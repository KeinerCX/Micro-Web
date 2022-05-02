import { createTRPCClient } from "@trpc/client";
import { betaCodesRouter } from "../../../../beta_access/src/router";

export const betaCodes = createTRPCClient<betaCodesRouter>({
  url: "http://localhost:3001",
});
