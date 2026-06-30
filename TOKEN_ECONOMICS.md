# $TREND Token Economics

> **Contract:** `0xbf981cfF5040F9652D4721c85C3e05F6d79f9b07` (Base Mainnet)  
> **Platform:** [Clanker V4](https://www.clanker.world/clanker/0xbf981cfF5040F9652D4721c85C3e05F6d79f9b07) · Farcaster-native  
> **Empire:** [Empire Builder staking & treasury](https://www.empirebuilder.world/empire/0xbf981cff5040f9652d4721c85c3e05f6d79f9b07)

---

## Current Onchain State (Jun 28, 2026)

| Metric | Value |
|--------|-------|
| Market cap | ~$16.0K |
| Price | ~$1.569e-7 |
| Holders | 384 |
| Top 10 concentration | 99.63% |
| Liquidity in pool | 70% of supply |
| Vaulted | 30% (fully vested May 25, 2026) |
| Empire treasury | ~$1,851 (11.8B TREND + ETH/USDC/ARB) |
| Distributed via Empire | $0 (rewards pipeline ready) |

### Fee Configuration (Clanker)

| Parameter | Value |
|-----------|-------|
| Fee type | Dynamic (1% base → 3% max) |
| Clanker fee | 0.2% |
| Sniper fee decay | 80% → 5% over 90s |

### Reward Recipients

| Recipient | Share | Role |
|-----------|-------|------|
| @haku85 | 60% | Creator / ops |
| @haku85 | 20% | Admin |
| `0xAFB6...885B` | 20% | Reward recipient |

---

## Token Utility in Game

`$TREND` is the **scarce extraction reward** and **stake-for-power** asset. It is NOT burned in normal gameplay (preserves liquidity).

### Utility Matrix

| Action | TREND Required | Effect |
|--------|----------------|--------|
| **Mine (wallet mode)** | 0 (hold optional) | Earn TREND from emission pool |
| **Stake on Empire** | 1M+ for 3x boost | Leaderboard + staking multiplier |
| **Token holder boost** | 10M+ | 4.5x Empire score |
| **Rig Tier 3+** | 100K–1M | Permanent hash upgrade |
| **Front-Run Vein** (Traders) | 50K fee → treasury | Early vein access |
| **Deploy Node** (Builders) | 10K burn → **deflationary sink** | Create community vein |
| **Governance (Phase 3)** | 1M vote weight | Vein curation, halving params |

### Soft Currency: `$ORE`

| Property | Detail |
|----------|--------|
| Nature | Offchain (DB), non-transferable |
| Earn | Mining, quests, mini-games |
| Spend | Rig upgrades, cosmetics, `$ORE`-only bets |
| Convert | **No direct TREND swap** — prevents farm-and-dump |

---

## Emission Schedule (Game Mining Pool)

**Design principle:** Game emissions come from **Empire treasury allocation + vault release schedule**, not inflation beyond existing Clanker supply.

### Allocation of Vault (30% supply)

```
Vault (30%)
├── 40% → Game mining emissions (halving schedule)
├── 30% → Leaderboard rewards (Empire distribution)
├── 20% → Community grants (builders, scribes bounties)
└── 10% → Liquidity / LP incentives
```

### Halving Timeline

| Era | Block interval | Emission/block | Cumulative % of game pool |
|-----|----------------|----------------|---------------------------|
| 0 – Genesis | 10 min | 100 TREND | 0–15% |
| 1 | 10 min | 50 TREND | 15–35% |
| 2 | 10 min | 25 TREND | 35–60% |
| 3 | 10 min | 12.5 TREND | 60–85% |
| 4 – Final | 10 min | 6.25 TREND | 85–100% |

**Halving trigger:** Each era completes when allocated TREND from that era is claimed onchain.

**Post-depletion:** Mine converts to `$ORE`-only mode; `$TREND` utility shifts to stake, governance, and sponsored veins.

---

## Staking Economics (Empire Builder Integration)

Existing Empire mechanics — game reads, does not replace:

### Boosters (from Empire)

```
Final Score = base_mined × token_booster × stake_booster × rep_booster

token_booster  = 4.5x if balance ≥ 10,000,000 TREND
stake_booster  = 3x if staked ≥ 1,000,000 TREND (flexible lock)
rep_booster    = dynamic (Farcaster Neynar + Ethos onchain)
```

### Staking APY (informational)

Empire does not guarantee APY. Expected player ROI drivers:

1. **Leaderboard rank** → treasury `$TREND` distribution
2. **In-game hash multiplier** → more mining yield
3. **Social status** → Farcaster visibility → organic token demand

**Recommended stake tiers for players:**

| Tier | Stake | Target player |
|------|-------|---------------|
| Casual | 0 | Guest / try-before-stake |
| Miner | 100K–1M | Active daily |
| Serious | 1M–10M | 3x stake boost |
| Whale | 10M+ | 4.5x token + leaderboard top 50 |

---

## Sinks & Faucets

### Faucets (TREND enters circulation)

| Source | Rate limit |
|--------|------------|
| Idle + active mining | Halving schedule |
| Leaderboard payouts | Weekly from treasury |
| Quest rewards | 1K–10K TREND/day cap per user |
| Referral milestones | One-time 50K TREND |

### Sinks (TREND leaves circulation or locks)

| Sink | Amount | Destination |
|------|--------|-------------|
| Deploy Node burn | 10K | Burn address |
| Front-Run fee | 50K | Empire treasury |
| Rig Tier 4+ lock | 1M locked 30d | Staking contract |
| LP provision (optional) | Variable | Uniswap V4 pool |

**Target net flow:** Slight sink bias after Era 2 to support price as emissions decrease.

---

## Flywheel

```
Real social trends (data feeds)
        ↓
Daily veins → engagement → Farcaster casts
        ↓
New players → buy TREND on Clanker / stake on Empire
        ↓
Higher stake → higher hash → more mining competition
        ↓
Treasury fills (fees + Front-Run) → leaderboard rewards
        ↓
Winners cast wins → viral loop → repeat
```

---

## Clankernomics Alignment

From Clanker page — liquidity distribution across 5 MCAP positions ($27K → $1.5B+):

- Game **does not extract LP**
- Trading happens on Clanker/Uniswap — game drives **holder count** and **stake lock-up**
- Dynamic fees (1–3%) benefit reward recipients → fund ops + future game dev

**Holder concentration risk (99.63% top 10):**

Mitigation via game design:

1. Leaderboard rewards favor **activity score**, not just balance
2. Scribes guild rewards **content**, diluting pure whale dominance
3. Small-holder quests (100K TREND milestones)

---

## Treasury Management (Empire)

Current treasury: **~$1,851** (11.8B TREND dominant)

### Proposed distribution (once game live)

| Bucket | % | Use |
|--------|---|-----|
| Weekly leaderboard | 50% | Top 100 by composite score |
| Guild wars winner | 20% | Monthly guild competition |
| Creator bounties | 15% | Scribes + builder content |
| Dev / infra | 10% | Servers, APIs, audits |
| Reserve | 5% | Emergency / halving event bonuses |

**Distribution cadence:** Weekly, triggered by `@haku85` or automated via Empire when API available.

---

## Anti-Sybil & Fairness

| Threat | Mitigation |
|--------|------------|
| Multi-wallet farming | SIWE + rate limits; `$ORE` quests capped per IP/device |
| Bot mining | Proof-of-attention mini-games for >50% emission tier |
| Whale dominance | Activity-weighted leaderboard (50% activity / 50% stake) |
| Wash trading TREND | Front-run fees + stake lock for boosts |

---

## Metrics Dashboard (build in-game)

- Total TREND mined (all time)
- Current era / next halving ETA
- Network hash rate (sum of all players)
- Treasury balance (live from Empire)
- Top veins by extraction volume
- Guild war standings

---

## Phase 2 Token Extensions (optional, not required for launch)

| Feature | Description |
|---------|-------------|
| **Trend NFTs** | Soulbound badges for era completions |
| **Vein Keys** | ERC-1155 access to sponsored premium veins |
| **x402 API** | Pay USDC to pull raw trend feed (Builder Code attributed) |

---

## Summary

`$TREND` economics succeed if:

1. **Scarcity** — halving + burns create urgency ("before running out")
2. **Utility** — stake boosts mining + Empire leaderboard
3. **Social proof** — Farcaster/Ethos verification rewards real contributors
4. **No inflation** — emissions from existing vault/treasury, not new mint

The game is the **retention engine**; Clanker is the **discovery engine**; Empire Builder is the **staking & treasury layer**.
