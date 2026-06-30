# Trends Mining Simulator — Development Roadmap

> **Stack target:** Next.js PWA · wagmi/viem · SIWE · WalletConnect · Base · Empire Builder API · Neynar  
> **Repo:** `/root/trends-miner`

---

## Phase 0 — Foundation (Week 1–2)

### Goals
Ship playable prototype with wallet login and idle mining.

| Task | Priority | Details |
|------|----------|---------|
| Project scaffold | P0 | Next.js 15, TypeScript, Tailwind, PWA manifest |
| Wallet connect | P0 | wagmi + WalletConnect + Coinbase Wallet + Base chain |
| SIWE auth | P0 | `siwe` package, nonce store (Redis/Upstash), JWT session |
| `$TREND` read | P0 | ERC-20 balance on Base `0xbf981...9b07` |
| Core mine UI | P0 | Click/idle loop, `$ORE` accumulation, rig tier 1 |
| Deploy | P0 | Vercel or Cloudflare Pages |

**Deliverable:** `play.trendsminer.xyz` — connect wallet, mine ORE, see TREND balance.

---

## Phase 1 — Token & Empire Integration (Week 3–4)

### Goals
Connect staking multipliers and leaderboards to live Empire Builder data.

| Task | Priority | Details |
|------|----------|---------|
| Empire API integration | P0 | Read stake status, leaderboard rank, treasury |
| Stake multiplier logic | P0 | 3x @ 1M staked, 4.5x @ 10M held |
| TREND mining claims | P0 | Merkle or direct transfer from treasury wallet (manual v1) |
| Clanker link embed | P1 | Buy TREND CTA in UI |
| Farcaster login (optional) | P1 | Neynar SIWN → link FC account to wallet |

**Deliverable:** Stakers see boosted hash rate; leaderboard tab live.

---

## Phase 2 — Trend Feeds & Daily Veins (Week 5–7)

### Goals
Replace static content with real trending data; launch three guilds.

| Task | Priority | Details |
|------|----------|---------|
| Trend ingestion pipeline | P0 | Cron job: fetch + normalize feeds → `veins` table |
| Feed sources (v1) | P0 | See [TRENDS_FEED](./TRENDS_FEED_2026-06-28.md) architecture |
| Vein rotation engine | P0 | 5–8 veins/day, rarity from velocity score |
| Guild selection | P0 | Builder / Trader / Scribe onboarding |
| Guild boost logic | P1 | Builder Code, Ethos, Neynar verification |
| Mini-game: Signal Match | P1 | +20% yield bonus |
| Halving countdown UI | P1 | Era tracker tied to emission DB |

### Feed Sources (priority order)

1. **Farcaster** — Neynar `fetchTrendingFeeds` / popular casts
2. **Reddit** — r/CryptoCurrency, r/Base, r/Farcaster hot posts
3. **X/Twitter** — search API or StableSocial (when funded)
4. **Onchain** — Base new Clanker deploys, large swaps
5. **News** — Serper/Exa for "Base crypto" headlines

**Deliverable:** Daily veins update automatically; guilds affect gameplay.

---

## Phase 3 — Farcaster Mini App (Week 8–9)

### Goals
Distribution inside Farcaster/Base App ecosystem.

| Task | Priority | Details |
|------|----------|---------|
| Mini-app manifest | P0 | `farcaster.json`, embed meta |
| Frame v2 actions | P1 | "Mine now" / "Check vein" from cast |
| Auto-cast hooks | P2 | Halving alerts, personal best |
| `@haku85` launch cast | P0 | Coordinated with Clanker community |

**Deliverable:** Playable in Warpcast / Base App without leaving feed.

---

## Phase 4 — Social Verification & Reputation (Week 10–11)

### Goals
Wire verified builders, traders, and scribes to real accounts.

| Task | Priority | Details |
|------|----------|---------|
| Neynar score pull | P0 | Dynamic rep booster |
| Ethos score pull | P0 | Onchain reputation API |
| Builder Code verify | P1 | ERC-8021 ownership check on Base |
| X/TikTok handle link | P2 | OAuth or manual verify + post challenge |
| Scribe "Amplify" quest | P1 | Detect casts mentioning `$TREND` |

**Deliverable:** Verified badges in profile; real multipliers applied.

---

## Phase 5 — Competitive & Live Ops (Week 12+)

### Goals
Retention loops, guild wars, treasury distribution automation.

| Task | Priority | Details |
|------|----------|---------|
| Weekly leaderboard payout | P0 | Script: Empire treasury → top 100 |
| Guild Wars (monthly) | P1 | Aggregate guild extraction → treasury split |
| Referral system | P1 | SIWE-linked codes |
| Push notifications | P2 | PWA: viral vein spawned |
| Trend Futures (ORE-only) | P2 | Bet on vein peak timing |
| x402 trend API | P3 | Builders sell raw feed; Builder Code attribution |

---

## Technical Architecture

```
┌──────────────┐     SIWE      ┌──────────────┐
│   Browser    │◄────────────►│  Next.js API │
│   PWA Game   │   WalletConnect│  (Auth)      │
└──────┬───────┘               └──────┬───────┘
       │                              │
       │ wagmi/viem                   │ Prisma + Postgres
       ▼                              ▼
┌──────────────┐               ┌──────────────┐
│ Base Mainnet │               │  Game State  │
│ $TREND ERC20 │               │  veins, ORE  │
│ Empire stake │               │  emissions   │
└──────────────┘               └──────┬───────┘
                                      │
       ┌──────────────────────────────┼──────────────────┐
       ▼                              ▼                  ▼
┌──────────────┐               ┌──────────────┐  ┌──────────────┐
│ Neynar API   │               │ Trend Cron   │  │ Empire API   │
│ Farcaster    │               │ (feeds)      │  │ Treasury     │
└──────────────┘               └──────────────┘  └──────────────┘
```

### Key Dependencies

| Package | Purpose |
|---------|---------|
| `wagmi` + `viem` | Base chain interactions |
| `@walletconnect/web3wallet` | Mobile wallets |
| `siwe` | Sign-In With Ethereum |
| `@coinbase/onchainkit` | Base UI components |
| `@neynar/nodejs-sdk` | Farcaster data |
| `@prisma/client` | Game state persistence |

### Env Vars

```bash
NEXT_PUBLIC_WC_PROJECT_ID=
NEXT_PUBLIC_TREND_TOKEN=0xbf981cfF5040F9652D4721c85C3e05F6d79f9b07
NEXT_PUBLIC_BASE_RPC=
SIWE_DOMAIN=play.trendsminer.xyz
NEYNAR_API_KEY=
DATABASE_URL=
EMPIRE_API_KEY=          # if available
ETHOS_API_KEY=
```

---

## Milestones & KPIs

| Milestone | Date (target) | KPI |
|-----------|---------------|-----|
| M0: Prototype | +2 weeks | 10 test wallets |
| M1: Empire live | +4 weeks | 50 stakers using boost |
| M2: Daily veins | +7 weeks | 200 DAU |
| M3: Mini app | +9 weeks | 500 FC opens/week |
| M4: First halving event | +12 weeks | 1000 casts, treasury −20% |

---

## Team & Roles (suggested)

| Role | Responsibility |
|------|----------------|
| **@haku85** | Product, token ops, Farcaster distribution |
| **Frontend dev** | PWA, mine UI, mini-app |
| **Backend dev** | SIWE, feeds, emissions |
| **Content (Scribes guild)** | Daily vein flavor text, cast copy |
| **Community** | Guild leads, weekly AMA casts |

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Low TREND liquidity | Focus on stake + gameplay before heavy TREND claims |
| Feed API costs | Start with free tiers (Neynar, Reddit JSON); add StableSocial when funded |
| Whale dominance | Activity-weighted scoring |
| Farcaster API changes post-Neynar | Abstract feed layer; multi-platform from day 1 |
| Smart contract audit (if custom claims) | Manual treasury distribution v1; contract v2 later |

---

## Immediate Next Steps

1. `pnpm create next-app trends-miner-app` inside this repo
2. Implement WalletConnect + SIWE + TREND balance read
3. Build idle mine loop with localStorage `$ORE`
4. Wire first static vein from [TRENDS_FEED_2026-06-28.md](./TRENDS_FEED_2026-06-28.md)
5. Deploy preview → share cast on Farcaster
