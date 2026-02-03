import { DEFAULT_LIMIT } from "@/constants";
import { HistoryView } from "@/modules/playlist/ui/views/history-view";

import { HydrateClient, trpc } from "@/trpc/server";

const Page = () => {
  void trpc.playlists.getHistory.prefetchInfinite({ limit: DEFAULT_LIMIT });
  return (
    // <div className="max-w-screen-md  mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
    <HydrateClient>
      <HistoryView />
    </HydrateClient>
  );
};

export default Page;
