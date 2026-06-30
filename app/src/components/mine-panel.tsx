"use client";

import { getVeinById } from "@/lib/veins";

interface MinePanelProps {
  onMine: () => void;
  hashRate: number;
  clicks: number;
  selectedVeinId: string;
}

export function MinePanel({
  onMine,
  hashRate,
  clicks,
  selectedVeinId,
}: MinePanelProps) {
  const vein = getVeinById(selectedVeinId);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-black p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#0052FF22,transparent_60%)]" />
      <div className="relative flex flex-col items-center gap-6">
        <div className="text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
            Active vein
          </p>
          <h2 className="mt-1 text-2xl font-bold text-zinc-50">{vein.name}</h2>
          <p className="mt-2 max-w-sm text-sm italic text-zinc-500">
            &ldquo;{vein.flavor}&rdquo;
          </p>
        </div>

        <button
          type="button"
          onClick={onMine}
          className="group relative flex h-36 w-36 items-center justify-center rounded-full border-2 border-[#F4B942]/60 bg-[#F4B942]/10 transition active:scale-95 hover:border-[#F4B942] hover:bg-[#F4B942]/20 hover:shadow-[0_0_40px_#F4B94244]"
        >
          <span className="text-4xl transition group-hover:scale-110">⛏</span>
          <span className="absolute -bottom-8 font-mono text-xs text-zinc-500">
            tap to mine
          </span>
        </button>

        <div className="flex gap-6 font-mono text-xs text-zinc-500">
          <span>{hashRate.toFixed(2)} ORE/s idle</span>
          <span>{clicks} taps</span>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-1 flex justify-between text-[10px] uppercase tracking-widest text-zinc-600">
            <span>Mining progress</span>
            <span>Era 0 · Genesis</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full animate-pulse rounded-full bg-gradient-to-r from-[#0052FF] to-[#F4B942]"
              style={{ width: `${Math.min(100, (clicks / 50) * 100)}%` }}
            />
          </div>
          <p className="mt-2 text-center text-[10px] text-zinc-600">
            Halving countdown starts at launch · stake $TREND on Empire for 3x boost
          </p>
        </div>
      </div>
    </div>
  );
}
