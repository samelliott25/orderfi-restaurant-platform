import { pgTable, text, serial, integer, boolean, decimal, timestamp, date, json, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const restaurants = pgTable("restaurants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  cuisineType: text("cuisine_type"),
  tone: text("tone").default("friendly"),
  welcomeMessage: text("welcome_message"),
  isActive: boolean("is_active").default(true),
});

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").references(() => restaurants.id),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  costPrice: decimal("cost_price", { precision: 10, scale: 2 }),
  category: text("category").notNull(),
  tags: text("tags").array(),
  
  // AI conversation metadata
  aliases: text("aliases").array(), // ["burger", "cheeseburger", "beef burger"]
  keywords: text("keywords").array(), // ["beef", "cheese", "grilled", "american"]
  dietaryTags: text("dietary_tags").array(), // ["vegetarian", "gluten-free", "spicy"]
  allergens: text("allergens").array(), // ["dairy", "gluten", "nuts"]
  
  // Inventory & availability
  isAvailable: boolean("is_available").default(true),
  currentStock: integer("current_stock").default(0),
  lowStockThreshold: integer("low_stock_threshold").default(5),
  trackInventory: boolean("track_inventory").default(false),
  preparationTime: integer("preparation_time").default(15), // minutes
  
  // AI recommendation & reporting data
  popularityScore: integer("popularity_score").default(0),
  profitMargin: decimal("profit_margin", { precision: 5, scale: 2 }),
  totalOrdered: integer("total_ordered").default(0),
  revenueGenerated: decimal("revenue_generated", { precision: 12, scale: 2 }).default("0"),
  lastRecommended: timestamp("last_recommended"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").references(() => restaurants.id),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").references(() => restaurants.id),
  customerName: text("customer_name"),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone"),
  tableNumber: text("table_number"),
  items: text("items").notNull(), // JSON string of order items
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  tax: decimal("tax", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text("payment_method"), // 'usdc', 'credit', 'cash'
  paymentId: text("payment_id"),
  transactionId: text("transaction_id"),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  message: text("message").notNull(),
  isUser: boolean("is_user").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// AI reporting and analytics support for verbal queries
export const reportingQueries = pgTable("reporting_queries", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").references(() => restaurants.id),
  sessionId: text("session_id").notNull(),
  
  // Query context
  queryType: text("query_type").notNull(), // "sales_report", "inventory_status", "popular_items"
  naturalLanguageQuery: text("natural_language_query").notNull(), // "show me today's best sellers"
  interpretedQuery: json("interpreted_query"), // Structured query parameters
  
  // Report data
  reportData: json("report_data"), // Generated report results
  reportFormat: text("report_format").default("verbal"), // verbal, chart, table
  
  // Performance tracking
  executionTime: integer("execution_time"), // milliseconds
  dataPoints: integer("data_points"), // number of records analyzed
  
  createdAt: timestamp("created_at").defaultNow(),
});

// AI intent patterns for management and reporting
export const aiIntentPatterns = pgTable("ai_intent_patterns", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").references(() => restaurants.id),
  
  intentType: text("intent_type").notNull(), // "price_change", "sales_report", "inventory_check"
  triggerPhrases: text("trigger_phrases").array(), // ["show me sales", "what's selling well", "top items"]
  extractionPattern: text("extraction_pattern"), // Regex or NLP pattern
  confirmationTemplate: text("confirmation_template"), // "Show {{period}} sales for {{items}}?"
  
  successResponse: text("success_response"),
  errorResponse: text("error_response"),
  
  isActive: boolean("is_active").default(true),
});

// Sales data for AI reporting (enhanced order tracking)
export const salesData = pgTable("sales_data", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").references(() => restaurants.id),
  itemId: integer("item_id").references(() => menuItems.id),
  orderId: integer("order_id").references(() => orders.id),
  
  // Sale details
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  modifiers: json("modifiers"), // Applied modifiers
  
  // Time-based reporting
  saleDate: date("sale_date").notNull(),
  saleHour: integer("sale_hour"), // 0-23 for hourly reporting
  dayOfWeek: integer("day_of_week"), // 1-7 for weekly patterns
  
  createdAt: timestamp("created_at").defaultNow(),
});

// AI conversation tracking for menu management
export const menuConversations = pgTable("menu_conversations", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").references(() => restaurants.id),
  sessionId: text("session_id").notNull(),
  
  // Change tracking
  actionType: text("action_type").notNull(), // "add_item", "update_price", "toggle_availability"
  targetItemId: integer("target_item_id").references(() => menuItems.id),
  previousValue: json("previous_value"),
  newValue: json("new_value"),
  
  // Natural language context
  userIntent: text("user_intent"), // "make the burger more expensive"
  aiInterpretation: text("ai_interpretation"), // "Increasing burger price from $12 to $15"
  confidenceScore: decimal("confidence_score", { precision: 3, scale: 2 }),
  
  // Change management
  changeStatus: text("change_status").default("pending"), // pending, confirmed, rejected
  requiresConfirmation: boolean("requires_confirmation").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertRestaurantSchema = createInsertSchema(restaurants).omit({
  id: true,
});

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
}).extend({
  category: z.string().optional(), // Make category optional for auto-categorization
});

export const insertFaqSchema = createInsertSchema(faqs).omit({
  id: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
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

export type Restaurant = typeof restaurants.$inferSelect;
export type InsertRestaurant = z.infer<typeof insertRestaurantSchema>;
export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type FAQ = typeof faqs.$inferSelect;
export type InsertFAQ = z.infer<typeof insertFaqSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

// AI reporting types
export type ReportingQuery = typeof reportingQueries.$inferSelect;
export type InsertReportingQuery = z.infer<typeof insertReportingQuerySchema>;
export type AiIntentPattern = typeof aiIntentPatterns.$inferSelect;
export type InsertAiIntentPattern = z.infer<typeof insertAiIntentPatternSchema>;
export type SalesData = typeof salesData.$inferSelect;
export type InsertSalesData = z.infer<typeof insertSalesDataSchema>;
export type MenuConversation = typeof menuConversations.$inferSelect;
export type InsertMenuConversation = z.infer<typeof insertMenuConversationSchema>;
