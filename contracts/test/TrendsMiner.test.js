const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Trends Miner Contracts", function () {
  let deployer, user1, user2, user3;
  let trendToken, miningPool, governor, timelock;

  beforeEach(async function () {
    [deployer, user1, user2, user3] = await ethers.getSigners();

    // Deploy TrendToken
    const TrendToken = await ethers.getContractFactory("TrendToken");
    trendToken = await TrendToken.deploy("TrendToken", "$TREND", ethers.parseEther("1000000"));
    await trendToken.waitForDeployment();

    // Deploy Timelock
    const minDelay = 1;
    const maxDelay = 7;
    const Timelock = await ethers.getContractFactory("TrendsMinerTimelock");
    timelock = await Timelock.deploy(deployer.address, minDelay, maxDelay);
    await timelock.waitForDeployment();

    // Deploy Governor
    const Governor = await ethers.getContractFactory("TrendsMinerGovernor");
    governor = await Governor.deploy(await trendToken.getAddress(), await timelock.getAddress());
    await governor.waitForDeployment();

    // Deploy MiningPool
    const miningRate = 100;
    const tapMultiplier = 150;
    const MiningPool = await ethers.getContractFactory("MiningPool");
    miningPool = await MiningPool.deploy(
      await trendToken.getAddress(),
      deployer.address,
      miningRate,
      tapMultiplier
    );
    await miningPool.waitForDeployment();

    // Transfer tokens to users
    await trendToken.transfer(user1.address, ethers.parseEther("10000"));
    await trendToken.transfer(user2.address, ethers.parseEther("10000"));
    await trendToken.transfer(user3.address, ethers.parseEther("10000"));
  });

  describe("TrendToken", function () {
    it("Should deploy with correct name and symbol", async function () {
      expect(await trendToken.name()).to.equal("TrendToken");
      expect(await trendToken.symbol()).to.equal("$TREND");
      expect(await trendToken.decimals()).to.equal(18);
    });

    it("Should mint tokens to owner", async function () {
      const ownerBalance = await trendToken.balanceOf(deployer.address);
      expect(ownerBalance).to.equal(ethers.parseEther("1000000"));
    });

    it("Should allow owner to mint more tokens", async function () {
      await trendToken.mint(user1.address, ethers.parseEther("1000"));
      expect(await trendToken.balanceOf(user1.address)).to.equal(ethers.parseEther("11000"));
    });

    it("Should not allow non-owner to mint", async function () {
      await expect(
        trendToken.connect(user1).mint(user1.address, ethers.parseEther("1000"))
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("MiningPool", function () {
    it("Should deploy with correct parameters", async function () {
      expect(await miningPool.trendToken()).to.equal(await trendToken.getAddress());
      expect(await miningPool.miningRate()).to.equal(100);
      expect(await miningPool.tapMultiplier()).to.equal(150);
    });

    it("Should allow users to stake tokens", async function () {
      await trendToken.connect(user1).approve(await miningPool.getAddress(), ethers.parseEther("1000"));
      await miningPool.connect(user1).stake(ethers.parseEther("1000"));
      
      const userData = await miningPool.getUserData(user1.address);
      expect(userData.stakedAmount).to.equal(ethers.parseEther("1000"));
    });

    it("Should update guild when staking", async function () {
      await trendToken.connect(user1).approve(await miningPool.getAddress(), ethers.parseEther("1000"));
      await miningPool.connect(user1).stake(ethers.parseEther("1000"));
      
      const guild = await miningPool.getUserGuild(user1.address);
      expect(guild.name).to.equal("Apprentice");
    });

    it("Should allow users to withdraw staked tokens", async function () {
      await trendToken.connect(user1).approve(await miningPool.getAddress(), ethers.parseEther("1000"));
      await miningPool.connect(user1).stake(ethers.parseEther("1000"));
      
      await miningPool.connect(user1).withdraw(ethers.parseEther("500"));
      
      const userData = await miningPool.getUserData(user1.address);
      expect(userData.stakedAmount).to.equal(ethers.parseEther("500"));
    });

    it("Should calculate claim amount correctly", async function () {
      await trendToken.connect(user1).approve(await miningPool.getAddress(), ethers.parseEther("1000000"));
      await miningPool.connect(user1).stake(ethers.parseEther("1000000"));
      
      const claimAmount = await miningPool.calculateClaimAmount(user1.address);
      expect(claimAmount).to.be.gt(0);
    });

    it("Should activate governance", async function () {
      await miningPool.activateGovernance(
        await governor.getAddress(),
        await timelock.getAddress()
      );
      
      expect(await miningPool.governanceActivated()).to.be.true;
      expect(await miningPool.governor()).to.equal(await governor.getAddress());
      expect(await miningPool.timelock()).to.equal(await timelock.getAddress());
    });

    it("Should not allow activating governance twice", async function () {
      await miningPool.activateGovernance(
        await governor.getAddress(),
        await timelock.getAddress()
      );
      
      await expect(
        miningPool.activateGovernance(
          await governor.getAddress(),
          await timelock.getAddress()
        )
      ).to.be.revertedWith("MiningPool: governance already activated");
    });
  });

  describe("Governance Integration", function () {
    it("Should transfer ownership to timelock on governance activation", async function () {
      await miningPool.activateGovernance(
        await governor.getAddress(),
        await timelock.getAddress()
      );
      
      expect(await miningPool.owner()).to.equal(await timelock.getAddress());
    });
  });
});