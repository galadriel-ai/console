"use client"

import {useState} from "react";
import Sidebar, {MenuItemType} from "@/components/Sidebar";

export default function LoginPage() {

  const [networkStats, setNetworkStats] = useState<string>("")
  const [selectedMenu, setSelectedMenu] = useState<MenuItemType>("network_stats")

  const onMenuItemChange = (name: MenuItemType) => {
    setSelectedMenu(name)
  }

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
      className="flex w-full min-h-screen flex-row gap-[40px] p-[40px]"
    >
      <div className="w-1/5 min-w-[220px] flex flex-col justify-between gal-sidebar p-[10px]">
        <Sidebar selectedMenu={selectedMenu} onMenuItemChange={(menuItem: MenuItemType) => onMenuItemChange(menuItem)}/>
      </div>
      <div className="w-4/5 h-full">
        {selectedMenu === "network_stats" &&
          <>
            <button onClick={() => getNetworkStats()}>Get network stats</button>
            <div>{networkStats}</div>
          </>
        }

      </div>
    </div>
  )
}
