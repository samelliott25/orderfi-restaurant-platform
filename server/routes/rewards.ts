import { Router } from 'express';
import { z } from 'zod';

const router = Router();

// In-memory token balances (would be in database in production)
const tokenBalances = new Map<string, {
  customerId: string;
  balance: number;
  totalEarned: number;
  totalRedeemed: number;
  tier: string;
  transactions: Array<{
    id: string;
    type: 'earned' | 'redeemed';
    amount: number;
    description: string;
    timestamp: Date;
    orderId?: string;
  }>;
}>();

// Earn tokens from order
router.post('/earn', async (req, res) => {
  try {
    const { 
      customerId, 
      customerName, 
      customerEmail, 
      orderId, 
      orderAmount, 
      paymentMethod 
    } = req.body;

    if (!customerId || !orderAmount) {
      return res.status(400).json({ error: 'Customer ID and order amount required' });
    }

    // Calculate tokens earned
    let baseTokens = Math.floor(orderAmount * 2); // 2 tokens per dollar
    let bonusTokens = 0;
    
    // Bonus for crypto payments
    if (paymentMethod === 'usdc') {
      bonusTokens = Math.floor(orderAmount * 2); // Double tokens for crypto
    }
    
    const totalTokens = baseTokens + bonusTokens;

    // Get or create customer balance
    let customerBalance = tokenBalances.get(customerId);
    if (!customerBalance) {
      customerBalance = {
        customerId,
        balance: 0,
        totalEarned: 0,
        totalRedeemed: 0,
        tier: 'Bronze',
        transactions: []
      };
    }

    // Update balance
    customerBalance.balance += totalTokens;
    customerBalance.totalEarned += totalTokens;

    // Update tier based on total earned
    const tiers = [
      { name: 'Bronze', minTokens: 0 },
      { name: 'Silver', minTokens: 500 },
      { name: 'Gold', minTokens: 1500 },
      { name: 'Platinum', minTokens: 5000 }
    ];
    
    customerBalance.tier = tiers
      .slice()
      .reverse()
      .find(tier => customerBalance!.totalEarned >= tier.minTokens)?.name || 'Bronze';

    // Add transaction record
    customerBalance.transactions.push({
      id: `tx_${Date.now()}`,
      type: 'earned',
      amount: totalTokens,
      description: `Order #${orderId} - ${paymentMethod === 'usdc' ? 'Crypto Bonus' : 'Standard'} Earning`,
      timestamp: new Date(),
      orderId
    });

    // Store updated balance
    tokenBalances.set(customerId, customerBalance);

    // Store in blockchain for transparency
    try {
      const { blockchainStorage } = await import("../blockchain/storage");
      await blockchainStorage.createMenuItemBlock({
        type: 'REWARD_TRANSACTION',
        customerId,
        orderId,
        tokensEarned: totalTokens,
        paymentMethod,
        timestamp: new Date().toISOString()
      });
    } catch (blockchainError) {
      console.error('Blockchain storage error:', blockchainError);
    }

    res.json({
      success: true,
      tokensEarned: totalTokens,
      newBalance: customerBalance.balance,
      tier: customerBalance.tier,
      breakdown: {
        baseTokens,
        bonusTokens,
        reason: paymentMethod === 'usdc' ? 'Crypto payment bonus' : 'Standard earning'
      }
    });

  } catch (error) {
    console.error('Token earning error:', error);
    res.status(500).json({ error: 'Failed to process token earning' });
  }
});

// Get customer token balance
router.get('/balance/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    
    const customerBalance = tokenBalances.get(customerId);
    if (!customerBalance) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(customerBalance);
  } catch (error) {
    console.error('Balance retrieval error:', error);
    res.status(500).json({ error: 'Failed to retrieve balance' });
  }
});

// Redeem tokens for rewards
router.post('/redeem', async (req, res) => {
  try {
    const { customerId, rewardId, cost } = req.body;

    if (!customerId || !rewardId || !cost) {
      return res.status(400).json({ error: 'Customer ID, reward ID, and cost required' });
    }

    const customerBalance = tokenBalances.get(customerId);
    if (!customerBalance) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    if (customerBalance.balance < cost) {
      return res.status(400).json({ error: 'Insufficient token balance' });
    }

    // Deduct tokens
    customerBalance.balance -= cost;
    customerBalance.totalRedeemed += cost;

    // Add transaction record
    customerBalance.transactions.push({
      id: `tx_${Date.now()}`,
      type: 'redeemed',
      amount: cost,
      description: `Redeemed reward: ${rewardId}`,
      timestamp: new Date()
    });

    // Store updated balance
    tokenBalances.set(customerId, customerBalance);

    // Store redemption in blockchain
    try {
      const { blockchainStorage } = await import("../blockchain/storage");
      await blockchainStorage.createMenuItemBlock({
        type: 'REWARD_REDEMPTION',
        customerId,
        rewardId,
        tokensRedeemed: cost,
        timestamp: new Date().toISOString()
      });
    } catch (blockchainError) {
      console.error('Blockchain storage error:', blockchainError);
    }

    res.json({
      success: true,
      tokensRedeemed: cost,
      newBalance: customerBalance.balance,
      rewardId
    });

  } catch (error) {
    console.error('Token redemption error:', error);
    res.status(500).json({ error: 'Failed to process token redemption' });
  }
});

// Get customer transaction history
router.get('/transactions/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    
    const customerBalance = tokenBalances.get(customerId);
    if (!customerBalance) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const transactions = customerBalance.transactions
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 50); // Last 50 transactions

    res.json({ transactions });
  } catch (error) {
    console.error('Transaction history error:', error);
    res.status(500).json({ error: 'Failed to retrieve transaction history' });
  }
});

// Get leaderboard (top token earners)
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = Array.from(tokenBalances.values())
      .sort((a, b) => b.totalEarned - a.totalEarned)
      .slice(0, 10)
      .map(customer => ({
        customerId: customer.customerId,
        totalEarned: customer.totalEarned,
        tier: customer.tier
      }));

    res.json({ leaderboard });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Failed to retrieve leaderboard' });
  }
});

export default router;