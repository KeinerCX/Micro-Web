import { createTRPCClient } from "@trpc/client";
import React, { FormEventHandler, useState } from "react";
import { usersServiceRouter } from "../../users/src/router";

export default function Web() {
  let [message, setMessage] = useState("");

  const registerUser = async (event: any) => {
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
    <div>
      <h1>Web App</h1>
      <h3>{message}</h3>
      <form onSubmit={registerUser}>
        <label htmlFor="name">Username</label>
        <input id="name" type="text" autoComplete="username" required />

        <label htmlFor="name">Email</label>
        <input id="email" type="text" autoComplete="email" required />

        <label htmlFor="name">Password</label>
        <input id="password" type="password" autoComplete="password" required />

        <hr></hr>
        <label htmlFor="name">Access Code</label>
        <input
          id="access_code"
          type="text"
          autoComplete="access_code"
          required
        />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
