"use client"

import {useState} from "react";
import Sidebar, {MenuItemType} from "@/components/Sidebar";
import {Network} from "@/components/dashboard/Network";

export default function LoginPage() {

  const [selectedMenu, setSelectedMenu] = useState<MenuItemType>("network_stats")

  const onMenuItemChange = (name: MenuItemType) => {
    setSelectedMenu(name)
  }




  return (
    <div
      className="flex w-full min-h-screen flex-row gap-[40px] p-[40px]"
    >
      <div className="w-1/5 min-w-[260px] flex flex-col justify-between gal-sidebar p-[10px]">
        <Sidebar selectedMenu={selectedMenu} onMenuItemChange={(menuItem: MenuItemType) => onMenuItemChange(menuItem)}/>
      </div>
      <div className="w-4/5 h-full">
        {selectedMenu === "network_stats" &&
          <Network/>
        }

      </div>
    </div>
  )
}
