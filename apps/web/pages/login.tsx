import { createTRPCClient } from "@trpc/client";
import React, { FormEventHandler, useState } from "react";
import { usersServiceRouter } from "../../users/src/router";
import { LockClosedIcon } from "@heroicons/react/solid";
import { Util } from "../utility/users";

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
    <div className="flex flex-col items-center justify-center h-screen dark:bg-gray-900">
      <div className="flex flex-col dark:bg-gray-800 bg-gray-200 w-3/12 p-12 rounded-xl">
        <h1 className="sm:text-md md:text-lg lg:text-xl xl:text-3xl text-center font-semibold dark:text-white">
          Login to{" "}
          <span className="text-indigo-400 dark:text-indigo-500">Micro</span>
        </h1>
        <form className="mt-8 space-y-6" action="#" method="POST">
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="login_id" className="sr-only">
                Login ID
              </label>
              <input
                id="login_id"
                name="login_id"
                type="login_id"
                autoComplete="current-password"
                required
                className="appearance-none rounded-t-md relative block
                  w-full px-3 py-2 border border-gray-300
                  dark:bg-gray-700
                  dark:text-white

                  dark:border-gray-600
                  placeholder-gray-500 text-gray-900 
                  focus:outline-none focus:ring-indigo-500
                  focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email or Username"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block
                  w-full px-3 py-2 border border-gray-300
                  dark:bg-gray-700
                  dark:border-gray-600
                  dark:text-white
                  placeholder-gray-500 text-gray-900 rounded-b-md
                  focus:outline-none focus:ring-indigo-500
                  focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          {/* <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500
                  border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900 dark:text-white"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </a>
            </div>
          </div> */}

          <div className="mt-auto">
            <button
              type="submit"
              className="group relative w-full flex justify-center
                py-2 px-4 border border-transparent text-sm font-medium
                rounded-md text-white 
                bg-indigo-400 hover:bg-indigo-500
                dark:bg-indigo-600 dark:hover:bg-indigo-700
                focus:outline-none focus:ring-2 focus:ring-offset-2
                focus:ring-indigo-500"
              onClick={async (e) => { 
                e.preventDefault();
                const [ login_id, password ] = [ 
                  (document.getElementById("login_id") as HTMLInputElement).value,
                  (document.getElementById("password") as HTMLInputElement).value,
                ]

                try {
                  const token = await Util.User.Login(login_id, password);
                  console.log(token)
                  setMessage(`Successfully logged in as ${login_id}`)
                  window.location.href = "/"
                } catch (e: any) {
                  setMessage(e.message);
                }
              }}
            >
              {/* <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LockClosedIcon
                  className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                  aria-hidden="true"
                />
              </span> */}
              Sign in
            </button>
          </div>
        </form>{" "}
      </div>
      <a className="text-lg text-indigo-500 mt-6" href="/register">
        Switch to Register
      </a>
    </div>
  );
}
