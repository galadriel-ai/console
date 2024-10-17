"use client"

import {useRouter, useSearchParams} from 'next/navigation';
import {Suspense} from "react";
import {PasswordForm} from "@/app/authenticate/PasswordForm";

export default function AuthenticatePage() {

  return (
    <Suspense>
      <Authenticate/>
    </Suspense>
  )
}

function Authenticate() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onNotAuthenticated = async () => {
    router.push("/login")
  }
  const onPasswordSuccess = async () => {
    router.push("/dashboard")
  }

  return (
    <div
      className="flex w-full min-h-screen max-w-[1200px] mx-auto flex-col justify-center items-center gap-20 pt-10 py-2 px-0 md:px-5 lg:px-10 z-2 relative">
      <div className={"flex flex-col gap-6 gal-card py-10 px-2 md:px-8 relative w-full md:w-auto"}>
        <PasswordForm
          searchParams={searchParams}
          onNotAuthenticated={onNotAuthenticated}
          onSuccess={onPasswordSuccess}
        />
      </div>
    </div>
  )
}
