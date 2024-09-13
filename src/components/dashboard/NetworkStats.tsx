import {DashboardContent} from "@/components/dashboard/components/DashboardContent";
import {Title} from "@/components/Text";
import {useEffect, useState} from "react";
import {formatNumber} from "@/utils/helpers";
import {Card} from "@/components/dashboard/components/Card";

interface NetworkStats {
  nodesOnline: number
  nodesTotal: number
  inferencesCount: number
  networkThroughput: number
}

export function NetworkStats() {
  const [networkStats, setNetworkStats] = useState<NetworkStats | undefined>()
  const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState(null);

  useEffect(() => {
    getNetworkStats()
  }, [])

  const getNetworkStats = async () => {
    setIsLoading(true)
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

  return (
    <DashboardContent>
      <Title>NetworkStats stats</Title>
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
    </DashboardContent>
  )
}