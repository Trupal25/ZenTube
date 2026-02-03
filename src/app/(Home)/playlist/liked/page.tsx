import { DEFAULT_LIMIT } from "@/constants";
import { LikedView } from "@/modules/home/ui/views/liked-view";
import { trpc, HydrateClient } from "@/trpc/server";

export const dynamic = "force-dynamic";

const Page = () => {
  void trpc.playlists.getLiked.prefetchInfinite({ limit: DEFAULT_LIMIT });

  return (
    // <div className="max-w-screen-md  mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
    <HydrateClient>
      <LikedView />
    </HydrateClient>
  );
};

export default Page;
