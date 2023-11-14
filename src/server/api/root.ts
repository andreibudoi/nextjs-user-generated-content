import { postRouter } from "~/server/api/modules/post";
import { siteRouter } from "~/server/api/modules/site";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  site: siteRouter,
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
