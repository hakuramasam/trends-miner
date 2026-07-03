# Trends Miner Smart Contracts

Solidity contracts for the Trends Miner game on Base network.

## Contracts

### Core Contracts

| Contract | Description | Status |
|----------|-------------|--------|
| TrendToken.sol | ERC-20 token for $TREND with minting capabilities | Complete |
| MiningPool.sol | Mining pool with staking, guilds, and veins | Complete |
| Governor.sol | OpenZeppelin Governor for DAO governance | Complete |
| Timelock.sol | OpenZeppelin Timelock for delayed execution | Complete |

## Contract Architecture

Trends Miner Contracts
+-- TrendToken.sol (ERC-20)
|   +-- Minting capabilities for mining rewards
|   +-- Ownable (initially deployer, later timelock)
|   +-- Permit support for gasless approvals
+-- MiningPool.sol
|   +-- Idle mining
|   +-- Tap mining (with bonus)
|   +-- Staking (3 guilds: Novice, Apprentice, Master)
|   +-- 6 veins (Crypto, AI, DeFi, Gaming, Memes, Social)
|   +-- Claim system
|   +-- Governance activation trigger
|   +-- Ownership transfer to Timelock
+-- Governor.sol
|   +-- OpenZeppelin Governor
|   +-- Voting with $TREND tokens
|   +-- 1 block voting delay
|   +-- 5760 blocks (24h) voting period
|   +-- 4% quorum requirement
|   +-- Proposes to Timelock
+-- Timelock.sol
    +-- 1 day minimum delay
    +-- 7 days maximum delay
    +-- Self-executor
    +-- Controls MiningPool after activation

## Governance Activation

The governance system activates when $TREND market cap reaches 100K (7-day average).

### Activation Process

1. Before Activation:
   - MiningPool owner is the deployer
   - Deployer can update parameters directly
   - No governance proposals accepted

2. Activation:
   - Call MiningPool.activateGovernance(governorAddress, timelockAddress)
   - Ownership transfers from deployer to Timelock
   - Governor can now propose changes

3. After Activation:
   - Deployer loses direct control
   - All changes require governance proposal
   - Timelock enforces delay (1-7 days)
   - Only Timelock can execute proposals

## Tokenomics

### Initial Supply
- 1,000,000 $TREND initially minted to deployer
- Additional tokens can be minted by owner (before governance) or through governance proposals (after activation)

### Multipliers

| Stake Amount | Multiplier |
|--------------|------------|
| < 1M $TREND | 1x |
| >= 1M $TREND | 3x |
| >= 10M $TREND | 4.5x |

### Guilds

| Guild | Requirement | Multiplier |
|-------|-------------|------------|
| Novice | 0 $TREND | 1x |
| Apprentice | 1,000 $TREND | 1.25x |
| Master | 10,000 $TREND | 1.5x |

## Deployment

### Prerequisites
- Node.js 18+
- Hardhat
- Alchemy API key for Base network
- Etherscan API key for verification

### Quick Start

1. Install dependencies:
   cd contracts
   npm install

2. Copy environment file:
   cp .env.example .env

3. Configure .env with your keys

4. Compile contracts:
   npm run compile

5. Deploy to Base Sepolia (testnet):
   npm run deploy:base-sepolia

6. Deploy to Base Mainnet:
   npm run deploy:base

7. Verify contracts on Etherscan:
   npm run verify:base-sepolia
   npm run verify:base

## Testing

Run the test suite:
   npm test

## Security Considerations

1. Before Governance Activation:
   - Deployer has full control
   - Can update any parameter
   - Can recover unallocated rewards

2. After Governance Activation:
   - Deployer loses direct control
   - All changes require governance proposal
   - Timelock enforces delay on all changes
   - No single point of failure

## License

MIT