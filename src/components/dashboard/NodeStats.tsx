import {DashboardContent} from "@/components/dashboard/components/DashboardContent";
import {Title} from "@/components/Text";
import {useEffect, useState} from "react";
import {formatNumber} from "@/utils/helpers";
import {Card} from "@/components/dashboard/components/Card";

interface NodeStats {
  inferencesCount: number
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
      const response = await fetch('/api/node_stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.log("Not ok")
        setNodeStats({
          inferencesCount: 0,
        })
      }
      const responseJson = await response.json()
      setNodeStats({
        inferencesCount: responseJson.requests_served_day || 0,
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
          title="Your inferences last 24h"
          isLoading={isLoading}
          text={nodeStats ? formatNumber(nodeStats.inferencesCount) : ""}
          iconName={"count"}
        />

      </div>
    </DashboardContent>
  )
}