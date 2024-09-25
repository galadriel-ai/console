
export interface DataPoint {
  time: string
  inferences: number
}

export interface ChartData {
  title: string

  dataPoints: DataPoint[]
  labelName: string

  xDataKey: "time"
  yDataKey: "inferences"
}