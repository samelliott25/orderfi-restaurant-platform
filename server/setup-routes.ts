import { Router, Request, Response } from "express";
import { z } from "zod";
import { storage } from "./storage";

export const setupRouter = Router();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Generate a URL-safe slug from a restaurant name.
 * Lowercases, replaces whitespace runs with a single hyphen, strips any
 * character that isn't alphanumeric or a hyphen, and appends a random 4-char
 * suffix to avoid collisions.
 */
function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const suffix = Math.random().toString(36).substring(2, 6);
  return base ? `${base}-${suffix}` : suffix;
}

/**
 * Round a number to two decimal places (currency precision).
 */
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

// ---------------------------------------------------------------------------
// Validation schemas
// ---------------------------------------------------------------------------

const operatingHoursEntrySchema = z.object({
  open: z.string(),
  close: z.string(),
  closed: z.boolean().optional(),
});

const createRestaurantSchema = z.object({
  name: z.string().min(1, "Restaurant name is required").max(200),
  slug: z.string().optional(),
  description: z.string().optional(),
  cuisineType: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  currency: z.string().optional(),
  taxRate: z.union([z.string(), z.number()]).optional(),
  tippingEnabled: z.boolean().optional(),
  tipPresets: z.array(z.number()).optional(),
  splitBillEnabled: z.boolean().optional(),
  operatingHours: z.record(z.string(), operatingHoursEntrySchema).optional(),
  dineInEnabled: z.boolean().optional(),
  takeawayEnabled: z.boolean().optional(),
  voiceOrderingEnabled: z.boolean().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
});

const updateRestaurantSchema = createRestaurantSchema.partial();

const generateTablesSchema = z.object({
  restaurantId: z.number().int().positive(),
  count: z.number().int().positive().max(200),
  prefix: z.string().optional().default("T"),
});

const createOrderSchema = z.object({
  items: z.array(
    z.object({
      menuItemId: z.number().int().positive(),
      quantity: z.number().int().positive().default(1),
      modifiers: z.any().optional(),
      specialInstructions: z.string().optional(),
    }),
  ).min(1, "At least one item is required"),
  tableId: z.number().int().positive().optional(),
  customerName: z.string().optional(),
  customerEmail: z.string().email().optional().or(z.literal("")),
  tipAmount: z.union([z.string(), z.number()]).optional(),
  specialInstructions: z.string().optional(),
});

const addTipSchema = z.object({
  tipAmount: z.union([z.string(), z.number()]).refine(
    (v) => {
      const n = typeof v === "string" ? parseFloat(v) : v;
      return !isNaN(n) && n >= 0;
    },
    { message: "Tip amount must be a non-negative number" },
  ),
});

const splitBillSchema = z.object({
  splits: z.array(
    z.object({
      name: z.string().min(1),
      amount: z.number().optional(),
      items: z.array(z.number()).optional(),
      percentage: z.number().min(0).max(100).optional(),
    }),
  ).min(2, "At least two splits are required"),
});

// ===========================================================================
// 1. POST /api/setup/restaurant  --  Create a new restaurant
// ===========================================================================
setupRouter.post("/setup/restaurant", async (req: Request, res: Response) => {
  try {
    const parsed = createRestaurantSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }

    const data = parsed.data;

    // Generate slug from name (or use provided slug after sanitisation)
    let slug = data.slug ? generateSlug(data.slug) : generateSlug(data.name);

    // Ensure uniqueness – if it already exists, re-generate with a different suffix
    let existing = await storage.getRestaurantBySlug(slug);
    while (existing) {
      slug = generateSlug(data.name);
      existing = await storage.getRestaurantBySlug(slug);
    }

    const taxRate = data.taxRate !== undefined ? String(data.taxRate) : "0.10";

    const restaurant = await storage.createRestaurant({
      name: data.name,
      slug,
      description: data.description,
      cuisineType: data.cuisineType,
      phone: data.phone,
      email: data.email || undefined,
      address: data.address,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      country: data.country,
      currency: data.currency,
      taxRate,
      tippingEnabled: data.tippingEnabled,
      tipPresets: data.tipPresets,
      splitBillEnabled: data.splitBillEnabled,
      operatingHours: data.operatingHours,
      dineInEnabled: data.dineInEnabled,
      takeawayEnabled: data.takeawayEnabled,
      voiceOrderingEnabled: data.voiceOrderingEnabled,
      primaryColor: data.primaryColor,
      secondaryColor: data.secondaryColor,
      isActive: true,
      setupCompleted: false,
    });

    res.status(201).json(restaurant);
  } catch (error: any) {
    console.error("Error creating restaurant:", error);
    res.status(500).json({ error: error.message || "Failed to create restaurant" });
  }
});

// ===========================================================================
// 2. PUT /api/setup/restaurant/:id  --  Update restaurant settings
// ===========================================================================
setupRouter.put("/setup/restaurant/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid restaurant ID" });
    }

    const parsed = updateRestaurantSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }

    const data = parsed.data;

    // Build update payload, only including fields that were actually provided
    const update: Record<string, unknown> = {};
    if (data.name !== undefined) update.name = data.name;
    if (data.description !== undefined) update.description = data.description;
    if (data.cuisineType !== undefined) update.cuisineType = data.cuisineType;
    if (data.phone !== undefined) update.phone = data.phone;
    if (data.email !== undefined) update.email = data.email;
    if (data.address !== undefined) update.address = data.address;
    if (data.city !== undefined) update.city = data.city;
    if (data.state !== undefined) update.state = data.state;
    if (data.postalCode !== undefined) update.postalCode = data.postalCode;
    if (data.country !== undefined) update.country = data.country;
    if (data.currency !== undefined) update.currency = data.currency;
    if (data.taxRate !== undefined) update.taxRate = String(data.taxRate);
    if (data.tippingEnabled !== undefined) update.tippingEnabled = data.tippingEnabled;
    if (data.tipPresets !== undefined) update.tipPresets = data.tipPresets;
    if (data.splitBillEnabled !== undefined) update.splitBillEnabled = data.splitBillEnabled;
    if (data.operatingHours !== undefined) update.operatingHours = data.operatingHours;
    if (data.dineInEnabled !== undefined) update.dineInEnabled = data.dineInEnabled;
    if (data.takeawayEnabled !== undefined) update.takeawayEnabled = data.takeawayEnabled;
    if (data.voiceOrderingEnabled !== undefined) update.voiceOrderingEnabled = data.voiceOrderingEnabled;
    if (data.primaryColor !== undefined) update.primaryColor = data.primaryColor;
    if (data.secondaryColor !== undefined) update.secondaryColor = data.secondaryColor;

    // If name changed, regenerate slug
    if (data.name) {
      let slug = generateSlug(data.name);
      let existing = await storage.getRestaurantBySlug(slug);
      while (existing && existing.id !== id) {
        slug = generateSlug(data.name);
        existing = await storage.getRestaurantBySlug(slug);
      }
      update.slug = slug;
    }

    const restaurant = await storage.updateRestaurant(id, update);
    res.json(restaurant);
  } catch (error: any) {
    console.error("Error updating restaurant:", error);
    if (error.message === "Restaurant not found") {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    res.status(500).json({ error: error.message || "Failed to update restaurant" });
  }
});

// ===========================================================================
// 3. POST /api/setup/tables/generate  --  Bulk-generate tables
// ===========================================================================
setupRouter.post("/setup/tables/generate", async (req: Request, res: Response) => {
  try {
    const parsed = generateTablesSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }

    const { restaurantId, count, prefix } = parsed.data;

    // Look up the restaurant to get its slug for QR code IDs
    const restaurant = await storage.getRestaurant(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    const createdTables: Awaited<ReturnType<typeof storage.createTable>>[] = [];
    for (let i = 1; i <= count; i++) {
      const tableNumber = `${prefix}${i}`;
      const qrCodeId = `${restaurant.slug}-table-${i}`;

      const table = await storage.createTable({
        restaurantId,
        tableNumber,
        tableName: `${prefix} ${i}`,
        capacity: 4,
        qrCodeId,
        isActive: true,
      });

      createdTables.push(table);
    }

    res.status(201).json({
      created: createdTables.length,
      tables: createdTables,
    });
  } catch (error: any) {
    console.error("Error generating tables:", error);
    res.status(500).json({ error: error.message || "Failed to generate tables" });
  }
});

// ===========================================================================
// 4. GET /api/restaurant/:slug  --  Public: get restaurant by slug
// ===========================================================================
setupRouter.get("/restaurant/:slug", async (req: Request, res: Response) => {
  try {
    const restaurant = await storage.getRestaurantBySlug(req.params.slug);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    res.json(restaurant);
  } catch (error: any) {
    console.error("Error fetching restaurant:", error);
    res.status(500).json({ error: "Failed to fetch restaurant" });
  }
});

// ===========================================================================
// 5. GET /api/restaurant/:slug/menu  --  Public: full menu grouped by category
// ===========================================================================
setupRouter.get("/restaurant/:slug/menu", async (req: Request, res: Response) => {
  try {
    const restaurant = await storage.getRestaurantBySlug(req.params.slug);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    const [categories, items] = await Promise.all([
      storage.getMenuCategories(restaurant.id),
      storage.getMenuItems(restaurant.id),
    ]);

    // --- Filtering ---
    let filteredItems = items.filter((item) => item.isAvailable);

    // ?dietary=vegetarian,vegan  --  item must have ALL requested dietary tags
    const dietaryParam = req.query.dietary;
    if (dietaryParam && typeof dietaryParam === "string") {
      const requiredTags = dietaryParam.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
      if (requiredTags.length > 0) {
        filteredItems = filteredItems.filter((item) => {
          const itemTags = (item.dietaryTags || []).map((t) => t.toLowerCase());
          return requiredTags.every((tag) => itemTags.includes(tag));
        });
      }
    }

    // ?allergenFree=nuts,dairy  --  item must NOT contain any of the listed allergens
    const allergenFreeParam = req.query.allergenFree;
    if (allergenFreeParam && typeof allergenFreeParam === "string") {
      const excludeAllergens = allergenFreeParam.split(",").map((a) => a.trim().toLowerCase()).filter(Boolean);
      if (excludeAllergens.length > 0) {
        filteredItems = filteredItems.filter((item) => {
          const itemAllergens = (item.allergens || []).map((a) => a.toLowerCase());
          return !excludeAllergens.some((allergen) => itemAllergens.includes(allergen));
        });
      }
    }

    // --- Group items by category ---
    const categoryMap = new Map(categories.map((c) => [c.name, c]));

    // Build a map: category name -> items[]
    const grouped: Record<string, typeof filteredItems> = {};
    for (const item of filteredItems) {
      const catName = item.category || "Uncategorised";
      if (!grouped[catName]) {
        grouped[catName] = [];
      }
      grouped[catName].push(item);
    }

    // Produce ordered output based on category displayOrder
    const menu = categories
      .filter((cat) => grouped[cat.name] && grouped[cat.name].length > 0)
      .map((cat) => ({
        category: {
          id: cat.id,
          name: cat.name,
          description: cat.description,
          displayOrder: cat.displayOrder,
        },
        items: grouped[cat.name],
      }));

    // Append items whose category text doesn't match any MenuCategory record
    const knownCategoryNames = new Set(categories.map((c) => c.name));
    for (const [catName, catItems] of Object.entries(grouped)) {
      if (!knownCategoryNames.has(catName)) {
        menu.push({
          category: {
            id: 0,
            name: catName,
            description: null,
            displayOrder: 999,
          },
          items: catItems,
        });
      }
    }

    res.json({
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        slug: restaurant.slug,
        currency: restaurant.currency,
        taxRate: restaurant.taxRate,
      },
      menu,
    });
  } catch (error: any) {
    console.error("Error fetching menu:", error);
    res.status(500).json({ error: "Failed to fetch menu" });
  }
});

// ===========================================================================
// 6. GET /api/restaurant/:slug/table/:qrCodeId  --  Public: table info via QR
// ===========================================================================
setupRouter.get("/restaurant/:slug/table/:qrCodeId", async (req: Request, res: Response) => {
  try {
    const restaurant = await storage.getRestaurantBySlug(req.params.slug);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    const table = await storage.getTableByQrCode(req.params.qrCodeId);
    if (!table || table.restaurantId !== restaurant.id) {
      return res.status(404).json({ error: "Table not found" });
    }

    res.json({
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        slug: restaurant.slug,
        currency: restaurant.currency,
        taxRate: restaurant.taxRate,
        tippingEnabled: restaurant.tippingEnabled,
        tipPresets: restaurant.tipPresets,
        splitBillEnabled: restaurant.splitBillEnabled,
        operatingHours: restaurant.operatingHours,
        primaryColor: restaurant.primaryColor,
        secondaryColor: restaurant.secondaryColor,
      },
      table: {
        id: table.id,
        tableNumber: table.tableNumber,
        tableName: table.tableName,
        capacity: table.capacity,
        section: table.section,
        qrCodeId: table.qrCodeId,
      },
    });
  } catch (error: any) {
    console.error("Error fetching table:", error);
    res.status(500).json({ error: "Failed to fetch table info" });
  }
});

// ===========================================================================
// 7. POST /api/restaurant/:slug/order  --  Public: create an order
// ===========================================================================
setupRouter.post("/restaurant/:slug/order", async (req: Request, res: Response) => {
  try {
    const restaurant = await storage.getRestaurantBySlug(req.params.slug);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }

    const data = parsed.data;

    // Resolve menu items and calculate subtotal server-side
    const resolvedItems: Array<{
      menuItemId: number;
      name: string;
      price: string;
      quantity: number;
      modifiers?: unknown;
      specialInstructions?: string;
      lineTotal: number;
    }> = [];

    let subtotal = 0;

    for (const entry of data.items) {
      const menuItem = await storage.getMenuItem(entry.menuItemId);
      if (!menuItem) {
        return res.status(400).json({ error: `Menu item with id ${entry.menuItemId} not found` });
      }
      if (menuItem.restaurantId !== restaurant.id) {
        return res.status(400).json({ error: `Menu item ${entry.menuItemId} does not belong to this restaurant` });
      }
      if (!menuItem.isAvailable) {
        return res.status(400).json({ error: `"${menuItem.name}" is currently unavailable` });
      }

      const unitPrice = parseFloat(menuItem.price);
      const lineTotal = round2(unitPrice * entry.quantity);
      subtotal = round2(subtotal + lineTotal);

      resolvedItems.push({
        menuItemId: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: entry.quantity,
        modifiers: entry.modifiers,
        specialInstructions: entry.specialInstructions,
        lineTotal,
      });
    }

    // Tax calculation
    const taxRate = parseFloat(restaurant.taxRate || "0");
    const tax = round2(subtotal * taxRate);
    const tipAmount = data.tipAmount !== undefined ? round2(parseFloat(String(data.tipAmount))) : 0;
    const total = round2(subtotal + tax + tipAmount);

    const order = await storage.createOrder({
      restaurantId: restaurant.id,
      tableId: data.tableId ?? null,
      customerName: data.customerName,
      customerEmail: data.customerEmail || undefined,
      items: JSON.stringify(resolvedItems),
      specialInstructions: data.specialInstructions,
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      tipAmount: tipAmount.toFixed(2),
      total: total.toFixed(2),
      status: "pending",
      paymentStatus: "unpaid",
      orderType: "dine_in",
    });

    res.status(201).json(order);
  } catch (error: any) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: error.message || "Failed to create order" });
  }
});

// ===========================================================================
// 8. GET /api/restaurant/:slug/order/:orderId  --  Public: order status
// ===========================================================================
setupRouter.get("/restaurant/:slug/order/:orderId", async (req: Request, res: Response) => {
  try {
    const restaurant = await storage.getRestaurantBySlug(req.params.slug);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    const orderId = parseInt(req.params.orderId, 10);
    if (isNaN(orderId)) {
      return res.status(400).json({ error: "Invalid order ID" });
    }

    const order = await storage.getOrder(orderId);
    if (!order || order.restaurantId !== restaurant.id) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Parse items back from JSON string for the response
    let items: unknown;
    try {
      items = typeof order.items === "string" ? JSON.parse(order.items) : order.items;
    } catch {
      items = order.items;
    }

    res.json({
      id: order.id,
      status: order.status,
      items,
      subtotal: order.subtotal,
      tax: order.tax,
      tipAmount: order.tipAmount,
      total: order.total,
      specialInstructions: order.specialInstructions,
      customerName: order.customerName,
      tableId: order.tableId,
      tableNumber: order.tableNumber,
      paymentStatus: order.paymentStatus,
      isSplit: order.isSplit,
      splitDetails: order.splitDetails,
      estimatedReadyTime: order.estimatedReadyTime,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    });
  } catch (error: any) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

// ===========================================================================
// 9. POST /api/restaurant/:slug/order/:orderId/tip  --  Add / update tip
// ===========================================================================
setupRouter.post("/restaurant/:slug/order/:orderId/tip", async (req: Request, res: Response) => {
  try {
    const restaurant = await storage.getRestaurantBySlug(req.params.slug);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    if (!restaurant.tippingEnabled) {
      return res.status(400).json({ error: "Tipping is not enabled for this restaurant" });
    }

    const orderId = parseInt(req.params.orderId, 10);
    if (isNaN(orderId)) {
      return res.status(400).json({ error: "Invalid order ID" });
    }

    const order = await storage.getOrder(orderId);
    if (!order || order.restaurantId !== restaurant.id) {
      return res.status(404).json({ error: "Order not found" });
    }

    const parsed = addTipSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }

    const newTip = round2(parseFloat(String(parsed.data.tipAmount)));
    const oldTip = parseFloat(order.tipAmount as string) || 0;
    const oldTotal = parseFloat(order.total as string) || 0;
    const newTotal = round2(oldTotal - oldTip + newTip);

    const updatedOrder = await storage.updateOrder(orderId, {
      tipAmount: newTip.toFixed(2),
      total: newTotal.toFixed(2),
    });

    res.json(updatedOrder);
  } catch (error: any) {
    console.error("Error updating tip:", error);
    if (error.message?.includes("not found")) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(500).json({ error: error.message || "Failed to update tip" });
  }
});

// ===========================================================================
// 10. POST /api/restaurant/:slug/order/:orderId/split  --  Split a bill
// ===========================================================================
setupRouter.post("/restaurant/:slug/order/:orderId/split", async (req: Request, res: Response) => {
  try {
    const restaurant = await storage.getRestaurantBySlug(req.params.slug);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    if (!restaurant.splitBillEnabled) {
      return res.status(400).json({ error: "Bill splitting is not enabled for this restaurant" });
    }

    const orderId = parseInt(req.params.orderId, 10);
    if (isNaN(orderId)) {
      return res.status(400).json({ error: "Invalid order ID" });
    }

    const order = await storage.getOrder(orderId);
    if (!order || order.restaurantId !== restaurant.id) {
      return res.status(404).json({ error: "Order not found" });
    }

    const parsed = splitBillSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }

    const orderTotal = parseFloat(order.total as string) || 0;

    // Parse order items so we can do item-based splits
    let orderItems: Array<{ lineTotal?: number; price?: string; quantity?: number }> = [];
    try {
      orderItems = typeof order.items === "string" ? JSON.parse(order.items) : (order.items as any) || [];
    } catch {
      orderItems = [];
    }

    const splitDetails: Array<{
      name: string;
      amount: number;
      items?: number[];
      paid: boolean;
    }> = [];

    for (const split of parsed.data.splits) {
      let amount: number;

      if (split.amount !== undefined) {
        // Explicit amount
        amount = round2(split.amount);
      } else if (split.percentage !== undefined) {
        // Percentage of total
        amount = round2(orderTotal * (split.percentage / 100));
      } else if (split.items && split.items.length > 0) {
        // Sum of specific item line totals (indices into the order items array)
        amount = 0;
        for (const idx of split.items) {
          const item = orderItems[idx];
          if (item) {
            if (item.lineTotal !== undefined) {
              amount = round2(amount + item.lineTotal);
            } else if (item.price !== undefined) {
              const qty = item.quantity || 1;
              amount = round2(amount + parseFloat(String(item.price)) * qty);
            }
          }
        }
      } else {
        // Equal split (fallback)
        amount = round2(orderTotal / parsed.data.splits.length);
      }

      splitDetails.push({
        name: split.name,
        amount,
        items: split.items,
        paid: false,
      });
    }

    const updatedOrder = await storage.updateOrder(orderId, {
      isSplit: true,
      splitDetails,
    });

    res.json({
      orderId: updatedOrder.id,
      total: orderTotal,
      splits: splitDetails,
    });
  } catch (error: any) {
    console.error("Error splitting bill:", error);
    if (error.message?.includes("not found")) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(500).json({ error: error.message || "Failed to split bill" });
  }
});
