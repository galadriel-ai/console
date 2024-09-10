import Link from "next/link";


export default function Landing() {
  return (
    <div className="flex w-full min-h-screen max-w-[1200px] mx-auto flex-col items-center gap-20 py-2 px-5 lg:px-10 z-2 relative">
      <div>Landing</div>
      <Link href="/login">Log in</Link>
    </div>
  )
}