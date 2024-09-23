import {useState} from "react";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {getIcon} from "@/components/Icons";
import {Checkbox} from "@/components/ui/checkbox";


export function ApiKeyModal({isOpen, apiKey, onClose}: { isOpen: boolean, apiKey: string, onClose: () => void }) {

  const [isChecked, setIsChecked] = useState<boolean>(false)
  const [isCopyActive, setIsCopyActive] = useState<boolean>(false)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onOpenChange = (open: boolean) => {
  }

  const onCopy = async () => {
    await navigator.clipboard.writeText(apiKey)
    setIsCopyActive(true)
    try {
      setTimeout(() => {
        setIsCopyActive(false);
      }, 3000);
    } catch {

    }
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
                className={"text-black cursor-pointer flex flex-row gap-1 items-center gal-group"}
                onClick={onCopy}
              >
                <div>
                  {apiKey}
                </div>
                {isCopyActive ?
                  <div>
                    {getIcon("check")}
                  </div>
                  :
                  <div>
                    {getIcon("copy")}
                  </div>
                }
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