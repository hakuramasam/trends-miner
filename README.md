# Trends Miner

A web-based browser game on Base network for mining $TREND token with dynamic trend feeds and social integration.

## Overview

Trends Miner is a gamified mining simulator where users can:
- Mine $TREND tokens through idle and active tapping
- Stake tokens to unlock multipliers (3x for 1M+, 4.5x for 10M+)
- Claim rewards from the treasury
- Connect via WalletConnect or Farcaster/Neynar
- View trending content from Farcaster, Reddit, Twitter, and onchain sources

## Governance

The project features a three-phase governance structure:

| Phase | Mechanism | Trigger |
|-------|-----------|---------|
| 0 | None (noOp) | Day 0 |
| 1 | Signaling (Snapshot, staked-$TREND-weighted) | Immediately post-launch |
| 2 | Binding (OpenZeppelin Governor + Timelock, treasury control) | Market cap >= $100K (7-day average) |

## Features

### Phase 0 (Complete)
- Next.js 16 frontend with TypeScript
- WalletConnect integration
- SIWE (Sign-In with Ethereum)
- Idle/tap mining mechanics
- 6 static mining veins
- 3 guilds with progression
- PWA (Progressive Web App) support

### Phase 1 (Complete)
- Empire Builder API integration
- Stake multiplier logic
- Claims system with treasury wallet
- Farcaster/Neynar login
- Rate limiting
- Caching
- Dynamic trend feed pipeline
- Docker containerization

### Phase 2 (Planned)
- TrendToken.sol (ERC-20)
- Governor.sol + Timelock.sol
- Real wallet/contract integration
- Testnet deployment (Base Sepolia)
- Audit
- Mainnet launch

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/hakuramasam/trends-miner.git
cd trends-miner
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env
```

4. Configure your environment variables in .env

5. Run the development server:
```bash
npm run dev
```

6. Open http://localhost:3000 in your browser

## Environment Variables

See .env.example for all required configuration options.

### Required
- NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID - Your WalletConnect project ID
- TREASURY_PRIVATE_KEY - Treasury wallet private key (server-side only)
- NEYNAR_API_KEY - Neynar API key for Farcaster integration

### Optional
- TWITTER_API_KEY - Twitter API key for Twitter trends
- NEXT_PUBLIC_BASE_CHAIN_ID - Base chain ID (default: 8453)
- ADMIN_SECRET - Admin secret for cache refresh endpoint

## Docker Deployment

### Build and Run
```bash
docker-compose up --build
```

### With Docker Compose
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f
```

## API Endpoints

### Claims
- GET /api/claims?address=<address> - Get user claim status
- POST /api/claims - Process a claim

### Empire Builder
- Uses public endpoints at https://www.empirebuilder.world/api

### Neynar/Farcaster
- GET /api/neynar?address=<address> - Get Farcaster user by address
- GET /api/neynar?fid=<fid> - Get Farcaster user by FID
- GET /api/neynar?trending=true - Get trending casts
- POST /api/neynar/verify - Verify Farcaster signature

### Trends
- GET /api/trends - Get all trends
- GET /api/trends?source=<source> - Get trends from specific source
- GET /api/trends?limit=<limit> - Limit number of trends
- GET /api/trends?id=<id> - Get specific trend

## Smart Contracts

### MiningPool.sol
- Manages mining rewards distribution
- Ownership transfers to Governor timelock at $100K market cap trigger

### TrendToken.sol (Planned)
- ERC-20 token contract for $TREND
- Deployed via Doppler metadata script

### Governor.sol (Planned)
- OpenZeppelin Governor contract
- Activates at $100K market cap trigger
- Controls treasury and mining parameters

### Timelock.sol (Planned)
- OpenZeppelin Timelock contract
- Delays governance actions for security

## Architecture

Trends Miner
+-- app/ (Next.js)
|   +-- src/
|   |   +-- app/ (Pages & API routes)
|   |   +-- components/ (React components)
|   |   +-- lib/ (Utilities & integrations)
|   +-- Dockerfile
|   +-- docker-compose.yml
+-- contracts/ (Solidity)
|   +-- MiningPool.sol
|   +-- TrendToken.sol
|   +-- Governor.sol
|   +-- Timelock.sol
+-- README.md

## Contributing

1. Fork the repository
2. Create a feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m Add amazing feature)
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request

## License

MIT

## Contact

- Organization: Spat AI
- User: HakuramaSam
- Token: $TREND at 0xbf981cfF5040F9652D4721c85C3e05F6d79f9b07 on Base Mainnet