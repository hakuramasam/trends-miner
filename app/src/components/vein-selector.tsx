"use client";

import { RARITY_COLORS, VEINS, type Guild } from "@/lib/veins";

interface VeinSelectorProps {
  selectedId: string;
  guild: Guild | null;
  onSelect: (id: string) => void;
}

export function VeinSelector({ selectedId, guild, onSelect }: VeinSelectorProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
        Daily trend veins · Jun 28, 2026
      </h2>
      <div className="grid gap-2 sm:grid-cols-2">
        {VEINS.map((vein) => {
          const active = selectedId === vein.id;
          const guildMatch = guild && vein.guild === guild;
          return (
            <button
              key={vein.id}
              type="button"
              onClick={() => onSelect(vein.id)}
              className={`rounded-xl border p-3 text-left transition ${
                active
                  ? "border-[#0052FF] bg-[#0052FF]/10"
                  : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-600"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-zinc-100">
                  {vein.name}
                </span>
                <span
                  className="rounded px-1.5 py-0.5 font-mono text-[10px] font-bold"
                  style={{
                    color: RARITY_COLORS[vein.rarity],
                    backgroundColor: `${RARITY_COLORS[vein.rarity]}22`,
                  }}
                >
                  {vein.tag}
                </span>
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                {vein.type} · {vein.multiplier}x
                {guildMatch && (
                  <span className="ml-1 text-emerald-400">
                    +{(vein.guildBonus * 100).toFixed(0)}% guild
                  </span>
                )}
              </p>
              <p className="mt-2 line-clamp-2 text-xs italic text-zinc-600">
                {vein.flavor}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
