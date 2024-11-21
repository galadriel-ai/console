import {getIcon, IconName} from "@/components/Icons";
import {GpuNode, PageName} from "@/types/gpuNode";
import {formatNumber, formatTimestampToDate, formatTimestampToTime} from "@/utils/helpers";
import {useEffect, useState} from "react";
import {ChartData, DataPoint} from "@/types/chart";
import {Chart} from "@/components/dashboard/components/Chart";
import {UpdateNodeName} from "@/components/dashboard/components/UpdateNodeName";

interface Props {
  gpuNode: GpuNode
  onChangePage: (pageName: PageName) => void
  onNameUpdated: (gpuNode: GpuNode) => void
  onArchiveStatusUpdated: (gpuNode: GpuNode) => void
}

export function DisplayNode(
  {
    gpuNode,
    onChangePage,
    onNameUpdated,
    onArchiveStatusUpdated
  }: Props) {

  const [isArchived, setIsArchived] = useState<boolean>(gpuNode.isArchived)
  const [isCopyActive, setIsCopyActive] = useState<boolean>(false)
  const [isArchivalLoading, setIsArchivalLoading] = useState<boolean>(false)

  const [chartData, setChartData] = useState<ChartData | undefined>()
  const [isChartLoading, setIsChartLoading] = useState(false);

  useEffect(() => {
    if (gpuNode) {
      getChartData(gpuNode.nodeId)
    }
  }, [gpuNode])

  const getChartData = async (nodeId: string) => {
    if (isChartLoading) return
    setIsChartLoading(true)
    try {
      const response = await fetch("/api/graph", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          graphType: "node",
          nodeName: nodeId,
        })
      });

      if (response.ok) {
        const responseJson = await response.json()
        if (responseJson.timestamps && responseJson.values) {
          const dataPoints: DataPoint[] = []
          for (let i = 0; i < responseJson.timestamps.length; i++) {
            dataPoints.push({
              time: responseJson.timestamps[i],
              inferences: responseJson.values[i],
            })
          }
          setChartData({
            title: "Hourly node total inferences",
            dataPoints: dataPoints,
            labelName: "Inferences",
            xDataKey: "time",
            yDataKey: "inferences",
          })
        }
      }
    } catch {
      // setError(error.message || 'An error occurred during login.');
    }
    setIsChartLoading(false)
  }

  const onUpdateArchivalStatus = async () => {
    if (!gpuNode) return
    if (isArchivalLoading) return

    setIsArchivalLoading(true)

    try {
      const newIsArchived = !isArchived
      const response = await fetch('/api/node', {
        method: "PUT",
        headers: {
          "Content-Type": 'application/json',
        },
        body: JSON.stringify({
          nodeId: gpuNode.nodeId,
          isArchived: newIsArchived,
        })
      });

      if (!response.ok) {
        throw new Error('Network stats call failed');
      }
      const responseJson = await response.json()
      if (responseJson.isSuccess) {
        setIsArchived(newIsArchived)
        onArchiveStatusUpdated({...gpuNode, isArchived: newIsArchived})
      } else {
        // Error?
      }
    } catch {
    }
    setIsArchivalLoading(false)
  }

  const onCopy = async () => {
    if (!gpuNode) return
    await navigator.clipboard.writeText(gpuNode.nodeId)
    setIsCopyActive(true)
    try {
      setTimeout(() => {
        setIsCopyActive(false);
      }, 3000);
    } catch {
    }
  }

  const formatVram = (vram: number): string | null => {
    if (!vram) return null
    return `${Math.round(vram / 1.048576 / 1024)} GB`
  }

  if (!gpuNode) {
    return (
      <></>
    )
  }

  return (
    <>
      <div className={"flex flex-col gap-8"}>
        <div className={"flex flex-col px-3 md:px-0"}>
          <div className={"flex"}>
            <button className={"gal-button gal-button-icon cursor-pointer"} onClick={() => onChangePage("list")}>
              {getIcon("arrow_left")}
            </button>
          </div>
        </div>

        <div className={"flex flex-col px-3 md:px-0"}>
          <UpdateNodeName node={gpuNode} type={"title"} onNameUpdated={onNameUpdated}/>
          <div className={"flex flex-col md:flex-row gap-12 pt-6"}>
            <div className={"flex flex-row md:flex-col gap-6"}>
              <div className={"gal-subtitle"}>
                Created:
              </div>
              <div className={"gal-subtitle flex flex-col gap-2"}>
                <div>
                  {formatTimestampToDate(gpuNode.nodeCreatedAt)}
                </div>
                <div>
                  {formatTimestampToTime(gpuNode.nodeCreatedAt)}
                </div>
              </div>
            </div>
            <div>
              <a
                className={"gal-button gal-button-primary"}
                href={process.env.NEXT_PUBLIC_DOCS_URL}
                target="_blank"
              >
                Run node
              </a>
            </div>
            <div>
              {isArchived ?
                <button
                  className={"gal-button gal-button"}
                  onClick={onUpdateArchivalStatus}
                >
                  {isArchivalLoading && <>
                    {getIcon("spinner")}
                  </>
                  }
                  Reactivate node
                </button>
                :
                <button
                  className={"gal-button gal-button-warning"}
                  onClick={onUpdateArchivalStatus}
                >
                  {isArchivalLoading && <>
                    {getIcon("spinner")}
                  </>
                  }
                  Archive node
                </button>
              }

            </div>
          </div>
        </div>

        <div className={"flex flex-col px-3 md:px-0"}>
          <div className={"flex flex-col gap-2"}>
            <div className={"gal-subtitle"}>
              Node ID
            </div>
            <div className={"flex flex-row gap-2 items-center break-all cursor-pointer"}
                 onClick={onCopy}
            >
              {gpuNode.nodeId}
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
        </div>

        <div className={"flex flex-col md:flex-row flex-wrap gap-5"}>
          <div
            className={"py-6 px-8 flex flex-col gap-4 gal-card"}
          >
            <div className={"gal-subtitle"}>Status</div>
            <div className={"flex flex-row gap-2 items-center"}>
              {(gpuNode.status && gpuNode.status.toLowerCase().includes("run")) ?
                <div className={"gal-status-online"}/>
                :
                <div className={"gal-status-offline"}/>
              }
              {gpuNode.status}
            </div>
          </div>
          <StatCard title={"GPU"} content={gpuNode.gpuModel || "-"}/>
          <StatCard title={"GPU VRAM"} content={formatVram(gpuNode.vram) || "-"}/>
          <StatCard title={"CPU Cores"} content={`${gpuNode.cpuCount || "-"}`}/>
          <StatCard title={"Memory"} content={gpuNode.ram ? `${formatNumber(gpuNode.ram / 1024)} GB` : "-"}/>
          <StatCard title={"Benchmark result"}
                    content={gpuNode.tokensPerSecond ? `${formatNumber(gpuNode.tokensPerSecond)} tok/s` : "-"}/>
          <StatCard title={"24h Inferences"} content={`${gpuNode.requestsServedDay}`} iconName={"online_nodes"}/>
          <StatCard title={"Total uptime"} content={`${gpuNode.totalUptimeSeconds} s`} iconName={"online_nodes"}/>
        </div>
        <div className={"pt-10"}>
          <Chart chartData={chartData}/>
        </div>
      </div>
    </>
  )
}

function StatCard({title, content, iconName}: { title: string, content: string, iconName?: IconName }) {
  return (
    <div
      className={`py-6 px-8 flex flex-col gap-4 gal-card max-w-[600px] ${iconName ? "min-w-[300px]" : "min-w-[200px]"}`}
    >
      <div className={"gal-subtitle flex flex-row justify-between"}>
        <div>{title}</div>
        {iconName &&
          <>
            {getIcon(iconName)}
          </>
        }
      </div>
      <div className={"flex flex-row gap-2 items-center"}>
        {content}
      </div>
    </div>
  )
}