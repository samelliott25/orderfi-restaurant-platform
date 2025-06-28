import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Basic middleware only
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));

// Simple health check
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

(async () => {
  try {
    // Register routes first
    await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      console.error('Server error:', err);
    });

    // Create HTTP server from Express app
    const { createServer } = await import('http');
    const server = createServer(app);

    // Setup Vite or static serving
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Start the server
    const port = 5000;
    
    server.listen(port, "0.0.0.0", () => {
      log(`✓ Server successfully bound to port ${port}`);
      log(`✓ App available at http://localhost:${port}`);
    }).on('error', (err: any) => {
      console.error('Server startup error:', err);
      if (err.code === 'EADDRINUSE') {
        log(`Port ${port} is busy, attempting to kill existing processes...`);
        process.exit(1);
      } else {
        throw err;
      }
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
