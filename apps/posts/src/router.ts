import * as trpc from "@trpc/server";
import { Snowflake } from "nodejs-snowflake";
import validator from "validator";
import { string, z } from "zod";
import { CustomEpoch } from "./utility/regex";
import { Context } from "./Context";
import Util from "./utility/services";
import * as argon2 from "argon2";
import { createTRPCClient, TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { ContentTypeParserDoneFunction } from "fastify/types/content-type-parser";
import { PrismaClientValidationError } from "@prisma/client/runtime";
import { Prisma } from "@prisma/client";

// Prisma Client
import { prisma } from "./utility/prisma";

// TO-DO: Make posts endpoint

export const appRouter = trpc
  .router<Context>()
  .middleware(({ next, ctx }) => {
    if (ctx.user?.flags.includes("banned"))
      throw new TRPCError({ code: "UNAUTHORIZED", message: "banned" });
    return next();
  })
  .mutation("posts", {
    input: z.object({
      count: z.number(),
      start: z.date(),
    }),
    resolve: async ({ input }) => {
      return prisma.post.findMany({
        where: { posted: { gte: input.start } },
        take: input.count,
      });
    },
  })
  .merge(
    "post.",
    trpc
      .router<Context>()
      .mutation("create", {
        input: z.object({
          username: z.string().min(3).max(20),
          password: z.string().min(8).max(1000),
          email: z.string().email(),

          //this is temp
          access_code: z.string().length(8),
        }),
        resolve: async ({ input }) => {},
      })
      .merge(
        "edit.",
        trpc.router<Context>().mutation("body", {
          input: z.object({
            post_id: z.string().length(20),
          }),
          resolve: async ({ input }) => {},
        })
      )
      .mutation("delete", {
        input: z.string().length(20),
        resolve: async ({ input }) => {},
      })
  )
  .merge(
    "admin.",
    trpc
      .router<Context>()
      .middleware(({ next, ctx }) => {
        if (!ctx.user?.flags.includes("admin"))
          throw new TRPCError({ code: "UNAUTHORIZED" });
        return next();
      })
      .mutation("remove", {
        input: z.object({
          user_id: z.string(),
          flags: z.array(z.string()),
        }),
        resolve: async ({ input }) => {},
      })
  );

export type usersServiceRouter = typeof appRouter;
