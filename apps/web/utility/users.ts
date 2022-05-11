import { createTRPCClient } from "@trpc/client";
import { usersServiceRouter } from "../../users/src/router";

export namespace Util.User {
  export async function Register (username: string, password: string, email: string, access_code: string) {
    let client = createTRPCClient<usersServiceRouter>({
      url: "http://localhost:3001",
    });
  
    return await client.mutation("register", { username, password, email, access_code });
  }
  
  export async function Login (login_id: string, password: string,) {
    let client = createTRPCClient<usersServiceRouter>({
      url: "http://localhost:3001",
    });
  
    const token = await client.mutation("login", { login_id, password })
    sessionStorage.setItem("session_token", token);
    return token;
  }
}