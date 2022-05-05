import * as trpc from "@trpc/server";
import { inferAsyncReturnType, TRPCError } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import jwtDecode from "jwt-decode";
import { prisma } from "./utility/prisma";

export async function createContext(opts?: trpcNext.CreateNextContextOptions) {
  //This is where we will do authorizing once we have the user service

  let user = await prisma.user.findFirst({
    where: {
      sessions: {
        some: {
          session_id: token.session_id
        }
      }
    }
  })

  return {
    user,
  };
}
export type Context = inferAsyncReturnType<typeof createContext>;
