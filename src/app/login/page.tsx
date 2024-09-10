"use client"

import {useState} from "react";

export default function LoginPage() {

  const [mode, setMode] = useState<"login" | "signup">("login")

  return (
    <div
      className="flex w-full min-h-screen max-w-[1200px] mx-auto flex-col items-center gap-20 pt-10 py-2 px-5 lg:px-10 z-2 relative">
      {mode == "login" ?
        <>
          <div>Login page</div>
          <div
            className="cursor-pointer"
            onClick={() => {
              setMode("signup")
            }}
          >
            Sign up
          </div>
        </>
        :
        <>
          <div>Sign up page</div>
          <div
            className="cursor-pointer"
            onClick={() => {
              setMode("login")
            }}
          >
            Log in
          </div>
        </>
      }
    </div>
  )
}