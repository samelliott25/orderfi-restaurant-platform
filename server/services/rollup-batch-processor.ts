interface OrderBatch {
  id: string;
  orders: string[];
  restaurantId: number;
  batchSize: number;
  totalValue: string;
  status: 'pending' | 'processing' | 'submitted' | 'confirmed' | 'failed';
  createdAt: number;
  submittedAt?: number;
  confirmedAt?: number;
  transactionHash?: string;
  gasUsed?: string;
  errorMessage?: string;
}

interface BatchMetrics {
  totalBatches: number;
  pendingOrders: number;
  processedOrders: number;
  averageBatchSize: number;
  averageProcessingTime: number;
  gasSavings: string;
}

class RollupBatchProcessor {
  private batches: Map<string, OrderBatch> = new Map();
  private pendingOrders: Map<string, any> = new Map();
  private batchingEnabled: boolean = true;
  private maxBatchSize: number = 50;
  private batchTimeout: number = 30000; // 30 seconds
  private processingInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startBatchProcessing();
  }

  private startBatchProcessing(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
    }

    this.processingInterval = setInterval(async () => {
      await this.processPendingBatches();
    }, this.batchTimeout);
  }

  async addOrderToBatch(order: any): Promise<{ batchId?: string; immediate: boolean }> {
    if (!this.batchingEnabled) {
      // Process immediately for high-priority orders
      await this.processImmediateOrder(order);
      return { immediate: true };
    }

    this.pendingOrders.set(order.id, {
      ...order,
      addedToBatch: Date.now()
    });

    console.log(`Order ${order.id} added to batch queue (${this.pendingOrders.size} pending)`);

    // Check if we should create a batch immediately
    const restaurantOrders = Array.from(this.pendingOrders.values())
      .filter(o => o.restaurantId === order.restaurantId);

    if (restaurantOrders.length >= this.maxBatchSize) {
      const batchId = await this.createBatch(order.restaurantId);
      return { batchId, immediate: false };
    }

    return { immediate: false };
  }

  private async createBatch(restaurantId: number): Promise<string> {
    const restaurantOrders = Array.from(this.pendingOrders.entries())
      .filter(([, order]) => order.restaurantId === restaurantId)
      .slice(0, this.maxBatchSize);

    if (restaurantOrders.length === 0) {
      return '';
    }

    const batchId = `batch_${restaurantId}_${Date.now()}`;
    const orderIds = restaurantOrders.map(([id]) => id);
    const totalValue = restaurantOrders
      .reduce((sum, [, order]) => sum + parseFloat(order.total || '0'), 0)
      .toFixed(2);

    const batch: OrderBatch = {
      id: batchId,
      orders: orderIds,
      restaurantId,
      batchSize: orderIds.length,
      totalValue,
      status: 'pending',
      createdAt: Date.now()
    };

    this.batches.set(batchId, batch);

    // Remove orders from pending queue
    orderIds.forEach(orderId => {
      this.pendingOrders.delete(orderId);
    });

    console.log(`Created batch ${batchId} with ${orderIds.length} orders (total: $${totalValue})`);
    return batchId;
  }

  private async processPendingBatches(): Promise<void> {
    // Create batches for restaurants with pending orders
    const restaurantGroups = new Map<number, any[]>();
    
    Array.from(this.pendingOrders.values()).forEach(order => {
      const orders = restaurantGroups.get(order.restaurantId) || [];
      orders.push(order);
      restaurantGroups.set(order.restaurantId, orders);
    });

    // Create batches for restaurants with sufficient orders or old pending orders
    for (const [restaurantId, orders] of restaurantGroups) {
      const oldestOrder = orders.reduce((oldest, current) => 
        current.addedToBatch < oldest.addedToBatch ? current : oldest
      );

      const shouldBatch = orders.length >= 5 || // Minimum batch size
        (Date.now() - oldestOrder.addedToBatch) > this.batchTimeout; // Timeout reached

      if (shouldBatch) {
        await this.createBatch(restaurantId);
      }
    }

    // Process ready batches
    const readyBatches = Array.from(this.batches.values())
      .filter(batch => batch.status === 'pending');

    for (const batch of readyBatches) {
      await this.submitBatchToRollup(batch);
    }
  }

  private async submitBatchToRollup(batch: OrderBatch): Promise<void> {
    try {
      batch.status = 'processing';
      batch.submittedAt = Date.now();

      console.log(`Submitting batch ${batch.id} to Base rollup...`);

      // Simulate rollup submission to Base network
      const batchData = {
        batchId: batch.id,
        restaurantId: batch.restaurantId,
        orderIds: batch.orders,
        totalValue: batch.totalValue,
        timestamp: batch.createdAt,
        merkleRoot: this.generateMerkleRoot(batch.orders)
      };

      // Simulate blockchain transaction
      await this.simulateRollupTransaction(batchData);

      batch.status = 'submitted';
      batch.transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      batch.gasUsed = this.estimateGasSavings(batch.batchSize).toString();

      console.log(`Batch ${batch.id} submitted successfully (${batch.transactionHash})`);

      // Wait for confirmation (simulated)
      setTimeout(() => {
        batch.status = 'confirmed';
        batch.confirmedAt = Date.now();
        console.log(`Batch ${batch.id} confirmed on-chain`);
      }, 5000);

    } catch (error) {
      batch.status = 'failed';
      batch.errorMessage = error.message;
      console.error(`Batch ${batch.id} failed:`, error.message);

      // Retry failed orders individually
      await this.retryFailedBatchOrders(batch);
    }
  }

  private async simulateRollupTransaction(batchData: any): Promise<void> {
    // Simulate Base network transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate occasional failures
    if (Math.random() < 0.05) { // 5% failure rate
      throw new Error('Rollup submission failed: Network congestion');
    }
  }

  private generateMerkleRoot(orderIds: string[]): string {
    // Simplified merkle root generation
    const combined = orderIds.sort().join('');
    return `0x${Buffer.from(combined).toString('hex').padEnd(64, '0').substr(0, 64)}`;
  }

  private estimateGasSavings(batchSize: number): number {
    // Individual transaction: ~21,000 gas
    // Batch transaction: ~100,000 + (batchSize * 5,000) gas
    const individualGas = batchSize * 21000;
    const batchGas = 100000 + (batchSize * 5000);
    return Math.max(0, individualGas - batchGas);
  }

  private async retryFailedBatchOrders(batch: OrderBatch): Promise<void> {
    console.log(`Retrying ${batch.orders.length} orders from failed batch ${batch.id}`);
    
    // Add orders back to pending queue for individual processing
    for (const orderId of batch.orders) {
      // In a real implementation, would fetch order data and retry
      console.log(`Retrying order ${orderId} individually`);
    }
  }

  private async processImmediateOrder(order: any): Promise<void> {
    console.log(`Processing order ${order.id} immediately (high priority)`);
    
    // Submit individual transaction to blockchain
    try {
      await this.simulateRollupTransaction({
        orderId: order.id,
        restaurantId: order.restaurantId,
        totalValue: order.total,
        timestamp: Date.now()
      });
      
      console.log(`Order ${order.id} processed immediately`);
    } catch (error) {
      console.error(`Immediate order processing failed for ${order.id}:`, error.message);
      throw error;
    }
  }

  getBatchStatus(batchId: string): OrderBatch | undefined {
    return this.batches.get(batchId);
  }

  getRestaurantBatches(restaurantId: number): OrderBatch[] {
    return Array.from(this.batches.values())
      .filter(batch => batch.restaurantId === restaurantId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  getMetrics(): BatchMetrics {
    const batches = Array.from(this.batches.values());
    const pendingOrdersCount = this.pendingOrders.size;
    const processedOrders = batches.reduce((sum, batch) => 
      batch.status === 'confirmed' ? sum + batch.batchSize : sum, 0);
    
    const confirmedBatches = batches.filter(b => b.status === 'confirmed');
    const averageBatchSize = confirmedBatches.length > 0 
      ? confirmedBatches.reduce((sum, b) => sum + b.batchSize, 0) / confirmedBatches.length
      : 0;

    const averageProcessingTime = confirmedBatches.length > 0
      ? confirmedBatches.reduce((sum, b) => 
          sum + ((b.confirmedAt || 0) - b.createdAt), 0) / confirmedBatches.length
      : 0;

    const totalGasSavings = confirmedBatches.reduce((sum, b) => 
      sum + parseInt(b.gasUsed || '0'), 0);

    return {
      totalBatches: batches.length,
      pendingOrders: pendingOrdersCount,
      processedOrders,
      averageBatchSize,
      averageProcessingTime,
      gasSavings: totalGasSavings.toString()
    };
  }

  async configureBatching(config: {
    enabled?: boolean;
    maxBatchSize?: number;
    timeoutMs?: number;
  }): Promise<void> {
    if (config.enabled !== undefined) {
      this.batchingEnabled = config.enabled;
      console.log(`Batching ${config.enabled ? 'enabled' : 'disabled'}`);
    }

    if (config.maxBatchSize !== undefined) {
      this.maxBatchSize = Math.max(1, Math.min(100, config.maxBatchSize));
      console.log(`Max batch size set to ${this.maxBatchSize}`);
    }

    if (config.timeoutMs !== undefined) {
      this.batchTimeout = Math.max(5000, config.timeoutMs);
      console.log(`Batch timeout set to ${this.batchTimeout}ms`);
      
      // Restart processing with new timeout
      this.startBatchProcessing();
    }
  }

  stop(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
  }
}

export const rollupBatchProcessor = new RollupBatchProcessor();