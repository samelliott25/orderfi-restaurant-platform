import { pgTable, text, serial, integer, boolean, decimal, timestamp, date, json, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ===== CORE RESTAURANT =====

export const restaurants = pgTable("restaurants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // URL-safe slug for /menu/:slug
  description: text("description"),
  cuisineType: text("cuisine_type"),
  tone: text("tone").default("friendly"),
  welcomeMessage: text("welcome_message"),
  logoUrl: text("logo_url"),
  coverImageUrl: text("cover_image_url"),
  primaryColor: text("primary_color").default("#E23D28"),
  secondaryColor: text("secondary_color").default("#FF6B35"),

  // Contact & location
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  postalCode: text("postal_code"),
  country: text("country").default("AU"),
  timezone: text("timezone").default("Australia/Sydney"),

  // Business settings
  currency: text("currency").default("AUD"),
  taxRate: decimal("tax_rate", { precision: 5, scale: 4 }).default("0.10"), // 10% GST
  serviceChargeRate: decimal("service_charge_rate", { precision: 5, scale: 4 }).default("0"),
  tippingEnabled: boolean("tipping_enabled").default(true),
  tipPresets: json("tip_presets").$type<number[]>().default([10, 15, 20]),
  splitBillEnabled: boolean("split_bill_enabled").default(true),

  // Operating hours: { "mon": { "open": "11:00", "close": "22:00" }, ... }
  operatingHours: json("operating_hours").$type<Record<string, { open: string; close: string; closed?: boolean }>>(),

  // Ordering modes
  dineInEnabled: boolean("dine_in_enabled").default(true),
  takeawayEnabled: boolean("takeaway_enabled").default(false),
  deliveryEnabled: boolean("delivery_enabled").default(false),
  voiceOrderingEnabled: boolean("voice_ordering_enabled").default(true),

  // Setup status
  setupCompleted: boolean("setup_completed").default(false),
  isActive: boolean("is_active").default(true),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ===== TABLES & QR CODES =====

export const tables = pgTable("tables", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").references(() => restaurants.id).notNull(),
  tableNumber: text("table_number").notNull(), // "1", "2", "A1", "Patio-3"
  tableName: text("table_name"), // "Window Seat", "Private Booth"
  capacity: integer("capacity").default(4),
  section: text("section"), // "Indoor", "Outdoor", "Bar", "VIP"
  qrCodeId: text("qr_code_id").notNull(), // Unique QR identifier
  isActive: boolean("is_active").default(true),
  currentOrderId: integer("current_order_id"), // Active order at this table
  createdAt: timestamp("created_at").defaultNow(),
});

// ===== MENU SYSTEM =====

export const menuCategories = pgTable("menu_categories", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").references(() => restaurants.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  displayOrder: integer("display_order").default(0),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),

  // Time-based availability: "breakfast", "lunch", "dinner", "happy_hour", "all_day"
  availabilitySchedule: text("availability_schedule").default("all_day"),
  // Custom time range: { "start": "11:00", "end": "15:00" }
  customTimeRange: json("custom_time_range").$type<{ start: string; end: string } | null>(),
});

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").references(() => restaurants.id),
  categoryId: integer("category_id").references(() => menuCategories.id),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  costPrice: decimal("cost_price", { precision: 10, scale: 2 }),
  category: text("category").notNull(), // Legacy text category for backward compat

  // Rich media
  photoUrl: text("photo_url"),
  reviewsUrl: text("reviews_url"),

  // AI conversation metadata
  aliases: text("aliases").array(),
  keywords: text("keywords").array(),
  weightedKeywords: json("weighted_keywords").$type<Record<string, number>>(),
  dietaryTags: text("dietary_tags").array(), // ["vegetarian", "gluten-free", "spicy", "vegan", "dairy-free", "nut-free", "halal", "kosher"]
  allergens: text("allergens").array(), // ["dairy", "gluten", "nuts", "shellfish", "eggs", "soy"]
  tags: text("tags").array(),

  // Customization options: [{ "name": "Size", "options": [{ "label": "Regular", "price": 0 }, { "label": "Large", "price": 3 }] }]
  modifierGroups: json("modifier_groups").$type<Array<{
    name: string;
    required: boolean;
    maxSelections: number;
    options: Array<{ label: string; price: number }>;
  }>>(),

  // Inventory & availability
  isAvailable: boolean("is_available").default(true),
  currentStock: integer("current_stock").default(0),
  lowStockThreshold: integer("low_stock_threshold").default(5),
  trackInventory: boolean("track_inventory").default(false),
  preparationTime: integer("preparation_time").default(15),

  // Time-based availability
  availabilitySchedule: text("availability_schedule").default("all_day"),
  customTimeRange: json("custom_time_range").$type<{ start: string; end: string } | null>(),

  // AI recommendation & reporting data
  popularityScore: integer("popularity_score").default(0),
  profitMargin: decimal("profit_margin", { precision: 5, scale: 2 }),
  totalOrdered: integer("total_ordered").default(0),
  revenueGenerated: decimal("revenue_generated", { precision: 12, scale: 2 }).default("0"),
  lastRecommended: timestamp("last_recommended"),

  // Display
  displayOrder: integer("display_order").default(0),
  isFeatured: boolean("is_featured").default(false),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ===== ORDERS =====

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").references(() => restaurants.id),
  tableId: integer("table_id").references(() => tables.id),
  tableNumber: text("table_number"),
  orderType: text("order_type").default("dine_in"), // "dine_in", "takeaway", "delivery"

  // Customer info
  customerName: text("customer_name"),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone"),
  customerId: integer("customer_id").references(() => customers.id),

  // Order content
  items: text("items").notNull(), // JSON string of order items
  specialInstructions: text("special_instructions"),

  // Pricing
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  tax: decimal("tax", { precision: 10, scale: 2 }).notNull(),
  tipAmount: decimal("tip_amount", { precision: 10, scale: 2 }).default("0"),
  serviceCharge: decimal("service_charge", { precision: 10, scale: 2 }).default("0"),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),

  // Payment
  paymentMethod: text("payment_method"), // 'card', 'apple_pay', 'google_pay', 'cash'
  paymentId: text("payment_id"),
  transactionId: text("transaction_id"),
  paymentStatus: text("payment_status").default("unpaid"), // "unpaid", "paid", "partial", "refunded"

  // Status flow: pending -> confirmed -> preparing -> ready -> completed
  status: text("status").default("pending"),
  estimatedReadyTime: timestamp("estimated_ready_time"),

  // Split bill tracking
  isSplit: boolean("is_split").default(false),
  splitDetails: json("split_details").$type<Array<{
    name: string;
    amount: number;
    items?: number[];
    paymentId?: string;
    paid: boolean;
  }>>(),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ===== CUSTOMERS =====

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").references(() => restaurants.id),
  name: text("name"),
  email: text("email"),
  phone: text("phone"),
  dietaryPreferences: text("dietary_preferences").array(), // ["vegetarian", "gluten-free"]
  allergens: text("allergens").array(),
  favoriteItems: json("favorite_items").$type<number[]>(), // menu item IDs
  totalOrders: integer("total_orders").default(0),
  totalSpent: decimal("total_spent", { precision: 12, scale: 2 }).default("0"),
  lastVisit: timestamp("last_visit"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ===== DIGITAL RECEIPTS =====

export const receipts = pgTable("receipts", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  restaurantId: integer("restaurant_id").references(() => restaurants.id).notNull(),
  customerEmail: text("customer_email"),
  receiptData: json("receipt_data"), // Full receipt JSON
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ===== EXISTING TABLES (kept for backward compatibility) =====

export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").references(() => restaurants.id),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  message: text("message").notNull(),
  isUser: boolean("is_user").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const reportingQueries = pgTable("reporting_queries", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").references(() => restaurants.id),
  sessionId: text("session_id").notNull(),
  queryType: text("query_type").notNull(),
  naturalLanguageQuery: text("natural_language_query").notNull(),
  interpretedQuery: json("interpreted_query"),
  reportData: json("report_data"),
  reportFormat: text("report_format").default("verbal"),
  executionTime: integer("execution_time"),
  dataPoints: integer("data_points"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const aiIntentPatterns = pgTable("ai_intent_patterns", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").references(() => restaurants.id),
  intentType: text("intent_type").notNull(),
  triggerPhrases: text("trigger_phrases").array(),
  extractionPattern: text("extraction_pattern"),
  confirmationTemplate: text("confirmation_template"),
  successResponse: text("success_response"),
  errorResponse: text("error_response"),
  isActive: boolean("is_active").default(true),
});

export const salesData = pgTable("sales_data", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").references(() => restaurants.id),
  itemId: integer("item_id").references(() => menuItems.id),
  orderId: integer("order_id").references(() => orders.id),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  modifiers: json("modifiers"),
  saleDate: date("sale_date").notNull(),
  saleHour: integer("sale_hour"),
  dayOfWeek: integer("day_of_week"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const menuConversations = pgTable("menu_conversations", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").references(() => restaurants.id),
  sessionId: text("session_id").notNull(),
  actionType: text("action_type").notNull(),
  targetItemId: integer("target_item_id").references(() => menuItems.id),
  previousValue: json("previous_value"),
  newValue: json("new_value"),
  userIntent: text("user_intent"),
  aiInterpretation: text("ai_interpretation"),
  confidenceScore: decimal("confidence_score", { precision: 3, scale: 2 }),
  changeStatus: text("change_status").default("pending"),
  requiresConfirmation: boolean("requires_confirmation").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const copilotFeedback = pgTable("copilot_feedback", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  userMessage: text("user_message").notNull(),
  copilotResponse: text("copilot_response").notNull(),
  feedbackType: text("feedback_type").notNull(),
  pageContext: text("page_context"),
  sentiment: text("sentiment"),
  resolved: boolean("resolved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// ===== INSERT SCHEMAS =====

export const insertRestaurantSchema = createInsertSchema(restaurants).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTableSchema = createInsertSchema(tables).omit({
  id: true,
  createdAt: true,
});

export const insertMenuCategorySchema = createInsertSchema(menuCategories).omit({
  id: true,
});

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
}).extend({
  category: z.string().optional(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
});

export const insertReceiptSchema = createInsertSchema(receipts).omit({
  id: true,
  createdAt: true,
});

export const insertFaqSchema = createInsertSchema(faqs).omit({
  id: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

export const insertCopilotFeedbackSchema = createInsertSchema(copilotFeedback).omit({
  id: true,
  createdAt: true,
});

export const insertReportingQuerySchema = createInsertSchema(reportingQueries).omit({
  id: true,
  createdAt: true,
});

export const insertAiIntentPatternSchema = createInsertSchema(aiIntentPatterns).omit({
  id: true,
});

export const insertSalesDataSchema = createInsertSchema(salesData).omit({
  id: true,
  createdAt: true,
});

export const insertMenuConversationSchema = createInsertSchema(menuConversations).omit({
  id: true,
  createdAt: true,
});

// ===== TYPES =====

export type Restaurant = typeof restaurants.$inferSelect;
export type InsertRestaurant = z.infer<typeof insertRestaurantSchema>;
export type Table = typeof tables.$inferSelect;
export type InsertTable = z.infer<typeof insertTableSchema>;
export type MenuCategory = typeof menuCategories.$inferSelect;
export type InsertMenuCategory = z.infer<typeof insertMenuCategorySchema>;
export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Receipt = typeof receipts.$inferSelect;
export type InsertReceipt = z.infer<typeof insertReceiptSchema>;
export type FAQ = typeof faqs.$inferSelect;
export type InsertFAQ = z.infer<typeof insertFaqSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ReportingQuery = typeof reportingQueries.$inferSelect;
export type InsertReportingQuery = z.infer<typeof insertReportingQuerySchema>;
export type AiIntentPattern = typeof aiIntentPatterns.$inferSelect;
export type InsertAiIntentPattern = z.infer<typeof insertAiIntentPatternSchema>;
export type SalesData = typeof salesData.$inferSelect;
export type InsertSalesData = z.infer<typeof insertSalesDataSchema>;
export type MenuConversation = typeof menuConversations.$inferSelect;
export type InsertMenuConversation = z.infer<typeof insertMenuConversationSchema>;
export type CopilotFeedback = typeof copilotFeedback.$inferSelect;
export type InsertCopilotFeedback = z.infer<typeof insertCopilotFeedbackSchema>;

// Export auth models
export * from "./models/auth";
