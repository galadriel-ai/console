"use client"

import {useState} from "react";
import {getIcon} from "@/components/Icons";

export default function Signup() {
  const [isEmailSent, setIsEmailSent] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");


  const [errorMessage, setErrorMessage] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Call the onLogin function passed as a prop with the username and password
    onSignup(email);
  };

  const onSignup = async (inputEmail: string) => {
    if (isLoading) return
    setErrorMessage("")
    setIsLoading(true)
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "email": inputEmail,
        }),
      });

      const responseJson = await response.json()
      if (responseJson.isSuccess) {
        setIsEmailSent(true)
      } else {
        setErrorMessage("An unexpected error occurred, please try again.");
      }
    } catch (error: any) {
      setErrorMessage((error && error.message) || "An error occurred during login.");
    }
    setIsLoading(false)
  }

  return (
    <>
      <div>Signup page</div>
      <div className={"gal-error"}>{errorMessage}</div>
      {!isEmailSent ?
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border px-4 py-2 text-black"
          />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 flex flex-row items-center justify-center">
            {isLoading && <>
              {getIcon("spinner")}
            </>
            }
            Sign up
          </button>
        </form>
        :
        <div>Check your email!</div>
      }

    </>
  )
}