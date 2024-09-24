import {Area, AreaChart, CartesianGrid, XAxis, YAxis} from "recharts"

import {CardContent, CardHeader,} from "@/components/ui/card"
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart"
import {ChartData} from "@/types/chart";


export function Chart({chartData}: { chartData: ChartData | undefined }) {

  if (!chartData) {
    return (
      <div className={"gal-card"}>
        <CardHeader>
          <div className={"gal-text"}>Hourly network total inferences</div>
        </CardHeader>
        <CardContent>
          Loading...
        </CardContent>
      </div>
    )
  }

  const chartConfig = {
    inferences: {
      label: chartData.labelName,
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig

  return (
    <div className={"gal-card"}>
      <CardHeader>
        <div className={"gal-text"}>Hourly network total inferences</div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData.dataPoints}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="35%" stopColor="#4489FF" stopOpacity={1}/>
                <stop offset="90%" stopColor="white" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false}/>
            <XAxis
              dataKey={chartData.xDataKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={8}
              tickFormatter={(value) => value}
            />
            <YAxis domain={[0, (dataMax: number) => dataMax + 20]}/>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line"/>}
            />
            <Area
              dataKey={chartData.yDataKey}
              type="natural"
              // fill="var(--Blue)"
              fill={`url(#colorUv)`}
              fillOpacity={0.4}
              stroke="#4489FF"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </div>
  )
}
