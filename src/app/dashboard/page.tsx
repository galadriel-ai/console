"use client"

import {Drawer, DrawerContent, DrawerTrigger} from "@/components/ui/drawer"
import {useEffect, useState} from "react";
import Sidebar, {MenuItemType} from "@/components/Sidebar";
import {NetworkStats} from "@/components/dashboard/NetworkStats";
import {NodeStats} from "@/components/dashboard/NodeStats";
import {ApiKeys} from "@/components/dashboard/ApiKeys";
import {MyNodes} from "@/components/dashboard/MyNodes";
import {usePostHog} from "posthog-js/react";
import {getUserId} from "@/utils/user";
import {Chat} from "@/components/dashboard/Chat";
import {getIcon} from "@/components/Icons";

export default function DashboardPage() {
  const posthog = usePostHog()

  const [isIdentified, setIsIdentified] = useState<boolean>(false)

  useEffect(() => {
    if (isIdentified) return
    const userId = getUserId()
    if (userId) {
      posthog?.identify(userId, {})
      setIsIdentified(true)
    }
  }, [posthog])

  const [selectedMenu, setSelectedMenu] = useState<MenuItemType>("chat")

  const onMenuItemChange = (name: MenuItemType) => {
    setSelectedMenu(name)
  }

  const onRunNode = () => {
    setSelectedMenu("my_nodes")
  }

  return (
    <div
      className="flex w-full min-h-screen flex-row gap-[40px] pt-12 p-0 md:p-[40px]"
    >
      <SidebarMobileWrapper
        selectedMenu={selectedMenu}
        onMenuItemChange={(menuItem: MenuItemType) => onMenuItemChange(menuItem)}
      />
      <div className="hidden md:flex md:w-1/5 min-w-[260px] flex-col justify-between gal-sidebar p-[10px]">
        <Sidebar selectedMenu={selectedMenu} onMenuItemChange={(menuItem: MenuItemType) => onMenuItemChange(menuItem)}/>
      </div>
      <div className="w-full md:w-4/5 h-full">
        {selectedMenu === "chat" &&
          <Chat onRunNode={onRunNode}/>
        }
        {selectedMenu === "network_stats" &&
          <NetworkStats/>
        }
        {selectedMenu === "node_stats" &&
          <NodeStats/>
        }
        {selectedMenu === "my_nodes" &&
          <MyNodes/>
        }
        {selectedMenu === "api_keys" &&
          <ApiKeys/>
        }

      </div>
    </div>
  )
}

function SidebarMobileWrapper(
  {
    selectedMenu, onMenuItemChange
  }: {
    selectedMenu: MenuItemType,
    onMenuItemChange: (menuItem: MenuItemType) => void
  }
) {

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const onOpenChange = (open: boolean) => {
    setIsOpen(open)
  }

  const onMenuItemChangeClose = (menuItem: MenuItemType) => {
    setIsOpen(false)
    onMenuItemChange(menuItem)
  }

  return (
    <div className={"md:hidden absolute left-0 top-0 z-20 w-full py-4 px-4 bg-white"}>
      <Drawer direction={"left"} open={isOpen} onOpenChange={onOpenChange}>
        <DrawerTrigger>{getIcon("burger")}</DrawerTrigger>
        <DrawerContent className={"bg-white h-full w-3/4 flex flex-col justify-between p-[10px] pb-6"}>
          <Sidebar
            selectedMenu={selectedMenu}
            onMenuItemChange={onMenuItemChangeClose}
          />
        </DrawerContent>
      </Drawer>
    </div>
  )
}