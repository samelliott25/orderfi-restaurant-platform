import { Router, Request, Response } from "express";
import { getUncachableStripeClient, getStripePublishableKey } from "./stripeClient";
import { sessions } from "./voice-routes";

export const paymentRouter = Router();

// Get Stripe publishable key for client
paymentRouter.get("/config", async (_req: Request, res: Response) => {
  try {
    const publishableKey = await getStripePublishableKey();
    res.json({ publishableKey });
  } catch (error) {
    res.status(500).json({ error: "Failed to get Stripe config" });
  }
});

// Create payment intent for order - amount calculated SERVER-SIDE from session
paymentRouter.post("/create-intent", async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "Missing session ID" });
    }

    // Get session data server-side
    const session = sessions.get(sessionId);
    if (!session || session.currentOrder.length === 0) {
      return res.status(400).json({ error: "No items in order" });
    }

    // Calculate total SERVER-SIDE - never trust client amount
    const subtotal = session.currentOrder.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    if (total <= 0) {
      return res.status(400).json({ error: "Invalid order total" });
    }

    const stripe = await getUncachableStripeClient();
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Convert to cents
      currency: "usd",
      metadata: {
        sessionId,
        orderItems: JSON.stringify(session.currentOrder.map(i => ({
          name: i.name,
          qty: i.quantity,
          price: i.price
        }))),
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      total: total.toFixed(2),
    });
  } catch (error: any) {
    console.error("Payment intent error:", error);
    res.status(500).json({ error: error.message || "Failed to create payment" });
  }
});

// Confirm payment was successful
paymentRouter.post("/confirm", async (req: Request, res: Response) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: "Missing payment intent ID" });
    }

    const stripe = await getUncachableStripeClient();
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      res.json({
        success: true,
        sessionId: paymentIntent.metadata.sessionId,
      });
    } else {
      res.json({
        success: false,
        status: paymentIntent.status,
      });
    }
  } catch (error: any) {
    console.error("Payment confirm error:", error);
    res.status(500).json({ error: error.message || "Failed to confirm payment" });
  }
});
