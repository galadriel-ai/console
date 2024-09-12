import type {Metadata} from "next";
import {IBM_Plex_Mono} from "next/font/google";
import "./globals.css";

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
    <body
      className={`${ibmPlexMono.className} antialiased`}
    >
    {children}
    </body>
    </html>
  );
}
