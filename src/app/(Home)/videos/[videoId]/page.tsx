import { DEFAULT_LIMIT } from "@/constants";
import { VideoView } from "@/modules/videos/ui/views/video-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    videoId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { videoId } = await params;

  trpc.videos.getOne.prefetch({ id: videoId });
  // TODO: change this to prefetch infinite  -> DONE
  trpc.comments.getMany.prefetchInfinite({ videoId, limit: DEFAULT_LIMIT });
  trpc.suggestions.getMany.prefetchInfinite({ videoId, limit: DEFAULT_LIMIT });

  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
};

export default Page;
