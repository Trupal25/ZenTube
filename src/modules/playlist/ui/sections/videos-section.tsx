"use client";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import {
  VideoGridCard,
  VideoGridCardSkeleton,
} from "@/modules/videos/ui/components/video-grid-card";
import {
  VideoRowCard,
  VideoRowCardSkeleton,
} from "@/modules/videos/ui/components/video-row-card";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";

interface VideosSectionProps {
  playlistId: string;
}

export const VideosSection = (props: VideosSectionProps) => {
  return (
    <Suspense fallback={<VideosSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Loading...</p>}>
        <VideosSectionSuspense {...props} />
      </ErrorBoundary>
    </Suspense>
  );
};

const VideosSectionSkeleton = () => {
  return (
    <div>
      <div className="flex flex-col gap-4 gap-y-10 md:hidden">
        {Array.from({ length: 18 }).map((_, idx) => (
          <VideoGridCardSkeleton key={idx} />
        ))}
      </div>
      <div className="flex-col gap-4 md:flex hidden">
        {Array.from({ length: 18 }).map((_, idx) => (
          <VideoRowCardSkeleton key={idx} />
        ))}
      </div>
    </div>
  );
};

const VideosSectionSuspense = ({ playlistId }: VideosSectionProps) => {
  const utils = trpc.useUtils();
  const removeVideo = trpc.playlists.removeVideo.useMutation({
    onSuccess: (data) => {
      toast.success("Video Removed From Playlist");
      utils.playlists.getMany.invalidate();
      utils.playlists.getOne.invalidate({ playlistId: playlistId });
      utils.playlists.getVideosForPlaylist.invalidate({
        videoId: data.videoId,
      });
      utils.playlists.getVideos.invalidate({ playlistId: data.playlistId });
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const [videos, query] = trpc.playlists.getVideos.useSuspenseInfiniteQuery(
    {
      playlistId: playlistId,
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  return (
    <div>
      <div className="flex flex-col gap-4 gap-y-10 md:hidden">
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoGridCard
              data={video}
              key={video.id}
              onRemove={() =>
                removeVideo.mutate({ playlistId, videoId: video.id })
              }
            />
          ))}
      </div>
      <div className="flex-col gap-4 md:flex hidden">
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoRowCard
              size="compact"
              key={video.id}
              data={video}
              onRemove={() =>
                removeVideo.mutate({ playlistId, videoId: video.id })
              }
            />
          ))}
      </div>
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        fetchNextPage={query.fetchNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
      />
    </div>
  );
};
