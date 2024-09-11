"use client"

import {useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login")

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Call the onLogin function passed as a prop with the username and password
    onLogin(email, password);
  };

  const onLogin = async (inputEmail: string, inputPassword: string) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "email": inputEmail,
          "password": inputPassword,
        }),
      });

      const responseJson = await response.json()
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
      <Link href="/">Home</Link>
      {mode == "login" ?
        <>
          <div>Login page</div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border px-4 py-2 text-black"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border px-4 py-2 text-black"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2">
              Login
            </button>
            <div
              className="cursor-pointer"
              onClick={() => {
                setMode("signup")
              }}
            >
              Sign up
            </div>
          </form>
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
            Back to log in
          </div>
        </>
      }
    </div>
  )
}