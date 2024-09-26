

export function DashboardContent({children}: {children: React.ReactNode}) {
  return (
    <div className={"flex flex-col pt-[60px] pb-12 md:pt-[40px] md:pb-0"}>
      {children}
    </div>
  )
}