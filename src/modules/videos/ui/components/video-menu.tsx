import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { APP_URL } from "@/constants";
import { PlaylistAddModal } from "@/modules/playlist/ui/components/playlist-add-modal";
import {
  ListPlusIcon,
  MoreVerticalIcon,
  ShareIcon,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface VideoMenuProps {
  videoId: string;
  variant?: "default" | "ghost" | "secondary";
  onRemove?: () => void;
}

export const VideoMenu = ({
  videoId,
  variant = "ghost",
  onRemove,
}: VideoMenuProps) => {
  const [isOpenPlaylistModal, setIsOpenPlaylistModal] = useState(false);

  const onShare = () => {
    const fullUrl = `${APP_URL}/videos/${videoId}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success("Link copied to clipboard");
  };

  return (
    <>
      <PlaylistAddModal
        videoId={videoId}
        open={isOpenPlaylistModal}
        onOpenChange={setIsOpenPlaylistModal}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size="icon" className="rounded-full">
            <MoreVerticalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem onClick={onShare}>
            <ShareIcon className="mr-2 size-4" />
            Share
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsOpenPlaylistModal(true)}>
            <ListPlusIcon className="mr-2 size-4" />
            Add to playlist
          </DropdownMenuItem>
          {onRemove && (
            <DropdownMenuItem
              onClick={() => {
                onRemove();
              }}
            >
              <TrashIcon className="mr-2 size-4" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
