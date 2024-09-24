
export interface DataPoint {
  time: string
  inferences: number
}

export interface ChartData {
  dataPoints: DataPoint[]
  labelName: string

  xDataKey: "time"
  yDataKey: "inferences"
}