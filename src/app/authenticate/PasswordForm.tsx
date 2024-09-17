import {ReadonlyURLSearchParams} from "next/navigation";
import {useState} from "react";
import {zxcvbn} from "@zxcvbn-ts/core";
import {Title} from "@/components/Text";
import {getIcon} from "@/components/Icons";


export function PasswordForm({searchParams, onNotAuthenticated, onSuccess}: {
  searchParams: ReadonlyURLSearchParams,
  onNotAuthenticated: () => void,
  onSuccess: () => void,
}) {

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");

  const [errorMessage, setErrorMessage] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)


  const handlePasswordSubmit = (e: any) => {
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
      onNotAuthenticated()
      return
    }
    try {
      const response = await fetch('/api/setUserInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          username,
          "password": inputPassword,
        }),
      });

      const responseJson = await response.json()
      if (responseJson.isSuccess) {
        // router.push("/dashboard")
        await setErrorMessage("")
        onSuccess()
        return
      } else {
        if (responseJson.status === 409) {
          setErrorMessage("Username already exists")
        } else {
          setErrorMessage("An error occurred during login, please try again.")
        }
      }
    } catch (error: any) {
      setErrorMessage((error && error.message) || "An error occurred during login.")
    }
    setIsLoading(false)
  }

  return (
    <>
      <Title>Sign up</Title>
      <div className={"gal-text"}>Fill out the fields below to get started.</div>


      <div className={"gal-error"}>{errorMessage}</div>
      <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-6">
        <div className={"flex flex-col gap-2"}>
          <label className={"gal-text"}>Username</label>
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border px-4 py-2 text-black"
          />
        </div>
        <div className={"flex flex-col gap-2"}>
          <label className={"gal-text"}>Password</label>
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border px-4 py-2 text-black"
          />
        </div>

        <div className={"flex flex-col gap-2"}>
          <label className={"gal-text"}>Repeat password</label>
          <input
            type="password"
            placeholder="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="border px-4 py-2 text-black"
          />
        </div>

        <div className={"flex justify-end pt-8"}>
          <button type="submit" className={"gal-button gal-button-primary"}>
            {isLoading && <>
              {getIcon("spinner")}
            </>
            }
            Continue
          </button>
        </div>
      </form>
    </>
  )
}