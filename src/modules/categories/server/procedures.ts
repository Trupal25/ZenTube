import { db } from "@/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { categories } from "@/db/schema";
import { TRPCError } from "@trpc/server";

export const categoriesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    // Testing error boundary
    // throw new TRPCError({ code: "BAD_REQUEST", message: "Testing server error handling" });

    const data = await db.select().from(categories);

    return data;
  }),
});
