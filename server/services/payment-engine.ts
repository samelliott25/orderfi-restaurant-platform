import { storage } from '../storage';
import { rewardEngine } from './reward-engine';

export interface PaymentRequest {
  orderId: number;
  amount: string;
  currency: 'USD' | 'USDC' | 'ETH';
  method: 'stripe' | 'crypto' | 'cash';
  customerWallet?: string;
  customerId: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  blockchainHash?: string;
  receiptUrl?: string;
  error?: string;
}

export interface CryptoPayment {
  walletAddress: string;
  amount: string;
  token: 'USDC' | 'ETH';
  network: 'base' | 'polygon' | 'ethereum';
  txHash: string;
}

class PaymentEngine {
  private pendingPayments = new Map<string, PaymentRequest>();
  private completedPayments = new Map<string, PaymentResult>();

  // Initialize payment for order
  async initializePayment(paymentRequest: PaymentRequest): Promise<{ paymentId: string; clientSecret?: string }> {
    const paymentId = `pay_${Date.now()}_${paymentRequest.orderId}`;
    this.pendingPayments.set(paymentId, paymentRequest);

    console.log(`✓ Payment initialized: ${paymentId} for $${paymentRequest.amount}`);
    
    // For Stripe payments, return client secret (would integrate with actual Stripe)
    if (paymentRequest.method === 'stripe') {
      return {
        paymentId,
        clientSecret: `pi_${paymentId}_secret`
      };
    }

    return { paymentId };
  }

  // Process Stripe payment
  async processStripePayment(paymentId: string, stripeToken: string): Promise<PaymentResult> {
    const payment = this.pendingPayments.get(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    try {
      // Simulate Stripe payment processing
      // In production: const charge = await stripe.charges.create({...})
      const mockStripeResponse = {
        id: `ch_${Date.now()}`,
        status: 'succeeded',
        receipt_url: `https://pay.stripe.com/receipts/${paymentId}`
      };

      const result: PaymentResult = {
        success: true,
        transactionId: mockStripeResponse.id,
        receiptUrl: mockStripeResponse.receipt_url
      };

      await this.completePayment(paymentId, result);
      return result;

    } catch (error) {
      const result: PaymentResult = {
        success: false,
        transactionId: '',
        error: error.message
      };
      
      this.completedPayments.set(paymentId, result);
      return result;
    }
  }

  // Process crypto payment
  async processCryptoPayment(paymentId: string, cryptoData: CryptoPayment): Promise<PaymentResult> {
    const payment = this.pendingPayments.get(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    try {
      // Verify blockchain transaction
      const isValidTransaction = await this.verifyBlockchainTransaction(cryptoData);
      
      if (!isValidTransaction) {
        throw new Error('Invalid blockchain transaction');
      }

      const result: PaymentResult = {
        success: true,
        transactionId: cryptoData.txHash,
        blockchainHash: cryptoData.txHash,
        receiptUrl: `https://${cryptoData.network}.etherscan.io/tx/${cryptoData.txHash}`
      };

      await this.completePayment(paymentId, result);
      return result;

    } catch (error) {
      const result: PaymentResult = {
        success: false,
        transactionId: '',
        error: error.message
      };
      
      this.completedPayments.set(paymentId, result);
      return result;
    }
  }

  // Process cash payment (for in-person orders)
  async processCashPayment(paymentId: string): Promise<PaymentResult> {
    const payment = this.pendingPayments.get(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    const result: PaymentResult = {
      success: true,
      transactionId: `cash_${Date.now()}`,
      receiptUrl: undefined
    };

    await this.completePayment(paymentId, result);
    return result;
  }

  // Complete payment and update order
  private async completePayment(paymentId: string, result: PaymentResult): Promise<void> {
    const payment = this.pendingPayments.get(paymentId);
    if (!payment) return;

    if (result.success) {
      // Update order status to paid
      await storage.updateOrder(payment.orderId, {
        status: 'paid',
        paymentMethod: payment.method,
        transactionId: result.transactionId
      });

      // Process loyalty rewards
      await rewardEngine.processOrderReward(payment.orderId, payment.customerId);

      console.log(`✓ Payment completed: ${paymentId} - Order ${payment.orderId} marked as paid`);
    } else {
      // Update order status to payment failed
      await storage.updateOrder(payment.orderId, {
        status: 'payment_failed'
      });

      console.log(`✗ Payment failed: ${paymentId} - ${result.error}`);
    }

    this.completedPayments.set(paymentId, result);
    this.pendingPayments.delete(paymentId);
  }

  // Verify blockchain transaction (simplified)
  private async verifyBlockchainTransaction(cryptoData: CryptoPayment): Promise<boolean> {
    // In production, this would call actual blockchain RPC
    // For now, simulate verification based on transaction hash format
    const isValidHash = /^0x[a-fA-F0-9]{64}$/.test(cryptoData.txHash);
    const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(cryptoData.walletAddress);
    
    return isValidHash && isValidAddress && parseFloat(cryptoData.amount) > 0;
  }

  // Get payment status
  getPaymentStatus(paymentId: string): PaymentResult | null {
    return this.completedPayments.get(paymentId) || null;
  }

  // Get payment analytics for dashboard
  getPaymentAnalytics(): {
    totalRevenue: number;
    paymentMethodBreakdown: Record<string, number>;
    successRate: number;
    averageOrderValue: number;
  } {
    const completedPayments = Array.from(this.completedPayments.values());
    const successfulPayments = completedPayments.filter(p => p.success);
    
    const methodBreakdown: Record<string, number> = {};
    let totalRevenue = 0;

    for (const [paymentId, payment] of this.pendingPayments) {
      if (completedPayments.find(cp => cp.success)) {
        const method = payment.method;
        methodBreakdown[method] = (methodBreakdown[method] || 0) + 1;
        totalRevenue += parseFloat(payment.amount);
      }
    }

    return {
      totalRevenue,
      paymentMethodBreakdown: methodBreakdown,
      successRate: completedPayments.length > 0 ? 
        (successfulPayments.length / completedPayments.length) * 100 : 0,
      averageOrderValue: successfulPayments.length > 0 ? 
        totalRevenue / successfulPayments.length : 0
    };
  }

  // Handle payment webhook (for Stripe)
  async handleWebhook(payload: any, signature: string): Promise<void> {
    // In production: verify webhook signature with Stripe
    console.log('Processing payment webhook:', payload.type);
    
    if (payload.type === 'payment_intent.succeeded') {
      const paymentIntent = payload.data.object;
      // Find matching payment and complete it
      // Implementation would depend on how payment IDs are mapped
    }
  }
}

export const paymentEngine = new PaymentEngine();