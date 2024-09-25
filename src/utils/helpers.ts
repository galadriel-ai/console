export function formatNumber(n: number): string {
  const integerNumber = Math.floor(n)
  return integerNumber.toLocaleString('en-US');
}

export function formatTimestampToDate(timestampSeconds: number): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(new Date(timestampSeconds * 1000)).replaceAll("/", ".");
}

export function formatTimestampToTime(timestampSeconds: number): string {
  return new Intl.DateTimeFormat('en-GB', {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).format(new Date(timestampSeconds * 1000)).replaceAll("/", ".");
}

export function formatTimestampToTimeNoSecond(timestampSeconds: number): string {
  return new Intl.DateTimeFormat('en-GB', {
    hour: "numeric",
    minute: "numeric",
  }).format(new Date(timestampSeconds * 1000)).replaceAll("/", ".");
}