import express, { type Request, Response } from "express";
import cors from "cors";
import path from "path";
import crypto from "crypto";
import session from "express-session";
import { voiceRouter } from "./voice-routes";
import { paymentRouter } from "./payment-routes";
import { adminRouter } from "./admin-routes";
import { setupRouter } from "./setup-routes";

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Serve static files
app.use(express.static(path.join(process.cwd(), "public")));

// Initialize auth and routes
async function initializeApp() {
  const isReplit = !!(process.env.REPL_ID && process.env.DATABASE_URL);

  if (isReplit) {
    const { setupAuth, registerAuthRoutes } = await import("./replit_integrations/auth");
    const { registerObjectStorageRoutes } = await import("./replit_integrations/object_storage");
    await setupAuth(app);
    registerAuthRoutes(app);
    registerObjectStorageRoutes(app);
    console.log("[auth] Replit Auth enabled");
  } else {
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
    res.json({ status: "ok", service: "OrderFi Platform" });
  });

  // API Routes
  app.use("/api/voice", voiceRouter);
  app.use("/api/payment", paymentRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api", setupRouter);

  // Public menu API (backward compatible)
  app.get("/api/menu", async (_req: Request, res: Response) => {
    try {
      const { storage } = await import("./storage");
      const menuItems = await storage.getMenuItems(1);
      res.json(menuItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch menu" });
    }
  });

  // Orders API (backward compatible)
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

  // Page routes
  app.get("/admin", (_req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), "public", "admin.html"));
  });

  app.get("/order", (_req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), "public", "order.html"));
  });

  app.get("/setup", (_req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), "public", "setup.html"));
  });

  app.get("/kitchen", (_req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), "public", "kitchen.html"));
  });

  // Customer menu page - /menu/:slug serves the menu.html SPA
  app.get("/menu/:slug", (_req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), "public", "menu.html"));
  });

  // Order tracking page
  app.get("/track/:orderId", (_req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), "public", "track.html"));
  });

  // PWA manifest
  app.get("/manifest.json", (_req: Request, res: Response) => {
    res.json({
      name: "OrderFi",
      short_name: "OrderFi",
      description: "Scan. Order. Pay. The smart restaurant ordering platform.",
      start_url: "/",
      display: "standalone",
      background_color: "#FFF9F5",
      theme_color: "#E23D28",
      icons: [
        { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
    });
  });

  // Landing page for root and other routes
  app.get("*", (_req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), "public", "index.html"));
  });

  const PORT = parseInt(process.env.PORT || "5000", 10);
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`OrderFi Platform running on port ${PORT}`);
  });
}

initializeApp().catch(console.error);
