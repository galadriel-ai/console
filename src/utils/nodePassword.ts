
const KEY: string = "gal-node-password"

export function setNodePassword(password: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, password)
  }
}

export function getNodePassword(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem(KEY) || ""
  }
  return ""
}
