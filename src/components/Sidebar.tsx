import {getIcon, IconName} from "@/components/Icons";
import {useRouter} from "next/navigation";

export type MenuItemType = "network_stats" | "node_stats"

export default function Sidebar(
  {
    selectedMenu, onMenuItemChange
  }: {
    selectedMenu: MenuItemType,
    onMenuItemChange: (menuItem: MenuItemType) => void
  }
) {
  const router = useRouter();

  const onLogout = async () => {
    const response = await fetch('/api/logout', {
      method: 'GET',
    });

    if (response.ok) {
      // Redirect to the login page after logging out
      router.push('/login');
    } else {
      console.error('Logout failed');
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="gal-subtitle">Menu</div>
        <div className="col gap-[10px]">
          <MenuItem
            name={"Network stats"}
            isActive={selectedMenu === "network_stats"}
            iconName={"menu_network"}
            onClick={() => onMenuItemChange("network_stats")}
          />
          <MenuItem
            name={"My stats"}
            isActive={selectedMenu === "node_stats"}
            iconName={"menu_mystats"}
            onClick={() => onMenuItemChange("node_stats")}
          />
          <a
            href={process.env.NEXT_PUBLIC_DOCS_URL}
            target="_blank"
          >
            <div
              className={`flex flex-row gap-4 min-h-[40px] py-[10px] px-[12px] items-center cursor-pointer gal-sidebar-menu-item`}
            >
              {getIcon("menu_docs")}
              <div className={"flex flex-row gap-2 items-center"}>
                Docs
                {getIcon("arrow")}
              </div>
            </div>
          </a>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className={"cursor-pointer"} onClick={onLogout}>Log out</div>
        <div className="gal-subtitle">Community & Support</div>
        <div className="flex flex-row gap-4">
          <a
            href="https://discord.gg/4UuffUbkjb"
            target="_blank"
          >
            {getIcon("discord")}
          </a>
          <a
            href="https://x.com/Galadriel_AI"
            target="_blank"
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
      className={`flex flex-row gap-4 min-h-[40px] py-[10px] px-[12px] items-center cursor-pointer gal-sidebar-menu-item gal-text ${isActive && "gal-sidebar-menu-item-active"}`}
      onClick={() => onClick()}
    >
      {getIcon(iconName)}
      {name}
    </div>
  )
}