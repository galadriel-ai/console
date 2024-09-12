
export function formatNumber(n: number): string {
  const integerNumber = Math.floor(n)
  return integerNumber.toLocaleString('en-US');
}