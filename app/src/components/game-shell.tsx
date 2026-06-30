"use client";

import { CLANKER_URL, EMPIRE_URL } from "@/lib/constants";
import { WalletButton } from "@/components/wallet-button";
import { StatsBar } from "@/components/stats-bar";
import { VeinSelector } from "@/components/vein-selector";
import { GuildPicker } from "@/components/guild-picker";
import { MinePanel } from "@/components/mine-panel";
import { useGameState } from "@/hooks/use-game-state";

export function GameShell() {
  const {
    state,
    hashRate,
    setHashRate,
    mineClick,
    selectVein,
    selectGuild,
  } = useGameState();

  return (
    <div className="mx-auto min-h-screen max-w-4xl px-4 py-6">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#0052FF]">
            Base Mainnet · $TREND
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl">
            Trends Mining Simulator
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Mine ORE from live trend veins · SIWE + WalletConnect
          </p>
        </div>
        <WalletButton />
      </header>

      <div className="mb-6">
        <StatsBar
          ore={state.ore}
          hashRate={hashRate}
          guild={state.guild}
          selectedVeinId={state.selectedVeinId}
          onHashRateChange={setHashRate}
        />
      </div>

      {!state.guild && (
        <div className="mb-6">
          <GuildPicker selected={state.guild} onSelect={selectGuild} />
        </div>
      )}

      <div className="mb-6">
        <MinePanel
          onMine={mineClick}
          hashRate={hashRate}
          clicks={state.clicks}
          selectedVeinId={state.selectedVeinId}
        />
      </div>

      <div className="mb-8">
        <VeinSelector
          selectedId={state.selectedVeinId}
          guild={state.guild}
          onSelect={selectVein}
        />
      </div>

      <footer className="flex flex-wrap gap-4 border-t border-zinc-800 pt-6 text-xs text-zinc-500">
        <a
          href={CLANKER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#0052FF]"
        >
          Trade on Clanker →
        </a>
        <a
          href={EMPIRE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#F4B942]"
        >
          Stake on Empire Builder →
        </a>
        <span className="ml-auto font-mono text-zinc-600">
          0xbf98…9b07
        </span>
      </footer>
    </div>
  );
}
