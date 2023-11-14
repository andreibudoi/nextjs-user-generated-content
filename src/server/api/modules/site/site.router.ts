import { createTRPCRouter, protectedProcedure, publicProcedure, } from "~/server/api/trpc";
import { createSiteDto, updateSiteDto } from "./site.dto";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Prisma } from '@prisma/client'

export const siteRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createSiteDto)
    .mutation(async({ ctx, input }) => {
      try {
        return await ctx.db.site.create({
          data: {
            subdomain: input.subdomain,
            name: input.name,
            description: input.description,
            createdBy: { connect: { id: ctx.session.user.id } },
          }
        })
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          // The .code property can be accessed in a type-safe manner
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Subdomain already exists',
            // optional: pass the original error to retain stack trace
            cause: e,
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          // optional: pass the original error to retain stack trace
          cause: e,
        });
      }
    }),

  update: protectedProcedure
    .input(updateSiteDto).mutation(async ({ ctx, input }) => {
      try {
        return ctx.db.site.update({
          where: {
            id: input.id
          },
          data: {
            subdomain: input.subdomain,
            name: input.name,
            description: input.description,
            createdBy: { connect: { id: ctx.session.user.id } },
          },
        })
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          // The .code property can be accessed in a type-safe manner
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Subdomain already exists',
            // optional: pass the original error to retain stack trace
            cause: e,
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          // optional: pass the original error to retain stack trace
          cause: e,
        });
      }
    }),

  getSiteByUserId: protectedProcedure.query(({ ctx }) => {
    return ctx.db.site.findUnique(
      { where: { createdById: ctx.session.user.id } }
    );
  }),

  getSiteBySubdomain: publicProcedure
    .input(z.object({ subdomain: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      return ctx.db.site.findUnique(
        { where: { subdomain: input.subdomain } }
      );
    }),
});
