import { Router, Request, Response } from "express";
import { db } from "./db";
import { menuItems, orders } from "../shared/schema";
import { eq, desc } from "drizzle-orm";
import { ObjectStorageService } from "./replit_integrations/object_storage";
import { z } from "zod";
import { getUncachableStripeClient } from "./stripeClient";
import OpenAI from "openai";

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
const objectStorage = new ObjectStorageService();

// Get all menu items for admin
adminRouter.get("/menu", async (req: Request, res: Response) => {
  try {
    const items = await db.select().from(menuItems).orderBy(menuItems.category, menuItems.name);
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
    await db.delete(menuItems).where(eq(menuItems.id, id));
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ error: "Failed to delete menu item" });
  }
});

// Get recent orders for admin
adminRouter.get("/orders", async (req: Request, res: Response) => {
  try {
    const recentOrders = await db.select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(50);
    res.json(recentOrders);
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
    
    const [order] = await db.update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    res.json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

// Get upload URL for menu item photos
adminRouter.post("/upload-url", async (req: Request, res: Response) => {
  try {
    const uploadURL = await objectStorage.getObjectEntityUploadURL();
    const objectPath = objectStorage.normalizeObjectEntityPath(uploadURL);
    res.json({ uploadURL, objectPath });
  } catch (error) {
    console.error("Error generating upload URL:", error);
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
});

// Get single order details
adminRouter.get("/orders/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    
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

    const mimeMatch = image.match(/^data:(image\/(jpeg|png|webp|gif));base64,/);
    if (!image.startsWith("data:image/")) {
      return res.status(400).json({ error: "Invalid image format. Please upload a JPG, PNG, or WEBP image." });
    }

    if (!process.env.XAI_API_KEY) {
      return res.status(500).json({ error: "AI service not configured" });
    }

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
