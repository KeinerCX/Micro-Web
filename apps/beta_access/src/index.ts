import { config } from "dotenv";
import fastify from "fastify";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { appRouter } from "./router";

//initialize the cunfigoratiun fwom .env
config();

const server = fastify({
  maxParamLength: 5000,
});

server.register(fastifyTRPCPlugin, {
  prefix: "/",
  trpcOptions: { router: appRouter },
});

server.listen(process.env.PORT || 3002, "0.0.0.0", () => { console.log("beta_access endpoint is running") });
