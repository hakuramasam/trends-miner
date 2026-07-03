// Deploy script for Trends Miner contracts
// Usage: npx hardhat run scripts/deploy.js --network base-sepolia

const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  
  console.log("Deploying contracts with account:", deployerAddress);
  console.log("Account balance:", (await ethers.provider.getBalance(deployerAddress)).toString());

  // Deploy TrendToken
  console.log("
=== Deploying TrendToken ===");
  const initialSupply = ethers.parseEther("1000000");
  const TrendToken = await ethers.getContractFactory("TrendToken");
  const trendToken = await TrendToken.deploy("TrendToken", "$TREND", initialSupply);
  await trendToken.waitForDeployment();
  const trendTokenAddress = await trendToken.getAddress();
  console.log("TrendToken deployed to:", trendTokenAddress);

  // Deploy Timelock
  console.log("
=== Deploying Timelock ===");
  const minDelay = 1 * 24 * 60 * 60;
  const maxDelay = 7 * 24 * 60 * 60;
  const Timelock = await ethers.getContractFactory("TrendsMinerTimelock");
  const timelock = await Timelock.deploy(deployerAddress, minDelay, maxDelay);
  await timelock.waitForDeployment();
  const timelockAddress = await timelock.getAddress();
  console.log("Timelock deployed to:", timelockAddress);

  // Deploy Governor
  console.log("
=== Deploying Governor ===");
  const Governor = await ethers.getContractFactory("TrendsMinerGovernor");
  const governor = await Governor.deploy(trendTokenAddress, timelockAddress);
  await governor.waitForDeployment();
  const governorAddress = await governor.getAddress();
  console.log("Governor deployed to:", governorAddress);

  // Deploy MiningPool
  console.log("
=== Deploying MiningPool ===");
  const miningRate = 100;
  const tapMultiplier = 150;
  const MiningPool = await ethers.getContractFactory("MiningPool");
  const miningPool = await MiningPool.deploy(
    trendTokenAddress,
    deployerAddress,
    miningRate,
    tapMultiplier
  );
  await miningPool.waitForDeployment();
  const miningPoolAddress = await miningPool.getAddress();
  console.log("MiningPool deployed to:", miningPoolAddress);

  // Transfer tokens to MiningPool
  console.log("
=== Transferring tokens to MiningPool ===");
  const deployerBalance = await trendToken.balanceOf(deployerAddress);
  const amountToTransfer = deployerBalance - ethers.parseEther("1000");
  if (amountToTransfer > 0) {
    await trendToken.transfer(miningPoolAddress, amountToTransfer);
    console.log("Transferred", ethers.formatEther(amountToTransfer), "$TREND to MiningPool");
  }

  // Setup Governor roles
  console.log("
=== Setting up Governor roles ===");
  const proposerRole = await governor.PROPOSER_ROLE();
  const executorRole = await governor.EXECUTOR_ROLE();
  const cancellerRole = await governor.CANCELLER_ROLE();
  
  await governor.grantRole(proposerRole, timelockAddress);
  await governor.grantRole(executorRole, timelockAddress);
  await governor.grantRole(cancellerRole, deployerAddress);
  console.log("Governor roles configured");

  // Transfer MiningPool ownership to Timelock
  console.log("
=== Setting up MiningPool governance ===");
  await miningPool.transferOwnership(timelockAddress);
  console.log("MiningPool ownership transferred to Timelock");

  console.log("
=== Deployment Summary ===");
  console.log("TrendToken:", trendTokenAddress);
  console.log("Timelock:", timelockAddress);
  console.log("Governor:", governorAddress);
  console.log("MiningPool:", miningPoolAddress);
  console.log("
Governance will activate when $TREND market cap reaches $100K (7-day average)");
  console.log("Call MiningPool.activateGovernance() to enable governance");

  // Save addresses
  const addresses = {
    network: hre.network.name,
    chainId: (await ethers.provider.getNetwork()).chainId,
    deployer: deployerAddress,
    TrendToken: trendTokenAddress,
    Timelock: timelockAddress,
    Governor: governorAddress,
    MiningPool: miningPoolAddress,
    deployedAt: new Date().toISOString()
  };
  
  const dir = "deployments";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(
    path.join(dir, hre.network.name + ".json"),
    JSON.stringify(addresses, null, 2)
  );
  console.log("
Addresses saved to deployments/" + hre.network.name + ".json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });