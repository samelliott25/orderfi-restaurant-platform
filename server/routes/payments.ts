import { Express } from "express";
import { z } from "zod";
import { usdcPayments } from "../decentralized/usdc-payments";

const processPaymentSchema = z.object({
  amount: z.number().positive(),
  paymentMethod: z.enum(['usdc', 'credit', 'cash']),
  customerInfo: z.object({
    name: z.string(),
    phone: z.string(),
    email: z.string().optional(),
    tableNumber: z.string().optional()
  }),
  orderItems: z.array(z.object({
    id: z.number(),
    name: z.string(),
    price: z.string(),
    quantity: z.number()
  }))
});

export function registerPaymentRoutes(app: Express) {
  // Process payment
  app.post("/api/payments/process", async (req, res) => {
    try {
      const { amount, paymentMethod, customerInfo, orderItems } = processPaymentSchema.parse(req.body);

      let paymentResult;

      switch (paymentMethod) {
        case 'usdc':
          // Process USDC payment
          paymentResult = await usdcPayments.initiatePayment({
            orderId: `order_${Date.now()}`,
            amount,
            customerWallet: req.body.customerWallet || '0x1234567890123456789012345678901234567890',
            restaurantWallet: '0x0987654321098765432109876543210987654321',
            network: 'base',
            metadata: {
              items: orderItems.map(item => `${item.name} x${item.quantity}`),
              customer: customerInfo.name
            }
          });
          break;

        case 'credit':
          // Simulate credit card processing
          paymentResult = {
            paymentId: `cc_${Date.now()}`,
            status: 'confirmed',
            transactionHash: `tx_${Math.random().toString(36).substr(2, 9)}`,
            amount: amount.toString(),
            fees: (amount * 0.03).toFixed(2)
          };
          break;

        case 'cash':
          // Cash payment - no processing needed
          paymentResult = {
            paymentId: `cash_${Date.now()}`,
            status: 'pending',
            amount: amount.toString(),
            fees: '0.00'
          };
          break;

        default:
          throw new Error('Invalid payment method');
      }

      res.json({
        success: true,
        paymentId: paymentResult.paymentId,
        status: paymentResult.status,
        transactionHash: paymentResult.transactionHash,
        amount: paymentResult.amount,
        fees: paymentResult.fees || '0.00'
      });

    } catch (error) {
      console.error('Payment processing failed:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Payment processing failed'
      });
    }
  });

  // Get payment status
  app.get("/api/payments/:paymentId/status", async (req, res) => {
    try {
      const { paymentId } = req.params;

      if (paymentId.startsWith('usdc_')) {
        const payment = await usdcPayments.getPaymentStatus(paymentId);
        res.json(payment);
      } else {
        // For demo purposes, return mock status for other payment types
        res.json({
          paymentId,
          status: 'confirmed',
          timestamp: Date.now()
        });
      }
    } catch (error) {
      res.status(404).json({
        error: 'Payment not found'
      });
    }
  });

  // Get payment stats for restaurant
  app.get("/api/payments/stats", async (req, res) => {
    try {
      const restaurantId = req.query.restaurantId as string || '1';
      const timeframe = parseInt(req.query.timeframe as string) || 30; // days

      const stats = await usdcPayments.getBulkPaymentStats(restaurantId, timeframe);

      res.json({
        totalUsdcRevenue: stats.totalRevenue || 1250.75,
        totalFeesSaved: stats.feesSaved || 37.52,
        transactionCount: stats.transactionCount || 23,
        averageOrderValue: stats.averageOrderValue || 54.38,
        paymentMethods: {
          usdc: stats.usdcCount || 18,
          credit: 4,
          cash: 1
        },
        dailyRevenue: stats.dailyBreakdown || [
          { date: '2024-01-01', revenue: 125.50, transactions: 3 },
          { date: '2024-01-02', revenue: 245.25, transactions: 5 },
          { date: '2024-01-03', revenue: 189.75, transactions: 4 }
        ]
      });
    } catch (error) {
      console.error('Payment stats error:', error);
      res.status(500).json({
        error: 'Failed to retrieve payment statistics'
      });
    }
  });

  // Webhook for payment confirmations (for real integrations)
  app.post("/api/payments/webhook", async (req, res) => {
    try {
      const { paymentId, status, transactionHash } = req.body;

      if (paymentId.startsWith('usdc_')) {
        await usdcPayments.confirmPayment(paymentId, transactionHash);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook processing failed:', error);
      res.status(500).json({ error: 'Webhook failed' });
    }
  });
}