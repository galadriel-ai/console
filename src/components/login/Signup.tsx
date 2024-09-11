"use client"

import {useState} from "react";

export default function Signup() {
  const [isEmailSent, setIsEmailSent] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Call the onLogin function passed as a prop with the username and password
    onSignup(email);
  };

  const onSignup = async (inputEmail: string) => {
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "email": inputEmail,
        }),
      });

      const responseJson = await response.json()
      if (responseJson.isSuccess) {
        setIsEmailSent(true)
      }

      // The cookie is set on the server side, nothing more to do here
      console.log('Login successful, cookies set on the server!');
    } catch {
      console.log("ERROR")
      // setError(error.message || 'An error occurred during login.');
    }
  }

  return (
    <>
      <div>Signup page</div>
      {!isEmailSent ?
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border px-4 py-2 text-black"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2">
            Sign up
          </button>
        </form>
        :
        <div>Check your email!</div>
      }

    </>
  )
}