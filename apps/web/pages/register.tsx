import { createTRPCClient } from "@trpc/client";
import React, { FormEventHandler, useState } from "react";
import { usersServiceRouter } from "../../users/src/router";
import { LockClosedIcon } from "@heroicons/react/solid";
import { Util } from "../utility/users";

export default function Web() {
  let [message, setMessage] = useState("");

  return (
    <div className="flex flex-col items-center justify-center h-screen dark:bg-gray-900">
      <div className="flex flex-col dark:bg-gray-800 bg-gray-200 w-3/12 p-12 rounded-xl">
        <h1 className="sm:text-md md:text-lg lg:text-xl xl:text-3xl text-center font-semibold dark:text-white">
          Register for{" "}
          <span className="text-indigo-400 dark:text-indigo-500">Micro</span>
        </h1>
        <form className="mt-8 space-y-5" action="#" method="POST">
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="username"
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
                placeholder="Username"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                E-Mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block
                  w-full px-3 py-2 border border-gray-300
                  dark:bg-gray-700
                  dark:border-gray-600
                  dark:text-white


                  placeholder-gray-500 text-gray-900 
                  focus:outline-none focus:ring-indigo-500
                  focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="E-Mail Address"
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
            <br></br>
            <div>
              <label htmlFor="access_code" className="sr-only">
                Access Code
              </label>
              <input
                id="access_code"
                name="access_code"
                type="access_code"
                autoComplete="access_code"
                required
                className="appearance-none rounded-none relative block
                  w-full px-3 py-2 border border-gray-300
                  dark:bg-gray-700
                  dark:border-gray-600
                  dark:text-white
                  placeholder-gray-500 text-gray-900 rounded-t-md rounded-b-md
                  focus:outline-none focus:ring-indigo-500
                  focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Beta Access Code"
              />
            </div>
          </div>

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
                const [ username, password, email, access_code ] = [ 
                  (document.getElementById("username") as HTMLInputElement).value,
                  (document.getElementById("password") as HTMLInputElement).value,
                  (document.getElementById("email") as HTMLInputElement).value,
                  (document.getElementById("access_code") as HTMLInputElement).value
                ]

                try {
                  const user = await Util.User.Register(username, password, email, access_code)
                  setMessage(`Successfully registered as ${user.username}`)

                  await Util.User.Login(email, password);
                  setMessage(`Successfully logged in as ${user.username}`)

                  //window.location.href = "/"
                } catch (e: any) {
                  setMessage(e.message);
                }
              }
            }
            >
              Register
            </button>
          </div>
        </form>{" "}
      </div>
      <a className="text-lg text-indigo-500 mt-6" href="/login">
        Switch to Login
      </a>
    </div>
  );
}
