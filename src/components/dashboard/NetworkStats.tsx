import {DashboardContent} from "@/components/dashboard/components/DashboardContent";
import {Title} from "@/components/Text";
import {useEffect, useState} from "react";
import {formatNumber} from "@/utils/helpers";
import {Card} from "@/components/dashboard/components/Card";
import {Chart} from "@/components/dashboard/components/Chart";
import {ChartData, DataPoint} from "@/types/chart";
import {useRouter} from "next/navigation";

interface NetworkStats {
  nodesOnline: number
  nodesTotal: number
  inferencesCount: number
  networkThroughput: number
}

export function NetworkStats() {
  const router = useRouter()

  const [networkStats, setNetworkStats] = useState<NetworkStats | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [chartData, setChartData] = useState<ChartData | undefined>()
  const [isChartLoading, setIsChartLoading] = useState(false);

  useEffect(() => {
    getNetworkStats()
    getChartData()
  }, [])

  const getNetworkStats = async () => {
    if (isLoading) return
    setIsLoading(true)
    try {
      const response = await fetch("/api/network", {
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
      setNetworkStats({
        nodesOnline: responseJson.connected_nodes_count,
        nodesTotal: responseJson.nodes_count,
        inferencesCount: responseJson.inference_count_day,
        networkThroughput: Number.parseFloat(responseJson.network_throughput.split(" ")[0])
      })
    } catch {
      // setError(error.message || 'An error occurred during login.');
    }
    setIsLoading(false)
  }

  const getChartData = async () => {
    if (isChartLoading) return
    setIsChartLoading(true)
    try {
      const response = await fetch("/api/graph", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          graphType: "network"
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
            title: "Hourly network total inferences",
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

  return (
    <DashboardContent>
      <div className={"flex flex-col px-3 md:px-0"}>
        <Title>Network stats</Title>
      </div>
      <div
        className={"flex flex-col md:flex-row pt-[32px] gap-6"}
      >
        <Card
          title="Online nodes"
          isLoading={isLoading}
          text={networkStats ? formatNumber(networkStats.nodesOnline) : ""}
          iconName={"online_nodes"}
        />
        <Card
          title="24h total inferences"
          isLoading={isLoading}
          text={networkStats ? formatNumber(networkStats.inferencesCount) : ""}
          iconName={"count"}
        />
        <Card
          title="Max network throughput"
          isLoading={isLoading}
          text={networkStats ? formatNumber(networkStats.networkThroughput) : ""}
          subText={"tok/s"}
          iconName={"network_throughput"}
        />
      </div>
      <div className={"pt-10"}>
        <Chart chartData={chartData}/>
      </div>
    </DashboardContent>
  )
}