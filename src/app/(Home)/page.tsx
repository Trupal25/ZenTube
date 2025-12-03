import { trpc } from "@/trpc/server";
import { HydrateClient } from "@/trpc/server";
import { HomeView } from "@/modules/home/ui/views/home-view";

export const dynamic = "force-dynamic"

interface Pageprops {
  searchParams: {
    categoryId?: string;
  }
}

const Page = async ({ searchParams }: Pageprops) => {
  const { categoryId } = await searchParams;

  // Handle server-side errors during prefetch
  try {
    await trpc.categories.getMany.prefetch();
  } catch (error) {
    console.error("Failed to prefetch categories:", error);
    // Error will be handled by client-side error boundary
  }

  return (
    <HydrateClient>
      <HomeView categoryId={categoryId} />
    </HydrateClient>
  );
}

export default Page;