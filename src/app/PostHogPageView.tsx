"use client"

import {usePathname, useSearchParams} from "next/navigation";
import {useEffect} from "react";
import {usePostHog} from "posthog-js/react";
import {getEmail} from "@/utils/user";

export default function PostHogPageView(): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();
  useEffect(() => {
    // Track page views
    if (pathname && posthog) {
      let url = window.origin + pathname
      if (searchParams.toString()) {
        url = url + `?${searchParams.toString()}`
      }
      const email = getEmail()
      let properties: any = {
        "$current_url": url,
        "website": "console",
      }
      if (email) {
        properties = {
          email, ...properties
        }
      }
      posthog.capture(
        "$pageview",
        properties,
      )


    }
  }, [pathname, searchParams, posthog])

  return null
}