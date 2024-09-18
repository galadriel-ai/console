import {DashboardContent} from "@/components/dashboard/components/DashboardContent";
import {useEffect, useState} from "react";
import {GpuNode, PageName} from "@/types/gpuNode";
import {ListNodes} from "@/components/dashboard/components/ListNodes";
import {AddNode} from "@/components/dashboard/components/AddNode";
import {DisplayNode} from "@/components/dashboard/components/DisplayNode";


export function MyNodes() {

  const [page, setPage] = useState<PageName>("list")

  const [gpuNodes, setGpuNodes] = useState<GpuNode[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [displayedNode, setDisplayedNode] = useState<GpuNode | null>(null)

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
      const newGpuNodes: GpuNode[] = responseJson.nodes.map((r: any) => ({
          nodeId: r.node_id,

          gpuModel: r.gpu_model || "",
          vram: r.vram || 0,
          cpuModel: r.cpu_model || "",
          cpuCount: r.cpu_count || 0,
          ram: r.ram || 0,
          networkUploadSpeed: r.network_upload_speed || 0,
          networkDownloadSpeed: r.network_download_speed || 0,
          operatingSystem: r.operating_system || "",

          nameAlias: r.name_alias,
          status: r.status,
          runDurationSeconds: r.run_duration_seconds,
          totalUptimeSeconds: r.total_uptime_seconds || 0,
          requestsServed: r.requests_served,
          requestsServedDay: r.requests_served_day,
          nodeCreatedAt: r.node_created_at,
        })
      )
      setGpuNodes(newGpuNodes)
    } catch {
      // setError(error.message || 'An error occurred during login.');
    }
    setIsLoading(false)
  }

  const onChangePage = (page: PageName) => {
    setPage(page)
  }

  const onAddGpuNode = async (gpuNode: GpuNode) => {
    await setGpuNodes([
      gpuNode,
      ...gpuNodes,
    ])
  }

  const onDisplayNode = (gpunode: GpuNode) => {
    setDisplayedNode(gpunode)
    setPage("display")
  }

  return (
    <DashboardContent>
      <>
        {page === "list" &&
          <ListNodes
            gpuNodes={gpuNodes}
            isLoading={isLoading}
            onChangePage={onChangePage}
            onDisplayNode={onDisplayNode}
          />
        }
        {page === "add" &&
          <AddNode gpuNodes={gpuNodes} onAddGpuNode={onAddGpuNode} onChangePage={onChangePage}/>
        }
        {page === "display" &&
          <DisplayNode gpuNode={displayedNode} onChangePage={onChangePage}/>
        }
      </>
    </DashboardContent>
  )
}
