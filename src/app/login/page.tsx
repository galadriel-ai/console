"use client"

import {useState} from "react";
import Login from "@/components/login/Login";
import Signup from "@/components/login/Signup";

export default function LoginPage() {

  const [mode, setMode] = useState<"login" | "signup">("login")

  return (
    <div
      className="flex w-full min-h-screen max-w-[1200px] mx-auto flex-col items-center gap-20 pt-0 md:pt-10 py-0 md:py-2 px-0 md:px-5 lg:px-10 z-2 relative overflow-y-auto">
      {mode == "login" ?
        <Login onSignup={() => {
          setMode("signup")
        }}/>
        :
        <Signup onLogin={() => {
          setMode("login")
        }}/>
      }
    </div>
  )
}