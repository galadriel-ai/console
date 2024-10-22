import {DashboardContent} from "@/components/dashboard/components/DashboardContent";
import {Title} from "@/components/Text";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {formatNumber} from "@/utils/helpers";
import {Progress} from "@/components/ui/progress";
import {getIcon, IconName} from "@/components/Icons";
import {ppNeueBit} from "@/app/fonts/fonts";

export function Limits() {

  const router = useRouter()

  const [rateLimits, setRateLimits] = useState<any>(undefined)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    getLimits()
  }, [])

  const getLimits = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/rate_limits", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login")
        }
      }
      const responseJson = await response.json()
      console.log("responseJson")
      console.log(responseJson)
      if (responseJson.rate_limit_minute && responseJson.rate_limit_day) {
        setRateLimits(responseJson)
      }
      // if (responseJson.api_key) setApiKey(responseJson.api_key)
    } catch {
      // setError(error.message || 'An error occurred during login.');
    }
    setIsLoading(false)
  }

  return (
    <DashboardContent>
      <div className={"flex flex-col px-3 md:px-0"}>
        <Title>API Usage</Title>
        <div className={"pt-10 gal-text-secondary max-w-4xl"}>
          API usage stats & limits
        </div>
      </div>
      <div className={"pt-8"}>
        {(isLoading && !rateLimits) &&
          <div>Loading...</div>
        }
        {rateLimits &&
          <>
            <div
              className={"flex flex-col pt-[32px] gap-6"}
            >
              <div className={"flex flex-col md:flex-row gap-6"}>
                <LimitsCard
                  title="Usage tier"
                  isLoading={isLoading}
                  text={rateLimits.usage_tier_name ? rateLimits.usage_tier_name : ""}
                />
              </div>
              <div className={"pt-10 gal-text-secondary max-w-4xl"}>
                Rate limits
              </div>
              <div className={"flex flex-col md:flex-row gap-6"}>
                <LimitsCard
                  title="Max requests"
                  isLoading={isLoading}
                  text={rateLimits.rate_limit_minute.max_requests}
                  subText={"req/min"}
                />
                <LimitsCard
                  title="Max tokens"
                  isLoading={isLoading}
                  text={rateLimits.rate_limit_minute.max_tokens}
                  subText={"tok/min"}
                />
              </div>
              <div className={"flex flex-col md:flex-row gap-6"}>
                <LimitsCard
                  title="Max requests"
                  isLoading={isLoading}
                  text={rateLimits.rate_limit_day.max_requests}
                  subText={"req/day"}
                />
                <LimitsCard
                  title="Max tokens"
                  isLoading={isLoading}
                  text={rateLimits.rate_limit_day.max_tokens}
                  subText={"tok/day"}
                />
              </div>

              <div
                className={"py-8 px-3 md:px-8 flex flex-col gap-8 gal-card"}
              >
                <div>Daily API usage</div>
                <UsageBar
                  usageLeft={rateLimits.rate_limit_day.remaining_requests}
                  maxUsage={rateLimits.rate_limit_day.max_requests}
                  text={"requests"}
                />
                <UsageBar
                  usageLeft={rateLimits.rate_limit_day.remaining_tokens}
                  maxUsage={rateLimits.rate_limit_day.max_tokens}
                  text={"tokens"}
                />
              </div>
            </div>

          </>
        }
      </div>
    </DashboardContent>
  )
}


interface Props {
  title: string
  isLoading: boolean
  text: string | undefined
  subText?: string | undefined
  iconName?: IconName
}

function LimitsCard({title, text, isLoading, subText, iconName}: Props) {
  return (
    <div
      className={"md:w-1/3 py-6 px-8 flex flex-col gap-8 gal-card"}
    >
      <div className={"gal-text flex flex-row justify-between"}>
        <div>
          {title}
        </div>
        {iconName &&
          <>
            {getIcon(iconName)}
          </>
        }
      </div>
      {(isLoading || !text) ?
        <div>Loading...</div>
        :
        <div className={"flex flex-row gap-3"}>
          <span
            className={`${ppNeueBit.className} gal-title`}
            style={{fontSize: "60px"}}
          >
            {text}
          </span>
          {subText &&
            <span className={"gal-unit"}>{subText}</span>
          }
        </div>
      }
    </div>
  )
}

function UsageBar(
  {usageLeft, maxUsage, text}: {
    usageLeft: number,
    maxUsage: number,
    text: string,
  }
) {

  const percentage = Math.max(((maxUsage - usageLeft) / maxUsage) * 100, 1)

  return (
    <div className={"flex flex-col gap-2"}>
      <div className={"gal-subtitle"}>
        {formatNumber(maxUsage - usageLeft)} / {formatNumber(maxUsage)} {text}
      </div>
      <Progress value={percentage} className="w-full"/>
    </div>
  )
}