

export function DashboardContent({children}: {children: React.ReactNode}) {
  return (
    <div className={"flex flex-col pt-[40px]"}>
      {children}
    </div>
  )
}