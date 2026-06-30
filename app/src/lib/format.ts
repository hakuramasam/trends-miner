export function formatOre(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return Math.floor(value).toLocaleString();
}

export function formatTrend(value: bigint, decimals = 18): string {
  const divisor = 10n ** BigInt(decimals);
  const whole = value / divisor;
  const fraction = value % divisor;
  const fractionStr = fraction.toString().padStart(Number(decimals), "0");
  const trimmed = fractionStr.slice(0, 2).replace(/0+$/, "");
  if (whole >= 1_000_000n) {
    return `${(Number(whole) / 1_000_000).toFixed(2)}M`;
  }
  if (whole >= 1_000n) {
    return `${(Number(whole) / 1_000).toFixed(1)}K`;
  }
  return trimmed ? `${whole}.${trimmed}` : whole.toString();
}

export function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}
