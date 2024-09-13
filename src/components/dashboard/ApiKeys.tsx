import {Checkbox} from "@/components/ui/checkbox"
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import {DashboardContent} from "@/components/dashboard/components/DashboardContent";
import {Title} from "@/components/Text";
import {useEffect, useState} from "react";

interface ApiKey {
  key: string
  // API format, ISO 8601
  createdAt: string
}

export function ApiKeys() {

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isCreationLoading, setIsCreationLoading] = useState<boolean>(false)

  const [isModelOpen, setIsModelOpen] = useState<boolean>(false)
  const [createdApiKey, setCreatedApiKey] = useState<string>("")


  useEffect(() => {
    getApiKeys()
  }, [])

  const getApiKeys = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/api_key', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network stats call failed');
      }
      const responseJson = await response.json()
      setApiKeys(responseJson.api_keys.map((r: any) => ({
          key: r.api_key_prefix,
          createdAt: r.created_at,
        })
      ))
    } catch {
      // setError(error.message || 'An error occurred during login.');
    }
    setIsLoading(false)
  }

  const onCreateNewKey = async () => {
    if (isCreationLoading) return
    setIsCreationLoading(true)
    try {
      const response = await fetch("/api/api_key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // TODO: error?
        return
      }
      const responseJson = await response.json()
      if (responseJson.isSuccess) {
        setApiKeys([
          ...apiKeys,
          {
            key: responseJson.apiKey.slice(0, 10),
            createdAt: responseJson.createdAt,
          }
        ])
        setCreatedApiKey(responseJson.apiKey)
        setIsModelOpen(true)
      }
    } catch {
      // setError(error.message || 'An error occurred during login.');
    }
    setIsCreationLoading(false)
  }

  const onCloseModal = () => {
    setCreatedApiKey("")
    setIsModelOpen(false)
  }

  const formatDate = (date: string): string => {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  }

  return (
    <DashboardContent>
      <Title>API keys</Title>
      <ApiKeyModal isOpen={isModelOpen} apiKey={createdApiKey} onClose={onCloseModal}/>
      <div className={"pt-10 gal-text-secondary max-w-4xl"}>
        Your secret API keys are listed below. Do not share your API keys with others, or expose them in the browser or
        other client-side code.
      </div>

      <div
        className={"flex flex-col pt-[32px] gap-[32px]"}
      >
        <div className={"gal-api-keys-wrapper flex flex-col gap-4"}>
          <div className={"flex flex-row gap-12"}>
            <div className={"gal-subtitle w-1/2"}>
              Key:
            </div>
            <div className={"gal-subtitle w-1/2"}>
              Created:
            </div>
          </div>
          {isLoading &&
            <div
              className={"flex flex-row gap-12"}
            >
              Loading...
            </div>
          }
          {apiKeys.map((apiKey, i) => {
            return (
              <div
                className={"flex flex-row gap-12"}
                key={`apiKey-${i}`}
              >
                <div className={"w-1/2"}>
                  {apiKey.key}...
                </div>
                <div className={"w-1/2"}>
                  {formatDate(apiKey.createdAt)}
                </div>
              </div>
            )
          })}
        </div>
        <div className={"flex flex-row gap-[32px]"}>
          <button
            className={"gal-button gal-button-primary"}
            onClick={onCreateNewKey}
          >
            Create new key
          </button>
          <a
            href={process.env.NEXT_PUBLIC_DOCS_URL}
            target="_blank"
          >
            <button className={"gal-button"}>
              Go to API docs
            </button>
          </a>

        </div>
      </div>
    </DashboardContent>
  )
}


function ApiKeyModal({isOpen, apiKey, onClose}: { isOpen: boolean, apiKey: string, onClose: () => void }) {

  const [isChecked, setIsChecked] = useState<boolean>(false)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onOpenChange = (open: boolean) => {
  }

  const onCopy = async () => {
    await navigator.clipboard.writeText(apiKey)
  }

  const onCheckedChange = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      setIsChecked(true)
    } else {
      setIsChecked(false)
    }
  }

  const onCloseModal = () => {
    if (isChecked) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>
            <div className={"pb-4"}>
              Copy the API key
            </div>
          </DialogTitle>
          <DialogDescription>
            <div className={"flex flex-col gap-4"}>
              <div className={"gal-subtitle gal-text-warning"}>
                {"Make sure you save your API key, you won't be able to see the full API key again."}
              </div>
              <div>Click to copy your API key</div>
              <div
                className={"text-black cursor-pointer"}
                onClick={onCopy}
              >
                {apiKey}
              </div>
              <div className="items-top flex space-x-2">
                <Checkbox id="checkApiKey" onCheckedChange={onCheckedChange}/>
                <div className="grid gap-1.5 leading-none cursor-pointer">
                  <label
                    htmlFor="checkApiKey"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    I have saved the API key
                  </label>
                </div>
              </div>
              <div>
                {isChecked ?
                  <button className={"gal-button gal-button-primary"} onClick={onCloseModal}>
                    Done
                  </button>
                  :
                  <button className={"gal-button-disabled"}>
                    Done
                  </button>
                }
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}