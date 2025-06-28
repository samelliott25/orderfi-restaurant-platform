import type { Express } from "express";
import { paymentEngine } from "../services/payment-engine";

export async function registerPaymentRoutes(app: Express): Promise<void> {
  // Initialize payment for order
  app.post("/api/payments/initialize", async (req, res) => {
    try {
      const { orderId, amount, currency, method, customerWallet, customerId } = req.body;
      
      if (!orderId || !amount || !method || !customerId) {
        return res.status(400).json({ error: "Missing required payment parameters" });
      }

      const paymentRequest = { 
        orderId: parseInt(orderId), 
        amount: amount.toString(), 
        currency: currency || 'USD', 
        method, 
        customerWallet, 
        customerId 
      };
      
      const result = await paymentEngine.initializePayment(paymentRequest);
      res.json(result);
    } catch (error: any) {
      console.error('Payment initialization failed:', error);
      res.status(400).json({ error: error.message });
    }
  });

  // Process Stripe payment
  app.post("/api/payments/stripe", async (req, res) => {
    try {
      const { paymentId, stripeToken } = req.body;
      
      if (!paymentId || !stripeToken) {
        return res.status(400).json({ error: "Payment ID and Stripe token required" });
      }

      const result = await paymentEngine.processStripePayment(paymentId, stripeToken);
      res.json(result);
    } catch (error: any) {
      console.error('Stripe payment failed:', error);
      res.status(400).json({ error: error.message });
    }
  });

  // Process crypto payment
  app.post("/api/payments/crypto", async (req, res) => {
    try {
      const { paymentId, cryptoData } = req.body;
      
      if (!paymentId || !cryptoData) {
        return res.status(400).json({ error: "Payment ID and crypto data required" });
      }

      const result = await paymentEngine.processCryptoPayment(paymentId, cryptoData);
      res.json(result);
    } catch (error: any) {
      console.error('Crypto payment failed:', error);
      res.status(400).json({ error: error.message });
    }
  });

  // Process cash payment (for in-person orders)
  app.post("/api/payments/cash", async (req, res) => {
    try {
      const { paymentId } = req.body;
      
      if (!paymentId) {
        return res.status(400).json({ error: "Payment ID required" });
      }

      const result = await paymentEngine.processCashPayment(paymentId);
      res.json(result);
    } catch (error: any) {
      console.error('Cash payment failed:', error);
      res.status(400).json({ error: error.message });
    }
  });

  // Get payment status
  app.get("/api/payments/:paymentId/status", async (req, res) => {
    try {
      const { paymentId } = req.params;
      const status = paymentEngine.getPaymentStatus(paymentId);
      
      if (!status) {
        return res.status(404).json({ error: "Payment not found" });
      }
      
      res.json(status);
    } catch (error: any) {
      console.error('Payment status check failed:', error);
      res.status(400).json({ error: error.message });
    }
  });

  // Get payment analytics for dashboard
  app.get("/api/payments/analytics", async (req, res) => {
    try {
      const analytics = paymentEngine.getPaymentAnalytics();
      res.json(analytics);
    } catch (error: any) {
      console.error('Payment analytics failed:', error);
      res.status(500).json({ error: "Failed to get payment analytics" });
    }
  });

  // Handle payment webhooks (for Stripe)
  app.post("/api/payments/webhook", async (req, res) => {
    try {
      const signature = req.headers['stripe-signature'] as string;
      await paymentEngine.handleWebhook(req.body, signature);
      res.json({ received: true });
    } catch (error: any) {
      console.error('Payment webhook failed:', error);
      res.status(400).json({ error: error.message });
    }
  });
}