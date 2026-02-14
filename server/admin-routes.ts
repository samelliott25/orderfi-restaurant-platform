import { Router, Request, Response } from "express";
import { db } from "./db";
import { menuItems, orders, copilotFeedback } from "../shared/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import { storage } from "./storage";

// Validation schemas
const createMenuItemSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  price: z.number().positive("Price must be positive"),
  category: z.string().optional().default("Main"),
  description: z.string().optional(),
  photoUrl: z.string().url().optional().or(z.literal("")),
  reviewsUrl: z.string().url().optional().or(z.literal("")),
  weightedKeywords: z.record(z.string(), z.number().min(0).max(1)).optional().default({}),
  aliases: z.array(z.string()).optional().default([]),
  dietaryTags: z.array(z.string()).optional().default([]),
  allergens: z.array(z.string()).optional().default([]),
});

const updateMenuItemSchema = createMenuItemSchema.partial().extend({
  isAvailable: z.boolean().optional(),
});

export const adminRouter = Router();

// Get all menu items for admin
adminRouter.get("/menu", async (req: Request, res: Response) => {
  try {
    if (db) {
      const items = await db.select().from(menuItems).orderBy(menuItems.category, menuItems.name);
      return res.json(items);
    }
    // Fallback to in-memory storage
    const items = await storage.getMenuItems(1);
    res.json(items);
  } catch (error) {
    console.error("Error fetching menu:", error);
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
});

// Create menu item
adminRouter.post("/menu", async (req: Request, res: Response) => {
  try {
    const parsed = createMenuItemSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }

    const { name, description, price, category, photoUrl, reviewsUrl, weightedKeywords, aliases, dietaryTags, allergens } = parsed.data;

    if (db) {
      const [item] = await db.insert(menuItems).values({
        restaurantId: 1,
        name,
        description,
        price: price.toString(),
        category: category || "Main",
        photoUrl: photoUrl || null,
        reviewsUrl: reviewsUrl || null,
        weightedKeywords: weightedKeywords || {},
        aliases: aliases || [],
        keywords: Object.keys(weightedKeywords || {}),
        dietaryTags: dietaryTags || [],
        allergens: allergens || [],
        isAvailable: true,
      }).returning();
      return res.json(item);
    }

    // Fallback to in-memory storage
    const item = await storage.createMenuItem({
      restaurantId: 1,
      name,
      description,
      price: price.toString(),
      category: category || "Main",
      isAvailable: true,
      tags: dietaryTags || [],
    });
    res.json(item);
  } catch (error) {
    console.error("Error creating menu item:", error);
    res.status(500).json({ error: "Failed to create menu item" });
  }
});

// Update menu item
adminRouter.put("/menu/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid menu item ID" });
    }

    const parsed = updateMenuItemSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }

    const { name, description, price, category, photoUrl, reviewsUrl, weightedKeywords, aliases, dietaryTags, allergens, isAvailable } = parsed.data;

    if (db) {
      const updateData: Record<string, unknown> = { updatedAt: new Date() };
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (price !== undefined) updateData.price = price.toString();
      if (category !== undefined) updateData.category = category;
      if (photoUrl !== undefined) updateData.photoUrl = photoUrl || null;
      if (reviewsUrl !== undefined) updateData.reviewsUrl = reviewsUrl || null;
      if (weightedKeywords !== undefined) {
        updateData.weightedKeywords = weightedKeywords;
        updateData.keywords = Object.keys(weightedKeywords);
      }
      if (aliases !== undefined) updateData.aliases = aliases;
      if (dietaryTags !== undefined) updateData.dietaryTags = dietaryTags;
      if (allergens !== undefined) updateData.allergens = allergens;
      if (isAvailable !== undefined) updateData.isAvailable = isAvailable;

      const [item] = await db.update(menuItems)
        .set(updateData)
        .where(eq(menuItems.id, id))
        .returning();

      if (!item) {
        return res.status(404).json({ error: "Menu item not found" });
      }
      return res.json(item);
    }

    // Fallback to in-memory storage
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price.toString();
    if (category !== undefined) updateData.category = category;
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable;
    const item = await storage.updateMenuItem(id, updateData);
    res.json(item);
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ error: "Failed to update menu item" });
  }
});

// Delete menu item
adminRouter.delete("/menu/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (db) {
      await db.delete(menuItems).where(eq(menuItems.id, id));
    } else {
      await storage.deleteMenuItem(id);
    }
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ error: "Failed to delete menu item" });
  }
});

// Get recent orders for admin
adminRouter.get("/orders", async (req: Request, res: Response) => {
  try {
    if (db) {
      const recentOrders = await db.select()
        .from(orders)
        .orderBy(desc(orders.createdAt))
        .limit(50);
      return res.json(recentOrders);
    }
    const allOrders = await storage.getOrdersByRestaurant(1);
    res.json(allOrders.slice(0, 50));
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Update order status
adminRouter.put("/orders/:id/status", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    if (db) {
      const [order] = await db.update(orders)
        .set({ status })
        .where(eq(orders.id, id))
        .returning();

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      return res.json(order);
    }

    const order = await storage.updateOrderStatus(id, status);
    res.json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

// Get upload URL for menu item photos
adminRouter.post("/upload-url", async (req: Request, res: Response) => {
  try {
    // Object storage requires Replit environment
    const { ObjectStorageService } = await import("./replit_integrations/object_storage");
    const objectStorage = new ObjectStorageService();
    const uploadURL = await objectStorage.getObjectEntityUploadURL();
    const objectPath = objectStorage.normalizeObjectEntityPath(uploadURL);
    res.json({ uploadURL, objectPath });
  } catch (error) {
    console.error("Error generating upload URL:", error);
    res.status(500).json({ error: "File uploads require Replit Object Storage (not available in local mode)" });
  }
});

// Get single order details
adminRouter.get("/orders/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (db) {
      const [order] = await db.select().from(orders).where(eq(orders.id, id));
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      return res.json(order);
    }
    const order = await storage.getOrder(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

// Full refund
adminRouter.post("/orders/:id/refund", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { reason } = req.body;

    if (!db) {
      return res.status(503).json({ error: "Refunds require database and Stripe (not available in local mode)" });
    }

    const [order] = await db.select().from(orders).where(eq(orders.id, id));

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (!order.paymentId) {
      return res.status(400).json({ error: "No payment associated with this order" });
    }

    if (order.status === 'refunded') {
      return res.status(400).json({ error: "Order has already been refunded" });
    }

    const { getUncachableStripeClient } = await import("./stripeClient");
    const stripe = await getUncachableStripeClient();

    const refund = await stripe.refunds.create({
      payment_intent: order.paymentId,
      reason: reason || 'requested_by_customer',
    });

    // Update order status
    const [updatedOrder] = await db.update(orders)
      .set({ status: 'refunded' })
      .where(eq(orders.id, id))
      .returning();

    res.json({
      success: true,
      refundId: refund.id,
      amount: refund.amount / 100,
      order: updatedOrder
    });
  } catch (error: any) {
    console.error("Error processing refund:", error);
    res.status(500).json({ error: error.message || "Failed to process refund" });
  }
});

// Partial refund (by amount or items)
adminRouter.post("/orders/:id/partial-refund", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { amount, itemIndices, reason } = req.body;

    if (!db) {
      return res.status(503).json({ error: "Refunds require database and Stripe (not available in local mode)" });
    }

    const [order] = await db.select().from(orders).where(eq(orders.id, id));

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (!order.paymentId) {
      return res.status(400).json({ error: "No payment associated with this order" });
    }

    // Prevent multiple refunds on already refunded orders
    if (order.status === 'refunded') {
      return res.status(400).json({ error: "Order has already been fully refunded" });
    }

    let refundAmount: number;

    if (amount) {
      refundAmount = parseFloat(amount);
    } else if (itemIndices && Array.isArray(itemIndices)) {
      // Calculate refund based on selected items
      let items: any[] = [];
      try {
        items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
      } catch (e) {
        return res.status(400).json({ error: "Invalid order items data" });
      }

      refundAmount = itemIndices.reduce((sum: number, idx: number) => {
        const item = items[idx];
        if (item) {
          return sum + (parseFloat(item.price) * (item.quantity || 1));
        }
        return sum;
      }, 0);

      // Add proportional tax
      const subtotal = parseFloat(order.subtotal as string);
      const tax = parseFloat(order.tax as string);
      const taxRate = subtotal > 0 ? tax / subtotal : 0;
      refundAmount = refundAmount * (1 + taxRate);
    } else {
      return res.status(400).json({ error: "Must specify amount or itemIndices" });
    }

    if (refundAmount <= 0) {
      return res.status(400).json({ error: "Refund amount must be positive" });
    }

    const { getUncachableStripeClient } = await import("./stripeClient");
    const stripe = await getUncachableStripeClient();

    const refund = await stripe.refunds.create({
      payment_intent: order.paymentId,
      amount: Math.round(refundAmount * 100), // Convert to cents
      reason: reason || 'requested_by_customer',
    });

    // Update order status to partial refund
    const [updatedOrder] = await db.update(orders)
      .set({ status: 'partial_refund' })
      .where(eq(orders.id, id))
      .returning();

    res.json({
      success: true,
      refundId: refund.id,
      amount: refund.amount / 100,
      order: updatedOrder
    });
  } catch (error: any) {
    console.error("Error processing partial refund:", error);
    res.status(500).json({ error: error.message || "Failed to process partial refund" });
  }
});

// AI Menu Scanner - analyze a menu image and bulk-create items
adminRouter.post("/scan-menu", async (req: Request, res: Response) => {
  try {
    const { image } = req.body;
    if (!image || typeof image !== 'string') {
      return res.status(400).json({ error: "No image data provided" });
    }

    if (image.length > 20_000_000) {
      return res.status(400).json({ error: "Image too large. Please use an image under 15MB." });
    }

    if (!image.startsWith("data:image/")) {
      return res.status(400).json({ error: "Invalid image format. Please upload a JPG, PNG, or WEBP image." });
    }

    if (!process.env.XAI_API_KEY) {
      return res.status(500).json({ error: "AI service not configured (XAI_API_KEY required)" });
    }

    const OpenAI = (await import("openai")).default;
    const xai = new OpenAI({
      baseURL: "https://api.x.ai/v1",
      apiKey: process.env.XAI_API_KEY,
    });

    const visionResponse = await xai.chat.completions.create({
      model: "grok-2-vision-1212",
      messages: [
        {
          role: "system",
          content: `You are a menu extraction expert. Analyze the menu image and extract every food/drink item you can find.
For each item, provide:
- name: the item name exactly as shown
- price: the price as a number (no currency symbol). If no price is visible, estimate a reasonable price.
- category: categorize as one of: Main Course, Appetizer, Dessert, Drinks, Sides, Pizza, Pasta, Salad, Breakfast, Steaks, Seafood, Burgers, Sandwiches, Soups, Kids Menu, or Other
- description: a brief description if visible, otherwise create a short appetizing one
- dietaryTags: array of applicable tags like "vegetarian", "vegan", "gluten-free", "spicy", "dairy-free", "nut-free"
- aliases: array of common alternative names customers might use

Respond with ONLY valid JSON in this exact format:
{
  "items": [
    {
      "name": "Item Name",
      "price": 12.99,
      "category": "Main Course",
      "description": "Brief description",
      "dietaryTags": [],
      "aliases": []
    }
  ]
}`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract all menu items from this menu image. Return them as a JSON array."
            },
            {
              type: "image_url",
              image_url: {
                url: image.startsWith("data:") ? image : `data:image/jpeg;base64,${image}`
              }
            }
          ],
        },
      ],
      max_tokens: 4096,
      response_format: { type: "json_object" },
    });

    const content = visionResponse.choices[0]?.message?.content;
    if (!content) {
      return res.status(500).json({ error: "AI returned no response" });
    }

    let parsed: { items: any[] };
    try {
      parsed = JSON.parse(content);
    } catch {
      return res.status(500).json({ error: "AI returned invalid format", raw: content });
    }

    if (!parsed.items || !Array.isArray(parsed.items) || parsed.items.length === 0) {
      return res.status(400).json({ error: "No menu items could be detected in this image" });
    }

    const allowedCategories = ["Main Course", "Appetizer", "Dessert", "Drinks", "Sides", "Pizza", "Pasta", "Salad", "Breakfast", "Steaks", "Seafood", "Burgers", "Sandwiches", "Soups", "Kids Menu", "Other"];

    const createdItems: any[] = [];
    const failedItems: string[] = [];

    for (const item of parsed.items) {
      try {
        const name = typeof item.name === 'string' ? item.name.slice(0, 100) : "Unknown Item";
        const price = parseFloat(item.price);
        const safePrice = (!isNaN(price) && price > 0 && price < 10000) ? price : 10;
        const category = allowedCategories.includes(item.category) ? item.category : "Other";
        const description = typeof item.description === 'string' ? item.description.slice(0, 500) : "";
        const aliases = Array.isArray(item.aliases) ? item.aliases.filter((a: any) => typeof a === 'string').slice(0, 10) : [];
        const dietaryTags = Array.isArray(item.dietaryTags) ? item.dietaryTags.filter((t: any) => typeof t === 'string').slice(0, 10) : [];

        if (db) {
          const [created] = await db.insert(menuItems).values({
            restaurantId: 1,
            name,
            description,
            price: safePrice.toString(),
            category,
            aliases,
            keywords: [...aliases, ...dietaryTags],
            weightedKeywords: {},
            dietaryTags,
            allergens: [],
            isAvailable: true,
          }).returning();
          createdItems.push(created);
        } else {
          const created = await storage.createMenuItem({
            restaurantId: 1,
            name,
            description,
            price: safePrice.toString(),
            category,
            isAvailable: true,
            tags: dietaryTags,
          });
          createdItems.push(created);
        }
      } catch (itemError) {
        console.error(`Error creating item "${item.name}":`, itemError);
        failedItems.push(item.name || "Unknown");
      }
    }

    if (createdItems.length === 0) {
      return res.status(500).json({ error: "Failed to create any menu items", failedItems });
    }

    res.json({
      success: true,
      totalDetected: parsed.items.length,
      totalCreated: createdItems.length,
      totalFailed: failedItems.length,
      items: createdItems,
      failedItems: failedItems.length > 0 ? failedItems : undefined,
    });
  } catch (error: any) {
    console.error("Error scanning menu:", error);
    res.status(500).json({ error: error.message || "Failed to scan menu" });
  }
});

// === AI Copilot ===

const COPILOT_SYSTEM_PROMPT = `You are OrderFi Copilot, a friendly and knowledgeable AI assistant built into the OrderFi staff dashboard. You help restaurant staff use every feature of the platform.

Your personality: Warm, patient, encouraging. You're like a helpful colleague who knows the system inside out. Keep responses concise (2-4 sentences max unless explaining a process).

PLATFORM FEATURES YOU KNOW ABOUT:
1. **Menu Management** (Menu Items tab):
   - Add individual menu items with name, price, category, description
   - Upload photos for menu items using the camera icon
   - Set dietary tags (vegetarian, vegan, gluten-free, spicy)
   - Add allergen information
   - Set weighted keywords for AI voice ordering accuracy
   - Add aliases (alternative names customers might say)
   - Toggle item availability on/off
   - AI Menu Scanner: Upload a photo of a physical menu to auto-create all items

2. **Orders** (Recent Orders tab):
   - View all recent orders with status
   - Click any order to see full details
   - Process refunds (full or partial) via the order detail view
   - Order statuses: pending, confirmed, preparing, ready, completed

3. **Configuration** (Configuration tab):
   - WiFi printer setup for receipt printing
   - Receipt customization: choose kitchen receipt vs customer receipt
   - Customize what appears on receipts (order number, customer name, prices, tax, payment method, barcode)
   - Edit receipt header (restaurant name, address, phone)
   - Edit receipt footer message
   - Paper width settings (80mm or 58mm)

4. **Voice Ordering** (customer-facing /order page):
   - Customers speak their order naturally
   - AI matches spoken items to menu using weighted keywords
   - Supports browsing mode as alternative to voice
   - Stripe payment integration

5. **AI Menu Scanner**:
   - Upload a photo of any menu (JPG, PNG, WEBP)
   - AI reads and extracts all items with prices, categories, descriptions
   - Creates items in bulk automatically

WHEN DETECTING ISSUES OR FEEDBACK:
- If user reports a bug, problem, or confusion, acknowledge it warmly and help them
- If user suggests a feature, thank them and note it
- If user expresses frustration, be empathetic and solution-focused
- Always try to guide them to the right feature or workaround

IMPORTANT: You are embedded in the staff dashboard. When referring to features, point them to specific tabs or buttons they can see. Use the feature names exactly as they appear in the UI.`;

adminRouter.post("/copilot/chat", async (req: Request, res: Response) => {
  try {
    const { message, conversationHistory, pageContext } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (message.length > 2000) {
      return res.status(400).json({ error: "Message too long" });
    }

    if (!process.env.XAI_API_KEY) {
      return res.status(500).json({ error: "AI service not configured (XAI_API_KEY required)" });
    }

    const OpenAI = (await import("openai")).default;
    const xai = new OpenAI({
      baseURL: "https://api.x.ai/v1",
      apiKey: process.env.XAI_API_KEY,
    });

    const messages: any[] = [
      { role: "system", content: COPILOT_SYSTEM_PROMPT + (pageContext ? `\n\nThe user is currently viewing: ${pageContext}` : '') },
    ];

    if (Array.isArray(conversationHistory)) {
      for (const msg of conversationHistory.slice(-10)) {
        if (msg.role === 'user' || msg.role === 'assistant') {
          messages.push({ role: msg.role, content: String(msg.content).slice(0, 2000) });
        }
      }
    }

    messages.push({ role: "user", content: message });

    const response = await xai.chat.completions.create({
      model: "grok-3-mini",
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply = response.choices[0]?.message?.content || "I'm sorry, I couldn't process that. Could you try rephrasing?";

    const feedbackType = detectFeedbackType(message);
    const sentiment = detectSentiment(message);

    if (feedbackType !== 'general' && db) {
      const sessionId = `copilot_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      await db.insert(copilotFeedback).values({
        sessionId,
        userMessage: message.slice(0, 2000),
        copilotResponse: reply.slice(0, 2000),
        feedbackType,
        pageContext: pageContext || null,
        sentiment,
        resolved: false,
      }).catch(err => console.error("Failed to save copilot feedback:", err));
    }

    res.json({ reply, feedbackType, sentiment });
  } catch (error: any) {
    console.error("Copilot chat error:", error);
    res.status(500).json({ error: "Copilot is temporarily unavailable" });
  }
});

adminRouter.get("/copilot/feedback", async (_req: Request, res: Response) => {
  try {
    if (!db) {
      return res.json([]);
    }
    const feedback = await db.select().from(copilotFeedback).orderBy(desc(copilotFeedback.createdAt)).limit(50);
    res.json(feedback);
  } catch (error: any) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
});

adminRouter.patch("/copilot/feedback/:id", async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({ error: "Database not available in local mode" });
    }
    const id = parseInt(req.params.id);
    const [updated] = await db.update(copilotFeedback).set({ resolved: true }).where(eq(copilotFeedback.id, id)).returning();
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to update feedback" });
  }
});

function detectFeedbackType(message: string): string {
  const lower = message.toLowerCase();
  const bugWords = ['bug', 'broken', 'not working', 'error', 'crash', 'wrong', 'glitch', 'stuck', 'freeze', 'cant', "can't", "doesn't work", "won't", 'failed'];
  const confusionWords = ['how do i', 'where is', 'how to', 'confused', "don't understand", "don't know how", 'help me', 'what does', 'where can i'];
  const featureWords = ['wish', 'would be nice', 'can you add', 'feature request', 'suggestion', 'it would help', 'should have', 'could you add', 'missing'];
  const praiseWords = ['love', 'great', 'awesome', 'amazing', 'perfect', 'thank', 'excellent', 'fantastic', 'helpful'];

  if (bugWords.some(w => lower.includes(w))) return 'bug';
  if (confusionWords.some(w => lower.includes(w))) return 'confusion';
  if (featureWords.some(w => lower.includes(w))) return 'feature_request';
  if (praiseWords.some(w => lower.includes(w))) return 'praise';
  return 'general';
}

function detectSentiment(message: string): string {
  const lower = message.toLowerCase();
  const negative = ['frustrated', 'annoyed', 'hate', 'terrible', 'awful', 'horrible', 'angry', 'broken', 'worst', 'useless', 'bug', 'not working', 'error'];
  const positive = ['love', 'great', 'awesome', 'amazing', 'perfect', 'thank', 'excellent', 'fantastic', 'helpful', 'wonderful', 'nice', 'good'];

  const negScore = negative.filter(w => lower.includes(w)).length;
  const posScore = positive.filter(w => lower.includes(w)).length;

  if (negScore > posScore) return 'negative';
  if (posScore > negScore) return 'positive';
  return 'neutral';
}

// === Table Management ===

adminRouter.get("/tables", async (_req: Request, res: Response) => {
  try {
    const tables = await storage.getTables(1);
    res.json(tables);
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).json({ error: "Failed to fetch tables" });
  }
});

adminRouter.post("/tables", async (req: Request, res: Response) => {
  try {
    const { tableNumber, tableName, capacity, section, qrCodeId } = req.body;
    const table = await storage.createTable({
      restaurantId: 1,
      tableNumber: tableNumber || "1",
      tableName,
      capacity: capacity || 4,
      section,
      qrCodeId: qrCodeId || `table-${Date.now()}`,
      isActive: true,
    });
    res.json(table);
  } catch (error) {
    console.error("Error creating table:", error);
    res.status(500).json({ error: "Failed to create table" });
  }
});

adminRouter.put("/tables/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const table = await storage.updateTable(id, req.body);
    res.json(table);
  } catch (error) {
    console.error("Error updating table:", error);
    res.status(500).json({ error: "Failed to update table" });
  }
});

adminRouter.delete("/tables/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await storage.deleteTable(id);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting table:", error);
    res.status(500).json({ error: "Failed to delete table" });
  }
});

// === Menu Categories ===

adminRouter.get("/categories", async (_req: Request, res: Response) => {
  try {
    const categories = await storage.getMenuCategories(1);
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

adminRouter.post("/categories", async (req: Request, res: Response) => {
  try {
    const { name, description, displayOrder, availabilitySchedule } = req.body;
    const category = await storage.createMenuCategory({
      restaurantId: 1,
      name: name || "New Category",
      description,
      displayOrder: displayOrder || 0,
      availabilitySchedule: availabilitySchedule || "all_day",
    });
    res.json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
});

adminRouter.delete("/categories/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await storage.deleteMenuCategory(id);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
});

// === Restaurant Settings ===

adminRouter.get("/restaurant", async (_req: Request, res: Response) => {
  try {
    const restaurant = await storage.getRestaurant(1);
    res.json(restaurant || { error: "No restaurant configured" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch restaurant" });
  }
});

adminRouter.put("/restaurant", async (req: Request, res: Response) => {
  try {
    const restaurant = await storage.updateRestaurant(1, req.body);
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: "Failed to update restaurant" });
  }
});

// === Analytics ===

adminRouter.get("/analytics", async (_req: Request, res: Response) => {
  try {
    const allOrders = await storage.getOrdersByRestaurant(1);
    const menuItemsList = await storage.getMenuItems(1);

    const totalOrders = allOrders.length;
    const totalRevenue = allOrders.reduce((sum, o) => sum + parseFloat(o.total as string || "0"), 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Orders by status
    const byStatus: Record<string, number> = {};
    allOrders.forEach(o => { byStatus[o.status || 'pending'] = (byStatus[o.status || 'pending'] || 0) + 1; });

    // Item popularity from orders
    const itemCounts: Record<string, number> = {};
    allOrders.forEach(o => {
      try {
        const items = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
        if (Array.isArray(items)) {
          items.forEach((item: any) => {
            itemCounts[item.name] = (itemCounts[item.name] || 0) + (item.quantity || 1);
          });
        }
      } catch {}
    });

    const popularItems = Object.entries(itemCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    // Orders by hour (mock distribution)
    const ordersByHour: Record<number, number> = {};
    allOrders.forEach(o => {
      if (o.createdAt) {
        const hour = new Date(o.createdAt).getHours();
        ordersByHour[hour] = (ordersByHour[hour] || 0) + 1;
      }
    });

    res.json({
      totalOrders,
      totalRevenue: totalRevenue.toFixed(2),
      avgOrderValue: avgOrderValue.toFixed(2),
      totalMenuItems: menuItemsList.length,
      byStatus,
      popularItems,
      ordersByHour,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});
