"use client";

import type { Guild } from "@/lib/veins";

const GUILDS: { id: Guild; label: string; emoji: string; desc: string }[] = [
  {
    id: "builders",
    label: "Builders",
    emoji: "⛏",
    desc: "Builder Codes, Clanker, mini-apps",
  },
  {
    id: "traders",
    label: "Traders",
    emoji: "📈",
    desc: "Ethos, whales, prediction markets",
  },
  {
    id: "scribes",
    label: "Scribes",
    emoji: "✍",
    desc: "Farcaster, Reali-TEA, content",
  },
];

interface GuildPickerProps {
  selected: Guild | null;
  onSelect: (guild: Guild) => void;
}

export function GuildPicker({ selected, onSelect }: GuildPickerProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
        Choose your guild
      </h2>
      <div className="grid grid-cols-3 gap-2">
        {GUILDS.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => onSelect(g.id)}
            className={`rounded-xl border p-3 text-center transition ${
              selected === g.id
                ? "border-[#F4B942] bg-[#F4B942]/10"
                : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-600"
            }`}
          >
            <span className="text-2xl">{g.emoji}</span>
            <p className="mt-1 text-xs font-semibold text-zinc-200">{g.label}</p>
            <p className="mt-0.5 text-[10px] leading-tight text-zinc-500">
              {g.desc}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
