"use client"


import {ResetPasswordForm} from "@/app/reset/PasswordForm";
import {useRouter, useSearchParams} from "next/navigation";
import {Suspense} from "react";

export default function ResetPage() {
  return (
    <Suspense>
      <Reset/>
    </Suspense>
  )
}

function Reset() {
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
        <ResetPasswordForm
          searchParams={searchParams}
          onNotAuthenticated={onNotAuthenticated}
          onSuccess={onPasswordSuccess}
        />
      </div>
    </div>
  )
}