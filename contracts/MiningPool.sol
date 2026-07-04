// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MiningPool is Ownable {
    IERC20 public trendToken;
    IERC20 public oreToken;

    uint256 public miningRate;
    uint256 public tapMultiplier;
    uint256 public totalMined;
    uint256 public constant MAX_ENERGY = 100;

    struct Guild {
        uint256 requirement;
        uint256 multiplier;
        string name;
    }
    Guild[3] public guilds;

    struct Vein {
        uint256 baseRate;
        uint256 multiplier;
        string name;
        bool isActive;
    }
    Vein[6] public veins;

    struct UserData {
        uint256 lastMined;
        uint256 totalMined;
        uint256 stakedAmount;
        uint256 energy;
        uint256 guildId;
        uint256 veinId;
        bool hasClaimed;
    }
    mapping(address => UserData) public userData;

    address public treasury;
    bool public governanceActivated;
    address public governor;
    address public timelock;

    event TokensMined(address indexed user, uint256 amount, uint256 timestamp);
    event TokensClaimed(address indexed user, uint256 amount, uint256 timestamp);
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event GovernanceActivated(address indexed governor, address indexed timelock);

    constructor(
        address _trendToken,
        address _treasury,
        uint256 _miningRate,
        uint256 _tapMultiplier
    ) {
        trendToken = IERC20(_trendToken);
        treasury = _treasury;
        miningRate = _miningRate;
        tapMultiplier = _tapMultiplier;
        governanceActivated = false;

        guilds[0] = Guild(0, 100, "Novice");
        guilds[1] = Guild(1000 * 10**18, 125, "Apprentice");
        guilds[2] = Guild(10000 * 10**18, 150, "Master");

        veins[0] = Vein(100, 100, "Crypto", true);
        veins[1] = Vein(120, 120, "AI", true);
        veins[2] = Vein(150, 150, "DeFi", true);
        veins[3] = Vein(110, 110, "Gaming", true);
        veins[4] = Vein(80, 80, "Memes", true);
        veins[5] = Vein(90, 90, "Social", true);
    }

    function mine(address user) external {
        require(user != address(0), "MiningPool: zero address");

        UserData storage userD = userData[user];
        uint256 timeElapsed = block.timestamp - userD.lastMined;

        uint256 baseAmount = miningRate * timeElapsed;
        uint256 guildMultiplier = guilds[userD.guildId].multiplier;
        uint256 guildAmount = baseAmount * guildMultiplier / 100;
        uint256 veinMultiplier = veins[userD.veinId].multiplier;
        uint256 finalAmount = guildAmount * veinMultiplier / 100;

        userD.lastMined = block.timestamp;
        userD.totalMined += finalAmount;
        totalMined += finalAmount;

        trendToken.transfer(user, finalAmount);
        emit TokensMined(user, finalAmount, block.timestamp);
    }

    function tap(address user) external {
        require(user != address(0), "MiningPool: zero address");
        UserData storage userD = userData[user];
        require(userD.energy > 0, "MiningPool: no energy");

        uint256 baseAmount = miningRate * tapMultiplier;
        uint256 guildMultiplier = guilds[userD.guildId].multiplier;
        uint256 guildAmount = baseAmount * guildMultiplier / 100;
        uint256 veinMultiplier = veins[userD.veinId].multiplier;
        uint256 finalAmount = guildAmount * veinMultiplier / 100;

        userD.energy -= 10;
        userD.totalMined += finalAmount;
        totalMined += finalAmount;

        trendToken.transfer(user, finalAmount);
        emit TokensMined(user, finalAmount, block.timestamp);
    }

    function stake(uint256 amount) external {
        require(amount > 0, "MiningPool: zero amount");
        UserData storage userD = userData[msg.sender];

        trendToken.transferFrom(msg.sender, address(this), amount);
        userD.stakedAmount += amount;

        if (userD.energy == 0) {
            userD.energy = MAX_ENERGY;
        }

        if (userD.stakedAmount >= guilds[2].requirement) {
            userD.guildId = 2;
        } else if (userD.stakedAmount >= guilds[1].requirement) {
            userD.guildId = 1;
        } else {
            userD.guildId = 0;
        }

        emit Staked(msg.sender, amount);
    }

    function withdraw(uint256 amount) external {
        require(amount > 0, "MiningPool: zero amount");
        UserData storage userD = userData[msg.sender];
        require(userD.stakedAmount >= amount, "MiningPool: insufficient stake");

        userD.stakedAmount -= amount;

        if (userD.stakedAmount >= guilds[2].requirement) {
            userD.guildId = 2;
        } else if (userD.stakedAmount >= guilds[1].requirement) {
            userD.guildId = 1;
        } else {
            userD.guildId = 0;
        }

        trendToken.transfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount);
    }

    function claim() external {
        UserData storage userD = userData[msg.sender];
        require(!userD.hasClaimed, "MiningPool: already claimed");

        uint256 claimAmount = calculateClaimAmount(msg.sender);
        require(
            trendToken.transferFrom(treasury, msg.sender, claimAmount),
            "MiningPool: treasury transfer failed"
        );

        userD.hasClaimed = true;
        emit TokensClaimed(msg.sender, claimAmount, block.timestamp);
    }

    function calculateClaimAmount(address user) public view returns (uint256) {
        UserData storage userD = userData[user];
        uint256 staked = userD.stakedAmount;
        uint256 multiplier;

        if (staked >= 10000000 * 10**18) {
            multiplier = 450;
        } else if (staked >= 1000000 * 10**18) {
            multiplier = 300;
        } else {
            multiplier = 100;
        }

        return userD.totalMined * multiplier / 100;
    }

    function activateGovernance(address _governor, address _timelock) external onlyOwner {
        require(!governanceActivated, "MiningPool: governance already activated");
        require(_governor != address(0), "MiningPool: zero governor");
        require(_timelock != address(0), "MiningPool: zero timelock");

        governor = _governor;
        timelock = _timelock;
        governanceActivated = true;

        transferOwnership(_timelock);
        emit GovernanceActivated(_governor, _timelock);
    }

    function updateMiningParameters(uint256 _miningRate, uint256 _tapMultiplier) external onlyOwner {
        miningRate = _miningRate;
        tapMultiplier = _tapMultiplier;
    }

    function updateTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "MiningPool: zero treasury");
        treasury = _treasury;
    }

    function updateGuild(
        uint256 guildId,
        uint256 requirement,
        uint256 multiplier,
        string memory name
    ) external onlyOwner {
        require(guildId < 3, "MiningPool: invalid guild id");
        guilds[guildId] = Guild(requirement, multiplier, name);
    }

    function updateVein(
        uint256 veinId,
        uint256 baseRate,
        uint256 multiplier,
        string memory name,
        bool isActive
    ) external onlyOwner {
        require(veinId < 6, "MiningPool: invalid vein id");
        veins[veinId] = Vein(baseRate, multiplier, name, isActive);
    }

    function recoverUnallocatedRewards() external onlyOwner {
        uint256 balance = trendToken.balanceOf(address(this));
        if (balance > 0) {
            trendToken.transfer(treasury, balance);
        }
    }

    function getUserData(address user) external view returns (UserData memory) {
        return userData[user];
    }

    function getTotalMined() external view returns (uint256) {
        return totalMined;
    }

    function getUserGuild(address user) external view returns (Guild memory) {
        UserData memory userD = userData[user];
        return guilds[userD.guildId];
    }

    function getUserVein(address user) external view returns (Vein memory) {
        UserData memory userD = userData[user];
        return veins[userD.veinId];
    }
}