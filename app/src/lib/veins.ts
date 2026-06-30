export type VeinRarity = "common" | "rare" | "epic" | "viral";
export type Guild = "builders" | "traders" | "scribes" | "all";

export interface Vein {
  id: string;
  name: string;
  type: string;
  rarity: VeinRarity;
  multiplier: number;
  guild: Guild;
  guildBonus: number;
  flavor: string;
  tag: string;
}

export const VEINS: Vein[] = [
  {
    id: "agent-swarm",
    name: "AI Agent Swarms",
    type: "Agent",
    rarity: "viral",
    multiplier: 2.5,
    guild: "traders",
    guildBonus: 0.2,
    flavor:
      "Agents don't predict the future. They organize the past. The swarm found a wallet.",
    tag: "VIRAL",
  },
  {
    id: "builder-codes",
    name: "Builder Codes",
    type: "Infra",
    rarity: "epic",
    multiplier: 2.0,
    guild: "builders",
    guildBonus: 0.15,
    flavor:
      "ERC-8021 pulses through the chain. Every x402 payment leaves a fingerprint.",
    tag: "EPIC",
  },
  {
    id: "prediction-markets",
    name: "Odds Everywhere",
    type: "Markets",
    rarity: "epic",
    multiplier: 1.8,
    guild: "traders",
    guildBonus: 0.15,
    flavor: "Every feed is a market. Every cast is a position.",
    tag: "EPIC",
  },
  {
    id: "farcaster-neynar",
    name: "Protocol Handoff",
    type: "Social",
    rarity: "rare",
    multiplier: 1.5,
    guild: "scribes",
    guildBonus: 0.15,
    flavor:
      "Founders stepped back. Infrastructure stepped up. The graph persists.",
    tag: "RARE",
  },
  {
    id: "realitea",
    name: "Reali-TEA",
    type: "Culture",
    rarity: "common",
    multiplier: 1.2,
    guild: "scribes",
    guildBonus: 0.2,
    flavor: "Polish is out. Proof is in. Mine authenticity, not aesthetics.",
    tag: "COMMON",
  },
  {
    id: "clanker-season",
    name: "Clanker Season",
    type: "Launch",
    rarity: "rare",
    multiplier: 1.6,
    guild: "builders",
    guildBonus: 0.1,
    flavor:
      "$TREND deployed on Base. 384 holders dig beside you. Halving approaches.",
    tag: "RARE",
  },
];

export const RARITY_COLORS: Record<VeinRarity, string> = {
  common: "#6b7280",
  rare: "#3b82f6",
  epic: "#a855f7",
  viral: "#f4b942",
};

export function getVeinById(id: string): Vein {
  return VEINS.find((v) => v.id === id) ?? VEINS[0];
}
