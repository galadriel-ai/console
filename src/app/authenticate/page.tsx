"use client"

import {useSearchParams} from 'next/navigation';
import {useRouter} from "next/navigation";
import {useState} from "react";

export default function AuthenticatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");


  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSignup(password);
  };

  const onSignup = async (inputPassword: string) => {
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
      console.log("responseJson")
      console.log(responseJson)
      if (responseJson.isSuccess) {
        router.push("/dashboard")
      }

      // The cookie is set on the server side, nothing more to do here
      console.log('Login successful, cookies set on the server!');
    } catch {
      console.log("ERROR")
      // setError(error.message || 'An error occurred during login.');
    }
  }

  return (
    <div
      className="flex w-full min-h-screen max-w-[1200px] mx-auto flex-col items-center gap-20 pt-10 py-2 px-5 lg:px-10 z-2 relative">
      Auth page

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