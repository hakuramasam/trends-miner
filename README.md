# Trends Mining Simulator

Web-based browser game on **Base** — mine `$TREND` from live social trends, stake via [Empire Builder](https://www.empirebuilder.world/empire/0xbf981cff5040f9652d4721c85c3e05f6d79f9b07), login with **SIWE + WalletConnect**.

## Token

| | |
|---|---|
| **Symbol** | `$TREND` |
| **Chain** | Base Mainnet |
| **Contract** | `0xbf981cfF5040F9652D4721c85C3e05F6d79f9b07` |
| **Clanker** | [clanker.world/clanker/0xbf981...](https://www.clanker.world/clanker/0xbf981cfF5040F9652D4721c85C3e05F6d79f9b07) |
| **Creator** | [@haku85](https://warpcast.com/haku85) |

## Documentation

| Doc | Description |
|-----|-------------|
| [GAME_CONCEPT.md](./GAME_CONCEPT.md) | Full game design — guilds, loops, halving, mini-app |
| [TOKEN_ECONOMICS.md](./TOKEN_ECONOMICS.md) | `$TREND` utility, emissions, Empire integration |
| [ROADMAP.md](./ROADMAP.md) | 12-week build plan + tech stack |
| [TRENDS_FEED_2026-06-28.md](./TRENDS_FEED_2026-06-28.md) | Today's trending veins mapped to gameplay |

## Quick Concept

```
Social trends (Farcaster, X, TikTok, Base) → Daily "veins"
        ↓
Players mine $TREND + $ORE (idle + mini-games)
        ↓
Stake on Empire → 3x–4.5x boost → leaderboard → treasury rewards
        ↓
Halving eras → scarcity → "mine before it runs out"
```

## Three Guilds

- **Builders** — Base Builder Codes, Clanker deploys, mini-apps
- **Traders** — Ethos rep, whale radar, trend futures
- **Scribes** — Farcaster/Neynar, content amplification

## Auth Stack

- Sign-In With Ethereum (SIWE)
- WalletConnect v2
- Base Mainnet (chainId 8453)
- Optional Farcaster link (Neynar)

## Status

🎮 **Phase 0 prototype live** — see [`app/`](./app/)

```bash
cd app
cp .env.local.example .env.local   # add WalletConnect project ID
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Phase 0 features

- WalletConnect + injected + Coinbase Wallet on Base
- SIWE sign-in (session cookie)
- Live `$TREND` balance read
- Idle + tap mining (`$ORE`, localStorage)
- 6 daily trend veins from Jun 28 feed
- 3 guilds (Builders / Traders / Scribes)
- PWA manifest
