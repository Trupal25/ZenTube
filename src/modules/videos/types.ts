import { inferRouterOutputs } from "@trpc/server";

import { appRouter, AppRouter } from "@/trpc/routers/_app";

export type VideoGetOneOutput = inferRouterOutputs<
  typeof appRouter
>["videos"]["getOne"];

export type VideoGetManyOutput =
  inferRouterOutputs<AppRouter>["suggestions"]["getMany"];
