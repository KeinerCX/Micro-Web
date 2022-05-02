import { config } from "dotenv";
import fastify from "fastify";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { appRouter } from "./router";

//enitiaize the cunfigoratiun fwom .env
config();

const server = fastify({
  maxParamLength: 5000,
});

server.register(fastifyTRPCPlugin, {
  prefix: "/",
  trpcOptions: { router: appRouter },
});

server.listen(process.env.PORT || 3001, "0.0.0.0", () => { console.log("beta_access endpoint is running") });
