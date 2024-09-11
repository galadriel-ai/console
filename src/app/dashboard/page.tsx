"use client"

import {useState} from "react";

export default function LoginPage() {

  const [networkStats, setNetworkStats] = useState<string>("")

  const getNetworkStats = async () => {
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
      setNetworkStats(JSON.stringify(responseJson))
    } catch {
      console.log("ERROR")
      // setError(error.message || 'An error occurred during login.');
    }
  }


  return (
    <div
      className="flex w-full min-h-screen max-w-[1200px] mx-auto flex-col items-center gap-20 pt-10 py-2 px-5 lg:px-10 z-2 relative"
    >
      <div>Dashboard</div>
      <button onClick={() => getNetworkStats()}>Get network stats</button>
      <div>{networkStats}</div>
    </div>
  )
}
