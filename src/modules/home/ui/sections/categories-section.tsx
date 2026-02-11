"use client";
import { FilterCarousel } from "@/components/filter-carousel";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface categoriesSectionProps {
  categoryId?: string;
}

const ErrorFallback = ({ error }: { error: unknown }) => {
  const errorMessage =
    error instanceof Error ? error.message : "An unknown error occurred";
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded">
      <h2 className="text-red-800 font-semibold">Something went wrong</h2>
      <p className="text-red-600 text-sm mt-2">{errorMessage}</p>
    </div>
  );
};

export const CategoriesSection = ({ categoryId }: categoriesSectionProps) => {
  return (
    <Suspense fallback={<CategoriesSkeleton />}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <CategoriesSectionSuspense categoryId={categoryId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const CategoriesSkeleton = () => {
  return <FilterCarousel isLoading onSelect={() => {}} data={[]} />;
};

const CategoriesSectionSuspense = ({ categoryId }: categoriesSectionProps) => {
  const router = useRouter();
  const [categories] = trpc.categories.getMany.useSuspenseQuery();

  const data = categories.map((category: { id: string; name: string }) => ({
    value: category.id,
    label: category.name,
  }));

  const onSelect = (value: string | null) => {
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set("categoryId", value);
    } else {
      url.searchParams.delete("categoryId");
    }
    router.push(url.toString());
  };

  return <FilterCarousel data={data} onSelect={onSelect}></FilterCarousel>;
};
