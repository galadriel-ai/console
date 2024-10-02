import {useState} from "react";
import {getIcon} from "@/components/Icons";
import {Title} from "@/components/Text";

export default function ResetEmail({onLogin}: { onLogin: () => void }) {


  const [isEmailSent, setIsEmailSent] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");

  const [errorMessage, setErrorMessage] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)


  const handleSubmit = (e: any) => {
    e.preventDefault();
    onReset(email);
  };

  const onReset = async (inputEmail: string) => {
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
          email: inputEmail,
          isReset: true,
        }),
      });

      const responseJson = await response.json()
      if (responseJson.isSuccess) {
        setIsEmailSent(true)
      } else {
        if (responseJson.error?.status_code === 404) {
          setErrorMessage("Email not found.")
        } else {
          setErrorMessage("An unexpected error occurred, please try again.")
        }
      }
    } catch (error: any) {
      setErrorMessage((error && error.message) || "An error occurred during login.");
    }
    setIsLoading(false)
  }

  return (
    <div
      className="flex w-full min-h-screen max-w-[600px] mx-auto flex-col justify-center items-center gap-20 pt-0 md:pt-10 p-0 md:px-5 lg:px-10 z-2 relative"
    >
      <div className={"flex flex-col gap-6 gal-card p-0 relative top-0 md:top-auto md:min-w-[500px]"}>
        <div className={"gal-login-image-wrapper z-0 inset-0"}/>

        <div className={"flex flex-col gap-6 pt-32 pb-10 px-2 md:px-8 z-10"}>
          <Title>Reset password</Title>
          <div className={"gal-text"}>Enter your email address to reset your password.</div>
          <div className={"gal-error"}>{errorMessage}</div>
          {!isEmailSent ?
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
              <button
                type="submit"
                className={"gal-button gal-button-primary"}>
                {isLoading && <>
                  {getIcon("spinner")}
                </>
                }
                Reset password
              </button>
            </form>
            :
            <div>Check your email for the magic link!</div>
          }

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

        </div>
      </div>
    </div>
  )
}
