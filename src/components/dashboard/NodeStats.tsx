import {DashboardContent} from "@/components/dashboard/components/DashboardContent";
import {Title} from "@/components/Text";
import {useEffect, useState} from "react";
import {formatNumber} from "@/utils/helpers";
import {Card} from "@/components/dashboard/components/Card";

interface NodeStats {
  inferencesCountDay: number
  inferencesCount: number
  averageTimeToFirstToken: number
  totalTokensPerSecond: number
}

export function NodeStats() {
  const [nodeStats, setNodeStats] = useState<NodeStats | undefined>()
  const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState(null);

  useEffect(() => {
    getNetworkStats()
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
        console.log("Not ok")
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

  return (
    <DashboardContent>
      <Title>Node stats</Title>
      <div
        className={"flex flex-row pt-[32px] gap-6"}
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
    </DashboardContent>
  );
}