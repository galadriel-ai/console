import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
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
      if (responseJson.usage_tier_name && responseJson.usages !== null) {
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
      <div className={"py-8"}>
        {(isLoading && !rateLimits) &&
          <div>Loading...</div>
        }
        {rateLimits &&
          <>
            <div className={"flex flex-col md:flex-row pb-8"}>
              <LimitsCard
                title="Usage tier"
                isLoading={isLoading}
                text={rateLimits.usage_tier_name ? rateLimits.usage_tier_name : ""}
              />
            </div>
            <div
              className={"py-8 px-3 md:px-8 flex flex-col gap-8 gal-card"}
            >
              <div>Daily API usage</div>
              {rateLimits.usages.map((usage: any, index: number) => {
                return <div key={index}>
                  <div className={"gal-title-secondary pb-4"}>
                    {usage.model}
                  </div>
                  <UsageBar
                    usage={usage.requests_used_day}
                    usageLeft={usage.requests_left_day}
                    maxUsage={usage.max_requests_per_day}
                    text={"requests"}
                  />
                  <UsageBar
                    usage={usage.tokens_used_day}
                    usageLeft={usage.tokens_left_day}
                    maxUsage={usage.max_tokens_per_day}
                    text={"tokens"}
                  />
                </div>
              })}
            </div>
            <div
              className={"flex flex-col pt-[32px] gap-6"}
            >
              <div className={"px-3 pt-10 gal-text-secondary max-w-4xl"}>
                <div className={"pb-4"}>
                  Rate limits
                </div>
                <LimitsTable limits={rateLimits.usages || []}/>
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
  {usage, usageLeft, maxUsage, text}: {
    usage: number | null,
    usageLeft: number | null,
    maxUsage: number | null,
    text: string,
  }
) {

  let percentage = 0
  if (usageLeft !== null && maxUsage !== null && usageLeft !== maxUsage) {
    percentage = Math.max(((maxUsage - usageLeft) / maxUsage) * 100, 1)
  }

  return (
    <div className={"flex flex-col gap-2 pb-4"}>
      <div className={"gal-subtitle"}>
        {(maxUsage && usageLeft) ? formatNumber(maxUsage - usageLeft) : (usage || 0)} / {maxUsage ? formatNumber(maxUsage) : "∞"} {text}
      </div>
      <Progress value={percentage} className="w-full"/>
    </div>
  )
}

function LimitsTable({limits}: { limits: any[] }) {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Model</TableHead>
            {/*<TableHead>Tier</TableHead>*/}
            {/*<TableHead>Price per 1M token</TableHead>*/}
            <TableHead>RPM ¹</TableHead>
            <TableHead>RPD ²</TableHead>
            <TableHead>TPM ³</TableHead>
            <TableHead>TPD ⁴</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {limits.map((limit) => (
            <TableRow key={limit.model}>
              <TableCell className="font-medium">{limit.model}</TableCell>
              {/*<TableCell>{"TODO"}</TableCell>*/}
              {/*<TableCell>-</TableCell>*/}
              <TableCell>{limit.max_requests_per_minute ? formatNumber(limit.max_requests_per_minute) : "∞"}</TableCell>
              <TableCell>{limit.max_requests_per_day ? formatNumber(limit.max_requests_per_day) : "∞"}</TableCell>
              <TableCell>{limit.max_tokens_per_minute ? formatNumber(limit.max_tokens_per_minute) : "∞"}</TableCell>
              <TableCell>{limit.max_tokens_per_day ? formatNumber(limit.max_tokens_per_day) : "∞"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className={"gal-subtitle flex flex-col pt-4 gap-1"}>
          <div>(1) Requests Per Minute</div>
          <div>(2) Requests Per Day</div>
          <div>(3) Tokens Per Minute</div>
          <div>(4) Tokens Per Day</div>
      </div>
    </div>
  )
}