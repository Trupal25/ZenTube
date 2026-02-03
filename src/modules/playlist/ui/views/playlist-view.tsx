"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { PlaylistCreateModal } from "../components/playlist-create-modal";
import { PlaylistSection } from "../sections/playlist-section";

export const PlaylistView = () => {
  // TODO: create history view and liked view in ./views and make them used for appropriate calls from frontend...

  const [createModalOpen, setCreateModalOpen] = useState(false);

  return (
    <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <div className="flex justify-between items-center">
        <PlaylistCreateModal
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
        />
        <div>
          <h1 className="text-2xl font-bold">Playlist</h1>
          <p className="text-xs text-muted-foreground">Your Playlist Videos</p>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => {
            setCreateModalOpen(true);
          }}
        >
          <PlusIcon />
        </Button>
      </div>
      <PlaylistSection />
    </div>
  );
};
