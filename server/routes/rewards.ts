import { Express } from "express";
import { z } from "zod";

interface CustomerReward {
  customerId: string;
  customerName: string;
  customerEmail: string;
  totalOrders: number;
  totalSpent: number;
  mimiTokensEarned: number;
  mimiTokensRedeemed: number;
  currentBalance: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  joinDate: number;
  lastOrderDate: number;
}

interface RewardTransaction {
  id: string;
  customerId: string;
  type: 'earned' | 'redeemed';
  amount: number;
  orderId?: string;
  description: string;
  timestamp: number;
}

// In-memory storage for demo
const customerRewards = new Map<string, CustomerReward>();
const rewardTransactions: RewardTransaction[] = [];

// Initialize with sample data
const sampleCustomers: CustomerReward[] = [
  {
    customerId: "cust_001",
    customerName: "Alice Johnson",
    customerEmail: "alice@example.com",
    totalOrders: 15,
    totalSpent: 487.50,
    mimiTokensEarned: 975,
    mimiTokensRedeemed: 200,
    currentBalance: 775,
    tier: 'Gold',
    joinDate: Date.now() - (90 * 24 * 60 * 60 * 1000), // 90 days ago
    lastOrderDate: Date.now() - (2 * 24 * 60 * 60 * 1000) // 2 days ago
  },
  {
    customerId: "cust_002", 
    customerName: "Bob Smith",
    customerEmail: "bob@example.com",
    totalOrders: 8,
    totalSpent: 234.25,
    mimiTokensEarned: 468,
    mimiTokensRedeemed: 100,
    currentBalance: 368,
    tier: 'Silver',
    joinDate: Date.now() - (45 * 24 * 60 * 60 * 1000),
    lastOrderDate: Date.now() - (7 * 24 * 60 * 60 * 1000)
  }
];

sampleCustomers.forEach(customer => {
  customerRewards.set(customer.customerId, customer);
});

const earnRewardsSchema = z.object({
  customerId: z.string(),
  customerName: z.string(),
  customerEmail: z.string(),
  orderId: z.string(),
  orderAmount: z.number().positive(),
  paymentMethod: z.enum(['usdc', 'credit', 'cash'])
});

const redeemRewardsSchema = z.object({
  customerId: z.string(),
  tokensToRedeem: z.number().positive(),
  orderId: z.string().optional()
});

function calculateTier(totalSpent: number): CustomerReward['tier'] {
  if (totalSpent >= 1000) return 'Platinum';
  if (totalSpent >= 500) return 'Gold';
  if (totalSpent >= 200) return 'Silver';
  return 'Bronze';
}

function calculateTokensEarned(orderAmount: number, paymentMethod: string, tier: string): number {
  let baseRate = 2; // 2 tokens per dollar spent
  
  // Bonus for USDC payments
  if (paymentMethod === 'usdc') {
    baseRate = 3; // 3 tokens per dollar for Web3 payments
  }
  
  // Tier multipliers
  const tierMultipliers = {
    'Bronze': 1.0,
    'Silver': 1.2,
    'Gold': 1.5,
    'Platinum': 2.0
  };
  
  return Math.floor(orderAmount * baseRate * tierMultipliers[tier as keyof typeof tierMultipliers]);
}

export function registerRewardRoutes(app: Express) {
  // Get customer rewards profile
  app.get("/api/rewards/customer/:customerId", (req, res) => {
    try {
      const { customerId } = req.params;
      const customer = customerRewards.get(customerId);
      
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      
      const recentTransactions = rewardTransactions
        .filter(t => t.customerId === customerId)
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 10);
      
      res.json({
        ...customer,
        recentTransactions,
        tierBenefits: {
          [customer.tier]: {
            tokenMultiplier: customer.tier === 'Bronze' ? 1.0 : 
                           customer.tier === 'Silver' ? 1.2 :
                           customer.tier === 'Gold' ? 1.5 : 2.0,
            specialOffers: customer.tier === 'Platinum' ? ['Free delivery', 'Priority support'] :
                          customer.tier === 'Gold' ? ['10% birthday discount'] :
                          customer.tier === 'Silver' ? ['5% monthly special'] : []
          }
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customer rewards" });
    }
  });

  // Earn rewards for completed order
  app.post("/api/rewards/earn", (req, res) => {
    try {
      const { customerId, customerName, customerEmail, orderId, orderAmount, paymentMethod } = 
        earnRewardsSchema.parse(req.body);
      
      let customer = customerRewards.get(customerId);
      
      if (!customer) {
        // Create new customer
        customer = {
          customerId,
          customerName,
          customerEmail,
          totalOrders: 0,
          totalSpent: 0,
          mimiTokensEarned: 0,
          mimiTokensRedeemed: 0,
          currentBalance: 0,
          tier: 'Bronze',
          joinDate: Date.now(),
          lastOrderDate: Date.now()
        };
      }
      
      // Update customer stats
      customer.totalOrders += 1;
      customer.totalSpent += orderAmount;
      customer.lastOrderDate = Date.now();
      customer.tier = calculateTier(customer.totalSpent);
      
      // Calculate tokens earned
      const tokensEarned = calculateTokensEarned(orderAmount, paymentMethod, customer.tier);
      customer.mimiTokensEarned += tokensEarned;
      customer.currentBalance += tokensEarned;
      
      // Save customer
      customerRewards.set(customerId, customer);
      
      // Record transaction
      const transaction: RewardTransaction = {
        id: `txn_${Date.now()}`,
        customerId,
        type: 'earned',
        amount: tokensEarned,
        orderId,
        description: `Earned ${tokensEarned} MIMI tokens for $${orderAmount.toFixed(2)} order (${paymentMethod.toUpperCase()})`,
        timestamp: Date.now()
      };
      
      rewardTransactions.push(transaction);
      
      res.json({
        success: true,
        tokensEarned,
        newBalance: customer.currentBalance,
        tier: customer.tier,
        transaction
      });
      
    } catch (error) {
      console.error('Earn rewards error:', error);
      res.status(400).json({ error: "Invalid reward data" });
    }
  });

  // Redeem rewards
  app.post("/api/rewards/redeem", (req, res) => {
    try {
      const { customerId, tokensToRedeem, orderId } = redeemRewardsSchema.parse(req.body);
      
      const customer = customerRewards.get(customerId);
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      
      if (customer.currentBalance < tokensToRedeem) {
        return res.status(400).json({ error: "Insufficient token balance" });
      }
      
      // Update customer balance
      customer.mimiTokensRedeemed += tokensToRedeem;
      customer.currentBalance -= tokensToRedeem;
      customerRewards.set(customerId, customer);
      
      // Record transaction
      const transaction: RewardTransaction = {
        id: `txn_${Date.now()}`,
        customerId,
        type: 'redeemed',
        amount: tokensToRedeem,
        orderId,
        description: `Redeemed ${tokensToRedeem} MIMI tokens for discount`,
        timestamp: Date.now()
      };
      
      rewardTransactions.push(transaction);
      
      // Calculate dollar value (100 tokens = $1)
      const dollarValue = tokensToRedeem / 100;
      
      res.json({
        success: true,
        tokensRedeemed: tokensToRedeem,
        dollarValue: dollarValue.toFixed(2),
        newBalance: customer.currentBalance,
        transaction
      });
      
    } catch (error) {
      console.error('Redeem rewards error:', error);
      res.status(400).json({ error: "Invalid redemption data" });
    }
  });

  // Get all customers (for admin dashboard)
  app.get("/api/rewards/customers", (req, res) => {
    try {
      const customers = Array.from(customerRewards.values())
        .sort((a, b) => b.totalSpent - a.totalSpent);
      
      const stats = {
        totalCustomers: customers.length,
        totalTokensIssued: customers.reduce((sum, c) => sum + c.mimiTokensEarned, 0),
        totalTokensRedeemed: customers.reduce((sum, c) => sum + c.mimiTokensRedeemed, 0),
        averageTokensPerCustomer: customers.length > 0 ? 
          customers.reduce((sum, c) => sum + c.currentBalance, 0) / customers.length : 0,
        tierDistribution: {
          Bronze: customers.filter(c => c.tier === 'Bronze').length,
          Silver: customers.filter(c => c.tier === 'Silver').length,
          Gold: customers.filter(c => c.tier === 'Gold').length,
          Platinum: customers.filter(c => c.tier === 'Platinum').length
        }
      };
      
      res.json({
        customers: customers.slice(0, 50), // Limit to 50 for performance
        stats
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customers" });
    }
  });

  // Get reward stats for dashboard
  app.get("/api/rewards/stats", (req, res) => {
    try {
      const customers = Array.from(customerRewards.values());
      const now = Date.now();
      const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
      
      const recentTransactions = rewardTransactions.filter(t => t.timestamp > thirtyDaysAgo);
      
      res.json({
        totalCustomers: customers.length,
        activeCustomers: customers.filter(c => c.lastOrderDate > thirtyDaysAgo).length,
        totalTokensIssued: customers.reduce((sum, c) => sum + c.mimiTokensEarned, 0),
        totalTokensRedeemed: customers.reduce((sum, c) => sum + c.mimiTokensRedeemed, 0),
        totalTokensOutstanding: customers.reduce((sum, c) => sum + c.currentBalance, 0),
        recentActivity: {
          tokensEarned: recentTransactions
            .filter(t => t.type === 'earned')
            .reduce((sum, t) => sum + t.amount, 0),
          tokensRedeemed: recentTransactions
            .filter(t => t.type === 'redeemed')
            .reduce((sum, t) => sum + t.amount, 0)
        },
        tierDistribution: {
          Bronze: customers.filter(c => c.tier === 'Bronze').length,
          Silver: customers.filter(c => c.tier === 'Silver').length,
          Gold: customers.filter(c => c.tier === 'Gold').length,
          Platinum: customers.filter(c => c.tier === 'Platinum').length
        },
        topCustomers: customers
          .sort((a, b) => b.totalSpent - a.totalSpent)
          .slice(0, 5)
          .map(c => ({
            name: c.customerName,
            totalSpent: c.totalSpent,
            tier: c.tier,
            tokensEarned: c.mimiTokensEarned
          }))
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reward stats" });
    }
  });
}