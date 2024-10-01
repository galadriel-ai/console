import {DashboardContent} from "@/components/dashboard/components/DashboardContent";
import {Title} from "@/components/Text";
import {useEffect, useState} from "react";
import {formatNumber} from "@/utils/helpers";
import {Card} from "@/components/dashboard/components/Card";
import {ChartData, DataPoint} from "@/types/chart";
import {Chart} from "@/components/dashboard/components/Chart";
import {useRouter} from "next/navigation";

interface NodeStats {
  inferencesCountDay: number
  inferencesCount: number
  averageTimeToFirstToken: number
  totalTokensPerSecond: number
}

export function NodeStats() {
  const router = useRouter()

  const [nodeStats, setNodeStats] = useState<NodeStats | undefined>()
  const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState(null);

  const [chartData, setChartData] = useState<ChartData | undefined>()
  const [isChartLoading, setIsChartLoading] = useState(false);

  useEffect(() => {
    getNetworkStats()
    getChartData()
  }, [])

  const getNetworkStats = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/user_stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login")
        }
        setNodeStats({
          inferencesCountDay: 0,
          inferencesCount: 0,
          totalTokensPerSecond: 0,
          averageTimeToFirstToken: 0,
        })
      }
      const responseJson = await response.json()
      setNodeStats({
        inferencesCountDay: responseJson.requests_served_day || 0,
        inferencesCount: responseJson.total_requests_served || 0,
        averageTimeToFirstToken: responseJson.average_time_to_first_token || 0,
        totalTokensPerSecond: responseJson.total_tokens_per_second || 0,
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
          graphType: "user"
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
            title: "My nodes' total inferences per hour",
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
        <Title>Node stats</Title>
      </div>
      <div
        className={"flex flex-col md:flex-row pt-[32px] gap-6"}
      >
        <Card
          title="Your inferences last 24h"
          isLoading={isLoading}
          text={(nodeStats && nodeStats.inferencesCountDay) ? formatNumber(nodeStats.inferencesCountDay) : "-"}
          iconName={"online_nodes"}
        />
        <Card
          title="Your total inferences"
          isLoading={isLoading}
          text={(nodeStats && nodeStats.inferencesCount) ? formatNumber(nodeStats.inferencesCount) : "-"}
          iconName={"count"}
        />
        <Card
          title="Total throughput"
          isLoading={isLoading}
          text={
            (nodeStats && nodeStats.totalTokensPerSecond)
              ?
              `${formatNumber(nodeStats.totalTokensPerSecond)}`
              :
              "-"
          }
          subText={(nodeStats && nodeStats.totalTokensPerSecond) ? "tok/s" : ""}
          iconName={"network_throughput"}
        />

      </div>
      <div className={"pt-10"}>
        <Chart chartData={chartData}/>
      </div>
    </DashboardContent>
  );
}