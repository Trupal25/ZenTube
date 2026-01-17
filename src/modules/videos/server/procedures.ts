import { db } from "@/db";
import { users, videoReactions, videos, videoViews } from "@/db/schema";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { mux } from "@/lib/mux"
import { TRPCError } from "@trpc/server";
import { videoUpdateSchema as baseVideoUpdateSchema } from "@/db/schema";
import { and, eq, getTableColumns, inArray } from "drizzle-orm";
import { z } from "zod";
import { UTApi } from "uploadthing/server";
import { workflow } from "@/lib/workflow";
// Ensure id is required and help TypeScript infer field types properly
const videoUpdateSchema = baseVideoUpdateSchema.required({ id: true });

export const videosRouter = createTRPCRouter({
    getOne: baseProcedure
        .input(z.object({
            id: z.string().uuid()
        }))
        .query(async ({ ctx, input })=> {
            const { clerkUserId } = ctx;
            let userId;

            const [user] = await db
                        .select()
                        .from(users)
                        .where(inArray(users.clerkId, clerkUserId ? [clerkUserId]: []));
                
            if(user){
                userId = user.id;
            }
            const viewerReactions = db.$with("viewer_reactions").as(
                db
                    .select({
                        videoId: videoReactions.videoId,
                        type: videoReactions.type,
                    })
                    .from(videoReactions)
                    .where(inArray(videoReactions.userId, userId ? [userId] : []))
            )

            const [existingVideo] = await db
                .with(viewerReactions)
                .select({
                    ...getTableColumns(videos),
                users:{
                    ...getTableColumns(users)
                },
                videoViews:{
                    viewCount: db.$count(videoViews,eq(videoViews.videoId,videos.id)),
                    likeCount: db.$count(videoReactions,and(eq(videoReactions.videoId, videos.id), eq(videoReactions.type, "like"))),
                    dislikeCount: db.$count(videoReactions,and(eq(videoReactions.videoId, videos.id), eq(videoReactions.type, "dislike"))),
                    viewerReaction: viewerReactions.type,
                }
                })
                .from(videos)
                .innerJoin(users, eq(videos.userId, users.id))
                .leftJoin(viewerReactions, eq(viewerReactions.videoId, videos.id))
                .where(and(
                    eq(videos.id, input.id),
                ))
                // .groupBy(
                //     videos.id,
                //     users.id,
                //     viewerReactions.type,
                // )


            if(!existingVideo){
                throw new TRPCError({
                    code: "NOT_FOUND"
                })
            }
            return existingVideo;
        }),
    generateThumbnail: protectedProcedure
        .input(z.object({
            id: z.string().uuid()
        }))
        .mutation(async ({ ctx, input }) => {
            const { id: userId } = ctx.user;

            const { workflowRunId } = await workflow.trigger({
                url: `${process.env.UPSTASH_WORKFLOW_URL!}/api/videos/workflow/title`,
                body: { userId, videoId: input.id }
            });

            return workflowRunId;
        })
        ,
    restoreThumbnail: protectedProcedure
        .input(z.object({
            id: z.string().uuid()
        }))
        .mutation(async ({ ctx, input }) => {
            const { id: userId } = ctx.user;

            const [existingVideo] = await db
                .select()
                .from(videos)
                .where(and(
                    eq(videos.id, input.id),
                    eq(videos.userId, userId)
                ));

                if(!existingVideo) {
                    throw new TRPCError({ code: "NOT_FOUND"});
                }
                if(!existingVideo.muxPlaybackId) {
                    throw new TRPCError({ code: "BAD_REQUEST"});
                }

                const utapi = new UTApi()
                
            const tempThumbnailUrl = `https://image.mux.com/${existingVideo.muxPlaybackId}/thumbnail.jpg`
            const uploadedThumbnail = await utapi.uploadFilesFromUrl(tempThumbnailUrl)
            
            if(!uploadedThumbnail.data){
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR"});
            }

            const { key: thumbnailKey, url: thumbnailUrl } = uploadedThumbnail.data;

                const [updatedVideo] = await db
                    .update(videos)
                    .set({
                        thumbnailKey,
                        thumbnailUrl,
                        updatedAt: new Date(),
                    })
                    .where(and(
                        eq(videos.id, input.id),
                        eq(videos.userId, userId)
                    ))
                    .returning();

            return updatedVideo;
        }),
    remove: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            const { id: userId } = ctx.user;

            const [removedVideo] = await db
                .delete(videos)
                .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
                .returning();

            if (!removedVideo) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Video not found",
                })
            }
            return removedVideo;
        }),
    update: protectedProcedure
        .input(videoUpdateSchema)
        .mutation(async ({ input, ctx }) => {
            const { id: userId } = ctx.user;

            if (!input.id) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Video ID is required",
                })
            }

            // const video = await db.select().from(videos)
            //     .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
            //     .limit(1)
            //     .get();

            // if(!video){
            //     throw new TRPCError({
            //         code: "NOT_FOUND",
            //         message: "Video not found",
            //     })
            // }
            const [updatedVideo] = await db
                .update(videos)
                .set({
                    title: input.title,
                    description: input.description,
                    categoryId: input.categoryId,
                    visibility: input.visibility,
                    updatedAt: new Date(),
                })
                .where(and(
                    eq(videos.id, input.id),
                    eq(videos.userId, userId)
                ))
                .returning();

            if (!updatedVideo) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Video not found",
                });
            }
            return updatedVideo;
        }),

    create: protectedProcedure.mutation(async ({ ctx }) => {
        const { id: userId } = ctx.user;

        try {
            const upload = await mux.video.uploads.create({
                new_asset_settings: {
                    passthrough: userId,
                    playback_policies: ["public"],
                    input: [
                        {
                            generated_subtitles: [
                                {
                                    language_code: "en",
                                    name: "English",
                                },
                            ],
                        },
                    ],
                },
                cors_origin: "*" //change in prod
            })

            const [video] = await db
                .insert(videos)
                .values({
                    userId,
                    title: "Untitled",
                    muxUploadId: upload.id,
                })
                .returning();

            return {
                video: video,
                url: upload.url
            };
        } catch (error) {
            console.error("Error creating video:", error);

            if (error instanceof Error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: `Failed to create video: ${error.message}`,
                    cause: error,
                });
            }

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to create video. Please check your Mux credentials.",
            });
        }
    })

})