"use client"

import {useRouter, useSearchParams} from 'next/navigation';
import {useState} from "react";
import {zxcvbn} from '@zxcvbn-ts/core';

export default function AuthenticatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");

  const [errorMessage, setErrorMessage] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)


  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSignup(password, passwordConfirmation);
  };

  const onSignup = async (inputPassword: string, inputPasswordConfirmation: string) => {
    if (isLoading) return
    setErrorMessage("")

    if (inputPassword !== inputPasswordConfirmation) {
      setErrorMessage("Passwords must match")
      return
    }
    setIsLoading(true)
    const passwordInfo = zxcvbn(password)
    if (passwordInfo.score < 3) {
      setErrorMessage("Password is not strong enough, use numbers and symbols")
      setIsLoading(false)
      return
    }

    const token = searchParams.get('token');
    if (!token) {
      router.push("/login")
      return
    }
    try {
      // TODO: url
      const response = await fetch('/api/setUserInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          "password": inputPassword,
        }),
      });

      const responseJson = await response.json()
      if (responseJson.isSuccess) {
        router.push("/dashboard")
        return
      } else {
        setErrorMessage("An error occurred during login, please try again.")
      }
    } catch (error: any) {
      setErrorMessage((error && error.message) || "An error occurred during login.")
    }
    setIsLoading(false)
  }

  return (
    <div
      className="flex w-full min-h-screen max-w-[1200px] mx-auto flex-col items-center gap-20 pt-10 py-2 px-5 lg:px-10 z-2 relative">
      <div>Auth page</div>

      <div>Lets finish setting up your account</div>
      <div className={"gal-error"}>{errorMessage}</div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/*TODO: whatever fields required here*/}
        {/*<input*/}
        {/*  type="email"*/}
        {/*  placeholder="email"*/}
        {/*  value={email}*/}
        {/*  onChange={(e) => setEmail(e.target.value)}*/}
        {/*  className="border px-4 py-2 text-black"*/}
        {/*/>*/}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border px-4 py-2 text-black"
        />
        <input
          type="password"
          placeholder="Confirm password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          className="border px-4 py-2 text-black"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Sign up
        </button>
      </form>
    </div>
  )
}