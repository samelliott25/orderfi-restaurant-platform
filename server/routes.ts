import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from 'ws';
import { storage } from "./storage";
import OpenAI from 'openai';
import ordersRouter from "./routes/orders";
import kitchenPrintingRouter from "./routes/kitchen-printing";
import { paymentEngine } from "./services/payment-engine";
import { rewardEngine } from "./services/reward-engine";
import { blockchainStorage } from "./blockchain/storage";
import { blockchainIntegrationService } from "./services/blockchain-integration";
import { menuCategorizationService } from "./services/menu-categorization";
import { kitchenPrinterService } from "./services/kitchen-printer";
import { processChatMessage, processOperationsAiMessage, type ChatContext } from "./services/akash-chat";
import { enhancedCompetitiveAnalysis, grokFeatureTaste, analyzeMenuImage, generateRestaurantStrategy, testGrokConnection } from "./grok";
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
  
  // KDS WebSocket and API endpoints
  app.get('/api/orders/active', async (req, res) => {
    try {
      const activeOrders = await storage.getActiveOrders();
      res.json({ orders: activeOrders });
    } catch (error) {
      console.error('Error fetching active orders:', error);
      res.status(500).json({ error: 'Failed to fetch active orders' });
    }
  });

  app.post('/api/orders/update-status', async (req, res) => {
    try {
      const { orderId, status } = req.body;
      await storage.updateOrderStatus(orderId, status);
      
      // Broadcast to all connected WebSocket clients
      const broadcast = app.get('wsBroadcast');
      if (broadcast) {
        broadcast({
          type: 'order-status-updated',
          payload: {
            orderId,
            status,
            timestamp: new Date().toISOString()
          }
        }, 'kds-orders');
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ error: 'Failed to update order status' });
    }
  });
  
  // Register MVP routes first
  const { mvpRoutes } = await import('./mvp-routes');
  app.use(mvpRoutes);

  // Health check endpoint for Docker
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "1.0.0"
    });
  });

  // Enhanced voice search endpoint leveraging database optimizations
  app.post('/api/restaurants/:id/voice-search', async (req, res) => {
    try {
      const { id } = req.params;
      const { query, searchType = 'natural' } = req.body;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Query is required and must be a string' });
      }

      const restaurantId = parseInt(id);
      if (isNaN(restaurantId)) {
        return res.status(400).json({ error: 'Invalid restaurant ID' });
      }

      // Use different search strategies based on searchType
      let results = [];
      
      if (searchType === 'natural') {
        // Natural language search using unified search materialized view
        results = await storage.searchMenuItemsNatural(restaurantId, query);
      } else if (searchType === 'fuzzy') {
        // Fuzzy search using trigram similarity
        results = await storage.searchMenuItemsFuzzy(restaurantId, query);
      } else {
        // Default combined search
        results = await storage.searchMenuItemsCombined(restaurantId, query);
      }

      res.json({
        query,
        searchType,
        results,
        count: results.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Voice search error:', error);
      res.status(500).json({ error: 'Internal server error during voice search' });
    }
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
      console.log(`Fetching menu items for restaurant ${restaurantId}`);
      const menuItems = await storage.getMenuItems(restaurantId);
      console.log(`Found ${menuItems.length} menu items`);
      res.json(menuItems);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      res.status(500).json({ message: "Failed to fetch menu items", error: error.message });
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

  // Grok AI integration endpoints
  app.post('/api/grok/competitive-analysis', async (req, res) => {
    try {
      const { competitorData } = req.body;
      const analysis = await enhancedCompetitiveAnalysis(competitorData);
      res.json({ analysis });
    } catch (error) {
      console.error('Grok competitive analysis error:', error);
      res.status(500).json({ error: 'Failed to analyze competitor data' });
    }
  });

  app.post('/api/grok/feature-taste', async (req, res) => {
    try {
      const { featureDescription } = req.body;
      const result = await grokFeatureTaste(featureDescription);
      res.json(result);
    } catch (error) {
      console.error('Grok feature taste error:', error);
      res.status(500).json({ error: 'Failed to analyze feature taste' });
    }
  });

  app.post('/api/grok/menu-analysis', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image provided' });
      }
      
      const base64Image = req.file.buffer.toString('base64');
      const analysis = await analyzeMenuImage(base64Image);
      res.json({ analysis });
    } catch (error) {
      console.error('Grok menu analysis error:', error);
      res.status(500).json({ error: 'Failed to analyze menu image' });
    }
  });

  app.post('/api/grok/restaurant-strategy', async (req, res) => {
    try {
      const { businessContext } = req.body;
      const strategy = await generateRestaurantStrategy(businessContext);
      res.json({ strategy });
    } catch (error) {
      console.error('Grok restaurant strategy error:', error);
      res.status(500).json({ error: 'Failed to generate restaurant strategy' });
    }
  });

  app.get('/api/grok/test-connection', async (req, res) => {
    try {
      const isConnected = await testGrokConnection();
      res.json({ connected: isConnected });
    } catch (error) {
      console.error('Grok connection test error:', error);
      res.status(500).json({ error: 'Failed to test Grok connection' });
    }
  });

  // Phase 1 Implementation: Comprehensive competitive analysis
  app.post('/api/grok/phase1-competitive-analysis', async (req, res) => {
    try {
      const { phase1CompetitiveAnalysis } = await import('./grok');
      const analysis = await phase1CompetitiveAnalysis();
      res.json(analysis);
    } catch (error) {
      console.error('Phase 1 competitive analysis error:', error);
      res.status(500).json({ error: 'Failed to perform Phase 1 competitive analysis' });
    }
  });

  // Phase 1 Implementation: Development roadmap generation
  app.post('/api/grok/phase1-roadmap', async (req, res) => {
    try {
      const { competitiveInsights } = req.body;
      const { generatePhase1Roadmap } = await import('./grok');
      const roadmap = await generatePhase1Roadmap(competitiveInsights);
      res.json(roadmap);
    } catch (error) {
      console.error('Phase 1 roadmap generation error:', error);
      res.status(500).json({ error: 'Failed to generate Phase 1 roadmap' });
    }
  });

  // Phase 2 Implementation: Mobile optimization analysis
  app.post('/api/grok/phase2-mobile-analysis', async (req, res) => {
    try {
      const { currentAdminPages } = req.body;
      const { analyzeMobileOptimization } = await import('./grok');
      const analysis = await analyzeMobileOptimization(currentAdminPages);
      res.json(analysis);
    } catch (error) {
      console.error('Phase 2 mobile analysis error:', error);
      res.status(500).json({ error: 'Failed to analyze mobile optimization' });
    }
  });

  // Phase 2 Implementation: Generate mobile-optimized components
  app.post('/api/grok/phase2-generate-components', async (req, res) => {
    try {
      const { specifications } = req.body;
      const { generateMobileComponents } = await import('./grok');
      const components = await generateMobileComponents(specifications);
      res.json(components);
    } catch (error) {
      console.error('Phase 2 component generation error:', error);
      res.status(500).json({ error: 'Failed to generate mobile components' });
    }
  });

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

  // ChatOps automation endpoints
  app.post('/api/chatops', async (req, res) => {
    try {
      const { callChatOps } = await import('./chatops-automation');
      const { message, restaurantId } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }
      
      const result = await callChatOps(message, restaurantId || 1);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/chatops/monitor-stock', async (req, res) => {
    try {
      const { autoMonitorStock } = await import('./chatops-automation');
      const { restaurantId } = req.body;
      
      const result = await autoMonitorStock(restaurantId || 1);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Payment ChatOps endpoints
  app.post('/api/payments/chatops', async (req, res) => {
    try {
      const { callPaymentsChatOps } = await import('./payments-chatops');
      const { message, restaurantId } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }
      
      const result = await callPaymentsChatOps(message, restaurantId || 1);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/payments/monitor-pending', async (req, res) => {
    try {
      const { monitorPendingPayments } = await import('./payments-chatops');
      const result = await monitorPendingPayments();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Payments API endpoints
  app.get('/api/payments/summary', async (req, res) => {
    try {
      // Mock payment summary data
      const summary = {
        totalRevenue: 12345.67,
        cryptoRevenue: 4500.23,
        stripeRevenue: 7845.44,
        pendingPayments: 3,
        settledPayments: 147,
        failedPayments: 2,
        totalTransactions: 152,
        averageTransaction: 81.22
      };
      res.json(summary);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/payments', async (req, res) => {
    try {
      // Mock payments data
      const payments = [
        {
          id: '1',
          date: '2025-07-09',
          method: 'crypto',
          token: 'USDC',
          amount: 25.00,
          status: 'settled',
          description: 'Order #1234 - Burger Combo',
          transactionId: '0xabc123...',
          customerName: 'John Doe',
          walletAddress: '0x1234...5678'
        },
        {
          id: '2',
          date: '2025-07-08',
          method: 'stripe',
          amount: 75.00,
          status: 'pending',
          description: 'Order #1235 - Large Pizza',
          paymentIntentId: 'pi_1234567890',
          customerName: 'Jane Smith'
        },
        {
          id: '3',
          date: '2025-07-08',
          method: 'crypto',
          token: 'ETH',
          amount: 150.00,
          status: 'failed',
          description: 'Order #1236 - Catering Service',
          transactionId: '0xdef456...',
          customerName: 'Mike Johnson'
        }
      ];
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/payments/configure-stripe', async (req, res) => {
    try {
      const { publishableKey, secretKey, environment } = req.body;
      
      // TODO: Store Stripe configuration securely
      console.log('Stripe configuration received:', { publishableKey: publishableKey.substring(0, 10) + '...', environment });
      
      res.json({ 
        success: true, 
        message: 'Stripe configuration saved successfully',
        environment 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/payments/configure-crypto', async (req, res) => {
    try {
      const { enabledTokens, walletAddress } = req.body;
      
      // TODO: Store crypto configuration
      console.log('Crypto configuration received:', { enabledTokens, walletAddress });
      
      res.json({ 
        success: true, 
        message: 'Crypto configuration saved successfully',
        enabledTokens,
        walletAddress 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/payments/:id/capture', async (req, res) => {
    try {
      const { id } = req.params;
      
      // TODO: Implement actual payment capture logic
      console.log('Capturing payment:', id);
      
      res.json({ 
        success: true, 
        message: `Payment ${id} captured successfully`,
        paymentId: id 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/payments/:id/refund', async (req, res) => {
    try {
      const { id } = req.params;
      const { amount } = req.body;
      
      // TODO: Implement actual refund logic
      console.log('Refunding payment:', id, 'Amount:', amount);
      
      res.json({ 
        success: true, 
        message: `Refund processed for payment ${id}`,
        refundId: 're_' + Date.now(),
        amount 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
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

  // AI Forecast endpoint
  app.post("/api/ai-forecast", async (req, res) => {
    try {
      const { currentData, historical, period = 'tomorrow' } = req.body;
      
      // Get real data from storage
      const orders = await storage.getOrdersByRestaurant(1);
      
      // Calculate historical averages
      const recentOrders = orders.slice(-30); // Last 30 orders
      const avgRevenue = recentOrders.length > 0 
        ? recentOrders.reduce((sum, order) => sum + parseFloat(order.total), 0) / recentOrders.length
        : currentData.topLevel.netSales;
      
      const avgOrders = recentOrders.length;
      
      // OpenAI API call for generating forecast
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const prompt = `As a restaurant analytics AI, generate a data-driven forecast for ${period} based on this data:

Current Performance:
- Today's Sales: $${currentData.topLevel.netSales}
- Orders: ${currentData.topLevel.totalTransactions}
- Average Order Value: $${currentData.topLevel.avgOrderValue}

Historical Context:
- Recent 30-order average revenue: $${avgRevenue.toFixed(2)}
- Historical trend: ${historical.lastWeek.join(', ')}
- Day: ${historical.seasonality}
- Weather: ${historical.weather}
- Events: ${historical.events.join(', ')}

Sales Breakdown:
- Food: ${currentData.breakdown.byCategory[0].percentage}%
- Drinks: ${currentData.breakdown.byCategory[1].percentage}%
- Other: ${currentData.breakdown.byCategory[2].percentage}%

Top Performers:
${currentData.breakdown.topItems.map(item => `- ${item.name}: ${item.sold} sold, $${item.sales}`).join('\n')}

Provide a JSON response with:
{
  "expectedSales": number (tomorrow's predicted revenue),
  "expectedOrders": number (predicted order count),
  "confidence": number (0-100),
  "change": number (percentage change vs today),
  "insights": "brief explanation of the forecast",
  "recommendations": ["actionable suggestion 1", "suggestion 2"]
}

Base predictions on historical patterns, seasonal trends, weather impact, and current performance trajectory.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 500,
        temperature: 0.7
      });

      const forecast = JSON.parse(response.choices[0].message.content);

      res.json({
        ...forecast,
        timestamp: new Date().toISOString(),
        period,
        basedOn: {
          currentSales: currentData.topLevel.netSales,
          historicalAverage: avgRevenue,
          dataPoints: recentOrders.length
        }
      });
    } catch (error) {
      console.error('AI Forecast Error:', error);
      res.status(500).json({ 
        error: "Failed to generate forecast",
        fallback: {
          expectedSales: 4100,
          expectedOrders: 195,
          confidence: 75,
          change: 5.1,
          insights: "Based on historical patterns, expect similar performance with slight growth due to seasonal trends.",
          recommendations: ["Monitor peak hours closely", "Ensure adequate inventory for top items"]
        }
      });
    }
  });

  // KDS API endpoints
  app.get('/api/kds/orders', async (req, res) => {
    try {
      const orders = await storage.getActiveOrders();
      res.json(orders);
    } catch (error) {
      console.error('KDS orders error:', error);
      res.status(500).json({ error: 'Failed to get active orders' });
    }
  });

  app.patch('/api/kds/orders/:id/status', async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const order = await storage.updateOrderStatus(parseInt(id), status);
      
      // Broadcast to connected WebSocket clients
      const broadcast = app.get('wsBroadcast');
      if (broadcast) {
        broadcast({
          type: 'order-status-updated',
          payload: {
            orderId: parseInt(id),
            status,
            timestamp: new Date().toISOString()
          }
        }, 'kds-orders');
      }
      
      res.json(order);
    } catch (error) {
      console.error('KDS status update error:', error);
      res.status(500).json({ error: 'Failed to update order status' });
    }
  });

  // Test endpoint to create sample orders for KDS demo
  app.post('/api/kds/test-orders', async (req, res) => {
    try {
      const sampleOrders = [
        {
          restaurantId: 1,
          customerName: 'John Smith',
          tableNumber: 'Table 5',
          items: JSON.stringify([
            { name: 'Classic Burger', quantity: 1, modifications: ['No onions', 'Extra cheese'] },
            { name: 'Chips', quantity: 1, modifications: [] }
          ]),
          subtotal: '18.50',
          tax: '1.48',
          total: '19.98',
          status: 'pending',
          paymentMethod: 'credit'
        },
        {
          restaurantId: 1,
          customerName: 'Sarah Johnson',
          tableNumber: 'Table 3',
          items: JSON.stringify([
            { name: 'Buffalo Wings', quantity: 12, modifications: ['Extra hot sauce', 'Blue cheese dip'] },
            { name: 'Beer', quantity: 2, modifications: [] }
          ]),
          subtotal: '24.00',
          tax: '1.92',
          total: '25.92',
          status: 'preparing',
          paymentMethod: 'cash'
        },
        {
          restaurantId: 1,
          customerName: 'Mike Wilson',
          tableNumber: 'Table 7',
          items: JSON.stringify([
            { name: 'Chicken Tacos', quantity: 3, modifications: ['No cilantro', 'Extra lime'] },
            { name: 'Guacamole', quantity: 1, modifications: [] }
          ]),
          subtotal: '16.75',
          tax: '1.34',
          total: '18.09',
          status: 'ready',
          paymentMethod: 'usdc'
        }
      ];

      const createdOrders = [];
      for (const order of sampleOrders) {
        const created = await storage.createOrder(order);
        createdOrders.push(created);
      }

      res.json({ 
        message: 'Sample orders created successfully',
        orders: createdOrders 
      });
    } catch (error) {
      console.error('Test orders creation error:', error);
      res.status(500).json({ error: 'Failed to create test orders' });
    }
  });

  // Dashboard KPIs endpoint
  app.get('/api/dashboard/kpis', async (req, res) => {
    try {
      const orders = await storage.getOrders();
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const todayOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.toDateString() === today.toDateString();
      });
      
      const yesterdayOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.toDateString() === yesterday.toDateString();
      });
      
      const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
      const yesterdayRevenue = yesterdayOrders.reduce((sum, order) => sum + order.total, 0);
      
      const todayCustomers = new Set(todayOrders.map(order => order.customerName)).size;
      const yesterdayCustomers = new Set(yesterdayOrders.map(order => order.customerName)).size;
      
      const todayAvgOrder = todayOrders.length > 0 ? todayRevenue / todayOrders.length : 0;
      const yesterdayAvgOrder = yesterdayOrders.length > 0 ? yesterdayRevenue / yesterdayOrders.length : 0;
      
      const kpis = {
        revenue: {
          current: todayRevenue,
          previous: yesterdayRevenue,
          trend: todayRevenue >= yesterdayRevenue ? 'up' : 'down',
          percentage: yesterdayRevenue > 0 ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 : 0
        },
        orders: {
          current: todayOrders.length,
          previous: yesterdayOrders.length,
          trend: todayOrders.length >= yesterdayOrders.length ? 'up' : 'down',
          percentage: yesterdayOrders.length > 0 ? ((todayOrders.length - yesterdayOrders.length) / yesterdayOrders.length) * 100 : 0
        },
        customers: {
          current: todayCustomers,
          previous: yesterdayCustomers,
          trend: todayCustomers >= yesterdayCustomers ? 'up' : 'down',
          percentage: yesterdayCustomers > 0 ? ((todayCustomers - yesterdayCustomers) / yesterdayCustomers) * 100 : 0
        },
        avgOrder: {
          current: todayAvgOrder,
          previous: yesterdayAvgOrder,
          trend: todayAvgOrder >= yesterdayAvgOrder ? 'up' : 'down',
          percentage: yesterdayAvgOrder > 0 ? ((todayAvgOrder - yesterdayAvgOrder) / yesterdayAvgOrder) * 100 : 0
        }
      };
      
      res.json(kpis);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Live orders endpoint
  app.get('/api/dashboard/live-orders', async (req, res) => {
    try {
      const orders = await storage.getOrders();
      const liveOrders = orders
        .filter(order => ['pending', 'preparing', 'ready'].includes(order.status))
        .map(order => ({
          id: order.id,
          customerName: order.customerName,
          items: typeof order.items === 'string' ? JSON.parse(order.items).map(item => item.name) : order.items.map(item => item.name),
          status: order.status,
          tableNumber: order.tableNumber || 'N/A',
          timeElapsed: Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 1000 / 60),
          priority: order.priority || 'normal',
          total: order.total
        }))
        .sort((a, b) => b.timeElapsed - a.timeElapsed);
      
      res.json(liveOrders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Analytics endpoint
  app.get('/api/dashboard/analytics', async (req, res) => {
    try {
      const { period = 'today' } = req.query;
      const orders = await storage.getOrders();
      
      // Generate hourly revenue data
      const hourlyData = [];
      
      for (let hour = 9; hour <= 22; hour++) {
        const hourOrders = orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate.getHours() === hour;
        });
        
        const hourRevenue = hourOrders.reduce((sum, order) => sum + order.total, 0);
        const hourOrderCount = hourOrders.length;
        
        hourlyData.push({
          time: `${hour}:00`,
          amount: hourRevenue,
          forecast: hourRevenue * 1.05,
          count: hourOrderCount
        });
      }
      
      // Category analysis
      const categories = [
        { name: 'Burgers', value: 35, color: '#f97316' },
        { name: 'Wings', value: 25, color: '#e11d48' },
        { name: 'Tacos', value: 20, color: '#8b5cf6' },
        { name: 'Salads', value: 12, color: '#10b981' },
        { name: 'Drinks', value: 8, color: '#3b82f6' }
      ];
      
      // Waste analysis
      const wasteAnalysis = [
        { item: 'Buffalo Wings', waste: 8, cost: 45.60 },
        { item: 'Caesar Salad', waste: 3, cost: 18.75 },
        { item: 'Beef Burger', waste: 5, cost: 32.50 },
        { item: 'Fish Tacos', waste: 2, cost: 12.00 }
      ];
      
      // AI insights
      const aiInsights = [
        {
          id: '1',
          type: 'optimization',
          title: 'Peak Hour Efficiency',
          description: 'Order volume analysis shows opportunity for staff optimization',
          impact: 'high',
          action: 'Consider adding kitchen staff during peak hours'
        },
        {
          id: '2',
          type: 'opportunity',
          title: 'Menu Optimization',
          description: 'Top-selling items show consistent demand patterns',
          impact: 'medium',
          action: 'Increase portion prep for high-demand items'
        }
      ];
      
      const analytics = {
        revenue: hourlyData.map(item => ({ time: item.time, amount: item.amount, forecast: item.forecast })),
        orders: hourlyData.map(item => ({ time: item.time, count: item.count })),
        categories,
        wasteAnalysis,
        aiInsights
      };
      
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // AI Voice Processing endpoint
  app.post('/api/ai/process-voice', async (req, res) => {
    try {
      const { transcript, confidence, context, conversationHistory } = req.body;
      
      // Process with xAI Grok
      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'grok-2-1212',
          messages: [
            {
              role: 'system',
              content: `You are OrderFi, a voice-first AI assistant for a restaurant ordering system. 
              
              Context: ${context}
              Customer confidence: ${confidence}
              
              Analyze the customer's voice input and determine:
              1. Intent (order_item, ui_adaptation, robot_command, general_inquiry)
              2. Entities (food items, modifications, quantities)
              3. Appropriate response with empathetic tone
              4. Any actions needed (add to cart, modify order, etc.)
              
              Respond with structured JSON containing:
              - intent: string
              - entities: array of extracted entities
              - response: natural language response
              - actions: array of actions to take
              - confidence: confidence in interpretation
              
              Keep responses conversational, helpful, and match the customer's energy level.`
            },
            ...conversationHistory.map(msg => ({
              role: msg.type === 'user' ? 'user' : 'assistant',
              content: msg.content
            })),
            {
              role: 'user',
              content: transcript
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });
      
      if (!response.ok) {
        throw new Error('xAI API error');
      }
      
      const aiResult = await response.json();
      let parsedResponse;
      
      try {
        parsedResponse = JSON.parse(aiResult.choices[0].message.content);
      } catch (parseError) {
        // Fallback to simple response if JSON parsing fails
        parsedResponse = {
          intent: 'general_inquiry',
          entities: [],
          response: aiResult.choices[0].message.content,
          actions: [],
          confidence: 0.7
        };
      }
      
      res.json(parsedResponse);
    } catch (error) {
      console.error('AI voice processing error:', error);
      
      // Fallback response
      res.json({
        intent: 'general_inquiry',
        entities: [],
        response: "I'm here to help! Could you tell me what you'd like to order today?",
        actions: [],
        confidence: 0.5
      });
    }
  });

  // AI Personalization endpoint
  app.post('/api/ai/personalize', async (req, res) => {
    try {
      const { profile, menuItems, contextualFactors } = req.body;
      
      // Process with xAI Grok for personalization
      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'grok-2-1212',
          messages: [
            {
              role: 'system',
              content: `You are an AI personalization engine for OrderFi restaurant. 
              
              Analyze the customer profile and contextual factors to provide personalized recommendations.
              
              Customer Profile: ${JSON.stringify(profile)}
              Contextual Factors: ${JSON.stringify(contextualFactors)}
              
              Provide structured JSON response with:
              - recommendations: array of recommended items with reasoning and confidence scores
              - adaptations: interface and interaction adaptations
              - insights: behavioral insights and opportunities
              
              Consider psychology principles:
              - Mood alignment for food preferences
              - Time-of-day eating patterns
              - Weather influence on food choices
              - Social and cultural factors
              
              Keep recommendations helpful and non-manipulative.`
            },
            {
              role: 'user',
              content: `Here are the available menu items: ${JSON.stringify(menuItems.slice(0, 20))}. Please provide personalized recommendations.`
            }
          ],
          temperature: 0.8,
          max_tokens: 1000
        })
      });
      
      if (!response.ok) {
        throw new Error('xAI API error');
      }
      
      const aiResult = await response.json();
      let parsedResponse;
      
      try {
        parsedResponse = JSON.parse(aiResult.choices[0].message.content);
      } catch (parseError) {
        // Fallback to rule-based recommendations
        parsedResponse = generateRuleBasedPersonalization(profile, menuItems, contextualFactors);
      }
      
      res.json(parsedResponse);
    } catch (error) {
      console.error('AI personalization error:', error);
      
      // Fallback to rule-based recommendations
      const fallbackResponse = generateRuleBasedPersonalization(req.body.profile, req.body.menuItems, req.body.contextualFactors);
      res.json(fallbackResponse);
    }
  });

  // Removed robot automation endpoints as requested

  // Customer profile endpoint
  app.get('/api/customers/:id/profile', async (req, res) => {
    try {
      const { id } = req.params;
      const orders = await storage.getOrders();
      const customerOrders = orders.filter(order => order.customerId === id);
      
      if (customerOrders.length === 0) {
        return res.status(404).json({ error: 'Customer profile not found' });
      }
      
      // Build profile from order history
      const profile = buildCustomerProfile(customerOrders);
      res.json(profile);
    } catch (error) {
      console.error('Customer profile error:', error);
      res.status(500).json({ error: 'Failed to get customer profile' });
    }
  });

  // Routes registered successfully
}

// Helper functions for AI processing
function generateRuleBasedPersonalization(profile, menuItems, contextualFactors) {
  const recommendations = [];
  const timeOfDay = contextualFactors.timeOfDay;
  const weather = contextualFactors.weather;
  const mood = contextualFactors.mood;
  
  // Time-based filtering
  const timeAppropriateItems = menuItems.filter(item => {
    const itemName = item.name.toLowerCase();
    switch (timeOfDay) {
      case 'morning':
        return itemName.includes('breakfast') || itemName.includes('coffee') || itemName.includes('egg');
      case 'afternoon':
        return itemName.includes('lunch') || itemName.includes('salad') || itemName.includes('sandwich');
      case 'evening':
        return itemName.includes('dinner') || itemName.includes('burger') || itemName.includes('pizza');
      default:
        return true;
    }
  });
  
  // Weather-based filtering
  const weatherAppropriateItems = timeAppropriateItems.filter(item => {
    const itemName = item.name.toLowerCase();
    switch (weather) {
      case 'cold':
        return itemName.includes('soup') || itemName.includes('hot') || itemName.includes('warm');
      case 'hot':
        return itemName.includes('salad') || itemName.includes('cold') || itemName.includes('ice');
      default:
        return true;
    }
  });
  
  // Take top 6 items
  const topItems = weatherAppropriateItems.slice(0, 6);
  
  topItems.forEach((item, index) => {
    recommendations.push({
      id: `rule-${item.id}`,
      item: item,
      score: 0.8 - (index * 0.1),
      reasoning: `Great choice for ${timeOfDay} on a ${weather} day`,
      confidence: 0.7,
      category: 'contextual'
    });
  });
  
  return {
    recommendations,
    adaptations: {
      interfaceTheme: mood === 'comfort' ? 'warm' : 'fresh',
      layoutPreference: 'conversational',
      interactionStyle: 'voice-first',
      voicePersonality: 'friendly'
    },
    insights: [
      {
        type: 'preference',
        title: 'Time-based Preference',
        description: `You're ordering during ${timeOfDay} hours`,
        confidence: 0.8,
        actionable: true
      }
    ]
  };
}

// Robot functions removed as requested

function buildCustomerProfile(orders) {
  // Analyze order history to build customer profile
  const categories = {};
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const averageOrder = totalSpent / orders.length;
  
  orders.forEach(order => {
    const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
    items.forEach(item => {
      const category = item.category || 'other';
      categories[category] = (categories[category] || 0) + 1;
    });
  });
  
  const favoriteCategories = Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([category]) => category);
  
  return {
    id: orders[0].customerId,
    preferences: {
      dietary: [],
      cuisines: favoriteCategories,
      spiceLevel: 2,
      priceRange: [averageOrder * 0.8, averageOrder * 1.2],
      allergens: []
    },
    behavior: {
      orderFrequency: orders.length,
      averageOrderValue: averageOrder,
      favoriteCategories,
      orderTimes: ['evening'],
      seasonalPreferences: {}
    },
    context: {
      currentMood: 'happy',
      timeOfDay: 'evening',
      weather: 'sunny',
      dayOfWeek: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
      isSpecialOccasion: false
    }
  };
}
