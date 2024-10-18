import {DashboardContent} from "@/components/dashboard/components/DashboardContent";
import {Title} from "@/components/Text";
import {useEffect, useState} from "react";
import {CodeSnippet} from "@/components/dashboard/components/CodeSnippet";
import {useRouter} from "next/navigation";
import {ChatExample} from "@/components/dashboard/components/ChatExample";

interface Props {
  onRunNode: () => void
}

export function Chat({}: Props) {

  const router = useRouter()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [apiKey, setApiKey] = useState<string>("")

  useEffect(() => {
    getApiKeys()
  }, [])

  const getApiKeys = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/api_key_example", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login")
        }
      }
      const responseJson = await response.json()
      if (responseJson.api_key) setApiKey(responseJson.api_key)
    } catch {
      // setError(error.message || 'An error occurred during login.');
    }
    setIsLoading(false)
  }

  return (
    <DashboardContent>
      <div className={"flex flex-col px-3 md:px-0"}>
        <Title>Chat</Title>
        <div className={"pt-10 gal-text-secondary max-w-4xl"}>
          Fast & low-cost distributed LLMs.
        </div>
      </div>
      <div className={"pt-8"}>
        <div
          className={"py-8 px-3 md:px-8 flex flex-col gap-8 gal-card max-w-[700px] min-w-[300px]"}
        >
          <ChatExample/>
          {/*<div className={"flex flex-row justify-center"}>*/}
          {/*  <button className={"gal-button gal-button-primary"} onClick={onRunNode}>Run a node</button>*/}
          {/*</div>*/}
        </div>
      </div>
      <CodeSnippet isLoading={isLoading} apiKey={apiKey}/>
    </DashboardContent>
  )
}
