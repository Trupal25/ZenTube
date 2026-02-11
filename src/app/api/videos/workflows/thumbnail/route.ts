import { db } from "@/db";
import { users, videos } from "@/db/schema";
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

  const existingVideo = context.run("get-video", async () => {
    const data = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, videoId), eq(users.id, userId)));

    if (!data[0]) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return data[0];
  });

  console.log({ existingVideo });

  await context.run("generate-thumbnail", () => {
    console.log("initial step ran");
  });

  // upload thumbnail to uploadthing
  await context.run("second-step", () => {
    console.log("second step ran");
  });
});
