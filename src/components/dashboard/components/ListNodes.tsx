import {Title} from "@/components/Text";
import {getIcon} from "@/components/Icons";
import {useState} from "react";
import {GpuNode, PageName} from "@/types/gpuNode";
import {UpdateNodeName} from "@/components/dashboard/components/UpdateNodeName";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface Props {
  gpuNodes: GpuNode[]
  isLoading: boolean
  onChangePage: (pageName: PageName) => void
  onDisplayNode: (gpuNode: GpuNode) => void
  onNameUpdated: (gpuNode: GpuNode) => void
}

export function ListNodes({gpuNodes, isLoading, onChangePage, onDisplayNode, onNameUpdated}: Props) {

  const [isArchiveOpen, setIsArchiveOpen] = useState(false)

  const getNodes = (isArchived: boolean) => {
    return gpuNodes.filter((gpuNode: GpuNode) => gpuNode.isArchived === isArchived)
  }

  return (
    <>
      <div className={"flex flex-col px-3 md:px-0"}>
        <Title>My nodes</Title>
        <div className={"pt-10 gal-text-secondary max-w-4xl"}>
          Your created and running nodes will appear here.
        </div>
        <div className={"pt-10"}>
          <div
            className={"gal-add-circle flex items-center justify-center cursor-pointer"}
            onClick={() => onChangePage("add")}
          >
            {getIcon("plus")}
          </div>
        </div>
      </div>

      <div className={"flex flex-col gap-4 pt-10"}>
        {isLoading &&
          <div
            className={"flex flex-row gap-12 px-3 md:px-0"}
          >
            Loading...
          </div>
        }
        <div className={"flex flex-wrap gap-4"}>
          {getNodes(false).map((node, i) => {
            return (
              <div
                key={`gpuNode-${i}`}
                className={"w-full md:w-1/3 py-6 px-8 flex flex-col gap-8 gal-card md:max-w-[600px] min-w-[300px]"}
              >
                <NodeCard node={node} onDisplayNode={onDisplayNode} onNameUpdated={onNameUpdated}/>
              </div>
            )
          })}
        </div>

        {getNodes(true).length > 0 &&
          <Collapsible
            open={isArchiveOpen}
            onOpenChange={setIsArchiveOpen}
            className="space-y-2 pt-10"
          >
            <div className="flex items-center space-x-4 px-4">
              <CollapsibleTrigger asChild>
                <div className={"flex flex-row gap-4 items-center pb-4 cursor-pointer"}>
                  <button className={"gal-button"}>
                    {isArchiveOpen ? getIcon("arrow_down") : getIcon("arrow_up")}
                    <span className="sr-only">Toggle</span>
                  </button>
                  <div className={"gal-text-secondary max-w-4xl"}>
                    Archived nodes
                  </div>
                </div>
              </CollapsibleTrigger>

            </div>
            <CollapsibleContent className="space-y-2">
              <div className={"flex flex-wrap gap-4"}>
                {getNodes(true).map((node, i) => {
                  return (
                    <div
                      key={`gpuNode-${i}`}
                      className={"w-full md:w-1/3 py-6 px-8 flex flex-col gap-8 gal-card md:max-w-[600px] min-w-[300px]"}
                    >
                      <NodeCard node={node} onDisplayNode={onDisplayNode} onNameUpdated={onNameUpdated}/>
                    </div>
                  )
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>
        }

      </div>
    </>
  )
}

function NodeCard(
  {node, onDisplayNode, onNameUpdated}: {
    node: GpuNode,
    onDisplayNode: (gpuNode: GpuNode) => void,
    onNameUpdated: (gpuNode: GpuNode) => void,
  }
) {

  const [isCopyActive, setIsCopyActive] = useState<boolean>(false)

  const onCopy = async () => {
    await navigator.clipboard.writeText(node.nodeId)
    setIsCopyActive(true)
    try {
      setTimeout(() => {
        setIsCopyActive(false);
      }, 3000);
    } catch {
    }
  }

  return (
    <div className={"flex flex-col gap-8 w-full h-full"}>
      <div className={"flex flex-col gap-8 w-full h-full"}>
        <UpdateNodeName node={node} type={"text"} onNameUpdated={onNameUpdated}/>

        <div className={"flex flex-col gap-2"}>
          <div className={"gal-subtitle"}>
            Node ID
          </div>
          <div className={"flex flex-row gap-2 items-center break-all cursor-pointer"}
               onClick={onCopy}
          >
            {node.nodeId}
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
        </div>
        <div className={"flex flex-row gap-2"}>
          <div className={"w-1/2 flex flex-col gap-2"}>
            <div className={"gal-subtitle"}>
              Status
            </div>
            <div className={"flex flex-row gap-2 items-center"}>
              {node.status === "online" ?
                <div className={"gal-status-online"}/>
                :
                <div className={"gal-status-offline"}/>
              }
              {node.status}
            </div>
          </div>
          <div className={"w-1/2 flex flex-col gap-2"}>
            <div className={"gal-subtitle"}>
              Inferences
            </div>
            <div className={"flex flex-row gap-2 items-center"}>
              {node.requestsServed}
            </div>
          </div>
        </div>
        <div className={"flex flex-row gap-2"}>
          <div className={"w-1/2 flex flex-col gap-2"}>
            <div className={"gal-subtitle"}>
              Duration
            </div>
            <div className={"flex flex-row gap-2 items-center"}>
              {node.runDurationSeconds} s
            </div>
          </div>
          <div className={"w-1/2 flex flex-col gap-2"}>
            <div className={"gal-subtitle"}>
              GPU
            </div>
            <div className={"flex flex-row gap-2 items-center"}>
              {node.gpuModel}
            </div>
          </div>
        </div>
      </div>
      <div
        className={"gal-link align-bottom"}
        onClick={() => onDisplayNode(node)}
      >
        See more stats
      </div>
    </div>
  )
}
