"use client"

import {useState} from "react";
import Login from "@/components/login/Login";
import Signup from "@/components/login/Signup";
import ResetEmail from "@/components/login/ResetEmail";

export default function LoginPage() {

  const [mode, setMode] = useState<"login" | "signup" | "reset">("login")

  return (
    <div
      className="flex w-full min-h-screen max-w-[1200px] mx-auto flex-col items-center gap-20 pt-0 md:pt-10 py-0 md:py-2 px-0 md:px-5 lg:px-10 z-2 relative overflow-y-auto">
      {mode === "login" &&
        <Login
          onSignup={() => {
            setMode("signup")
          }}
          onReset={() => {
            setMode("reset")
          }}
        />
      }
      {mode === "signup" &&
        <Signup onLogin={() => {
          setMode("login")
        }}/>
      }
      {mode === "reset" &&
        <ResetEmail onLogin={() => {
          setMode("login")
        }}/>
      }
    </div>
  )
}