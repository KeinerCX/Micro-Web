import { createTRPCClient } from "@trpc/client";
import React, { FormEventHandler, useState } from "react";
import { usersServiceRouter } from "../../users/src/router";

export default function Web() {
  let [message, setMessage] = useState("");

  const loginUser = async (event: any) => {
    event.preventDefault();

    let client = createTRPCClient<usersServiceRouter>({
      url: "http://localhost:3001",
    });

    console.log({
      username: event.target.name.value!,
      password: event.target.password.value!,
      access_code: event.target.access_code.value!,
      email: event.target.email.value!,
    });

    try {
      let data = await client.mutation("register", {
        username: event.target.name.value!,
        password: event.target.password.value!,
        access_code: event.target.access_code.value!,
        email: event.target.email.value!,
      });

      setMessage(`Successfully registered as ${event.target.name.value!}`);
    } catch (e: any) {
      setMessage(e.message);
    }
  };
  return (
    <div className="container">
      <div className="loginContainer">
        <form onSubmit={loginUser}>
          <div className="inputContainer">
            <input
              id="name"
              type="text"
              autoComplete="username"
              required
              placeholder="Username"
            />

            <input
              id="password"
              type="password"
              autoComplete="password"
              required
              placeholder="Password"
            />
          </div>
          <hr></hr>

          <button type="submit">Register</button>
        </form>
      </div>
      <a className="loginSwitchText" href="/login">
        Switch to Login
      </a>
    </div>
  );
}
