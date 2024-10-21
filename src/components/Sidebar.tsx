import {getIcon, IconName} from "@/components/Icons";
import {useRouter} from "next/navigation";
import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import {getEmail, getUsername, removeUserData} from "@/utils/user";
import {Suspense, useState} from "react";

export type MenuItemType = "" | "chat" | "limits" | "network_stats" | "node_stats" | "my_nodes" | "api_keys"
const validMenuItems: MenuItemType[] = ["chat", "limits", "network_stats", "node_stats", "my_nodes", "api_keys"];

export function isMenuItemType(value: string): value is MenuItemType {
  return validMenuItems.includes(value as MenuItemType);
}

export default function Sidebar(
  {
    selectedMenu, onMenuItemChange, onMenuOpenChange
  }: {
    selectedMenu: MenuItemType,
    onMenuItemChange: (menuItem: MenuItemType) => void,
    onMenuOpenChange: (open: boolean) => void,
  }
) {
  const router = useRouter();

  const onLogout = async () => {
    const response = await fetch('/api/logout', {
      method: 'GET',
    });

    if (response.ok) {
      // Redirect to the login page after logging out
      removeUserData()
      router.push('/login');
    } else {
      console.error('Logout failed');
    }
  }

  return (
    <>
      <Settings onLogout={onLogout} onMenuOpenChange={onMenuOpenChange}/>
      <div className="flex flex-col gap-4">
        <div className="gal-subtitle">For developers</div>
        <div className="flex flex-col gap-[10px]">
          <MenuItem
            name={"Chat"}
            isActive={selectedMenu === "chat"}
            iconName={"menu_chat"}
            onClick={() => onMenuItemChange("chat")}
          />
          <MenuItem
            name={"API Usage"}
            isActive={selectedMenu === "limits"}
            iconName={"menu_stopwatch"}
            onClick={() => onMenuItemChange("limits")}
          />
          <a
            href={process.env.NEXT_PUBLIC_DOCS_URL + "api-reference/quickstart"}
            target="_blank"
          >
            <div
              className={`flex flex-row gap-4 min-h-[40px] py-[10px] px-[12px] items-center cursor-pointer gal-sidebar-menu-item gal-group`}
            >
              {getIcon("menu_docs")}
              <div className={"flex flex-row gap-2 items-center"}>
                API Docs
                {getIcon("arrow")}
              </div>
            </div>
          </a>
          <div className="gal-subtitle pt-8">For nodes</div>

          <MenuItem
            name={"Network stats"}
            isActive={selectedMenu === "network_stats"}
            iconName={"menu_network"}
            onClick={() => onMenuItemChange("network_stats")}
          />
          <MenuItem
            name={"Node stats"}
            isActive={selectedMenu === "node_stats"}
            iconName={"menu_mystats"}
            onClick={() => onMenuItemChange("node_stats")}
          />
          <MenuItem
            name={"My Nodes"}
            isActive={selectedMenu === "my_nodes"}
            iconName={"menu_mynodes"}
            onClick={() => onMenuItemChange("my_nodes")}
          />
          <MenuItem
            name={"API Keys"}
            isActive={selectedMenu === "api_keys"}
            iconName={"menu_keys"}
            onClick={() => onMenuItemChange("api_keys")}
          />
          <a
            href={process.env.NEXT_PUBLIC_DOCS_URL + "nodes/quickstart"}
            target="_blank"
          >
            <div
              className={`flex flex-row gap-4 min-h-[40px] py-[10px] px-[12px] items-center cursor-pointer gal-sidebar-menu-item gal-group`}
            >
              {getIcon("menu_docs")}
              <div className={"flex flex-row gap-2 items-center"}>
                Node Docs
                {getIcon("arrow")}
              </div>
            </div>
          </a>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Suspense>
          <div className={"md:hidden flex flex-col pb-4 gap-2"}>
            <div>{getUsername()}</div>
            <div className={"font-normal"}>{getEmail()}</div>
            <div className={"gal-link cursor-pointer"} onClick={onLogout}>Log out</div>
          </div>
        </Suspense>
        <div className="gal-subtitle">Community & Support</div>
        <div className="flex flex-row gap-4">
          <a
            href="https://discord.gg/4UuffUbkjb"
            target="_blank"
            className={"gal-group"}
          >
            {getIcon("discord")}
          </a>
          <a
            href="https://x.com/Galadriel_AI"
            target="_blank"
            className={"gal-group"}
          >
            {getIcon("twitter")}
          </a>
        </div>
      </div>
    </>
  )
}

function MenuItem({name, isActive, iconName, onClick}: {
  name: string,
  isActive: boolean,
  iconName: IconName,
  onClick: () => void
}) {
  return (
    <div
      className={`flex flex-row gap-4 min-h-[40px] py-[10px] px-[12px] items-center cursor-pointer gal-sidebar-menu-item gal-text gal-group ${isActive && "gal-sidebar-menu-item-active"}`}
      onClick={() => onClick()}
      data-ph-capture-attribute-dashboard-page-name={name}
    >
      {getIcon(iconName)}
      {name}
    </div>
  )
}

function Settings(
  {onLogout, onMenuOpenChange}:
    { onLogout: () => void, onMenuOpenChange: (open: boolean) => void }
) {

  const [isOpen, setIsOpen] = useState<boolean>(false)

  const onOpenChange = (open: boolean) => {
    setIsOpen(open)
    onMenuOpenChange(open)
  }

  return (
    <>
      <DropdownMenu onOpenChange={onOpenChange}>
        <DropdownMenuTrigger asChild className={""}>
          <div
            className={"hidden gal-settings-wrapper md:fixed top-12 right-10 md:flex flex-row gap-2 items-center cursor-pointer gal-group"}>
            <div>{getIcon("gear")}</div>
            <div>{isOpen ? getIcon("arrow_up") : getIcon("arrow_down")}</div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-auto py-8 px-6 flex flex-col gap-6" align={"end"} sideOffset={10}>
          <Suspense>
            <div className={"flex flex-col gap-2"}>
              <div>{getUsername()}</div>
              <div className={"font-normal"}>{getEmail()}</div>
            </div>
            <div className={"gal-link cursor-pointer"} onClick={onLogout}>Log out</div>
          </Suspense>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}