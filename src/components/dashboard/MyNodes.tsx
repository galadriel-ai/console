import {Title} from "@/components/Text";
import {DashboardContent} from "@/components/dashboard/components/DashboardContent";
import {useEffect, useState} from "react";
import {getIcon} from "@/components/Icons";

interface GpuNode {
  nodeId: string
  nameAlias: string
  status: string
  runDurationSeconds: number
  requestsServed: number
  gpuModel: string
}

export function MyNodes() {
  // TODO: node adding logic

  const [page, setPage] = useState<"list" | "add">("list")

  const [gpuNodes, setGpuNodes] = useState<GpuNode[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [isCreationLoading, setIsCreationLoading] = useState<boolean>(false)
  const [nodeName, setNodeName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");


  useEffect(() => {
    getNodes()
  }, [])

  const getNodes = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/node", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network call failed");
      }
      const responseJson = await response.json()
      setGpuNodes(responseJson.nodes.map((r: any) => ({
          nodeId: r.node_id,
          nameAlias: r.name_alias,
          status: r.status,
          runDurationSeconds: r.run_duration_seconds,
          requestsServed: r.requests_served,
          gpuModel: r.gpu_model || "",
        })
      ))
    } catch {
      // setError(error.message || 'An error occurred during login.');
    }
    setIsLoading(false)
  }

  const onAddNode = () => {
    setPage("add")
  }

  const onListNodes = () => {
    setPage("list")
  }

  const setNodeNameValidate = (value: string) => {
    setNodeName(value)
    setErrorMessage("")
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("handle submit")
    if (gpuNodes.filter(g => g.nameAlias.toLowerCase() === nodeName.toLowerCase()).length) {
      setErrorMessage("You already have a node with that name.")
    } else {
      onCreateNode()
    }
  };

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
        await setGpuNodes([
          {
            nodeId: responseJson.nodeId,
            nameAlias: nodeName,
            status: "offline",
            runDurationSeconds: 0,
            requestsServed: 0,
            gpuModel: "",
          },
          ...gpuNodes,
        ])
        onListNodes()
      }
    } catch {
      setErrorMessage("An error occurred, please try again.");
    }
    setIsCreationLoading(false)
  }

  return (
    <DashboardContent>
      <>
        {page === "list" ?
          <>
            <Title>My nodes</Title>
            <div className={"pt-10 gal-text-secondary max-w-4xl"}>
              Your created and running nodes will appear here.
            </div>
            <div className={"pt-10"}>
              <div
                className={"gal-add-circle flex items-center justify-center cursor-pointer"}
                onClick={onAddNode}
              >
                {getIcon("plus")}
              </div>
            </div>
            <div className={"flex flex-col gap-4 pt-10"}>
              {isLoading &&
                <div
                  className={"flex flex-row gap-12"}
                >
                  Loading...
                </div>
              }
              <div className={"flex flex-wrap gap-4"}>
                {gpuNodes.map((node, i) => {
                  return (<NodeCard key={i} node={node}/>)
                })}
              </div>

            </div>
          </>
          :
          <>
            <div className={"flex flex-col gap-8"}>
              <div className={"flex"}>
                <button className={"gal-button gal-button-icon"} onClick={onListNodes}>
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
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
        }
      </>
    </DashboardContent>
  )
}

function NodeCard({key, node}: { key:number, node: GpuNode }) {
  return (
    <div
      key={`gpuNode-${key}`}
      className={"w-1/3 py-6 px-8 flex flex-col gap-8 gal-card max-w-[600px] min-w-[300px]"}
    >
      <div className="gal-title-secondary">
        {node.nameAlias}
      </div>
      <div className={"gal-subtitle break-all"}>
        ID: {node.nodeId}
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
  )
}