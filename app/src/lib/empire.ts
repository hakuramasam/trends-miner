import { Address } from 'viem';

const EMPIRE_API_BASE = 'https://www.empirebuilder.world/api';
const TREND_TOKEN_ADDRESS = '0xbf981cfF5040F9652D4721c85C3e05F6d79f9b07' as Address;

export interface EmpireUser {
  address: Address;
  balance: bigint;
  staked: bigint;
  multiplier: number;
  lastClaim: number;
  totalClaimed: bigint;
}

export interface LeaderboardEntry {
  rank: number;
  address: Address;
  balance: bigint;
  staked: bigint;
}

export interface Booster {
  id: string;
  name: string;
  description: string;
  multiplier: number;
  cost: bigint;
  duration: number;
}

export interface Treasury {
  address: Address;
  balance: bigint;
}

export async function fetchEmpireUser(address: Address): Promise<EmpireUser | null> {
  try {
    const url = EMPIRE_API_BASE + '/empire/' + TREND_TOKEN_ADDRESS + '/users/' + address;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    return {
      address: data.address as Address,
      balance: BigInt(data.balance || 0),
      staked: BigInt(data.staked || 0),
      multiplier: data.multiplier || 1,
      lastClaim: data.lastClaim || 0,
      totalClaimed: BigInt(data.totalClaimed || 0),
    };
  } catch {
    return null;
  }
}

export async function fetchLeaderboard(limit: number = 100): Promise<LeaderboardEntry[]> {
  try {
    const url = EMPIRE_API_BASE + '/empire/' + TREND_TOKEN_ADDRESS + '/leaderboard?limit=' + limit;
    const response = await fetch(url);
    if (!response.ok) return [];
    const data = await response.json();
    return data.map((entry: any, index: number) => ({
      rank: index + 1,
      address: entry.address as Address,
      balance: BigInt(entry.balance || 0),
      staked: BigInt(entry.staked || 0),
    }));
  } catch {
    return [];
  }
}

export async function fetchBoosters(): Promise<Booster[]> {
  try {
    const url = EMPIRE_API_BASE + '/empire/' + TREND_TOKEN_ADDRESS + '/boosters';
    const response = await fetch(url);
    if (!response.ok) return [];
    const data = await response.json();
    return data.map((booster: any) => ({
      id: booster.id,
      name: booster.name,
      description: booster.description,
      multiplier: booster.multiplier,
      cost: BigInt(booster.cost || 0),
      duration: booster.duration,
    }));
  } catch {
    return [];
  }
}

export async function fetchTreasury(): Promise<Treasury | null> {
  try {
    const url = EMPIRE_API_BASE + '/empire/' + TREND_TOKEN_ADDRESS + '/treasury';
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    return {
      address: data.address as Address,
      balance: BigInt(data.balance || 0),
    };
  } catch {
    return null;
  }
}