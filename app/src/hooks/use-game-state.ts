"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Guild } from "@/lib/veins";
import { BASE_MINING_RATE, CLICK_BONUS } from "@/lib/constants";

const STORAGE_KEY = "trends-miner-game";

interface GameState {
  ore: number;
  totalMined: number;
  clicks: number;
  selectedVeinId: string;
  guild: Guild | null;
  lastTick: number;
}

const defaultState: GameState = {
  ore: 0,
  totalMined: 0,
  clicks: 0,
  selectedVeinId: "agent-swarm",
  guild: null,
  lastTick: Date.now(),
};

function loadState(): GameState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultState, lastTick: Date.now() };
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return { ...defaultState, lastTick: Date.now() };
  }
}

function saveState(state: GameState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useGameState() {
  const [state, setState] = useState<GameState>(defaultState);
  const [hashRate, setHashRate] = useState(BASE_MINING_RATE);
  const stateRef = useRef(state);

  useEffect(() => {
    setState(loadState());
  }, []);

  useEffect(() => {
    stateRef.current = state;
    saveState(state);
  }, [state]);

  const applyIdleTick = useCallback(
    (rate: number) => {
      setState((prev) => {
        const now = Date.now();
        const elapsed = (now - prev.lastTick) / 1000;
        if (elapsed < 0.1) return prev;
        const gained = elapsed * rate;
        return {
          ...prev,
          ore: prev.ore + gained,
          totalMined: prev.totalMined + gained,
          lastTick: now,
        };
      });
    },
    [],
  );

  useEffect(() => {
    const interval = setInterval(() => applyIdleTick(hashRate), 250);
    return () => clearInterval(interval);
  }, [hashRate, applyIdleTick]);

  const mineClick = useCallback(() => {
    setState((prev) => ({
      ...prev,
      ore: prev.ore + CLICK_BONUS * (hashRate / BASE_MINING_RATE),
      totalMined: prev.totalMined + CLICK_BONUS * (hashRate / BASE_MINING_RATE),
      clicks: prev.clicks + 1,
      lastTick: Date.now(),
    }));
  }, [hashRate]);

  const selectVein = useCallback((veinId: string) => {
    setState((prev) => ({ ...prev, selectedVeinId: veinId, lastTick: Date.now() }));
  }, []);

  const selectGuild = useCallback((guild: Guild) => {
    setState((prev) => ({ ...prev, guild }));
  }, []);

  return {
    state,
    hashRate,
    setHashRate,
    mineClick,
    selectVein,
    selectGuild,
  };
}
