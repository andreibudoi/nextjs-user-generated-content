import { createTRPCRouter, protectedProcedure, publicProcedure, } from "~/server/api/trpc";
import { createPostDto } from "./post.dto";
import { z } from "zod";

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createPostDto)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.post.create({
        data: {
          name: input.name,
          content: input.content,
          slug: input.slug,
          siteId: input.siteId,
          createdById: ctx.session.user.id,
        },
      });
    }),

  getLatest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });
  }),

  getAllPostsBySiteKey: publicProcedure
    .input(z.object({ siteKey: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.post.findMany({
        orderBy: { createdAt: "desc" },
        where: { site: { subdomain: input.siteKey } },
      });
    }),

  getPost: publicProcedure
    .input(z.object({ siteKey: z.string(), slug: z.string() }))
    .query(({ ctx, input }) => {
        return ctx.db.post.findFirst({
          where: { slug: input.slug, site: { subdomain: input.siteKey } }
        })
      }
    )
});
