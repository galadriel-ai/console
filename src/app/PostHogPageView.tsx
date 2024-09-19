"use client"

import {usePathname, useSearchParams} from "next/navigation";
import {Suspense, useEffect} from "react";
import {usePostHog} from "posthog-js/react";

export default function PostHogPageView() {
  return (
    <Suspense>
      <PostHogPageViewLoaded/>
    </Suspense>
  )
}

function PostHogPageViewLoaded(): null {
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
      posthog.capture(
        "$pageview",
        {
          "$current_url": url,
          "website": "console",
        },
      )
    }
  }, [pathname, searchParams, posthog])

  return null
}