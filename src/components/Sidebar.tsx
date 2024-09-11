export type MenuItemType = "network_stats" | "node_stats"

export default function Sidebar(
  {
    selectedMenu, onMenuItemChange
  }: {
    selectedMenu: MenuItemType,
    onMenuItemChange: (menuItem: MenuItemType) => void
  }
) {

  // const onMenuItemChange = (name: MenuItemType) => {
  //   setSelectedMenu(name)
  // }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="gal-subtitle">Menu</div>
        <div className="col gap-[10px]">
          <MenuItem
            name={"Network stats"}
            isActive={selectedMenu === "network_stats"}
            onClick={() => onMenuItemChange("network_stats")}
          />
          <MenuItem
            name={"My stats"}
            isActive={selectedMenu === "node_stats"}
            onClick={() => onMenuItemChange("node_stats")}
          />
          <a
            href={process.env.NEXT_PUBLIC_DOCS_URL}
            target="_blank"
          >
            <div
              className={`min-h-[40px] py-[10px] px-[12px] items-center cursor-pointer gal-sidebar-menu-item`}
            >
              Docs
            </div>
          </a>
        </div>
      </div>
      <div>footer</div>
    </>
  )
}

function MenuItem({name, isActive, onClick}: { name: string, isActive: boolean, onClick: () => void }) {
  return (
    <div
      className={`min-h-[40px] py-[10px] px-[12px] items-center cursor-pointer gal-sidebar-menu-item ${isActive && "gal-sidebar-menu-item-active"}`}
      onClick={() => onClick()}
    >
      {name}
    </div>
  )
}