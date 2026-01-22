"use client";

import { THUMBNAIL_FALLBACK } from "@/constants";
import MuxPlayer from "@mux/mux-player-react";

interface VideoPlayerProps {
  playbackId?: string | null | undefined;
  thumbnailUrl?: string | null | undefined;
  autoPlay?: boolean;
  onPlay?: () => void;
}

export const VideoPlayer = ({
  playbackId,
  thumbnailUrl,
  autoPlay,
  onPlay,
}: VideoPlayerProps) => {
  // if(!playbackId) return null;

  return (
    <div>
      <MuxPlayer
        playbackId={playbackId || ""}
        poster={thumbnailUrl || THUMBNAIL_FALLBACK}
        playerInitTime={0}
        thumbnailTime={0}
        accentColor="#ff2056"
        className="w-full h-full object-contain"
        autoPlay={autoPlay}
        onPlay={onPlay}
      />
    </div>
  );
};
