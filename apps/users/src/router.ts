import * as trpc from "@trpc/server";
import { Snowflake } from "nodejs-snowflake";
import validator from "validator";
import { string, z } from "zod";
import { CustomEpoch, PasswordRegex, UsernameRegex } from "./utility/regex";
import { Context, createRouter } from "./types/Context";
import Util from "./utility/services";
import * as argon2 from "argon2";
import { Meta } from "./types/interfaces/Meta";
import { createTRPCClient, TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { ContentTypeParserDoneFunction } from "fastify/types/content-type-parser";
import { Flag, Flags } from "./types/Flags";
import { PrismaClientValidationError } from "@prisma/client/runtime";
import { Prisma } from "@prisma/client";

// Prisma Client
import { prisma } from "./utility/prisma";

export const appRouter = createRouter()
  .mutation("register", {
    input: z.object({
      username: z.string().min(3).max(20),
      password: z.string().min(8).max(1000),
      email: z.string().email(),

      //this is temp
      access_code: z.string().length(8),
    }),
    resolve: async ({ input }) => {
      let { username, email, password, access_code } = input;

      if (!username.match(UsernameRegex)) throw new TRPCError({
        code: "BAD_REQUEST",
        message: "invalid_username",
      });

      if (!validator.isEmail(email)) throw new TRPCError({
        code: "BAD_REQUEST",
        message: "invalid_email",
      });

      if (!password.match(PasswordRegex)) throw new TRPCError({
        code: "BAD_REQUEST",
        message: "invalid_password",
      });

      let data = await prisma.betaCode.findFirst({
        where: {
          id: access_code,
        },
      });

      if (!data)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "access_code_not_found",
        });

      try {
        const user = await prisma.user.create({
          data: {
            username,
            email,
            password: await argon2.hash(password, { type: argon2.argon2id }),
            id: `${new Snowflake().idFromTimestamp(
              CustomEpoch || new Date().getMilliseconds()
            )}`,
            flags: ["user"],
          },
        });

        await prisma.betaCode.delete({
          where: {
            id: access_code,
          },
        });

        return user;
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "unique_constraint_validation_failure",
            });
          }
        }
        throw e;
      }
    },
  })
  .mutation("login", {
    input: z.object({
      login_id: z.string(),
      password: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      let { login_id, password } = input;

      const formattedLoginID = login_id.toLowerCase();
      const user = await prisma.user.findFirst({
        where: {
          OR: [{ email: formattedLoginID }, { username: formattedLoginID }],
        },
      });
      if (!user)
        throw new TRPCError({
          code: "CONFLICT",
          message: "login_id_invalid",
        });

      const auth = await argon2.verify(user.password, password, {
        type: argon2.argon2id,
      });
      if (!auth)
        throw new TRPCError({
          code: "CONFLICT",
          message: "invalid_login",
        });

      return Util.CreateSession(user.id, ctx.ip!);
    },
  })
  .mutation("logout", {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      try {
        prisma.user.update({
          where: { id: ctx.user?.id },
          data: {
            sessions: {
              delete: {
                session_id: input,
              },
            },
          },
        });
        return;
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === "P2001") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "record_not_found",
            });
          }
        }
        throw e;
      }
    },
  })
  .merge(
    "user.",
    createRouter()
      .middleware(async ({ path, type, next, meta, ctx }) => {
        let logged_in = false;

        if (ctx.user) logged_in = true;

        if (!logged_in) throw new TRPCError({ code: "UNAUTHORIZED" });
        return next();
      })

      // ~Username~
      .query("info", {
        input: z.string(),
        resolve: async ({ ctx, input }) => {
          let data = await prisma.user.findFirst({
            where: {
              id: input,
            },
          });

          if (!data)
            throw new TRPCError({
              code: "CONFLICT",
              message: "user_not_found",
            });

          return {
            id: data.id,
            username: data.username,
            display_name: data.displayname,
            avatar: data.avatar,
            flags: data.flags,
          };
        },
      })

      .query("me", {
        resolve: async ({ ctx }) => {
          return ctx.user;
        },
      })

      // ~Flags~
      .query("flags", {
        input: z.string(),
        resolve: async ({ ctx, input }) => {
          return (await Util.GetQueryUser(input)).flags;
        },
      })

      .merge(
        "session.",
        createRouter()
          .query("info", {
            input: z.string(),
            resolve: async ({ ctx, input }) => {
              return prisma.session.findFirst({
                where: {
                  session_id: input,
                },
              });
            },
          })

          .mutation("renew", {
            input: z.string(),
            resolve: async ({ ctx, input }) => {
              // Add session renew stuff
            },
          })
      )
  )
  .merge(
    "admin.",
    createRouter()
      .middleware(({ next, ctx }) => {
        if (ctx.user?.flags.includes("admin")) return next();
        
        throw new TRPCError({ code: "UNAUTHORIZED" });
      })
      .mutation("addFlags", {
        input: z.object({
          user_id: z.string(),
          flags: z.array(z.string()),
        }),
        resolve: async ({ input }) => {
          return await prisma.user.update({
            where: { id: (await Util.GetQueryUser(input.user_id)).id },
            data: {
              flags: { push: input.flags.filter((f) => Flags.includes(f)) },
            },
          });
        },
      })
      .mutation("removeFlags", {
        input: z.object({
          user_id: z.string(),
          flags: z.array(z.string()),
        }),
        resolve: async ({ ctx, input }) => {
          return await prisma.user.update({
            where: { id: (await Util.GetQueryUser(input.user_id)).id },
            data: {
              flags: {
                set: ctx.user?.flags.filter((f) => !input.flags.includes(f)),
              },
            },
          });
        },
      })
  );

export type usersServiceRouter = typeof appRouter;
