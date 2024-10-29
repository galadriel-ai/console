import {Dialog, DialogContentCloseable, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useState} from "react";
import {getIcon} from "@/components/Icons";


export function ApiKeyDeletionModal({isOpen, apiKeyId, apiKey, onDeleteSuccess, onClose}: {
  isOpen: boolean,
  apiKeyId: string,
  apiKey: string,
  onDeleteSuccess: () => void
  onClose: () => void
}) {

  const [isDeletionLoading, setIsDeletionLoading] = useState<boolean>(false)

  const onOpenChange = (open: boolean) => {
    if (!open) onClose()
  }

  const onDelete = async () => {
    if (isDeletionLoading) return
    setIsDeletionLoading(true)
    try {
      const response = await fetch("/api/api_key", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKeyId,
        })
      });

      if (!response.ok) {
        // TODO: error?
        return
      }
      const responseJson = await response.json()
      if (responseJson.isSuccess) {
        onDeleteSuccess()
      }
    } catch {
      // setError(error.message || 'An error occurred during login.');
    }
    setIsDeletionLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContentCloseable className="bg-white">
        <DialogHeader>
          <DialogTitle>
            <div className={"pb-4"}>
              Delete API key
            </div>
          </DialogTitle>
          <DialogDescription>
            <div className={"flex flex-col gap-4"}>
              <div className={"gal-subtitle gal-text-warning"}>
                {"Are you sure you wish to delete this API key? This cannot be undone."}
              </div>
              <div
                className={"text-black flex flex-row gap-1 items-center gal-group"}
              >
                <div>
                  {apiKey}...
                </div>
              </div>
              <div>
                <button className={"gal-button gal-button-warning"} onClick={onDelete}>
                  {isDeletionLoading && <>
                    {getIcon("spinner")}
                  </>
                  }
                  Delete
                </button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContentCloseable>
    </Dialog>
  )
}