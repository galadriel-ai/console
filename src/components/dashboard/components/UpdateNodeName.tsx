import {getIcon} from "@/components/Icons";
import {GpuNode} from "@/types/gpuNode";
import {useState} from "react";
import {Title} from "@/components/Text";

interface Props {
  node: GpuNode
  type: "text" | "title"
  onNameUpdated: (gpuNode: GpuNode) => void
}

export function UpdateNodeName({node, type, onNameUpdated}: Props) {

  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")


  const [originalName, setOriginalName] = useState<string>(node.nameAlias)
  const [name, setName] = useState<string>(node.nameAlias)


  const onCancel = () => {
    setIsUpdating(false)
    setName(originalName)
  }

  const onUpdateNodeName = () => {
    setIsUpdating(true)
  }


  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSendUpdate()
  }

  const onSendUpdate = async () => {
    setIsLoading(true)

    let isValidated = true
    if (name.length > 40) {
      setErrorMessage("Name too long")
      isValidated = false
    }
    if (name.length < 3) {
      setErrorMessage("Name too short")
      isValidated = false
    }
    if (!isValidated) {
      setIsLoading(false)
      return
    }
    setErrorMessage("")
    try {
      const response = await fetch('/api/node', {
        method: "PUT",
        headers: {
          "Content-Type": 'application/json',
        },
        body: JSON.stringify({
          nodeId: node.nodeId,
          nodeName: name,
        })
      });

      if (!response.ok) {
        throw new Error('Network stats call failed');
      }
      const responseJson = await response.json()
      if (responseJson.isSuccess && responseJson.is_name_updated) {
        setIsUpdating(false)
        setOriginalName(name)
        onNameUpdated({...node, nameAlias: name})
      } else {
        setErrorMessage("An error has occurred, please try again")
      }
    } catch {
    }
    setIsLoading(false)
  }

  return (
    <>
      {!isUpdating ?
        <div className="gal-title-secondary flex flex-row gap-2 items-center">
          {type === "title" ?
            <Title>
              <span style={{overflowWrap: "anywhere"}}>
              {name}
              </span>
            </Title>
            :
            <>
              {name}
            </>
          }
          <div
            className={"gal-group cursor-pointer " + (type === "title" ? "pl-6" : "pl-4")}
            onClick={onUpdateNodeName}
          >
            {getIcon("edit")}
          </div>
        </div>
        :
        <>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <div className={type === "title" ? "flex flex-row gap-3 items-center" : "flex flex-col gap-3 items-start"}>
              <input
                type="text"
                placeholder="node name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setErrorMessage("")
                }}
                className="border px-4 py-2 text-black"
              />
              <div className={"flex flex-row gap-4 items-start"}>
                <button
                  type="submit"
                >
                  {isLoading ?
                    <span className={"text-blue-400"}>{getIcon("spinner_blue")}</span>
                    :
                    <>{getIcon("check")}</>
                  }
                </button>
                <div
                  className={"cursor-pointer"}
                  onClick={onCancel}
                >
                  {getIcon("cross")}
                </div>
              </div>
            </div>
          </form>
          {errorMessage &&
            <div className={"gal-error"}>{errorMessage}</div>
          }
        </>
      }

    </>
  )
}