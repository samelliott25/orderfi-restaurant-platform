import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { processChatMessage, processOperationsAiMessage, processMenuImage, type ChatContext } from "./services/openai";
import { 
  insertRestaurantSchema, 
  insertMenuItemSchema, 
  insertFaqSchema, 
  insertOrderSchema,
  insertChatMessageSchema 
} from "@shared/schema";
import multer from 'multer';

// Configure multer for image uploads
const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
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
      const menuItemData = insertMenuItemSchema.parse({
        ...req.body,
        restaurantId,
      });
      const menuItem = await storage.createMenuItem(menuItemData);
      res.status(201).json(menuItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid menu item data" });
    }
  });

  app.put("/api/menu-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertMenuItemSchema.partial().parse(req.body);
      const menuItem = await storage.updateMenuItem(id, updateData);
      res.json(menuItem);
    } catch (error) {
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

  // Chat routes
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, restaurantId, sessionId, conversationHistory = [] } = req.body;
      
      if (!message || !restaurantId || !sessionId) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Get restaurant context
      const restaurant = await storage.getRestaurant(restaurantId);
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      const menuItems = await storage.getMenuItems(restaurantId);
      const faqs = await storage.getFAQs(restaurantId);

      const context: ChatContext = {
        restaurantName: restaurant.name,
        restaurantDescription: restaurant.description || "",
        tone: restaurant.tone || "friendly",
        welcomeMessage: restaurant.welcomeMessage || "",
        menuItems: menuItems.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description || "",
          price: item.price,
          category: item.category,
          tags: item.tags || [],
        })),
        faqs: faqs.map(faq => ({
          question: faq.question,
          answer: faq.answer,
        })),
      };

      // Store user message
      await storage.createChatMessage({
        sessionId,
        message,
        isUser: true,
      });

      // Process with OpenAI
      const response = await processChatMessage(message, context, [], conversationHistory);

      // Store AI response
      await storage.createChatMessage({
        sessionId,
        message: response.message,
        isUser: false,
      });

      res.json(response);
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  // Operations AI Chat endpoint
  app.post("/api/operations-ai-chat", async (req, res) => {
    try {
      const { message, context } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      const response = await processOperationsAiMessage(message, context);
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

  const httpServer = createServer(app);
  return httpServer;
}
