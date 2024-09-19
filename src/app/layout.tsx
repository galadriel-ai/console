import type {Metadata} from "next";
import {IBM_Plex_Mono} from "next/font/google";
import "./globals.css";
import {PHProvider} from "@/app/providers";
import PostHogPageView from "@/app/PostHogPageView";

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-ibm"
});

export const metadata: Metadata = {
  title: "Galadriel console",
  description: "Manage your galadriel nodes and API keys",
};

export default function RootLayout(
  {
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <html lang="en">
    <PHProvider>
      <body
        className={`${ibmPlexMono.className} antialiased`}
      >
      <PostHogPageView/>
      {children}
      </body>
    </PHProvider>
    </html>
  );
}
