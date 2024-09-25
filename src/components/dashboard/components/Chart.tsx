import {Area, AreaChart, CartesianGrid, XAxis, YAxis} from "recharts"

import {CardContent, CardHeader,} from "@/components/ui/card"
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart"
import {ChartData} from "@/types/chart";
import {formatTimestampToDate, formatTimestampToTimeNoSecond} from "@/utils/helpers";


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
        <div className={"gal-text"}>{chartData.title}</div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className={"w-full max-h-[400px]"}>
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
              minTickGap={50}
              tick={CustomizedTick}
            />
            <YAxis domain={[0, (dataMax: number) => dataMax + 20]}/>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line"/>}
            />
            <Area
              dataKey={chartData.yDataKey}
              type="natural"
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

function CustomizedTick({x, y, payload}: { x: any, y: any, stroke: any, payload: any }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16}>
        <tspan textAnchor="middle" x="0">
          {formatTimestampToTimeNoSecond(payload.value)}
        </tspan>
      </text>
      <text x={0} y={-15} dy={16}>
        <tspan textAnchor="middle" x="0">
          {formatTimestampToDate(payload.value)}
        </tspan>
      </text>
    </g>
  );
}
