import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import ordersRouter from "./routes/orders";
import { blockchainStorage } from "./blockchain/storage";
import { blockchainIntegrationService } from "./services/blockchain-integration";
import { menuCategorizationService } from "./services/menu-categorization";
import { processChatMessage, processOperationsAiMessage, processMenuImage, type ChatContext } from "./services/openai";
import { 
  insertRestaurantSchema, 
  insertMenuItemSchema, 
  insertFaqSchema, 
  insertOrderSchema,
  insertChatMessageSchema 
} from "@shared/schema";
import multer from 'multer';
import ttsRouter from "./routes/tts.js";

// Configure multer for image uploads
const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for Docker
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "1.0.0"
    });
  });
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
      // Support both formats for flexibility
      const { message, messages, restaurantId = 1, sessionId = 'default-session', conversationHistory = [] } = req.body;
      
      let userMessage = message;
      
      // If messages array is provided (OpenAI format), extract the last user message
      if (messages && Array.isArray(messages)) {
        const lastUserMsg = messages.filter(m => m.role === 'user').pop();
        userMessage = lastUserMsg?.content || '';
      }
      
      if (!userMessage) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Get restaurant context
      const restaurant = await storage.getRestaurant(restaurantId);
      const menuItems = await storage.getMenuItems(restaurantId);
      
      // Use AI training service and conversation memory for better responses
      const { aiTrainingService } = await import("../services/ai-training");
      const { conversationMemory } = await import("../services/conversation-memory");
      
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

      // Use OpenAI for intelligent responses
      const openai = new (await import('openai')).default({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: conversationMessages,
        max_tokens: 600,
        temperature: 0.8, // Slightly higher for more personality
      });
      
      // Store conversation in memory
      conversationMemory.addMessage(sessionId, 'user', userMessage);

      const response = completion.choices[0]?.message?.content || "I'm having trouble processing that. Could you try again?";
      
      // Store AI response in memory
      conversationMemory.addMessage(sessionId, 'assistant', response);

      res.json({ 
        message: response,
        response: response // Support both formats
      });
      
    } catch (error) {
      console.error("Chat error:", error);
      
      // Fallback response for healthy options
      const fallbackResponses = {
        'healthy': "For healthy options, I'd recommend our Craft Caesar Salad - fresh romaine with house-made croutons and parmesan for $12! We also have grilled proteins available. What type of healthy meal are you in the mood for?",
        'default': "I'm having some technical difficulties with my AI processing. Let me help you browse our menu directly, or you can tell me specifically what you'd like to order!"
      };
      
      const userMessage = req.body.message || req.body.messages?.filter(m => m.role === 'user').pop()?.content || '';
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

      const menuItems = await processMenuImage(req.file.buffer);
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

  const httpServer = createServer(app);
  return httpServer;
}
