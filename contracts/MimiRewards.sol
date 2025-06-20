// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract MimiRewards is ERC20, Ownable, ReentrancyGuard, Pausable {
    // Reward multipliers (basis points)
    uint256 public constant ORDER_REWARD_BP = 100; // 1%
    uint256 public constant REFERRAL_REWARD_BP = 500; // 5%
    uint256 public constant STAKING_APY_BP = 1200; // 12%
    uint256 public constant BASIS_POINTS = 10000;
    
    // Staking system
    struct Stake {
        uint256 amount;
        uint256 timestamp;
        uint256 rewardDebt;
    }
    
    mapping(address => Stake) public stakes;
    mapping(address => uint256) public referralRewards;
    mapping(address => address) public referrers;
    
    uint256 public totalStaked;
    uint256 public rewardPool;
    
    // Events
    event OrderReward(address indexed user, uint256 amount, uint256 orderValue);
    event ReferralReward(address indexed referrer, address indexed referee, uint256 amount);
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount, uint256 rewards);
    event RewardsClaimed(address indexed user, uint256 amount);
    
    constructor() ERC20("Mimi Token", "MIMI") {
        _mint(msg.sender, 1000000 * 10**decimals()); // 1M initial supply
    }
    
    function distributeOrderReward(address user, uint256 orderValue) external onlyOwner whenNotPaused {
        uint256 rewardAmount = (orderValue * ORDER_REWARD_BP) / BASIS_POINTS;
        _mint(user, rewardAmount);
        
        // Referral bonus if applicable
        address referrer = referrers[user];
        if (referrer != address(0)) {
            uint256 referralBonus = (rewardAmount * REFERRAL_REWARD_BP) / BASIS_POINTS;
            _mint(referrer, referralBonus);
            referralRewards[referrer] += referralBonus;
            emit ReferralReward(referrer, user, referralBonus);
        }
        
        emit OrderReward(user, rewardAmount, orderValue);
    }
    
    function setReferrer(address referrer) external {
        require(referrers[msg.sender] == address(0), "Referrer already set");
        require(referrer != msg.sender, "Cannot refer yourself");
        referrers[msg.sender] = referrer;
    }
    
    function stake(uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "Cannot stake 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        // Calculate pending rewards before updating stake
        uint256 pendingRewards = calculateStakingRewards(msg.sender);
        
        // Update stake
        stakes[msg.sender].amount += amount;
        stakes[msg.sender].timestamp = block.timestamp;
        stakes[msg.sender].rewardDebt += pendingRewards;
        
        totalStaked += amount;
        _transfer(msg.sender, address(this), amount);
        
        emit Staked(msg.sender, amount);
    }
    
    function unstake(uint256 amount) external nonReentrant {
        Stake storage userStake = stakes[msg.sender];
        require(userStake.amount >= amount, "Insufficient stake");
        
        // Calculate rewards
        uint256 rewards = calculateStakingRewards(msg.sender);
        
        // Update stake
        userStake.amount -= amount;
        totalStaked -= amount;
        
        // Transfer tokens and rewards
        _transfer(address(this), msg.sender, amount);
        if (rewards > 0) {
            _mint(msg.sender, rewards);
        }
        
        emit Unstaked(msg.sender, amount, rewards);
    }
    
    function calculateStakingRewards(address user) public view returns (uint256) {
        Stake memory userStake = stakes[user];
        if (userStake.amount == 0) return 0;
        
        uint256 timeStaked = block.timestamp - userStake.timestamp;
        uint256 annualReward = (userStake.amount * STAKING_APY_BP) / BASIS_POINTS;
        uint256 reward = (annualReward * timeStaked) / 365 days;
        
        return reward - userStake.rewardDebt;
    }
    
    function claimStakingRewards() external nonReentrant {
        uint256 rewards = calculateStakingRewards(msg.sender);
        require(rewards > 0, "No rewards to claim");
        
        stakes[msg.sender].rewardDebt += rewards;
        _mint(msg.sender, rewards);
        
        emit RewardsClaimed(msg.sender, rewards);
    }
    
    // Emergency functions
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function emergencyWithdraw(uint256 amount) external onlyOwner {
        _transfer(address(this), owner(), amount);
    }
}