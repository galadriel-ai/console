"use client"

import {useState} from "react";
import Link from "next/link";
import Login from "@/components/login/Login";
import Signup from "@/components/login/Signup";

export default function LoginPage() {

  const [mode, setMode] = useState<"login" | "signup">("login")

  return (
    <div
      className="flex w-full min-h-screen max-w-[1200px] mx-auto flex-col items-center gap-20 pt-10 py-2 px-5 lg:px-10 z-2 relative">
      <Link href="/">Home</Link>
      {mode == "login" ?
        <>
          <Login/>
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
          <Signup/>
          <div
            className="cursor-pointer"
            onClick={() => {
              setMode("login")
            }}
          >
            Back to log in
          </div>
        </>
      }
    </div>
  )
}