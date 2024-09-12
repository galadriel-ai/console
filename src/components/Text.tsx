import {ppNeueBit} from "@/app/fonts/fonts";


export function Title({children}: {children: React.ReactNode}) {
  return <span className={`${ppNeueBit.className} gal-title`}>{children}</span>
}