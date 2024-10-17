import {useState} from "react";
import {useRouter} from "next/navigation";
import {getIcon} from "@/components/Icons";
import {Title} from "@/components/Text";
import {saveUserData} from "@/utils/user";

interface Props {
  onSignup: () => void
  onReset: () => void
}

export default function Login({onSignup, onReset}: Props) {
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
        console.log("Save user data")
        console.log({
          userId: responseJson.userId,
          // No username anymore
          username: "",
          email: responseJson.email,
        })
        saveUserData({
          userId: responseJson.userId,
          username: inputEmail,
          email: responseJson.email,
        })
        router.push("/dashboard")
        return
      } else {
        if (responseJson.status === 400) {
          const errorMessage = responseJson.error?.message || "Invalid email or password"
          setErrorMessage(errorMessage[0].toUpperCase() + errorMessage.slice(1))
        } else if (responseJson.status == 401) {
          setErrorMessage("Invalid email or password")
        } else {
          setErrorMessage("An unexpected error has occurred, please try again!")
        }
      }
    } catch (error: any) {
      setErrorMessage((error && error.message) || "An error occurred during login.");
    }
    setIsLoading(false)
  }

  return (
    <div
      className="flex w-full min-h-screen max-w-[700px] mx-auto flex-col justify-center items-center gap-20 pt-0 md:pt-10 p-0 md:px-5 lg:px-10 z-2 relative"
    >
      <div className={"flex flex-col gap-6 gal-card p-0 relative top-0 md:top-auto md:min-w-[500px]"}>
        <div className={"gal-login-image-wrapper z-0 inset-0"}/>

        <div className={"flex flex-col gap-6 pt-32 pb-10 px-2 md:px-8 z-10"}>
          <Title>Welcome</Title>
          <div className={"gal-text"}>Fill out the fields below to log in.</div>

          <div className={"gal-error"}>{errorMessage}</div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            data-ph-capture-attribute-form-name="login"
            data-ph-capture-attribute-login-username={email}
          >
            <div className={"flex flex-col gap-2"}>
              <label className={"gal-text"}>Email</label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border px-4 py-2 text-black"
              />
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border px-4 py-2 text-black"
            />
            <div className={"pb-10"}
            >
              <div
                className="gal-link flex"
                onClick={onReset}
              >
                Forgot password? Reset it here
              </div>
            </div>
            <button
              type="submit"
              className={"gal-button gal-button-primary"}>
              {isLoading && <>
                {getIcon("spinner")}
              </>
              }
              Log in
            </button>
          </form>

          <div
            className={"flex flex-col gap-4 mt-12 gal-border-top pt-6"}
          >
            <div className={"font-normal"}>
              {"Don't have an account yet?"}
            </div>
            <div
              className="gal-link flex"
              onClick={onSignup}
            >
              Sign up
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}