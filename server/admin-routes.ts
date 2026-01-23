import { Router, Request, Response } from "express";
import { db } from "./db";
import { menuItems, orders } from "../shared/schema";
import { eq, desc } from "drizzle-orm";
import { ObjectStorageService } from "./replit_integrations/object_storage";
import { z } from "zod";

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
