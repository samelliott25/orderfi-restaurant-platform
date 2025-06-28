import { storage } from '../storage';
import { blockchainStorage } from '../blockchain/storage';

export interface RewardCalculation {
  orderValue: number;
  pointsEarned: number;
  tokenMultiplier: number;
  tierBonus: number;
  totalReward: number;
}

export interface LoyaltyTier {
  name: 'bronze' | 'silver' | 'gold' | 'platinum';
  minOrders: number;
  pointsMultiplier: number;
  tokenBonus: number;
}

export const LOYALTY_TIERS: LoyaltyTier[] = [
  { name: 'bronze', minOrders: 0, pointsMultiplier: 1.0, tokenBonus: 0 },
  { name: 'silver', minOrders: 5, pointsMultiplier: 1.2, tokenBonus: 10 },
  { name: 'gold', minOrders: 15, pointsMultiplier: 1.5, tokenBonus: 25 },
  { name: 'platinum', minOrders: 50, pointsMultiplier: 2.0, tokenBonus: 50 }
];

export class RewardEngine {
  private pendingRewards = new Map<string, RewardCalculation>();

  // Calculate points and tokens earned from order
  calculateReward(orderValue: number, customerOrderCount: number): RewardCalculation {
    const basePoints = Math.floor(orderValue * 10); // 10 points per $1
    const tier = this.getUserTier(customerOrderCount);
    
    const calculation: RewardCalculation = {
      orderValue,
      pointsEarned: Math.floor(basePoints * tier.pointsMultiplier),
      tokenMultiplier: tier.pointsMultiplier,
      tierBonus: tier.tokenBonus,
      totalReward: Math.floor(basePoints * tier.pointsMultiplier) + tier.tokenBonus
    };

    return calculation;
  }

  // Determine user's loyalty tier based on order history
  getUserTier(orderCount: number): LoyaltyTier {
    return LOYALTY_TIERS
      .reverse()
      .find(tier => orderCount >= tier.minOrders) || LOYALTY_TIERS[0];
  }

  // Process reward for completed order
  async processOrderReward(orderId: number, customerId: string): Promise<RewardCalculation> {
    try {
      const order = await storage.getOrder(orderId);
      if (!order) throw new Error('Order not found');

      // Get customer's order history for tier calculation
      const customerOrders = await storage.getOrdersByCustomer(customerId);
      const orderCount = customerOrders.length;

      const reward = this.calculateReward(parseFloat(order.total), orderCount);
      
      // Store pending reward for blockchain minting
      this.pendingRewards.set(`${customerId}-${orderId}`, reward);

      // Record reward in blockchain for transparency
      await blockchainStorage.createMenuItemBlock({
        restaurantId: order.restaurantId,
        name: 'REWARD_EARNED',
        description: `Customer ${customerId} earned ${reward.totalReward} points`,
        price: reward.totalReward.toString(),
        category: 'rewards',
        tags: ['loyalty', 'points'],
        isAvailable: true,
        operation: 'CREATE'
      });

      console.log(`✓ Reward processed: ${reward.totalReward} points for customer ${customerId}`);
      return reward;
    } catch (error) {
      console.error('Reward processing failed:', error);
      throw error;
    }
  }

  // Get pending rewards for customer (ready for token minting)
  getPendingRewards(customerId: string): RewardCalculation[] {
    const rewards: RewardCalculation[] = [];
    Array.from(this.pendingRewards.entries()).forEach(([key, reward]) => {
      if (key.startsWith(`${customerId}-`)) {
        rewards.push(reward);
      }
    });
    return rewards;
  }

  // Mark rewards as claimed (after successful token mint)
  markRewardsClaimed(customerId: string, orderIds: number[]): void {
    orderIds.forEach(orderId => {
      this.pendingRewards.delete(`${customerId}-${orderId}`);
    });
    console.log(`✓ Rewards claimed for customer ${customerId}: ${orderIds.length} orders`);
  }

  // Daily/weekly batch processing for token minting
  async getBatchRewardsForMinting(): Promise<{ customerId: string; totalRewards: number; orders: number[] }[]> {
    const customerRewards = new Map<string, { total: number; orders: number[] }>();

    Array.from(this.pendingRewards.entries()).forEach(([key, reward]) => {
      const [customerId, orderIdStr] = key.split('-');
      const orderId = parseInt(orderIdStr);

      if (!customerRewards.has(customerId)) {
        customerRewards.set(customerId, { total: 0, orders: [] });
      }

      const customerData = customerRewards.get(customerId)!;
      customerData.total += reward.totalReward;
      customerData.orders.push(orderId);
    });

    return Array.from(customerRewards.entries()).map(([customerId, data]) => ({
      customerId,
      totalRewards: data.total,
      orders: data.orders
    }));
  }

  // Analytics for restaurant dashboard
  getRewardAnalytics(): {
    totalPointsIssued: number;
    activeCustomers: number;
    averageRewardPerOrder: number;
    tierDistribution: Record<string, number>;
  } {
    const allRewards = Array.from(this.pendingRewards.values());
    const totalPoints = allRewards.reduce((sum, reward) => sum + reward.totalReward, 0);
    const uniqueCustomers = new Set(
      Array.from(this.pendingRewards.keys()).map(key => key.split('-')[0])
    ).size;

    return {
      totalPointsIssued: totalPoints,
      activeCustomers: uniqueCustomers,
      averageRewardPerOrder: allRewards.length > 0 ? totalPoints / allRewards.length : 0,
      tierDistribution: {
        bronze: 0, // Would need actual customer data to calculate
        silver: 0,
        gold: 0,
        platinum: 0
      }
    };
  }
}

export const rewardEngine = new RewardEngine();