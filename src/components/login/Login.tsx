"use client"

import {useState} from "react";
import {useRouter} from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [errorMessage, setErrorMessage] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onLogin(email, password);
  };

  const onLogin = async (inputEmail: string, inputPassword: string) => {
    if (isLoading) return
    setErrorMessage("")
    setIsLoading(true)
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
        return
      } else {
        setErrorMessage("Invalid username or password")
      }
    } catch (error: any) {
      setErrorMessage((error && error.message) || "An error occurred during login.");
    }
    setIsLoading(false)
  }

  return (
    <>
      <div>Login page</div>
      <div className={"gal-error"}>{errorMessage}</div>
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
      </form>
    </>
  )
}