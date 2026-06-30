# Trends Mining Simulator — Game Concept

> **Token:** `$TREND` · Base Mainnet · `0xbf981cfF5040F9652D4721c85C3e05F6d79f9b07`  
> **Creator:** [@haku85](https://warpcast.com/haku85) · Deployed via [Clanker](https://www.clanker.world/clanker/0xbf981cfF5040F9652D4721c85C3e05F6d79f9b07)  
> **Empire:** [Empire Builder](https://www.empirebuilder.world/empire/0xbf981cff5040f9652d4721c85c3e05f6d79f9b07)  
> **Date:** June 28, 2026

---

## One-Liner

A browser-native **trend-mining idle game** where players extract `$TREND` from live social signal feeds, stake to boost hash rate, and compete in three guilds — **Builders**, **Traders**, and **Scribes** — before the global halving exhausts the mine.

---

## Core Fantasy

The internet generates attention. Attention is ore. You are a **Trend Miner** operating a rig that taps into verified feeds from Farcaster, X, TikTok, Reddit, and onchain Base activity. The earlier you mine a rising trend, the more `$TREND` you extract — but only while the vein is hot.

Your existing token description already nails the loop:

> *"Mine more with staking and engagement with community before halving & running out."*

This document expands that into a full game.

---

## Authentication & Wallet Layer

| Method | Role |
|--------|------|
| **SIWE** (Sign-In With Ethereum) | Primary session auth — proves wallet ownership, issues JWT/session |
| **WalletConnect v2** | Mobile + multi-wallet (Coinbase Wallet, Rainbow, MetaMask, Base App) |
| **Base Mainnet (chainId 8453)** | `$TREND` balances, staking, onchain claims |
| **Farcaster (optional link)** | Reputation boost via Neynar score — already wired in Empire Builder |

### Login Flow

```
Connect Wallet (WalletConnect / injected)
    → Switch to Base if needed
    → SIWE message sign ("Sign in to Trends Mining Simulator")
    → Backend verifies signature + nonce
    → Session created; read TREND balance + Empire stake + Farcaster link
    → Enter mine
```

**Guest mode:** Play with offchain `$ORE` (soft currency) for 24h; wallet required to withdraw or stake.

---

## The Three Guilds (Verified Source Roles)

Every player picks a guild at onboarding. Guild choice affects boost sources and play style. All guilds mine the same `$TREND`; they differ in **multipliers** and **side activities**.

### ⛏ Builders Guild
**Real-world mirror:** Base builders, Farcaster mini-app devs, Clanker deployers, x402 integrators

| Verified Source | In-Game Effect |
|-----------------|----------------|
| Base **Builder Code** (ERC-8021 NFT) | +15% hash rate on "Infra" trend veins |
| Clanker-deployed token holder | Unlock **Launchpad Vein** daily bonus |
| GitHub / shipped mini-app (manual + Neynar verify) | **Blueprint** crafting — build permanent rig modules |
| Empire Builder staking | Standard stake multiplier (3x at 1M+ TREND) |

**Unique ability:** **Deploy Node** — spend `$ORE` to create a community trend node others can mine (you earn 5% royalty on their extraction).

### 📈 Traders Guild
**Real-world mirror:** Polymarket/Kalshi whales, onchain degens, prediction market analysts

| Verified Source | In-Game Effect |
|-----------------|----------------|
| Ethos score (onchain) | Dynamic multiplier on **Velocity** veins |
| Wallet with >10 Base txs / week | **Whale Radar** — see trend momentum 30min early |
| TREND holder (10M+) | Empire token booster (4.5x–9x on leaderboard) |
| Prediction market activity (future API) | **Trend Futures** — bet `$ORE` on peak timing |

**Unique ability:** **Front-Run Vein** — pay `$TREND` fee to mine a locked high-tier vein 1 hour before public unlock.

### ✍️ Scribes Guild
**Real-world mirror:** Farcaster writers, TikTok/X creators, content amplifiers

| Verified Source | In-Game Effect |
|-----------------|----------------|
| Farcaster account + Neynar score | Dynamic rep boost (already in Empire) |
| Linked social (X, TikTok handle verify) | **Amplify** — +hash rate when your mined trend matches your posted content |
| Cast/recast about `$TREND` (Farcaster API) | Daily **Signal Boost** quest |
| High engagement casts (recast/like threshold) | Unlock **Viral Vein** for 2 hours |

**Unique ability:** **Write the Trend** — submit narrative flavor text for today's vein; community votes; winner gets 1% of that vein's pool.

---

## Core Gameplay Loop

```
┌─────────────────────────────────────────────────────────────┐
│  1. DAILY TREND VEINS (from live social + onchain feeds)    │
│     ↓                                                       │
│  2. EQUIP RIG (GPU tiers, guild modules, stake boosters)    │
│     ↓                                                       │
│  3. MINE (idle + active mini-games) → earn $ORE + $TREND    │
│     ↓                                                       │
│  4. STAKE $TREND (Empire Builder) → multiply + leaderboard  │
│     ↓                                                       │
│  5. ENGAGE (casts, referrals, guild quests) → rep boost     │
│     ↓                                                       │
│  6. HALVING CHECK → emissions cut; scarce veins remain      │
└─────────────────────────────────────────────────────────────┘
```

### Trend Veins (Daily Content)

Each day, 5–8 **veins** spawn from real trending data:

| Vein Type | Source Feed | Example (Jun 28, 2026) |
|-----------|-------------|--------------------------|
| **Infra** | Base blog, builder announcements | Builder Codes / x402 |
| **Agent** | AI/crypto news, GitHub | AI Agent Swarms (Mevu) |
| **Social** | Farcaster trending, X | Neynar acquisition aftermath |
| **Culture** | TikTok trend report | "Reali-TEA" authenticity wave |
| **Markets** | Polymarket/Kalshi volume | Prediction market ad wars |
| **Launch** | Clanker new deploys | Mini-app tokens ($MINI, etc.) |

**Vein rarity:** Common → Rare → Epic → **Viral** (lasts 2–6 hours based on real velocity)

**Mining math (simplified):**
```
hash_rate = base_rig × stake_multiplier × guild_boost × rep_boost × vein_rarity
TREND_per_hour = (hash_rate / network_hash) × block_emission
```

### Active Mini-Games (optional, +20% yield)

1. **Signal Match** — match trending keywords to platform (TikTok vs Farcaster vs X)
2. **Velocity Tap** — rhythm tap when trend momentum spikes (from feed API)
3. **Narrative Mine** — Scribes-only word association on today's topic

### Idle Layer

- Rig runs 24/7 while tab open (Service Worker keeps soft tick)
- **Offline cap:** 8 hours of accrued `$ORE` (wallet users: 12h)
- Push notification (PWA): "Viral vein spawned: AI Agent Swarms"

---

## Progression Systems

### Rig Tiers (paid in `$ORE`, late tiers need `$TREND`)

| Tier | Name | Unlock |
|------|------|--------|
| 1 | Chrome Tab Miner | Free |
| 2 | VPS Rig | 1,000 ORE |
| 3 | GPU Farm | 10,000 ORE + 100K TREND |
| 4 | Data Center | 100,000 ORE + 1M TREND staked |
| 5 | **Trend Oracle** | Top 100 Empire leaderboard |

### Reputation (cross-platform)

Pull from Empire Builder's existing boosters:

- **Token Booster:** 10M+ TREND → 4.5x
- **Staking Booster:** 1M+ staked → 3x
- **Farcaster / Neynar:** Dynamic
- **Ethos (onchain):** Dynamic

Display as **Miner Rep Score** in UI (0–1000).

### Halving & Scarcity

Aligned with Bitcoin-style narrative in token description:

| Era | Emission / 10min block | Trigger |
|-----|------------------------|---------|
| Genesis | 100 TREND | Launch |
| Era 1 | 50 TREND | 25% vault released |
| Era 2 | 25 TREND | 50% vault released |
| Era 3 | 12.5 TREND | 75% vault released |
| **Final Era** | 6.25 TREND | Vault exhausted → **mine depletes** |

**Vault status (Clanker):** 30% vaulted, fully vested May 25, 2026 — vault tokens feed **Treasury Veins** and leaderboard rewards via Empire ($1,851 treasury as of today).

When global `$TREND` mined from game pool hits era cap → **Halving Event** (live countdown UI, community cast storm, 2x engagement rewards for 48h).

---

## Social & Community Layer

### Farcaster-Native Distribution

- Ship as **Farcaster Mini App** (Frame v2 / mini-app manifest)
- One-tap play from [@haku85](https://warpcast.com/haku85) casts
- Daily auto-cast: top miners + today's vein summary (opt-in)

### Leaderboards (Empire Builder integration)

Use existing Empire leaderboard infra:

- **TREND holders** — token-weighted score
- **TREND stakers** — lock-up bonus
- **Farcaster rep** — social proof

In-game overlay shows rank + rewards pending from treasury.

### Referral Mine

- SIWE-linked referral codes
- Referee mines → referrer gets 3% of their `$ORE` (not `$TREND` — anti-Sybil)
- Verified Farcaster referrer → 5%

---

## Monetization (Non-Extractive)

Game does **not** sell `$TREND`. Revenue / sustainability:

1. **Cosmetic rig skins** — `$ORE` only
2. **Premium vein preview** — 24h early access for 50K `$ORE`
3. **Builder Code partnership** — projects sponsor a daily vein (paid in USDC → treasury)
4. **Clanker fee share** — existing 1% dynamic fee flows to creator/reward recipient

---

## Art Direction

- **Aesthetic:** Retro terminal + neon data-viz (think 1980s mining sim meets Bloomberg terminal)
- **Palette:** Base blue `#0052FF`, TREND gold `#F4B942`, vein colors by type
- **UI:** Mobile-first PWA; desktop gets multi-panel dashboard
- **Sound:** Soft ASMR clicks on mine ticks; halving alarm siren

---

## Success Metrics (90-day)

| Metric | Target |
|--------|--------|
| WAU (wallet-connected) | 500 |
| Daily veins mined | 80% of active users |
| TREND staked via Empire | +20% from baseline |
| Farcaster casts / week | 200+ with `$TREND` |
| Avg session | 12 min |

---

## Competitive Position

| Project | Difference |
|---------|------------|
| Generic tap-to-earn | We use **real trend data**, not random clicks |
| Empire Builder alone | We add **gameplay + daily content** on top of stake/leaderboard |
| Farcaster mini-apps | We combine **idle mine + guild roles + live feeds** |
| Clanker tokens | `$TREND` already live with 384 holders — game drives **utility + retention** |

---

## Legal / Compliance Notes

- Game rewards are **existing `$TREND` emissions + treasury** — no new token sale
- Prediction-market mini-games use **`$ORE` only** (no real-money gambling in v1)
- SIWE = authentication, not custody
- Age gate 13+ (align with platform norms); no real-name required

---

## Next Document

→ [TOKEN_ECONOMICS.md](./TOKEN_ECONOMICS.md) · [ROADMAP.md](./ROADMAP.md) · [TRENDS_FEED_2026-06-28.md](./TRENDS_FEED_2026-06-28.md)
