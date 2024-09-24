import {DashboardContent} from "@/components/dashboard/components/DashboardContent";
import {Title} from "@/components/Text";
import {useEffect, useState} from "react";
import {formatNumber, formatTimestampToTime} from "@/utils/helpers";
import {Card} from "@/components/dashboard/components/Card";
import {Chart} from "@/components/dashboard/components/Chart";
import {ChartData, DataPoint} from "@/types/chart";

interface NetworkStats {
  nodesOnline: number
  nodesTotal: number
  inferencesCount: number
  networkThroughput: number
}

export function NetworkStats() {
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
    console.log("getNetworkStats")
    try {
      const response = await fetch('/api/network', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network stats call failed');
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
      const response = await fetch('/api/graph', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const responseJson = await response.json()
        if (responseJson.timestamps && responseJson.values) {
          const dataPoints: DataPoint[] = []
          for (let i = 0; i < responseJson.timestamps.length; i++) {
            dataPoints.push({
              time: formatTimestampToTime(responseJson.timestamps[i]),
              inferences: responseJson.values[i],
            })
          }
          setChartData({
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
      <Title>Network stats</Title>
      <div
        className={"flex flex-row pt-[32px] gap-6"}
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
          title="NetworkStats throughput"
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