import * as trpc from "@trpc/server";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

import makeid from "./utils/id";
import { Context, createContext } from "./context";
import { TRPCError } from "@trpc/server";

let prisma = new PrismaClient();

export const appRouter = trpc
  .router<Context>()
  .query("isTokenValid", {
    input: z.string(),
    async resolve({ input }) {
      let data = await prisma.betaCode.findFirst({
        where: {
          id: input,
        },
      });

      if (!data)
        return {
          ok: false,
          data: {
            error: "invalid_beta_code",
          },
        };

      return {
        ok: true,
      };
    },
  })
  .mutation("redeemToken", {
    input: z.string(),
    async resolve({ input }) {
      let data = await prisma.betaCode.findFirst({
        where: {
          id: input,
        },
      });

      if (!data)
        return {
          ok: false,
          data: {
            error: "invalid_beta_code",
          },
        };

      await prisma.betaCode.delete({
        where: {
          id: input,
        },
      });

      return {
        ok: true,
      };
    },
  })
  .merge(
    "admin.",
    trpc
      .router<Context>()
      .middleware(async ({ ctx, next }) => {
        if (!ctx.user!.flags?.includes("admin")) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }
        return next();
      })
      .mutation("createToken", {
        resolve() {
          return prisma.betaCode.create({
            data: {
              id: makeid(8),
            },
          });
        },
      })
  );

export type betaCodesRouter = typeof appRouter;
