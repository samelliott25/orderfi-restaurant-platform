import {
  restaurants,
  menuItems,
  menuCategories,
  tables,
  faqs,
  orders,
  customers,
  receipts,
  chatMessages,
  type Restaurant,
  type InsertRestaurant,
  type MenuItem,
  type InsertMenuItem,
  type MenuCategory,
  type InsertMenuCategory,
  type Table,
  type InsertTable,
  type FAQ,
  type InsertFAQ,
  type Order,
  type InsertOrder,
  type Customer,
  type InsertCustomer,
  type Receipt,
  type InsertReceipt,
  type ChatMessage,
  type InsertChatMessage,
} from "../shared/schema";

export interface IStorage {
  // Restaurant
  getRestaurant(id: number): Promise<Restaurant | undefined>;
  getRestaurantBySlug(slug: string): Promise<Restaurant | undefined>;
  createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant>;
  updateRestaurant(id: number, restaurant: Partial<InsertRestaurant>): Promise<Restaurant>;
  getAllRestaurants(): Promise<Restaurant[]>;

  // Tables
  getTables(restaurantId: number): Promise<Table[]>;
  getTable(id: number): Promise<Table | undefined>;
  getTableByQrCode(qrCodeId: string): Promise<Table | undefined>;
  createTable(table: InsertTable): Promise<Table>;
  updateTable(id: number, table: Partial<InsertTable>): Promise<Table>;
  deleteTable(id: number): Promise<void>;

  // Menu Categories
  getMenuCategories(restaurantId: number): Promise<MenuCategory[]>;
  createMenuCategory(category: InsertMenuCategory): Promise<MenuCategory>;
  updateMenuCategory(id: number, category: Partial<InsertMenuCategory>): Promise<MenuCategory>;
  deleteMenuCategory(id: number): Promise<void>;

  // Menu Items
  getMenuItems(restaurantId: number): Promise<MenuItem[]>;
  getMenuItem(id: number): Promise<MenuItem | undefined>;
  createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, menuItem: Partial<InsertMenuItem>): Promise<MenuItem>;
  deleteMenuItem(id: number): Promise<void>;

  // FAQs
  getFAQs(restaurantId: number): Promise<FAQ[]>;
  createFAQ(faq: InsertFAQ): Promise<FAQ>;
  deleteFAQ(id: number): Promise<void>;

  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrdersByRestaurant(restaurantId: number): Promise<Order[]>;
  getOrdersByCustomer(customerId: string): Promise<Order[]>;
  getOrdersByTable(tableId: number): Promise<Order[]>;
  updateOrder(id: number, order: Partial<InsertOrder>): Promise<Order>;
  getActiveOrders(): Promise<Order[]>;
  updateOrderStatus(orderId: number, status: string): Promise<Order>;

  // Customers
  getCustomer(id: number): Promise<Customer | undefined>;
  getCustomerByEmail(email: string, restaurantId: number): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer>;

  // Receipts
  createReceipt(receipt: InsertReceipt): Promise<Receipt>;
  getReceiptByOrder(orderId: number): Promise<Receipt | undefined>;

  // Chat
  getChatMessages(sessionId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class MemStorage implements IStorage {
  private restaurants: Map<number, Restaurant>;
  private menuItems: Map<number, MenuItem>;
  private menuCategoriesMap: Map<number, MenuCategory>;
  private tablesMap: Map<number, Table>;
  private faqs: Map<number, FAQ>;
  private orders: Map<number, Order>;
  private customersMap: Map<number, Customer>;
  private receiptsMap: Map<number, Receipt>;
  private chatMessages: Map<number, ChatMessage>;

  private currentRestaurantId: number;
  private currentMenuItemId: number;
  private currentMenuCategoryId: number;
  private currentTableId: number;
  private currentFaqId: number;
  private currentOrderId: number;
  private currentCustomerId: number;
  private currentReceiptId: number;
  private currentChatMessageId: number;

  constructor() {
    this.restaurants = new Map();
    this.menuItems = new Map();
    this.menuCategoriesMap = new Map();
    this.tablesMap = new Map();
    this.faqs = new Map();
    this.orders = new Map();
    this.customersMap = new Map();
    this.receiptsMap = new Map();
    this.chatMessages = new Map();

    this.currentRestaurantId = 1;
    this.currentMenuItemId = 1;
    this.currentMenuCategoryId = 1;
    this.currentTableId = 1;
    this.currentFaqId = 1;
    this.currentOrderId = 1;
    this.currentCustomerId = 1;
    this.currentReceiptId = 1;
    this.currentChatMessageId = 1;

    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Create demo restaurant
    const restaurant = await this.createRestaurant({
      name: "Loose Moose",
      slug: "loose-moose",
      description: "A modern Australian pub offering fresh, locally-sourced dishes with creative twists on classic favorites.",
      cuisineType: "Modern Australian",
      tone: "friendly",
      welcomeMessage: "Welcome to Loose Moose! Scan a QR code at your table to start ordering.",
      primaryColor: "#E23D28",
      secondaryColor: "#FF6B35",
      phone: "+61 2 9876 5432",
      email: "hello@loosemoose.com.au",
      address: "123 George Street",
      city: "Sydney",
      state: "NSW",
      postalCode: "2000",
      country: "AU",
      timezone: "Australia/Sydney",
      currency: "AUD",
      taxRate: "0.10",
      tippingEnabled: true,
      tipPresets: [10, 15, 20],
      splitBillEnabled: true,
      dineInEnabled: true,
      takeawayEnabled: true,
      voiceOrderingEnabled: true,
      setupCompleted: true,
      isActive: true,
      operatingHours: {
        mon: { open: "11:30", close: "22:00" },
        tue: { open: "11:30", close: "22:00" },
        wed: { open: "11:30", close: "22:00" },
        thu: { open: "11:30", close: "23:00" },
        fri: { open: "11:30", close: "00:00" },
        sat: { open: "10:00", close: "00:00" },
        sun: { open: "10:00", close: "21:00" },
      },
    });

    // Create categories
    const categories = [
      { restaurantId: restaurant.id, name: "Appetizer", displayOrder: 1, availabilitySchedule: "all_day" as const },
      { restaurantId: restaurant.id, name: "Main Course", displayOrder: 2, availabilitySchedule: "all_day" as const },
      { restaurantId: restaurant.id, name: "Pizza", displayOrder: 3, availabilitySchedule: "all_day" as const },
      { restaurantId: restaurant.id, name: "Steaks", displayOrder: 4, availabilitySchedule: "dinner" as const },
      { restaurantId: restaurant.id, name: "Salad", displayOrder: 5, availabilitySchedule: "all_day" as const },
      { restaurantId: restaurant.id, name: "Side", displayOrder: 6, availabilitySchedule: "all_day" as const },
      { restaurantId: restaurant.id, name: "Dessert", displayOrder: 7, availabilitySchedule: "all_day" as const },
      { restaurantId: restaurant.id, name: "Drinks", displayOrder: 8, availabilitySchedule: "all_day" as const },
    ];
    for (const cat of categories) {
      await this.createMenuCategory(cat);
    }

    // Create tables
    for (let i = 1; i <= 12; i++) {
      await this.createTable({
        restaurantId: restaurant.id,
        tableNumber: String(i),
        tableName: i <= 4 ? "Indoor" : i <= 8 ? "Outdoor" : "Bar",
        capacity: i <= 8 ? 4 : 2,
        section: i <= 4 ? "Indoor" : i <= 8 ? "Outdoor" : "Bar",
        qrCodeId: `lm-table-${i}`,
        isActive: true,
      });
    }

    // Create menu items
    const menuItemsData = [
      { restaurantId: restaurant.id, name: "Salt & Pepper Squid", description: "Aioli & lemon", price: "24.00", category: "Appetizer", dietaryTags: ["gluten-free"], isAvailable: true, isFeatured: true },
      { restaurantId: restaurant.id, name: "Haloumi Fries", description: "Homemade chilli jam, lime yoghurt, pomegranate & mint", price: "25.00", category: "Appetizer", dietaryTags: ["vegetarian"], tags: ["popular"], isAvailable: true },
      { restaurantId: restaurant.id, name: "Korean Fried Chicken", description: "Sweet & sour hot sauce, kewpie mayo, furikake & shallots", price: "25.00", category: "Appetizer", dietaryTags: ["spicy"], tags: ["popular"], isAvailable: true, isFeatured: true },
      { restaurantId: restaurant.id, name: "Buffalo Wings - Sweet Jesus", description: "Maple & smoky BBQ, served with tangy ranch", price: "22.00", category: "Appetizer", isAvailable: true },
      { restaurantId: restaurant.id, name: "Jalapeno Poppers", description: "Beer battered jalapenos, sundried tomato & roasted pepper cream cheese, dukkha, tangy ranch", price: "18.00", category: "Appetizer", dietaryTags: ["vegetarian", "spicy"], isAvailable: true },
      { restaurantId: restaurant.id, name: "Classic Burger", description: "Byron beef, onion, pickles, tomato, crisp lettuce, American cheddar, secret sauce", price: "23.00", category: "Main Course", tags: ["popular"], isAvailable: true, isFeatured: true },
      { restaurantId: restaurant.id, name: "Kentucky Chook Burger", description: "Southern fried chicken breast, tangy slaw, American cheddar, ketchup, smoked jalapeno mayo", price: "23.00", category: "Main Course", isAvailable: true },
      { restaurantId: restaurant.id, name: "Pulled Pig Burger", description: "Slow smoked sticky pulled pork, tangy slaw, American cheddar, cajun onion rings", price: "23.00", category: "Main Course", isAvailable: true },
      { restaurantId: restaurant.id, name: "Notorious V.E.G. Burger", description: "Plant based beef patty, vegan cheese, avo smash, beetroot, crisp lettuce, tomato, onion, aioli", price: "27.00", category: "Main Course", dietaryTags: ["vegan"], isAvailable: true },
      { restaurantId: restaurant.id, name: "Fish and Chips", description: "NT barracuda barramundi, battered or grilled, beer-battered fries, house salad, tangy tartare", price: "42.00", category: "Main Course", tags: ["popular"], isAvailable: true },
      { restaurantId: restaurant.id, name: "Pepperoni Pizza", description: "Spicy salami, mozzarella, fresh herbs", price: "24.00", category: "Pizza", tags: ["popular"], isAvailable: true },
      { restaurantId: restaurant.id, name: "BBQ Chicken Pizza", description: "Smokey BBQ sauce, pulled chicken, fior di latte mozzarella, caramelised onion, aioli", price: "27.00", category: "Pizza", isAvailable: true },
      { restaurantId: restaurant.id, name: "300g Rib Fillet MB2+", description: "English Angus cross, premium 120-day grain-fed, chargrilled with vine-ripened tomatoes & gravy", price: "38.00", category: "Steaks", tags: ["popular"], isAvailable: true },
      { restaurantId: restaurant.id, name: "Vegan Poke Salad", description: "Grilled mushrooms, vegan feta, baby cos, slaw, basmati rice, house dressing, avocado", price: "28.00", category: "Salad", dietaryTags: ["vegan"], isAvailable: true },
      { restaurantId: restaurant.id, name: "Beer-Battered Fries", description: "Served with jalapeno mayo", price: "13.00", category: "Side", dietaryTags: ["vegetarian"], isAvailable: true },
      { restaurantId: restaurant.id, name: "Mars Bar Cheesecake", description: "Creamy vanilla, chocolate and caramelized blueberry cheesecake, caramilk soil, strawberries", price: "18.00", category: "Dessert", tags: ["popular"], isAvailable: true },
      { restaurantId: restaurant.id, name: "House Lager", description: "Crisp, refreshing draft lager 425ml", price: "10.00", category: "Drinks", isAvailable: true },
      { restaurantId: restaurant.id, name: "Shiraz", description: "Barossa Valley, South Australia 150ml", price: "14.00", category: "Drinks", isAvailable: true },
    ];

    for (const item of menuItemsData) {
      await this.createMenuItem(item);
    }

    // Create FAQs
    const faqsData = [
      { restaurantId: restaurant.id, question: "Do you cater to dietary restrictions?", answer: "Absolutely! We have vegan, vegetarian, and gluten-free options clearly marked on our menu." },
      { restaurantId: restaurant.id, question: "What are your opening hours?", answer: "We're open daily from 11:30 AM to 10:00 PM for food service, bar stays open late." },
      { restaurantId: restaurant.id, question: "Do you take bookings?", answer: "Yes, we take bookings for groups of 6 or more. Smaller groups are walk-in." },
    ];
    for (const faq of faqsData) {
      await this.createFAQ(faq);
    }
  }

  // ===== Restaurant =====
  async getRestaurant(id: number): Promise<Restaurant | undefined> {
    return this.restaurants.get(id);
  }
  async getRestaurantBySlug(slug: string): Promise<Restaurant | undefined> {
    return Array.from(this.restaurants.values()).find(r => r.slug === slug);
  }
  async createRestaurant(data: InsertRestaurant): Promise<Restaurant> {
    const id = this.currentRestaurantId++;
    const restaurant = { ...data, id, createdAt: new Date(), updatedAt: new Date() } as Restaurant;
    this.restaurants.set(id, restaurant);
    return restaurant;
  }
  async updateRestaurant(id: number, data: Partial<InsertRestaurant>): Promise<Restaurant> {
    const existing = this.restaurants.get(id);
    if (!existing) throw new Error("Restaurant not found");
    const updated = { ...existing, ...data, updatedAt: new Date() } as Restaurant;
    this.restaurants.set(id, updated);
    return updated;
  }
  async getAllRestaurants(): Promise<Restaurant[]> {
    return Array.from(this.restaurants.values());
  }

  // ===== Tables =====
  async getTables(restaurantId: number): Promise<Table[]> {
    return Array.from(this.tablesMap.values()).filter(t => t.restaurantId === restaurantId);
  }
  async getTable(id: number): Promise<Table | undefined> {
    return this.tablesMap.get(id);
  }
  async getTableByQrCode(qrCodeId: string): Promise<Table | undefined> {
    return Array.from(this.tablesMap.values()).find(t => t.qrCodeId === qrCodeId);
  }
  async createTable(data: InsertTable): Promise<Table> {
    const id = this.currentTableId++;
    const table = { ...data, id, createdAt: new Date() } as Table;
    this.tablesMap.set(id, table);
    return table;
  }
  async updateTable(id: number, data: Partial<InsertTable>): Promise<Table> {
    const existing = this.tablesMap.get(id);
    if (!existing) throw new Error("Table not found");
    const updated = { ...existing, ...data } as Table;
    this.tablesMap.set(id, updated);
    return updated;
  }
  async deleteTable(id: number): Promise<void> {
    this.tablesMap.delete(id);
  }

  // ===== Menu Categories =====
  async getMenuCategories(restaurantId: number): Promise<MenuCategory[]> {
    return Array.from(this.menuCategoriesMap.values())
      .filter(c => c.restaurantId === restaurantId)
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }
  async createMenuCategory(data: InsertMenuCategory): Promise<MenuCategory> {
    const id = this.currentMenuCategoryId++;
    const cat = { ...data, id } as MenuCategory;
    this.menuCategoriesMap.set(id, cat);
    return cat;
  }
  async updateMenuCategory(id: number, data: Partial<InsertMenuCategory>): Promise<MenuCategory> {
    const existing = this.menuCategoriesMap.get(id);
    if (!existing) throw new Error("Category not found");
    const updated = { ...existing, ...data } as MenuCategory;
    this.menuCategoriesMap.set(id, updated);
    return updated;
  }
  async deleteMenuCategory(id: number): Promise<void> {
    this.menuCategoriesMap.delete(id);
  }

  // ===== Menu Items =====
  async getMenuItems(restaurantId: number): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(i => i.restaurantId === restaurantId);
  }
  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }
  async createMenuItem(data: InsertMenuItem): Promise<MenuItem> {
    const id = this.currentMenuItemId++;
    const item = { ...data, id, createdAt: new Date(), updatedAt: new Date() } as MenuItem;
    this.menuItems.set(id, item);
    return item;
  }
  async updateMenuItem(id: number, data: Partial<InsertMenuItem>): Promise<MenuItem> {
    const existing = this.menuItems.get(id);
    if (!existing) throw new Error("Menu item not found");
    const updated = { ...existing, ...data, updatedAt: new Date() } as MenuItem;
    this.menuItems.set(id, updated);
    return updated;
  }
  async deleteMenuItem(id: number): Promise<void> {
    this.menuItems.delete(id);
  }

  // ===== FAQs =====
  async getFAQs(restaurantId: number): Promise<FAQ[]> {
    return Array.from(this.faqs.values()).filter(f => f.restaurantId === restaurantId);
  }
  async createFAQ(data: InsertFAQ): Promise<FAQ> {
    const id = this.currentFaqId++;
    const faq = { ...data, id } as FAQ;
    this.faqs.set(id, faq);
    return faq;
  }
  async deleteFAQ(id: number): Promise<void> {
    this.faqs.delete(id);
  }

  // ===== Orders =====
  async createOrder(data: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order = { ...data, id, createdAt: new Date(), updatedAt: new Date() } as Order;
    this.orders.set(id, order);
    return order;
  }
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  async getOrdersByRestaurant(restaurantId: number): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(o => o.restaurantId === restaurantId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }
  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(o => o.customerName === customerId);
  }
  async getOrdersByTable(tableId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(o => o.tableId === tableId);
  }
  async updateOrder(id: number, data: Partial<InsertOrder>): Promise<Order> {
    const existing = this.orders.get(id);
    if (!existing) throw new Error(`Order with id ${id} not found`);
    const updated = { ...existing, ...data, updatedAt: new Date() } as Order;
    this.orders.set(id, updated);
    return updated;
  }
  async getActiveOrders(): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      o => o.status !== "completed" && o.status !== "cancelled"
    );
  }
  async updateOrderStatus(orderId: number, status: string): Promise<Order> {
    const order = this.orders.get(orderId);
    if (!order) throw new Error("Order not found");
    const updated = { ...order, status, updatedAt: new Date() } as Order;
    this.orders.set(orderId, updated);
    return updated;
  }

  // ===== Customers =====
  async getCustomer(id: number): Promise<Customer | undefined> {
    return this.customersMap.get(id);
  }
  async getCustomerByEmail(email: string, restaurantId: number): Promise<Customer | undefined> {
    return Array.from(this.customersMap.values()).find(
      c => c.email === email && c.restaurantId === restaurantId
    );
  }
  async createCustomer(data: InsertCustomer): Promise<Customer> {
    const id = this.currentCustomerId++;
    const customer = { ...data, id, createdAt: new Date() } as Customer;
    this.customersMap.set(id, customer);
    return customer;
  }
  async updateCustomer(id: number, data: Partial<InsertCustomer>): Promise<Customer> {
    const existing = this.customersMap.get(id);
    if (!existing) throw new Error("Customer not found");
    const updated = { ...existing, ...data } as Customer;
    this.customersMap.set(id, updated);
    return updated;
  }

  // ===== Receipts =====
  async createReceipt(data: InsertReceipt): Promise<Receipt> {
    const id = this.currentReceiptId++;
    const receipt = { ...data, id, createdAt: new Date() } as Receipt;
    this.receiptsMap.set(id, receipt);
    return receipt;
  }
  async getReceiptByOrder(orderId: number): Promise<Receipt | undefined> {
    return Array.from(this.receiptsMap.values()).find(r => r.orderId === orderId);
  }

  // ===== Chat Messages =====
  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values()).filter(m => m.sessionId === sessionId);
  }
  async createChatMessage(data: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentChatMessageId++;
    const message = { ...data, id, timestamp: new Date() } as ChatMessage;
    this.chatMessages.set(id, message);
    return message;
  }
}

export const storage = new MemStorage();
