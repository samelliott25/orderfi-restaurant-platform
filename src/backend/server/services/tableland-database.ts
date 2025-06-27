import { Database } from '@tableland/sdk';
import { Wallet, getDefaultProvider } from 'ethers';

interface TablelandConfig {
  chainId: number;
  privateKey: string;
  rpcUrl: string;
}

interface OrderRecord {
  id: string;
  restaurant_id: number;
  customer_name: string;
  customer_email: string;
  items: string;
  total: string;
  status: string;
  payment_method: string;
  created_at: number;
  blockchain_hash?: string;
}

class TablelandDatabaseService {
  private db: Database;
  private wallet: Wallet;
  private ordersTableName: string = '';
  private rewardsTableName: string = '';

  constructor(config: TablelandConfig) {
    const provider = getDefaultProvider(config.rpcUrl);
    this.wallet = new Wallet(config.privateKey, provider);
    this.db = new Database({ signer: this.wallet });
  }

  async initialize(): Promise<void> {
    try {
      // Create orders table if it doesn't exist
      const ordersSchema = `
        id TEXT PRIMARY KEY,
        restaurant_id INTEGER,
        customer_name TEXT,
        customer_email TEXT,
        items TEXT,
        total TEXT,
        status TEXT,
        payment_method TEXT,
        created_at INTEGER,
        blockchain_hash TEXT
      `;
      
      const { meta: ordersMeta } = await this.db.prepare(
        `CREATE TABLE orderfi_orders_${Date.now()} (${ordersSchema});`
      ).run();
      
      this.ordersTableName = ordersMeta.txn?.name || '';
      console.log(`📊 Orders table created: ${this.ordersTableName}`);

      // Create rewards table
      const rewardsSchema = `
        customer_id TEXT,
        order_id TEXT,
        points_earned INTEGER,
        tier TEXT,
        transaction_hash TEXT,
        created_at INTEGER
      `;
      
      const { meta: rewardsMeta } = await this.db.prepare(
        `CREATE TABLE orderfi_rewards_${Date.now()} (${rewardsSchema});`
      ).run();
      
      this.rewardsTableName = rewardsMeta.txn?.name || '';
      console.log(`🏆 Rewards table created: ${this.rewardsTableName}`);
      
    } catch (error) {
      console.error('Tableland initialization failed:', error);
      throw new Error(`Failed to initialize Tableland: ${error.message}`);
    }
  }

  async insertOrder(order: OrderRecord): Promise<boolean> {
    try {
      const query = `
        INSERT INTO ${this.ordersTableName} (
          id, restaurant_id, customer_name, customer_email, 
          items, total, status, payment_method, created_at, blockchain_hash
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;
      
      const { meta } = await this.db.prepare(query).bind(
        order.id,
        order.restaurant_id,
        order.customer_name,
        order.customer_email,
        order.items,
        order.total,
        order.status,
        order.payment_method,
        order.created_at,
        order.blockchain_hash || null
      ).run();

      console.log(`📝 Order stored on-chain: ${order.id} (${meta.txn?.transactionHash})`);
      return true;
    } catch (error) {
      console.error('Tableland order insert failed:', error);
      return false;
    }
  }

  async updateOrderStatus(orderId: string, status: string, blockchainHash?: string): Promise<boolean> {
    try {
      const query = `
        UPDATE ${this.ordersTableName} 
        SET status = ?, blockchain_hash = ?
        WHERE id = ?;
      `;
      
      await this.db.prepare(query).bind(status, blockchainHash || null, orderId).run();
      console.log(`📝 Order status updated: ${orderId} -> ${status}`);
      return true;
    } catch (error) {
      console.error('Tableland order update failed:', error);
      return false;
    }
  }

  async getOrdersByRestaurant(restaurantId: number, limit: number = 50): Promise<OrderRecord[]> {
    try {
      const query = `
        SELECT * FROM ${this.ordersTableName} 
        WHERE restaurant_id = ? 
        ORDER BY created_at DESC 
        LIMIT ?;
      `;
      
      const { results } = await this.db.prepare(query).bind(restaurantId, limit).all();
      return results as OrderRecord[];
    } catch (error) {
      console.error('Tableland query failed:', error);
      return [];
    }
  }

  async recordReward(customerId: string, orderId: string, points: number, tier: string, txHash: string): Promise<boolean> {
    try {
      const query = `
        INSERT INTO ${this.rewardsTableName} (
          customer_id, order_id, points_earned, tier, transaction_hash, created_at
        ) VALUES (?, ?, ?, ?, ?, ?);
      `;
      
      await this.db.prepare(query).bind(
        customerId,
        orderId,
        points,
        tier,
        txHash,
        Date.now()
      ).run();

      console.log(`🏆 Reward recorded: ${customerId} earned ${points} points`);
      return true;
    } catch (error) {
      console.error('Tableland reward insert failed:', error);
      return false;
    }
  }

  async getCustomerRewards(customerId: string): Promise<{ totalPoints: number; tier: string; transactions: any[] }> {
    try {
      const query = `
        SELECT * FROM ${this.rewardsTableName} 
        WHERE customer_id = ? 
        ORDER BY created_at DESC;
      `;
      
      const { results } = await this.db.prepare(query).bind(customerId).all();
      const transactions = results as any[];
      
      const totalPoints = transactions.reduce((sum, tx) => sum + tx.points_earned, 0);
      
      // Calculate tier based on total points
      let tier = 'Bronze';
      if (totalPoints >= 10000) tier = 'Platinum';
      else if (totalPoints >= 5000) tier = 'Gold';
      else if (totalPoints >= 1000) tier = 'Silver';
      
      return { totalPoints, tier, transactions };
    } catch (error) {
      console.error('Tableland rewards query failed:', error);
      return { totalPoints: 0, tier: 'Bronze', transactions: [] };
    }
  }

  async getAnalytics(restaurantId: number): Promise<{
    totalOrders: number;
    totalRevenue: string;
    topCustomers: any[];
    recentActivity: any[];
  }> {
    try {
      // Total orders and revenue
      const ordersQuery = `
        SELECT COUNT(*) as total_orders, SUM(CAST(total as REAL)) as total_revenue
        FROM ${this.ordersTableName} 
        WHERE restaurant_id = ?;
      `;
      
      const { results: orderStats } = await this.db.prepare(ordersQuery).bind(restaurantId).all();
      const stats = orderStats[0] as any;
      
      // Top customers by order frequency
      const customersQuery = `
        SELECT customer_name, customer_email, COUNT(*) as order_count, SUM(CAST(total as REAL)) as total_spent
        FROM ${this.ordersTableName} 
        WHERE restaurant_id = ?
        GROUP BY customer_email
        ORDER BY order_count DESC
        LIMIT 10;
      `;
      
      const { results: topCustomers } = await this.db.prepare(customersQuery).bind(restaurantId).all();
      
      // Recent activity
      const recentQuery = `
        SELECT id, customer_name, total, status, created_at
        FROM ${this.ordersTableName} 
        WHERE restaurant_id = ?
        ORDER BY created_at DESC
        LIMIT 20;
      `;
      
      const { results: recentActivity } = await this.db.prepare(recentQuery).bind(restaurantId).all();
      
      return {
        totalOrders: stats.total_orders || 0,
        totalRevenue: (stats.total_revenue || 0).toFixed(2),
        topCustomers: topCustomers as any[],
        recentActivity: recentActivity as any[]
      };
    } catch (error) {
      console.error('Tableland analytics query failed:', error);
      return {
        totalOrders: 0,
        totalRevenue: '0.00',
        topCustomers: [],
        recentActivity: []
      };
    }
  }

  getTableNames(): { orders: string; rewards: string } {
    return {
      orders: this.ordersTableName,
      rewards: this.rewardsTableName
    };
  }
}

// Initialize with Base network configuration
const tablelandConfig: TablelandConfig = {
  chainId: 8453, // Base mainnet
  privateKey: process.env.TABLELAND_PRIVATE_KEY || '',
  rpcUrl: process.env.BASE_RPC_URL || 'https://mainnet.base.org'
};

export const tablelandDB = new TablelandDatabaseService(tablelandConfig);