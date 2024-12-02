import {useState} from "react";
import {getIcon} from "@/components/Icons";
import {Title} from "@/components/Text";
import {zxcvbn} from "@zxcvbn-ts/core";
import {ExtraDataForm} from "@/app/authenticate/ExtraDataForm";
import {useRouter} from "next/navigation";
import {saveUserData} from "@/utils/user";

export default function Signup({onLogin}: { onLogin: () => void }) {

  const router = useRouter()

  const [page, setPage] = useState<"password" | "signup" | "extra">("signup")

  const [password, setPassword] = useState<string>("");

  // Signup form
  const [email, setEmail] = useState<string>("");
  const [signupPassword, setSignupPassword] = useState<string>("");


  const [errorMessage, setErrorMessage] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)


  const handlePasswordSubmit = (e: any) => {
    e.preventDefault();
    onValidatePassword(password)
  }

  const onValidatePassword = async (inputPassword: string) => {
    if (isLoading) return
    setIsLoading(true)
    setErrorMessage("")
    try {
      const response = await fetch("/api/node_auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({password: inputPassword})
      });

      if (!response.ok) {
        setErrorMessage("An unexpected error occurred, please try again!")
        return
      }
      const responseJson = await response.json()
      if (responseJson.isSuccess) {
        setPage("signup")
      } else {
        setErrorMessage("Invalid password!")
      }
    } catch {
      // setError(error.message || 'An error occurred during login.');
    }
    setIsLoading(false)
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Call the onLogin function passed as a prop with the username and password
    onSignup(email, signupPassword)
  };

  const onSignup = async (
    inputEmail: string,
    inputPassword: string,
  ) => {
    if (isLoading) return
    if (!email) {
      setErrorMessage("Email is required")
      return
    }
    if (!inputPassword) {
      setErrorMessage("Password is required")
      return
    }
    const passwordInfo = zxcvbn(inputPassword)
    if (passwordInfo.score < 3 || inputPassword.length < 10) {
      setErrorMessage("Password is not strong enough, use numbers and symbols")
      return
    }

    setErrorMessage("")
    setIsLoading(true)
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: inputEmail,
          password: inputPassword,
          isReset: false,
        }),
      });

      const responseJson = await response.json()
      if (responseJson.isSuccess) {
        // Skip extra data form for now
        // setPage("extra")
        saveUserData({
          userId: responseJson.userId,
          username: "",
          email: responseJson.email,
        })
        router.push("/dashboard")
      } else {
        try {
          if (responseJson.error) {
            if (responseJson.error.code === "invalid_password") {
              setErrorMessage("Invalid password.");
            } else if (responseJson.error.message) {
              setErrorMessage(responseJson.error.message);
            }
          } else {
            setErrorMessage("An unexpected error occurred, please try again.");
          }
        } catch (e) {
          setErrorMessage("An unexpected error occurred, please try again.");
        }
      }
    } catch (error: any) {
      setErrorMessage((error && error.message) || "An error occurred during login.");
    }
    setIsLoading(false)
  }

  const onExtraDataSubmitted = () => {
    router.push("/dashboard")
  };

  return (
    <div
      className="flex w-full min-h-screen max-w-[600px] mx-auto flex-col justify-center items-center gap-20 pt-0 md:pt-10 p-0 md:px-5 lg:px-10 z-2 relative"
    >
      <div className={"flex flex-col gap-6 gal-card p-0 relative top-0 md:top-auto md:min-w-[500px]"}>
        <div className={"gal-login-image-wrapper z-0 inset-0"}/>

        <div className={"flex flex-col gap-6 pt-32 pb-10 px-2 md:px-8 z-10"}>
          {page === "password" &&
            <>
              <Title>Welcome</Title>
              <div className={"gal-text"}>Available for selected alpha node runners.</div>
              <div className={"gal-error"}>{errorMessage}</div>
              <form
                onSubmit={handlePasswordSubmit}
                className="flex flex-col gap-4"
                data-ph-capture-attribute-form-name="signup"
              >
                <div className={"flex flex-col gap-2"}>
                  <label className={"gal-text"}>Present Access Password</label>
                  <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border px-4 py-2 text-black"
                  />
                </div>
                <button
                  type="submit"
                  className={"gal-button gal-button-primary"}>
                  {isLoading && <>
                    {getIcon("spinner")}
                  </>
                  }
                  Run a Node
                </button>
              </form>
              <div className={"gal-subtitle pt-4"}>
                DM on Telegram <a
                className="gal-link"
                href="https://t.me/karlkallas"
                target="_blank"
              >
                @karlkallas
              </a> for access
              </div>

            </>
          }
          {page === "signup" &&
            <>
              <Title>Sign up!</Title>
              <div className={"gal-text"}>Enter your signup info to get started.</div>
              <div className={"gal-error"}>{errorMessage}</div>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
                data-ph-capture-attribute-form-name="signup"
              >
                <div className={"flex flex-col gap-2"}>
                  <label className={"gal-text"}>Email</label>
                  <input
                    type="email"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border px-4 py-2 text-black"
                  />
                </div>
                <div className={"flex flex-col gap-2"}>
                  <label className={"gal-text"}>Password</label>
                  <input
                    type="password"
                    placeholder="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="border px-4 py-2 text-black"
                  />
                </div>
                <div className="text-sm text-gray-500">
                  By signing up, you agree to our <a
                  href="https://galadriel.com/tos"
                  className="gal-link"
                  target="_blank"
                >
                  terms of usage
                </a>
                </div>
                <button
                  type="submit"
                  className={"gal-button gal-button-primary"}>
                  {isLoading && <>
                    {getIcon("spinner")}
                  </>
                  }
                  Sign up
                </button>
              </form>
            </>
          }
          {page === "extra" &&
            <ExtraDataForm onSuccess={onExtraDataSubmitted}/>
          }

          {page !== "extra" &&
            <div
              className={"flex flex-col gap-4 mt-12 gal-border-top pt-6"}
            >
              <div className={"font-normal"}>
                {"Already have an account?"}
              </div>
              <div
                className="gal-link flex"
                onClick={onLogin}
              >
                Back to login
              </div>
            </div>
          }

        </div>
      </div>
    </div>
  )
}
