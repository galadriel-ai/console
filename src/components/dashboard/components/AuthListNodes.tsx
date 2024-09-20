import {Title} from "@/components/Text";
import {PageName} from "@/types/gpuNode";
import {useEffect, useState} from "react";
import {getNodePassword, setNodePassword} from "@/utils/nodePassword";


interface Props {
  onChangePage: (pageName: PageName) => void
}

export function AuthListNodes({onChangePage}: Props) {

  const [password, setPassword] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    const existingPassword = getNodePassword()
    console.log("Existing password")
    console.log(existingPassword)
    if (existingPassword) {
      onCheckPassword(existingPassword)
    }
  }, [])

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onCheckPassword(password);
  };

  const onCheckPassword = async (inputPassword: string) => {
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
        setNodePassword(inputPassword)
        onChangePage("list")
      } else {
        setErrorMessage("Invalid password!")
      }
    } catch {
      // setError(error.message || 'An error occurred during login.');
    }
    setIsLoading(false)
  }

  return (
    <>
      <Title>My nodes</Title>
      <div className={"pt-10 gal-text-secondary max-w-4xl"}>
        Your created and running nodes will appear here.
      </div>
      <div className={"pt-10"}>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
          data-ph-capture-attribute-form-name="create_node"
        >
          <div className="gal-title-secondary">
            Password to access node running
          </div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (errorMessage) setErrorMessage("")
            }}
            className="border px-4 py-2 text-black"
          />
          <div className={"gal-subtitle gal-error"}>
            {errorMessage}
          </div>

          <div className={"flex self-end"}>
            <button
              type="submit"
              className="gal-button gal-button-primary flex flex-row items-center justify-center">
              Run Nodes
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
