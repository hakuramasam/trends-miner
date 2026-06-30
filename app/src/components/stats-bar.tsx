"use client";

import { useAccount, useReadContract } from "wagmi";
import { erc20Abi } from "@/lib/abi/erc20";
import {
  BASE_MINING_RATE,
  STAKE_BOOST_THRESHOLD,
  TOKEN_HOLDER_BOOST_THRESHOLD,
  TREND_TOKEN,
} from "@/lib/constants";
import { formatTrend } from "@/lib/format";
import { getVeinById, type Guild } from "@/lib/veins";
import { useEffect } from "react";

interface StatsBarProps {
  ore: number;
  hashRate: number;
  guild: Guild | null;
  selectedVeinId: string;
  onHashRateChange: (rate: number) => void;
}

export function StatsBar({
  ore,
  hashRate,
  guild,
  selectedVeinId,
  onHashRateChange,
}: StatsBarProps) {
  const { address, isConnected } = useAccount();
  const vein = getVeinById(selectedVeinId);

  const { data: balance } = useReadContract({
    address: TREND_TOKEN,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) },
  });

  useEffect(() => {
    let rate = BASE_MINING_RATE * vein.multiplier;

    if (guild && vein.guild === guild) {
      rate *= 1 + vein.guildBonus;
    }

    if (balance) {
      if (balance >= TOKEN_HOLDER_BOOST_THRESHOLD) rate *= 1.45;
      else if (balance >= STAKE_BOOST_THRESHOLD) rate *= 1.3;
    }

    onHashRateChange(rate);
  }, [balance, guild, vein, onHashRateChange]);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Stat label="ORE" value={Math.floor(ore).toLocaleString()} accent="#F4B942" />
      <Stat
        label="Hash rate"
        value={`${hashRate.toFixed(2)}/s`}
        accent="#0052FF"
      />
      <Stat
        label="$TREND"
        value={
          isConnected && balance !== undefined
            ? formatTrend(balance)
            : "—"
        }
        accent="#22c55e"
      />
      <Stat label="Vein" value={vein.name} accent={vein.rarity === "viral" ? "#F4B942" : "#a855f7"} small />
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
  small,
}: {
  label: string;
  value: string;
  accent: string;
  small?: boolean;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3">
      <p className="text-[10px] uppercase tracking-widest text-zinc-500">{label}</p>
      <p
        className={`mt-1 font-mono font-semibold ${small ? "text-sm truncate" : "text-lg"}`}
        style={{ color: accent }}
      >
        {value}
      </p>
    </div>
  );
}
