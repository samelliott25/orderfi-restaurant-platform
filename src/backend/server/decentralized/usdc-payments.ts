// Circle USDC integration for crypto-native payments
// Base and Polygon networks with native USDC support

export interface USDCPayment {
  paymentId: string;
  orderId: string;
  amount: string; // USDC amount in wei (6 decimals)
  recipient: string; // Restaurant wallet address
  sender: string; // Customer wallet address
  network: 'base' | 'polygon' | 'ethereum';
  status: 'pending' | 'confirmed' | 'failed';
  transactionHash?: string;
  blockNumber?: number;
  gasUsed?: string;
  timestamp: number;
}

export interface PaymentRequest {
  orderId: string;
  amount: number; // Dollar amount
  customerWallet: string;
  restaurantWallet: string;
  network: 'base' | 'polygon';
  metadata?: {
    items: string[];
    tip?: number;
    taxes?: number;
  };
}

export class USDCPaymentService {
  private contractAddresses = {
    base: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
    polygon: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC on Polygon
    ethereum: '0xA0b86a33E6441a71508c6E8e6b4e0D20a92b6eE2' // USDC on Ethereum
  };

  private rpcUrls = {
    base: process.env.BASE_RPC_URL || 'https://mainnet.base.org',
    polygon: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
    ethereum: process.env.ETHEREUM_RPC_URL || 'https://mainnet.infura.io/v3/your-key'
  };

  async initiatePayment(request: PaymentRequest): Promise<USDCPayment> {
    try {
      const amountInWei = this.dollarToUSDCWei(request.amount);
      const contractAddress = this.contractAddresses[request.network];

      const payment: USDCPayment = {
        paymentId: `usdc_${Date.now()}_${request.orderId}`,
        orderId: request.orderId,
        amount: amountInWei,
        recipient: request.restaurantWallet,
        sender: request.customerWallet,
        network: request.network,
        status: 'pending',
        timestamp: Date.now()
      };

      // Generate transaction data for frontend wallet interaction
      const transactionData = {
        to: contractAddress,
        data: this.encodeTransferData(request.restaurantWallet, amountInWei),
        value: '0x0', // No ETH transfer, only USDC
        gas: '0x5208', // 21000 gas limit for basic transfer
        gasPrice: await this.getOptimalGasPrice(request.network)
      };

      console.log('USDC payment initiated:', payment);
      console.log('Transaction data for wallet:', transactionData);

      // Store payment record
      await this.storePaymentRecord(payment);

      return payment;
    } catch (error) {
      console.error('Payment initiation failed:', error);
      throw error;
    }
  }

  async confirmPayment(paymentId: string, transactionHash: string): Promise<USDCPayment> {
    try {
      const payment = await this.getPayment(paymentId);
      if (!payment) {
        throw new Error('Payment not found');
      }

      // Verify transaction on blockchain
      const receipt = await this.getTransactionReceipt(transactionHash, payment.network);
      
      if (receipt && receipt.status === '0x1') {
        payment.status = 'confirmed';
        payment.transactionHash = transactionHash;
        payment.blockNumber = parseInt(receipt.blockNumber, 16);
        payment.gasUsed = receipt.gasUsed;

        // Update payment record
        await this.updatePaymentRecord(payment);

        // Trigger order fulfillment
        await this.triggerOrderFulfillment(payment.orderId);

        console.log('Payment confirmed:', payment);
        return payment;
      } else {
        payment.status = 'failed';
        await this.updatePaymentRecord(payment);
        throw new Error('Transaction failed or not found');
      }
    } catch (error) {
      console.error('Payment confirmation failed:', error);
      throw error;
    }
  }

  async getPaymentStatus(paymentId: string): Promise<USDCPayment | null> {
    try {
      return await this.getPayment(paymentId);
    } catch (error) {
      console.error('Failed to get payment status:', error);
      return null;
    }
  }

  async processRefund(paymentId: string, refundAmount?: number): Promise<USDCPayment> {
    try {
      const originalPayment = await this.getPayment(paymentId);
      if (!originalPayment || originalPayment.status !== 'confirmed') {
        throw new Error('Invalid payment for refund');
      }

      const refundAmountWei = refundAmount 
        ? this.dollarToUSDCWei(refundAmount)
        : originalPayment.amount;

      const refundPayment: USDCPayment = {
        paymentId: `refund_${Date.now()}_${paymentId}`,
        orderId: originalPayment.orderId,
        amount: refundAmountWei,
        recipient: originalPayment.sender, // Refund to original sender
        sender: originalPayment.recipient, // From restaurant wallet
        network: originalPayment.network,
        status: 'pending',
        timestamp: Date.now()
      };

      console.log('Refund initiated:', refundPayment);
      await this.storePaymentRecord(refundPayment);

      return refundPayment;
    } catch (error) {
      console.error('Refund processing failed:', error);
      throw error;
    }
  }

  private dollarToUSDCWei(dollarAmount: number): string {
    // USDC has 6 decimals, so $1.00 = 1,000,000 wei
    return (dollarAmount * 1_000_000).toString();
  }

  private weiToUSDCDollar(weiAmount: string): number {
    return parseInt(weiAmount) / 1_000_000;
  }

  private encodeTransferData(to: string, amount: string): string {
    // ERC-20 transfer function signature: transfer(address,uint256)
    const functionSelector = '0xa9059cbb';
    const addressParam = to.toLowerCase().replace('0x', '').padStart(64, '0');
    const amountParam = parseInt(amount).toString(16).padStart(64, '0');
    
    return `${functionSelector}${addressParam}${amountParam}`;
  }

  private async getOptimalGasPrice(network: string): Promise<string> {
    try {
      // Get current gas prices for the network
      const rpcUrl = this.rpcUrls[network as keyof typeof this.rpcUrls];
      
      const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_gasPrice',
          params: [],
          id: 1
        })
      });

      const data = await response.json();
      return data.result || '0x5208';
    } catch (error) {
      console.error('Failed to get gas price:', error);
      return '0x5208'; // Fallback gas price
    }
  }

  private async getTransactionReceipt(txHash: string, network: string): Promise<any> {
    try {
      const rpcUrl = this.rpcUrls[network as keyof typeof this.rpcUrls];
      
      const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getTransactionReceipt',
          params: [txHash],
          id: 1
        })
      });

      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Failed to get transaction receipt:', error);
      return null;
    }
  }

  private async storePaymentRecord(payment: USDCPayment): Promise<void> {
    // Store in blockchain storage for immutability
    console.log('Storing payment record:', payment);
    // In production, this would write to IPFS or blockchain
  }

  private async updatePaymentRecord(payment: USDCPayment): Promise<void> {
    console.log('Updating payment record:', payment);
    // In production, this would update the stored record
  }

  private async getPayment(paymentId: string): Promise<USDCPayment | null> {
    // Retrieve from storage
    console.log('Retrieving payment:', paymentId);
    // In production, this would query from blockchain/IPFS
    return null;
  }

  private async triggerOrderFulfillment(orderId: string): Promise<void> {
    try {
      // Notify restaurant of confirmed payment
      console.log('Triggering order fulfillment for:', orderId);
      
      // Send webhook to restaurant POS system
      const fulfillmentData = {
        orderId,
        status: 'payment_confirmed',
        timestamp: Date.now()
      };

      // In production, this would integrate with restaurant systems
      console.log('Order fulfillment triggered:', fulfillmentData);
    } catch (error) {
      console.error('Order fulfillment trigger failed:', error);
    }
  }

  async getBulkPaymentStats(restaurantId: string, timeframe: number): Promise<any> {
    return {
      totalVolume: 0,
      transactionCount: 0,
      averageOrderValue: 0,
      networkBreakdown: {
        base: { volume: 0, count: 0 },
        polygon: { volume: 0, count: 0 }
      },
      refundRate: 0
    };
  }
}

export const usdcPayments = new USDCPaymentService();