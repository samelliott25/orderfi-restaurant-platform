import express, { type Request, Response } from "express";
import cors from "cors";
import path from "path";
import { voiceRouter } from "./voice-routes";
import { paymentRouter } from "./payment-routes";

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Serve static files (voice client)
app.use(express.static(path.join(process.cwd(), "public")));

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", service: "OrderFi Voice API" });
});

// Voice ordering API
app.use("/api/voice", voiceRouter);

// Payment API
app.use("/api/payment", paymentRouter);

// Menu API (minimal)
app.get("/api/menu", async (_req: Request, res: Response) => {
  try {
    const { storage } = await import("./storage");
    const menuItems = await storage.getMenuItems(1);
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch menu" });
  }
});

// Orders API (minimal)
app.post("/api/orders", async (req: Request, res: Response) => {
  try {
    const { storage } = await import("./storage");
    const order = await storage.createOrder(req.body);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to create order" });
  }
});

app.get("/api/orders/:id", async (req: Request, res: Response) => {
  try {
    const { storage } = await import("./storage");
    const order = await storage.getOrder(parseInt(req.params.id));
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

// Serve voice client for all other routes
app.get("*", (_req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

const PORT = parseInt(process.env.PORT || "5000", 10);
app.listen(PORT, "0.0.0.0", () => {
  console.log(`OrderFi Voice API running on port ${PORT}`);
});
