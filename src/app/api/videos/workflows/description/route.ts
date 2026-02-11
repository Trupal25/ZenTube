import { APP_URL } from "@/constants";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { TRPCError } from "@trpc/server";
import { serve } from "@upstash/workflow/nextjs";
import { and, eq } from "drizzle-orm";

interface InputType {
  videoId: string;
  userId: string;
}

export const { POST } = serve(async (context) => {
  const input = context.requestPayload as InputType;
  const { videoId, userId } = input;

  const video = await context.run("get-video", async () => {
    const [existingVideo] = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));

    if (!existingVideo) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return existingVideo;
  });

  const transcript = await context.run("get-transcript", async () => {
    const trackUrl = `https://stream.mux.com/${video.muxPlaybackId}/text/${video.muxTrackId}.txt`;
    const response = await fetch(trackUrl);
    const text = response.text();

    if (!text) {
      throw new Error("Bad Request");
    }

    return text;
  });

  const generateDescription = await context.run("get-description", async () => {
    const endpoint = `${APP_URL}/api/text-generation/description`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        token: process.env.GENERATE_ROUTE_TOKEN!,
      },
      body: JSON.stringify({
        transcript: transcript,
      }),
    }).then((response) => response.json());

    return response;
  });

  await context.run("update-description", async () => {
    if (!generateDescription.description) {
      throw new Error("description not generated");
    }
    const description = generateDescription.description;

    await db
      .update(videos)
      .set({
        description: description,
      })
      .where(and(eq(videos.id, video.id), eq(videos.userId, video.userId)));
  });
});
