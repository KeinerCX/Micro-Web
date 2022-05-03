import fastify from "fastify";
import { config } from "dotenv";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { appRouter } from "./router";
import { createContext } from "./Context";

//initialize the cunfigoratiun fwom .env
config();

const server = fastify({
  maxParamLength: 5000,
});

server.register(require('@fastify/cors'), { 
  // put your options here
})

//@ts-ignore
server.register(fastifyTRPCPlugin, {
  prefix: "/",
  trpcOptions: { router: appRouter, createContext },
});

server.listen(3001, "0.0.0.0", () => { console.log("posts endpoint is running") });
