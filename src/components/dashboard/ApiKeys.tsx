import {DashboardContent} from "@/components/dashboard/components/DashboardContent";
import {Title} from "@/components/Text";
import {useEffect, useState} from "react";
import {getIcon} from "@/components/Icons";
import {ApiKeyModal} from "@/components/dashboard/components/ApiKeyModal";
import {ApiKeyDeletionModal} from "@/components/dashboard/components/ApiKeyDeletionModal";
import {useRouter} from "next/navigation";

interface ApiKey {
  apiKeyId: string
  key: string
  // API format, ISO 8601
  createdAt: string
}

export function ApiKeys() {
  const router = useRouter()

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isCreationLoading, setIsCreationLoading] = useState<boolean>(false)

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [createdApiKey, setCreatedApiKey] = useState<string>("")

  const [isDeletionModalOpen, setIsDeletionModalOpen] = useState<boolean>(false)
  const [deletionApiKey, setDeletionApiKey] = useState<ApiKey | null>(null)


  useEffect(() => {
    getApiKeys()
  }, [])

  const getApiKeys = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/api_key", {
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
      setApiKeys(responseJson.api_keys.map((r: any) => ({
          apiKeyId: r.api_key_id,
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
        if (response.status === 401) {
          router.push("/login")
        }
        return
      }
      const responseJson = await response.json()
      if (responseJson.isSuccess) {
        setApiKeys([
          ...apiKeys,
          {
            apiKeyId: responseJson.apiKeyId,
            key: responseJson.apiKey.slice(0, 10),
            createdAt: responseJson.createdAt,
          }
        ])
        setCreatedApiKey(responseJson.apiKey)
        setIsModalOpen(true)
      }
    } catch {
      // setError(error.message || 'An error occurred during login.');
    }
    setIsCreationLoading(false)
  }

  const onCloseModal = () => {
    setCreatedApiKey("")
    setIsModalOpen(false)
  }

  const onDeleteApiKey = async (apiKey: ApiKey) => {
    setDeletionApiKey(apiKey)
    setIsDeletionModalOpen(true)
  }

  const onDeleteApiKeySuccess = async () => {
    if (!deletionApiKey) return
    const updatedApiKeys = apiKeys.filter(k => k.apiKeyId !== deletionApiKey.apiKeyId)
    setApiKeys([
      ...updatedApiKeys
    ])
    setDeletionApiKey(null)
    setIsDeletionModalOpen(false)
  }

  const onCloseDeleteModal = () => {
    setDeletionApiKey(null)
    setIsDeletionModalOpen(false)
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
      <div className={"flex flex-col px-3 md:px-0"}>

        <Title>API keys</Title>
        <ApiKeyModal isOpen={isModalOpen} apiKey={createdApiKey} onClose={onCloseModal}/>
        {deletionApiKey &&
          <ApiKeyDeletionModal
            isOpen={isDeletionModalOpen}
            apiKeyId={deletionApiKey.apiKeyId}
            apiKey={deletionApiKey.key}
            onDeleteSuccess={onDeleteApiKeySuccess}
            onClose={onCloseDeleteModal}
          />
        }
        <div className={"pt-10 gal-text-secondary max-w-4xl"}>
          Your secret API keys are listed below. Do not share your API keys with others, or expose them in the browser
          or other client-side code.
        </div>
      </div>

      <div
        className={"flex flex-col pt-[32px] gap-[32px] px-3 md:px-0"}
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
                <div className={"w-1/2 flex flex-row justify-between"}>
                  <div>{formatDate(apiKey.createdAt)}</div>
                  <div
                    className={"gal-group cursor-pointer"}
                    onClick={() => onDeleteApiKey(apiKey)}
                  >
                    {getIcon("delete")}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className={"flex flex-col md:flex-row gap-[32px]"}>
          <button
            className={"gal-button gal-button-primary"}
            onClick={onCreateNewKey}
            data-ph-capture-attribute-form-name="create_api_key"
          >
            Create new key
          </button>
          <a
            href={process.env.NEXT_PUBLIC_DOCS_URL}
            target="_blank"
          >
            <button className={"gal-button w-full"}>
              Go to API docs
            </button>
          </a>

        </div>
      </div>
    </DashboardContent>
  )
}
