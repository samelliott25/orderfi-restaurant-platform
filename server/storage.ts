import { 
  restaurants, 
  menuItems, 
  faqs, 
  orders, 
  chatMessages,
  type Restaurant, 
  type InsertRestaurant,
  type MenuItem,
  type InsertMenuItem,
  type FAQ,
  type InsertFAQ,
  type Order,
  type InsertOrder,
  type ChatMessage,
  type InsertChatMessage
} from "@shared/schema";

export interface IStorage {
  // Restaurant methods
  getRestaurant(id: number): Promise<Restaurant | undefined>;
  createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant>;
  updateRestaurant(id: number, restaurant: Partial<InsertRestaurant>): Promise<Restaurant>;
  getAllRestaurants(): Promise<Restaurant[]>;

  // Menu item methods
  getMenuItems(restaurantId: number): Promise<MenuItem[]>;
  getMenuItem(id: number): Promise<MenuItem | undefined>;
  createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, menuItem: Partial<InsertMenuItem>): Promise<MenuItem>;
  deleteMenuItem(id: number): Promise<void>;

  // FAQ methods
  getFAQs(restaurantId: number): Promise<FAQ[]>;
  createFAQ(faq: InsertFAQ): Promise<FAQ>;
  deleteFAQ(id: number): Promise<void>;

  // Order methods
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrdersByRestaurant(restaurantId: number): Promise<Order[]>;

  // Chat message methods
  getChatMessages(sessionId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class MemStorage implements IStorage {
  private restaurants: Map<number, Restaurant>;
  private menuItems: Map<number, MenuItem>;
  private faqs: Map<number, FAQ>;
  private orders: Map<number, Order>;
  private chatMessages: Map<number, ChatMessage>;
  private currentRestaurantId: number;
  private currentMenuItemId: number;
  private currentFaqId: number;
  private currentOrderId: number;
  private currentChatMessageId: number;

  constructor() {
    this.restaurants = new Map();
    this.menuItems = new Map();
    this.faqs = new Map();
    this.orders = new Map();
    this.chatMessages = new Map();
    this.currentRestaurantId = 1;
    this.currentMenuItemId = 1;
    this.currentFaqId = 1;
    this.currentOrderId = 1;
    this.currentChatMessageId = 1;

    // Initialize with sample data
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Create sample restaurant
    const restaurant = await this.createRestaurant({
      name: "Bella Vista Bistro",
      description: "A cozy Italian bistro serving authentic dishes made with fresh, locally-sourced ingredients in a warm, welcoming atmosphere.",
      cuisineType: "Italian",
      tone: "friendly",
      welcomeMessage: "Welcome to Bella Vista Bistro! I'm your AI assistant, ready to help you explore our delicious Italian menu and place your order. What can I get started for you today?",
      isActive: true,
    });

    // Create sample menu items
    const menuItemsData = [
      {
        restaurantId: restaurant.id,
        name: "Margherita Pizza",
        description: "Fresh mozzarella, tomatoes, basil, olive oil",
        price: "16.99",
        category: "Pizza",
        tags: ["vegetarian", "popular"],
        isAvailable: true,
      },
      {
        restaurantId: restaurant.id,
        name: "Chicken Parmigiana",
        description: "Breaded chicken breast, marinara sauce, mozzarella, pasta",
        price: "22.99",
        category: "Main Course",
        tags: ["popular"],
        isAvailable: true,
      },
      {
        restaurantId: restaurant.id,
        name: "Caprese Salad",
        description: "Buffalo mozzarella, tomatoes, basil, balsamic glaze",
        price: "12.99",
        category: "Salad",
        tags: ["vegetarian", "gluten-free"],
        isAvailable: true,
      },
      {
        restaurantId: restaurant.id,
        name: "Seafood Risotto",
        description: "Arborio rice, mixed seafood, white wine, herbs",
        price: "24.99",
        category: "Main Course",
        tags: ["special"],
        isAvailable: true,
      },
    ];

    for (const item of menuItemsData) {
      await this.createMenuItem(item);
    }

    // Create sample FAQs
    const faqsData = [
      {
        restaurantId: restaurant.id,
        question: "Do you allow pets?",
        answer: "Yes, we welcome well-behaved dogs on our outdoor patio only.",
      },
      {
        restaurantId: restaurant.id,
        question: "Do you offer gluten-free options?",
        answer: "Yes, we have gluten-free pasta and pizza options available. Please let us know about any allergies.",
      },
    ];

    for (const faq of faqsData) {
      await this.createFAQ(faq);
    }
  }

  // Restaurant methods
  async getRestaurant(id: number): Promise<Restaurant | undefined> {
    return this.restaurants.get(id);
  }

  async createRestaurant(insertRestaurant: InsertRestaurant): Promise<Restaurant> {
    const id = this.currentRestaurantId++;
    const restaurant: Restaurant = { ...insertRestaurant, id };
    this.restaurants.set(id, restaurant);
    return restaurant;
  }

  async updateRestaurant(id: number, updateData: Partial<InsertRestaurant>): Promise<Restaurant> {
    const existing = this.restaurants.get(id);
    if (!existing) {
      throw new Error("Restaurant not found");
    }
    const updated: Restaurant = { ...existing, ...updateData };
    this.restaurants.set(id, updated);
    return updated;
  }

  async getAllRestaurants(): Promise<Restaurant[]> {
    return Array.from(this.restaurants.values());
  }

  // Menu item methods
  async getMenuItems(restaurantId: number): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(
      (item) => item.restaurantId === restaurantId
    );
  }

  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async createMenuItem(insertMenuItem: InsertMenuItem): Promise<MenuItem> {
    const id = this.currentMenuItemId++;
    const menuItem: MenuItem = { ...insertMenuItem, id };
    this.menuItems.set(id, menuItem);
    return menuItem;
  }

  async updateMenuItem(id: number, updateData: Partial<InsertMenuItem>): Promise<MenuItem> {
    const existing = this.menuItems.get(id);
    if (!existing) {
      throw new Error("Menu item not found");
    }
    const updated: MenuItem = { ...existing, ...updateData };
    this.menuItems.set(id, updated);
    return updated;
  }

  async deleteMenuItem(id: number): Promise<void> {
    this.menuItems.delete(id);
  }

  // FAQ methods
  async getFAQs(restaurantId: number): Promise<FAQ[]> {
    return Array.from(this.faqs.values()).filter(
      (faq) => faq.restaurantId === restaurantId
    );
  }

  async createFAQ(insertFAQ: InsertFAQ): Promise<FAQ> {
    const id = this.currentFaqId++;
    const faq: FAQ = { ...insertFAQ, id };
    this.faqs.set(id, faq);
    return faq;
  }

  async deleteFAQ(id: number): Promise<void> {
    this.faqs.delete(id);
  }

  // Order methods
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = { 
      ...insertOrder, 
      id, 
      createdAt: new Date() 
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersByRestaurant(restaurantId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.restaurantId === restaurantId
    );
  }

  // Chat message methods
  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values()).filter(
      (message) => message.sessionId === sessionId
    );
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentChatMessageId++;
    const message: ChatMessage = { 
      ...insertMessage, 
      id, 
      timestamp: new Date() 
    };
    this.chatMessages.set(id, message);
    return message;
  }
}

export const storage = new MemStorage();
