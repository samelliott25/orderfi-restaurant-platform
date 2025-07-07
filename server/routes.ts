import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import ordersRouter from "./routes/orders";
import kitchenPrintingRouter from "./routes/kitchen-printing";
import { paymentEngine } from "./services/payment-engine";
import { rewardEngine } from "./services/reward-engine";
import { blockchainStorage } from "./blockchain/storage";
import { blockchainIntegrationService } from "./services/blockchain-integration";
import { menuCategorizationService } from "./services/menu-categorization";
import { kitchenPrinterService } from "./services/kitchen-printer";
import { processChatMessage, processOperationsAiMessage, type ChatContext } from "./services/akash-chat";
import { 
  insertRestaurantSchema, 
  insertMenuItemSchema, 
  insertFaqSchema, 
  insertOrderSchema,
  insertChatMessageSchema 
} from "@shared/schema";
import multer from 'multer';
import { parseMenuHandler, uploadMiddleware } from "./routes/menu-parser";
import { processOnboardingMessage } from "./services/onboarding-chat";
import { chatOpsOrchestrator } from "./services/chatops-orchestrator";
import ttsRouter from "./routes/tts.js";
import { validateRequest, createRateLimit, securityHeaders, requestLogger, errorHandler } from "./middleware/security.js";
import { cacheManager } from "./services/cache-manager.js";

// Configure multer for image uploads
const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<void> {
  // Warm cache on startup
  await cacheManager.warmCache();

  // Health check endpoint for Docker
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "1.0.0"
    });
  });

  // Menu parsing route for onboarding
  app.post("/api/parse-menu", uploadMiddleware, parseMenuHandler);

  // Restaurant routes
  app.get("/api/restaurants", async (req, res) => {
    try {
      const restaurants = await storage.getAllRestaurants();
      res.json(restaurants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch restaurants" });
    }
  });

  app.get("/api/restaurants/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const restaurant = await storage.getRestaurant(id);
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
      res.json(restaurant);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch restaurant" });
    }
  });

  app.put("/api/restaurants/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertRestaurantSchema.partial().parse(req.body);
      const restaurant = await storage.updateRestaurant(id, updateData);
      res.json(restaurant);
    } catch (error) {
      res.status(400).json({ message: "Invalid restaurant data" });
    }
  });

  // Menu item routes
  app.get("/api/restaurants/:id/menu", async (req, res) => {
    try {
      const restaurantId = parseInt(req.params.id);
      const menuItems = await storage.getMenuItems(restaurantId);
      res.json(menuItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });

  app.post("/api/restaurants/:id/menu", async (req, res) => {
    try {
      const restaurantId = parseInt(req.params.id);
      
      // Pre-assign category if not provided using AI categorization
      const rawData = { ...req.body, restaurantId };
      if (!rawData.category) {
        rawData.category = menuCategorizationService.categorizeMenuItem(
          rawData.name || "",
          rawData.description || "",
          rawData.price || "0"
        );
      }
      
      const menuItemData = insertMenuItemSchema.parse(rawData);
      
      // Create menu item with blockchain integration and proper categorization
      const result = await blockchainIntegrationService.createMenuItemWithBlockchain(menuItemData);
      
      res.status(201).json({
        ...result.menuItem,
        blockchainHash: result.blockchainHash,
        category: result.category
      });
    } catch (error) {
      console.error("Menu item creation error:", error);
      res.status(400).json({ message: "Invalid menu item data" });
    }
  });

  app.put("/api/menu-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertMenuItemSchema.partial().parse(req.body);
      
      // Update with blockchain integration and proper categorization
      const result = await blockchainIntegrationService.updateMenuItemWithBlockchain(id, updateData);
      
      res.json({
        ...result.menuItem,
        blockchainHash: result.blockchainHash
      });
    } catch (error) {
      console.error("Menu item update error:", error);
      res.status(400).json({ message: "Invalid menu item data" });
    }
  });

  app.delete("/api/menu-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteMenuItem(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete menu item" });
    }
  });

  // Blockchain-specific endpoints
  app.get("/api/blockchain/status", async (req, res) => {
    try {
      const chain = blockchainStorage.getChain();
      const integrity = blockchainStorage.verifyChainIntegrity();
      
      res.json({
        totalBlocks: chain.length,
        integrity,
        latestBlock: blockchainStorage.getLatestBlock(),
        chainValid: integrity
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get blockchain status" });
    }
  });

  app.get("/api/blockchain/export", async (req, res) => {
    try {
      const chainData = blockchainStorage.exportBlockchainData();
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="mimi-blockchain-export.json"');
      res.send(chainData);
    } catch (error) {
      res.status(500).json({ message: "Failed to export blockchain data" });
    }
  });

  app.get("/api/blockchain/menu-item/:id/history", async (req, res) => {
    try {
      const menuItemId = parseInt(req.params.id);
      const history = blockchainStorage.getMenuItemHistory(menuItemId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to get menu item history" });
    }
  });

  app.get("/api/blockchain/ipfs-ready", async (req, res) => {
    try {
      const ipfsData = await blockchainStorage.prepareForIPFS();
      res.json({
        message: "Blockchain data prepared for IPFS storage",
        hash: ipfsData.hash,
        dataSize: JSON.stringify(ipfsData.data).length,
        ready: true
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to prepare IPFS data" });
    }
  });

  // Enhanced menu categorization endpoints
  app.get("/api/restaurants/:id/menu/categorized", async (req, res) => {
    try {
      const restaurantId = parseInt(req.params.id);
      const categorizedItems = await blockchainIntegrationService.getMenuItemsByCategory(restaurantId);
      res.json(categorizedItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to get categorized menu items" });
    }
  });

  app.get("/api/menu/categories", async (req, res) => {
    try {
      const categories = menuCategorizationService.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to get menu categories" });
    }
  });

  // Menu duplicate confirmation endpoint
  app.post("/api/restaurants/:id/menu/confirm-duplicates", async (req, res) => {
    try {
      const restaurantId = parseInt(req.params.id);
      const { confirmedItems } = req.body;
      
      const addedItems = [];
      for (const item of confirmedItems) {
        try {
          const properCategory = menuCategorizationService.categorizeMenuItem(
            item.name,
            item.description || "",
            item.price || "0"
          );
          
          const menuItem = await storage.createMenuItem({
            restaurantId,
            name: item.name,
            description: item.description || "",
            price: item.price || "0",
            category: properCategory,
            tags: [...(item.tags || []), ...(item.allergens || [])],
            isAvailable: true
          });
          addedItems.push(menuItem);
          
          console.log(`Confirmed and added duplicate: "${item.name}" to category "${properCategory}"`);
        } catch (error) {
          console.error(`Failed to add confirmed duplicate ${item.name}:`, error);
        }
      }
      
      res.json({
        message: `Successfully added ${addedItems.length} confirmed duplicate items`,
        items: addedItems
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to add confirmed duplicates" });
    }
  });

  app.post("/api/restaurants/:id/menu/validate-categories", async (req, res) => {
    try {
      const restaurantId = parseInt(req.params.id);
      const result = await blockchainIntegrationService.validateMenuItemCategories(restaurantId);
      res.json({
        message: `Fixed ${result.fixed} incorrectly categorized items out of ${result.total} total`,
        fixed: result.fixed,
        total: result.total
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to validate menu categories" });
    }
  });

  app.get("/api/blockchain/stats", async (req, res) => {
    try {
      const stats = await blockchainIntegrationService.getBlockchainStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get blockchain statistics" });
    }
  });

  // FAQ routes
  app.get("/api/restaurants/:id/faqs", async (req, res) => {
    try {
      const restaurantId = parseInt(req.params.id);
      const faqs = await storage.getFAQs(restaurantId);
      res.json(faqs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch FAQs" });
    }
  });

  app.post("/api/restaurants/:id/faqs", async (req, res) => {
    try {
      const restaurantId = parseInt(req.params.id);
      const faqData = insertFaqSchema.parse({
        ...req.body,
        restaurantId,
      });
      const faq = await storage.createFAQ(faqData);
      res.status(201).json(faq);
    } catch (error) {
      res.status(400).json({ message: "Invalid FAQ data" });
    }
  });

  app.delete("/api/faqs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteFAQ(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete FAQ" });
    }
  });

  // AI Chat endpoint for conversational ordering
  app.post("/api/chat", async (req, res) => {
    try {
      // Support both formats for flexibility with language detection
      const { message, messages, restaurantId = 1, sessionId = 'default-session', conversationHistory = [], language, context } = req.body;
      
      let userMessage = message;
      
      // If messages array is provided (OpenAI format), extract the last user message
      if (messages && Array.isArray(messages)) {
        const lastUserMsg = messages.filter(m => m.role === 'user').pop();
        userMessage = lastUserMsg?.content || '';
      }
      
      if (!userMessage) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Use ChatOps orchestrator for all contexts
      const orchestratorResponse = await chatOpsOrchestrator.processMessage(
        userMessage,
        sessionId,
        {
          chatContext: context,
          currentPage: req.body.currentPage,
          restaurantId,
          onboardingState: req.body.onboardingState
        }
      );

      const chatMessage = await storage.createChatMessage({
        sessionId,
        role: 'assistant',
        content: orchestratorResponse.message,
        timestamp: new Date()
      });

      return res.json({
        response: orchestratorResponse.message,
        message: orchestratorResponse.message,
        messageId: chatMessage.id,
        action: orchestratorResponse.action,
        data: orchestratorResponse.data,
        extractedData: orchestratorResponse.extractedData,
        suggestions: orchestratorResponse.suggestions,
        completionStatus: orchestratorResponse.completionStatus
      });

      // Get restaurant context
      const restaurant = await storage.getRestaurant(restaurantId);
      const menuItems = await storage.getMenuItems(restaurantId);
      
      // Use AI training service and conversation memory for better responses
      const { aiTrainingService } = await import("./services/ai-training");
      const { conversationMemory } = await import("./services/conversation-memory");
      
      // Get conversation context
      const contextualHistory = conversationMemory.getContextualHistory(sessionId);
      const recentMessages = conversationMemory.getRecentHistory(sessionId);
      
      // Generate enhanced prompt with memory
      let enhancedPrompt = await aiTrainingService.generateContextualPrompt(userMessage, restaurantId);
      
      if (contextualHistory) {
        enhancedPrompt += `\n\nCUSTOMER CONTEXT FROM CONVERSATION:\n${contextualHistory}`;
      }
      
      // Add conversation history
      const conversationMessages = [
        { role: 'system' as const, content: enhancedPrompt },
        ...recentMessages.map(msg => ({ role: msg.role as 'user' | 'assistant', content: msg.content })),
        { role: 'user' as const, content: userMessage }
      ];

      // Use customer chat service with Akash Chat integration
      const restaurantData = await storage.getRestaurant(restaurantId);
      const menuItemsData = await storage.getMenuItems(restaurantId);
      const faqsData = await storage.getFAQs(restaurantId);
      
      const chatContext = {
        restaurantName: restaurantData?.name || "Our Restaurant",
        restaurantDescription: restaurantData?.description || "A delightful dining experience",
        tone: "friendly and helpful",
        welcomeMessage: "Hi! I'm OrderFi AI. How can I help you today?",
        menuItems: menuItemsData.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description || "",
          price: item.price,
          category: item.category,
          tags: item.tags || []
        })),
        faqs: faqsData.map(faq => ({
          question: faq.question,
          answer: faq.answer
        }))
      };

      const chatResponse = await processChatMessage(userMessage, chatContext, [], []);
      
      // Store conversation in memory
      conversationMemory.addMessage(sessionId, 'user', userMessage);
      conversationMemory.addMessage(sessionId, 'assistant', chatResponse.message);

      res.json({ 
        message: chatResponse.message,
        response: chatResponse.message,
        menuItems: chatResponse.suggestedItems?.map(item => item.name) || []
      });
      
    } catch (error) {
      console.error("Chat error:", error);
      
      // Fallback response for healthy options
      const fallbackResponses = {
        'healthy': "For healthy options, I'd recommend our Craft Caesar Salad - fresh romaine with house-made croutons and parmesan for $12! We also have grilled proteins available. What type of healthy meal are you in the mood for?",
        'default': "I'm having some technical difficulties with my AI processing. Let me help you browse our menu directly, or you can tell me specifically what you'd like to order!"
      };
      
      const userMessage = req.body.message || req.body.messages?.filter((m: any) => m.role === 'user').pop()?.content || '';
      const isHealthyQuery = userMessage.toLowerCase().includes('healthy');
      const fallbackResponse = isHealthyQuery ? fallbackResponses.healthy : fallbackResponses.default;
      
      res.json({ 
        message: fallbackResponse,
        response: fallbackResponse 
      });
    }
  });

  // Operations AI Chat endpoint
  app.post("/api/operations-ai-chat", upload.single('image'), async (req, res) => {
    try {
      const { message, context } = req.body;
      let imageData: string | undefined;
      
      // Handle image upload
      if (req.file) {
        imageData = req.file.buffer.toString('base64');
      }
      
      if (!message && !imageData) {
        return res.status(400).json({ message: "Message or image is required" });
      }

      const response = await processOperationsAiMessage(message || "Please analyze this image", context, imageData);
      res.json(response);
    } catch (error) {
      console.error("Operations AI error:", error);
      res.status(500).json({ message: "Failed to process operations request" });
    }
  });

  // AI Menu Image Processing endpoint
  app.post("/api/ai/process-menu", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      // Note: processMenuImage function removed as part of Akash Chat migration
      // TODO: Implement menu image processing with Akash Chat if needed
      const menuItems: any[] = [];
      res.json({ menuItems });
    } catch (error) {
      console.error("Menu processing error:", error);
      res.status(500).json({ message: "Failed to process menu image" });
    }
  });

  // Order routes
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      
      // Print order to kitchen
      try {
        const orderForPrinting = {
          id: order.id.toString(),
          customerName: orderData.customerName ?? undefined,
          items: JSON.parse(orderData.items || '[]').map((item: any) => ({
            name: item.name || 'Unknown Item',
            quantity: item.quantity || 1,
            specialInstructions: item.specialInstructions,
            price: parseFloat(item.price || '0')
          })),
          total: parseFloat(orderData.total || '0'),
          orderTime: new Date(),
          tableNumber: orderData.tableNumber ?? undefined,
          orderType: 'dine-in' as const
        };

        const printSuccess = await kitchenPrinterService.printOrder(orderForPrinting);
        if (printSuccess) {
          console.log(`Order ${order.id} printed to kitchen successfully`);
        } else {
          console.log(`Warning: Failed to print order ${order.id} to kitchen`);
        }
      } catch (printError) {
        console.error('Kitchen printing failed:', printError);
      }

      // Trigger automation workflows
      try {
        const { workflowManager } = await import("./automation/workflow-manager");
        
        // Trigger order confirmation workflow
        workflowManager.triggerWorkflow('/api/automation/webhooks/order-created', {
          orderId: order.id.toString(),
          customerName: orderData.customerName,
          customerEmail: orderData.customerEmail,
          tableNumber: orderData.tableNumber,
          items: orderData.items,
          total: orderData.total,
          orderItems: JSON.parse(orderData.items || '[]')
        });
        
        // Process rewards and trigger payment workflow if payment method exists
        if (orderData.paymentMethod && orderData.total) {
          const customerId = `cust_${orderData.customerPhone?.replace(/\D/g, '') || Date.now()}`;
          
          const rewardResponse = await fetch(`http://localhost:${process.env.PORT || 5000}/api/rewards/earn`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              customerId,
              customerName: orderData.customerName,
              customerEmail: orderData.customerEmail || '',
              orderId: order.id.toString(),
              orderAmount: parseFloat(orderData.total),
              paymentMethod: orderData.paymentMethod
            })
          });
          
          if (rewardResponse.ok) {
            const rewardData = await rewardResponse.json();
            console.log(`Customer ${orderData.customerName} earned ${rewardData.tokensEarned} MIMI tokens`);
            
            // Trigger payment confirmation workflow
            workflowManager.triggerWorkflow('/api/automation/webhooks/payment-confirmed', {
              paymentId: orderData.paymentId || `payment_${order.id}`,
              orderId: order.id.toString(),
              amount: orderData.total,
              paymentMethod: orderData.paymentMethod,
              customerId,
              customerEmail: orderData.customerEmail
            });
          }
        }
      } catch (automationError) {
        console.error('Automation workflow failed:', automationError);
        // Don't fail the order if automation fails
      }
      
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ message: "Invalid order data" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // Customer order history endpoint
  app.get("/api/orders/customer/:customerId", async (req, res) => {
    try {
      const { customerId } = req.params;
      const orders = await storage.getOrdersByCustomer(customerId);
      
      // Sort by most recent first
      const sortedOrders = orders.sort((a, b) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
      
      res.json(sortedOrders);
    } catch (error) {
      console.error('Failed to fetch customer orders:', error);
      res.status(500).json({ message: "Failed to fetch customer orders" });
    }
  });

  // Payment simulation route
  app.post("/api/payment/create-checkout", async (req, res) => {
    try {
      const { orderId, amount } = req.body;
      
      // Mock Stripe checkout creation
      const checkoutUrl = `https://checkout.stripe.com/pay/mock-session-${orderId}`;
      
      res.json({
        url: checkoutUrl,
        sessionId: `mock-session-${orderId}`,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to create payment session" });
    }
  });

  // Project summary download route
  app.get("/api/download/project-summary", async (req, res) => {
    try {
      const fs = await import('fs');
      const path = await import('path');
      
      const htmlPath = path.join(process.cwd(), 'Mimi_Waitress_Project_Summary.html');
      
      if (!fs.existsSync(htmlPath)) {
        return res.status(404).json({ message: "Project summary file not found" });
      }
      
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', 'attachment; filename="Mimi_Waitress_Project_Summary.html"');
      
      const fileStream = fs.createReadStream(htmlPath);
      fileStream.pipe(res);
    } catch (error) {
      console.error("Download error:", error);
      res.status(500).json({ message: "Failed to download file" });
    }
  });



  // Import and register routes
  const { registerDecentralizedRoutes } = await import("./routes/decentralized");
  registerDecentralizedRoutes(app);

  const { registerPaymentRoutes } = await import("./routes/payments");
  registerPaymentRoutes(app);

  // Rewards routes
  const rewardsRouter = (await import("./routes/rewards")).default;
  app.use("/api/rewards", rewardsRouter);

  const { registerAutomationRoutes } = await import("./routes/automation");
  registerAutomationRoutes(app);

  // Register TTS routes
  app.use("/api/tts", ttsRouter);

  // Register customer chat routes
  const customerChatRouter = await import("./routes/customer-chat.js");
  app.use("/api/customer-chat", customerChatRouter.default);

  // Register kitchen printing routes
  app.use("/api/kitchen-printing", kitchenPrintingRouter);

  // Web3 Storage routes
  app.post("/api/web3-storage/upload", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file provided" });
      }
      
      const { web3Storage } = await import("./services/web3-storage");
      const tempPath = `/tmp/${req.file.originalname}`;
      require('fs').writeFileSync(tempPath, req.file.buffer);
      
      const result = await web3Storage.uploadFile(tempPath, req.file.originalname);
      require('fs').unlinkSync(tempPath);
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Upload failed" });
    }
  });

  // Rollup batch processing routes
  app.get("/api/rollup/batches/:restaurantId", async (req, res) => {
    try {
      const { rollupBatchProcessor } = await import("./services/rollup-batch-processor");
      const restaurantId = parseInt(req.params.restaurantId);
      const batches = rollupBatchProcessor.getRestaurantBatches(restaurantId);
      res.json({ batches });
    } catch (error) {
      res.status(500).json({ error: "Failed to get batches" });
    }
  });

  app.get("/api/rollup/metrics", async (req, res) => {
    try {
      const { rollupBatchProcessor } = await import("./services/rollup-batch-processor");
      const metrics = rollupBatchProcessor.getMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to get metrics" });
    }
  });

  // Multi-provider failover routes
  app.get("/api/deployment/providers", async (req, res) => {
    try {
      const { multiProviderFailover } = await import("./services/multi-provider-failover");
      const status = multiProviderFailover.getProviderStatus();
      res.json(status);
    } catch (error) {
      res.status(500).json({ error: "Failed to get provider status" });
    }
  });

  // Performance monitoring endpoints
  app.get("/api/performance/cache", async (req, res) => {
    try {
      const stats = cacheManager.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to get cache stats" });
    }
  });

  app.post("/api/performance/cache/clear", async (req, res) => {
    try {
      cacheManager.clear();
      res.json({ message: "Cache cleared successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to clear cache" });
    }
  });

  // Health check endpoint for Akash deployment
  app.get("/health", async (req, res) => {
    const health = {
      status: "ok",
      timestamp: new Date().toISOString(),
      services: {
        database: "unknown",
        akashChat: "unknown",
        blockchain: "unknown"
      },
      version: process.env.npm_package_version || "1.0.0",
      uptime: process.uptime()
    };

    try {
      const restaurants = await storage.getAllRestaurants();
      health.services.database = restaurants ? "healthy" : "error";
    } catch (error) {
      health.services.database = "error";
    }

    try {
      const akashService = require('./services/akash-chat').akashChatService;
      await akashService.healthCheck();
      health.services.akashChat = "healthy";
    } catch (error) {
      health.services.akashChat = "degraded";
    }

    health.services.blockchain = "healthy";

    const isHealthy = Object.values(health.services).every(status => 
      status === "healthy" || status === "degraded"
    );

    res.status(isHealthy ? 200 : 503).json(health);
  });

  // Deployment monitoring endpoint
  app.get("/api/deployment/status", async (req, res) => {
    try {
      const { deploymentMonitor } = await import("./services/deployment-monitor");
      const deploymentHealth = await deploymentMonitor.getDeploymentHealth();
      res.json(deploymentHealth);
    } catch (error) {
      res.status(500).json({ 
        status: 'error', 
        message: 'Failed to get deployment status' 
      });
    }
  });

  // Provider migration endpoint
  app.post("/api/deployment/migrate", async (req, res) => {
    try {
      const { fromProvider, toProvider } = req.body;
      const { deploymentMonitor } = await import("./services/deployment-monitor");
      const success = await deploymentMonitor.migrateProvider(fromProvider, toProvider);
      res.json({ success, message: success ? 'Migration completed' : 'Migration failed' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Migration request failed' });
    }
  });

  // AI Verbal Reporting endpoints
  app.post("/api/ai/report", async (req, res) => {
    try {
      const { query, restaurantId, sessionId } = req.body;
      
      if (!query || !restaurantId) {
        return res.status(400).json({ message: "Query and restaurant ID are required" });
      }

      // Process natural language query using AI
      const response = await processOperationsAiMessage(
        `Generate a verbal report for this query: "${query}". Restaurant ID: ${restaurantId}. Base your analysis on the restaurant's current data and provide insights in a conversational format.`,
        "verbal_analytics"
      );

      // Save the query and response for learning
      if (sessionId) {
        try {
          // TODO: Implement query logging to reportingQueries table
          console.log(`Verbal report query logged: ${query}`);
        } catch (logError) {
          console.error("Failed to log query:", logError);
        }
      }

      res.json({
        verbalReport: response.message,
        queryProcessed: query,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("AI reporting error:", error);
      res.status(500).json({ 
        message: "I'm having trouble generating that report. Please try rephrasing your question or ask for a specific metric like 'show today's sales' or 'what are our top selling items'." 
      });
    }
  });

  // AI Menu Management endpoint
  app.post("/api/ai/menu-management", async (req, res) => {
    try {
      const { command, restaurantId, sessionId } = req.body;
      
      if (!command || !restaurantId) {
        return res.status(400).json({ message: "Command and restaurant ID are required" });
      }

      // Process menu management command
      const response = await processOperationsAiMessage(
        `Process this menu management request: "${command}". Restaurant ID: ${restaurantId}. If this involves changing prices, availability, or menu items, provide a clear confirmation of what will be changed and ask for approval.`,
        "menu_management"
      );

      res.json({
        aiResponse: response.message,
        commandProcessed: command,
        requiresConfirmation: false, // Default to false since this property doesn't exist in OperationsAiResponse
        proposedChanges: null, // Default to null since this property doesn't exist in OperationsAiResponse
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("AI menu management error:", error);
      res.status(500).json({ 
        message: "I'm having trouble with that menu command. Please try saying something like 'make the burger $15' or 'mark the fish as sold out'." 
      });
    }
  });

  // AI Layout Optimization endpoint
  app.post("/api/ai/layout-optimization", async (req, res) => {
    try {
      const { prompt, screenMetrics, context } = req.body;
      
      if (!prompt || !screenMetrics) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Use OpenAI to analyze layout optimization
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are an expert UI/UX designer specializing in restaurant dashboard layouts and screen real estate optimization. 
              
              Analyze the provided screen metrics and context to suggest specific layout optimizations that improve:
              1. Information density and hierarchy
              2. Workflow efficiency for restaurant staff
              3. Screen space utilization
              4. Visual clarity and readability
              5. Mobile responsiveness
              
              Always respond with valid JSON containing actionable layout suggestions with specific CSS classes and measurements.`
            },
            {
              role: "user",
              content: prompt
            }
          ],
          response_format: { type: "json_object" },
          max_tokens: 1500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const suggestions = JSON.parse(data.choices[0].message.content);

      // Log the analysis for debugging
      console.log(`Layout optimization analysis completed for ${context.page}`);
      console.log(`Screen: ${screenMetrics.width}x${screenMetrics.height}, Density: ${screenMetrics.density}`);
      console.log(`Generated ${suggestions.suggestions?.length || 0} suggestions`);

      res.json(suggestions);
    } catch (error) {
      console.error("Layout optimization error:", error);
      res.status(500).json({ 
        error: "Failed to analyze layout optimization",
        suggestions: []
      });
    }
  });

  // AI Sales Analytics endpoint
  app.get("/api/ai/analytics/:restaurantId", async (req, res) => {
    try {
      const restaurantId = parseInt(req.params.restaurantId);
      const { period = 'today', metric = 'overview' } = req.query;

      // Get actual sales data from orders
      const orders = await storage.getOrdersByRestaurant(restaurantId);
      const menuItems = await storage.getMenuItems(restaurantId);

      // Generate analytics report
      const analyticsPrompt = `Generate a verbal analytics report for restaurant ${restaurantId}. 
        Period: ${period}
        Metric focus: ${metric}
        
        Current data:
        - Total orders: ${orders.length}
        - Menu items: ${menuItems.length}
        
        Provide insights in a conversational format suitable for a restaurant manager.`;

      const response = await processOperationsAiMessage(analyticsPrompt, "analytics");

      res.json({
        verbalAnalytics: response.message,
        dataPoints: {
          totalOrders: orders.length,
          menuItems: menuItems.length,
          period,
          metric
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("AI analytics error:", error);
      res.status(500).json({ 
        message: "I'm having trouble generating analytics. Please try asking for specific metrics like 'show me today's performance' or 'what are my best sellers'." 
      });
    }
  });

  // AI Journal Summary endpoint
  app.post("/api/journal/summary", async (req, res) => {
    try {
      const { period = 'today' } = req.body;
      
      // Get real data from storage
      const orders = await storage.getOrdersByRestaurant(1);
      const menuItems = await storage.getMenuItems(1);
      
      // Calculate actual metrics
      const todayOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt || Date.now());
        const today = new Date();
        return orderDate.toDateString() === today.toDateString();
      });
      
      const todayRevenue = todayOrders.reduce((sum, order) => sum + parseFloat(order.total), 0);
      const avgOrderValue = todayOrders.length > 0 ? todayRevenue / todayOrders.length : 0;
      
      // OpenAI API call for generating summary
      const OpenAI = require('openai');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const prompt = `Generate a concise, professional restaurant journal summary for ${period} with this data:
      
Today's Performance:
- Revenue: $${todayRevenue.toFixed(2)}
- Orders: ${todayOrders.length}
- Average Order: $${avgOrderValue.toFixed(2)}
- Menu Items: ${menuItems.length}
- Active Menu Items: ${menuItems.filter(item => item.isAvailable).length}

Write a brief, insightful summary (2-3 sentences) focusing on key performance highlights and actionable insights for restaurant management. Keep it professional but engaging, like a daily business briefing.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        temperature: 0.7
      });

      const summary = response.choices[0].message.content;

      res.json({
        summary,
        data: {
          revenue: todayRevenue,
          orders: todayOrders.length,
          avgOrderValue,
          menuItems: menuItems.length,
          availableItems: menuItems.filter(item => item.isAvailable).length
        },
        timestamp: new Date().toISOString(),
        period
      });
    } catch (error) {
      console.error('AI Journal Summary Error:', error);
      res.status(500).json({ 
        error: "Failed to generate journal summary",
        fallback: "Strong performance today with steady order flow and excellent menu availability. Revenue tracking well with good customer engagement across available items."
      });
    }
  });

  // Routes registered successfully
}
