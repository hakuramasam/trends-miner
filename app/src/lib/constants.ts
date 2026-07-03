// Token and staking constants
export const TREND_TOKEN_ADDRESS = '0xbf981cfF5040F9652D4721c85C3e05F6d79f9b07';
export const EMPIRE_API_BASE = 'https://www.empirebuilder.world/api';

// Stake thresholds for multipliers
export const STAKE_MULTIPLIERS = {
  THRESHOLD_1M: 1_000_000n,
  THRESHOLD_10M: 10_000_000n,
  MULTIPLIER_3X: 3,
  MULTIPLIER_4_5X: 4.5,
} as const;

export function calculateStakeMultiplier(stakedAmount: bigint): number {
  if (stakedAmount >= STAKE_MULTIPLIERS.THRESHOLD_10M) {
    return STAKE_MULTIPLIERS.MULTIPLIER_4_5X;
  }
  if (stakedAmount >= STAKE_MULTIPLIERS.THRESHOLD_1M) {
    return STAKE_MULTIPLIERS.MULTIPLIER_3X;
  }
  return 1;
}

// Mining configuration
export const MINING_CONFIG = {
  BASE_RATE: 1000,
  TAP_MULTIPLIER: 1.5,
  MAX_ENERGY: 100,
  ENERGY_REGEN_RATE: 10,
  ENERGY_PER_TAP: 10,
} as const;

// API configuration
export const API_CONFIG = {
  RATE_LIMIT_WINDOW_MS: 60 * 1000,
  RATE_LIMIT_MAX: 100,
  CACHE_TTL_MS: 5 * 60 * 1000,
  STALE_WHILE_REVALIDATE_MS: 2 * 60 * 1000,
} as const;

// Guild configuration
export const GUILDS = {
  NOVICE: { id: 1, name: 'Novice', multiplier: 1, requirement: 0n },
  APPRENTICE: { id: 2, name: 'Apprentice', multiplier: 1.25, requirement: 1000n },
  MASTER: { id: 3, name: 'Master', multiplier: 1.5, requirement: 10000n },
} as const;

// Vein configuration
export const VEINS = {
  CRYPTO: { id: 1, name: 'Crypto', baseRate: 1000, multiplier: 1 },
  AI: { id: 2, name: 'AI', baseRate: 1200, multiplier: 1.2 },
  DEFI: { id: 3, name: 'DeFi', baseRate: 1500, multiplier: 1.5 },
  GAMING: { id: 4, name: 'Gaming', baseRate: 1100, multiplier: 1.1 },
  MEMES: { id: 5, name: 'Memes', baseRate: 800, multiplier: 0.8 },
  SOCIAL: { id: 6, name: 'Social', baseRate: 900, multiplier: 0.9 },
} as const;