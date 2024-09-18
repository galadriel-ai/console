export type PageName = "list" | "add" | "display"

export interface GpuNode {
  nodeId: string

  gpuModel: string
  vram: number
  cpuModel: string
  cpuCount: number
  ram: number
  networkUploadSpeed: number
  networkDownloadSpeed: number
  operatingSystem: string

  nameAlias: string
  status: string
  runDurationSeconds: number
  totalUptimeSeconds: number
  requestsServed: number
  requestsServedDay: number
  nodeCreatedAt: number
}

export function createGpuNode(nodeId: string, nameAlias: string): GpuNode {
  return {
    nodeId,

    gpuModel: "",
    vram: 0,
    cpuModel: "",
    cpuCount: 0,
    ram: 0,
    networkUploadSpeed: 0,
    networkDownloadSpeed: 0,
    operatingSystem: "",

    nameAlias,
    status: "",
    runDurationSeconds: 0,
    totalUptimeSeconds: 0,
    requestsServed: 0,
    requestsServedDay: 0,
    nodeCreatedAt: Math.floor((new Date()).getTime() / 1000),
  }
}
