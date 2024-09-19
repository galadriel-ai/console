import {getIcon} from "@/components/Icons";
import {Title} from "@/components/Text";
import {useState} from "react";
import {createGpuNode, GpuNode, PageName} from "@/types/gpuNode";

interface Props {
  gpuNodes: GpuNode[]
  onAddGpuNode: (gpuNode: GpuNode) => Promise<void>
  onChangePage: (pageName: PageName) => void
}

export function AddNode({gpuNodes, onAddGpuNode, onChangePage}: Props) {

  const [isCreationLoading, setIsCreationLoading] = useState<boolean>(false)
  const [nodeName, setNodeName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (gpuNodes.filter(g => g.nameAlias.toLowerCase() === nodeName.toLowerCase()).length) {
      setErrorMessage("You already have a node with that name.")
    } else {
      onCreateNode()
    }
  };

  const setNodeNameValidate = (value: string) => {
    setNodeName(value)
    setErrorMessage("")
  }

  const onCreateNode = async () => {
    setIsCreationLoading(true)
    try {
      const response = await fetch('/api/node', {
        method: "POST",
        headers: {
          "Content-Type": 'application/json',
        },
        body: JSON.stringify({
          nodeName,
        })
      });

      if (!response.ok) {
        throw new Error('Network stats call failed');
      }
      const responseJson = await response.json()
      if (responseJson.isSuccess) {
        await onAddGpuNode(createGpuNode(responseJson.nodeId, nodeName))
        onChangePage("list")
      }
    } catch {
      setErrorMessage("An error occurred, please try again.");
    }
    setIsCreationLoading(false)
  }

  return (
    <>
      <div className={"flex flex-col gap-8"}>
        <div className={"flex"}>
          <button className={"gal-button gal-button-icon"} onClick={() => onChangePage("list")}>
            {getIcon("arrow_left")}
          </button>
        </div>

        <Title>Create new node</Title>
        <div className={"pt-10 gal-text-secondary max-w-4xl"}>
          Fill out the fields below to get started.
        </div>
        <div
          className={"w-2/3 py-6 px-8 flex flex-col gap-8 gal-card max-w-[600px] min-w-[300px]"}
        >
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            data-ph-capture-attribute-form-name="create_node"
          >
            <div className="gal-title-secondary">
              Name
            </div>
            <input
              type="text"
              placeholder="My node"
              value={nodeName}
              onChange={(e) => setNodeNameValidate(e.target.value)}
              className="border px-4 py-2 text-black"
            />
            <div className={"gal-subtitle"}>
              {errorMessage}
            </div>

            <div className={"flex self-end"}>
              <button
                type="submit"
                className="gal-button gal-button-primary flex flex-row items-center justify-center">
                {isCreationLoading && <>
                  {getIcon("spinner")}
                </>
                }
                Create node
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}