import express, { type Request, Response } from "express";
import cors from "cors";
import path from "path";
import crypto from "crypto";
import session from "express-session";
import { voiceRouter } from "./voice-routes";
import { paymentRouter } from "./payment-routes";
import { adminRouter } from "./admin-routes";

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Serve static files (voice client)
app.use(express.static(path.join(process.cwd(), "public")));

// Initialize auth and routes
async function initializeApp() {
  const isReplit = !!(process.env.REPL_ID && process.env.DATABASE_URL);

  if (isReplit) {
    // Full Replit Auth + Object Storage when running on Replit
    const { setupAuth, registerAuthRoutes } = await import("./replit_integrations/auth");
    const { registerObjectStorageRoutes } = await import("./replit_integrations/object_storage");
    await setupAuth(app);
    registerAuthRoutes(app);
    registerObjectStorageRoutes(app);
    console.log("[auth] Replit Auth enabled");
  } else {
    // Lightweight local session (no DB, no OIDC)
    const secret = process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");
    app.use(session({
      secret,
      resave: false,
      saveUninitialized: false,
      cookie: { httpOnly: true, secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 },
    }));
    console.log("[auth] Running in local mode (no Replit Auth)");
  }
  
  // Health check
  app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", service: "OrderFi Voice API" });
  });

  // Voice ordering API
  app.use("/api/voice", voiceRouter);

  // Payment API
  app.use("/api/payment", paymentRouter);
  
  // Admin API (protected)
  app.use("/api/admin", adminRouter);

  // Menu API (minimal - public)
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

  // Serve admin page
  app.get("/admin", (_req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), "public", "admin.html"));
  });

  // Serve order page
  app.get("/order", (_req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), "public", "order.html"));
  });

  // Serve landing page for root and other routes
  app.get("*", (_req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), "public", "index.html"));
  });

  const PORT = parseInt(process.env.PORT || "5000", 10);
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`OrderFi Voice API running on port ${PORT}`);
  });
}

initializeApp().catch(console.error);
