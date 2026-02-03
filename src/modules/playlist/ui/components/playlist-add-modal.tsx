"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { ResponsiveModal } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import { Loader2Icon, SquareCheckIcon, SquareIcon } from "lucide-react";
import { toast } from "sonner";

interface PlaylistCreateModalProps {
  open: boolean;
  videoId: string;
  onOpenChange: (open: boolean) => void;
}

export const PlaylistAddModal = ({
  open,
  videoId,
  onOpenChange,
}: PlaylistCreateModalProps) => {
  const utils = trpc.useUtils();
  const {
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    data: playlists,
    isLoading,
  } = trpc.playlists.getVideosForPlaylist.useInfiniteQuery(
    {
      videoId,
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: !!videoId && open,
    },
  );

  const addVideo = trpc.playlists.addVideo.useMutation({
    onSuccess: () => {
      toast.success("video added sucessfully");
      utils.playlists.getMany.invalidate();
      utils.playlists.getVideosForPlaylist.invalidate({ videoId });
      // TODO: invalidate playlists.getOne
    },
    onError: () => {
      toast.error("Something went Wrong");
    },
  });

  const removeVideo = trpc.playlists.removeVideo.useMutation({
    onSuccess: () => {
      toast.success("Removed video Sucessfully");
      utils.playlists.getMany.invalidate();
      utils.playlists.getVideosForPlaylist.invalidate({ videoId });
      // TODO: invalidate playlists.getOne
    },
    onError: () => {
      toast.error("Something went Wrong");
    },
  });

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title="Add to playlist"
    >
      <div className="flex flex-col gap-2">
        {isLoading && (
          <div className="flex justify-center p-4">
            <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
          </div>
        )}
        {!isLoading &&
          playlists?.pages
            .flatMap((page) => page.items)
            .map((playlist) => (
              <Button
                variant="ghost"
                className="w-full justify-start px-2 [&_svg]:size-5"
                size="lg"
                key={playlist.id}
                onClick={() => {
                  if (playlist.containsVideo) {
                    removeVideo.mutate({ playlistId: playlist.id, videoId });
                  } else {
                    addVideo.mutate({ playlistId: playlist.id, videoId });
                  }
                }}
                disabled={addVideo.isPending || removeVideo.isPending}
              >
                {playlist.containsVideo ? (
                  <SquareCheckIcon className="mr-2" />
                ) : (
                  <SquareIcon className="mr-2" />
                )}
                {playlist.name}
              </Button>
            ))}
        <InfiniteScroll
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          isManual
        />
      </div>
    </ResponsiveModal>
  );
};
