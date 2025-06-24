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
  updateOrder(id: number, order: Partial<InsertOrder>): Promise<Order>;

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
    // Create Loose Moose restaurant
    const restaurant = await this.createRestaurant({
      name: "Loose Moose",
      description: "A modern Australian pub offering fresh, locally-sourced dishes with creative twists on classic favorites. From gourmet burgers to premium steaks, our menu celebrates bold flavors and quality ingredients.",
      cuisineType: "Modern Australian",
      tone: "friendly",
      welcomeMessage: "Hello there! I'm Mimi, your waitress here at Loose Moose. It's lovely to meet you! May I ask your name? And would you like to start with a drink or something light to eat?",
      isActive: true,
    });

    // Create Loose Moose menu items (popular selections)
    const menuItemsData = [
      {
        restaurantId: restaurant.id,
        name: "Classic Burger",
        description: "Byron beef, onion, pickles, tomato, crisp lettuce, American cheddar, secret sauce",
        price: "23.00",
        category: "Main Course",
        tags: ["popular"],
        isAvailable: true,
      },
      {
        restaurantId: restaurant.id,
        name: "Kentucky Chook Burger",
        description: "Southern fried chicken breast, tangy slaw, American cheddar, ketchup, smoked jalapeno mayo",
        price: "23.00",
        category: "Main Course",
        tags: ["popular"],
        isAvailable: true,
      },
      {
        restaurantId: restaurant.id,
        name: "Pulled Pig Burger",
        description: "Slow smoked sticky pulled pork, tangy slaw, American cheddar, cajun onion rings, smoked jalapeno mayo",
        price: "23.00",
        category: "Main Course",
        tags: ["popular"],
        isAvailable: true,
      },
      {
        restaurantId: restaurant.id,
        name: "Salt & Pepper Squid",
        description: "Aioli & lemon",
        price: "24.00",
        category: "Appetizer",
        tags: ["popular"],
        isAvailable: true,
      },
      {
        restaurantId: restaurant.id,
        name: "Haloumi Fries",
        description: "Homemade chilli jam, lime yoghurt, pomegranate & mint",
        price: "25.00",
        category: "Appetizer",
        tags: ["vegetarian", "popular"],
        isAvailable: true,
      },
      {
        restaurantId: restaurant.id,
        name: "Korean Fried Chicken",
        description: "Sweet & sour hot sauce, kewpie mayo, furikake & shallots",
        price: "25.00",
        category: "Appetizer",
        tags: ["spicy", "popular"],
        isAvailable: true,
      },
      {
        restaurantId: restaurant.id,
        name: "Buffalo Wings - Sweet Jesus",
        description: "Maple & smoky BBQ, served with tangy ranch",
        price: "22.00",
        category: "Appetizer",
        tags: ["popular"],
        isAvailable: true,
      },
      {
        restaurantId: restaurant.id,
        name: "300g Rib Fillet MB2+",
        description: "English Angus cross, premium 120-day grain-fed, Riverina NSW, chargrilled with vine-ripened tomatoes & house-made gravy",
        price: "38.00",
        category: "Steaks",
        tags: ["popular"],
        isAvailable: true,
      },
      {
        restaurantId: restaurant.id,
        name: "Fish and Chips",
        description: "NT barracuda barramundi, battered or grilled, served with beer-battered fries, house salad, homemade tangy tartare sauce, and lemon wedge",
        price: "42.00",
        category: "Main Course",
        tags: ["popular"],
        isAvailable: true,
      },
      {
        restaurantId: restaurant.id,
        name: "Pepperoni Pizza",
        description: "Spicy salami, mozzarella, fresh herbs",
        price: "24.00",
        category: "Pizza",
        tags: ["popular"],
        isAvailable: true,
      },
      {
        restaurantId: restaurant.id,
        name: "BBQ Chicken Pizza",
        description: "Smokey BBQ sauce, pulled chicken, fior di latte mozzarella, caramelised onion, aioli",
        price: "27.00",
        category: "Pizza",
        tags: ["popular"],
        isAvailable: true,
      },
      {
        restaurantId: restaurant.id,
        name: "Notorious V.E.G. Burger",
        description: "Plant based beef patty, vegan cheese, avo smash, beetroot, crisp lettuce, tomato, onion, aioli",
        price: "27.00",
        category: "Main Course",
        tags: ["vegan"],
        isAvailable: true,
      },
      {
        restaurantId: restaurant.id,
        name: "Vegan Poke Salad",
        description: "Grilled field mushrooms, vegan feta, baby cos, slaw, aged basmati rice, house dressing, cucumber, cherry tomatoes, black bean salsa, pickled onion, avocado, vegan mayo, dukkha",
        price: "28.00",
        category: "Salad",
        tags: ["vegan"],
        isAvailable: true,
      },
      {
        restaurantId: restaurant.id,
        name: "Jalapeno Poppers",
        description: "Beer battered jalapenos, sundried tomato & roasted pepper cream cheese, dukkha, tangy ranch & smoked paprika",
        price: "18.00",
        category: "Appetizer",
        tags: ["spicy", "vegetarian"],
        isAvailable: true,
      },
      {
        restaurantId: restaurant.id,
        name: "Mars Bar Cheesecake",
        description: "Creamy vanilla, chocolate and caramelized blueberry cheesecake, caramilk soil, strawberries, caramelised blueberries",
        price: "18.00",
        category: "Dessert",
        tags: ["popular"],
        isAvailable: true,
      },
      {
        restaurantId: restaurant.id,
        name: "Beer-Battered Fries",
        description: "Served with jalapeno mayo",
        price: "13.00",
        category: "Side",
        tags: ["vegetarian"],
        isAvailable: true,
      },
    ];

    for (const item of menuItemsData) {
      await this.createMenuItem(item);
    }

    // Create Loose Moose FAQs
    const faqsData = [
      {
        restaurantId: restaurant.id,
        question: "Do you cater to dietary restrictions?",
        answer: "Absolutely! We have vegan, vegetarian, and gluten-free options clearly marked on our menu. Please let us know about any allergies when ordering.",
      },
      {
        restaurantId: restaurant.id,
        question: "What are your opening hours?",
        answer: "We're open daily from 11:30 AM to 10:00 PM for food service, and our bar stays open until late.",
      },
      {
        restaurantId: restaurant.id,
        question: "Do you take bookings?",
        answer: "Yes, we take bookings for groups of 6 or more. For smaller groups, we operate on a walk-in basis.",
      },
      {
        restaurantId: restaurant.id,
        question: "Are kids welcome?",
        answer: "Absolutely! We have a dedicated kids menu and welcome families. Kids must be supervised at all times.",
      },
      {
        restaurantId: restaurant.id,
        question: "Do you have gluten-free options?",
        answer: "Yes, we offer gluten-free pizza bases and have several naturally gluten-free dishes. Please inform our staff of any allergies.",
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

// Switch to database storage for production
import { DatabaseStorage } from './db-storage.js';

export const storage = new DatabaseStorage();
