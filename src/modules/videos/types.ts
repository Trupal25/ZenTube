import { inferRouterOutputs } from "@trpc/server";

import { appRouter } from "@/trpc/routers/_app";

export type VideoGetOneOutput = inferRouterOutputs<
  typeof appRouter
>["videos"]["getOne"];
