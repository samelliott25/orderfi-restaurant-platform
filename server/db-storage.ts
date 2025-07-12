import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq, and, ne } from 'drizzle-orm';
import { 
  restaurants, 
  menuItems, 
  faqs, 
  orders, 
  chatMessages,
  type Restaurant,
  type MenuItem,
  type FAQ,
  type Order,
  type ChatMessage,
  type InsertRestaurant,
  type InsertMenuItem,
  type InsertFAQ,
  type InsertOrder,
  type InsertChatMessage
} from '../shared/schema.js';
import { IStorage } from './storage.js';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

export class DatabaseStorage implements IStorage {
  
  // Restaurant methods
  async getRestaurant(id: number): Promise<Restaurant | undefined> {
    const result = await db.select().from(restaurants).where(eq(restaurants.id, id));
    return result[0];
  }

  async createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant> {
    const result = await db.insert(restaurants).values(restaurant).returning();
    return result[0];
  }

  async updateRestaurant(id: number, restaurant: Partial<InsertRestaurant>): Promise<Restaurant> {
    const result = await db.update(restaurants)
      .set(restaurant)
      .where(eq(restaurants.id, id))
      .returning();
    return result[0];
  }

  async getAllRestaurants(): Promise<Restaurant[]> {
    return await db.select().from(restaurants);
  }

  // Menu item methods
  async getMenuItems(restaurantId: number): Promise<MenuItem[]> {
    return await db.select().from(menuItems).where(eq(menuItems.restaurantId, restaurantId));
  }

  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    const result = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return result[0];
  }

  async createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem> {
    const result = await db.insert(menuItems).values(menuItem).returning();
    return result[0];
  }

  async updateMenuItem(id: number, menuItem: Partial<InsertMenuItem>): Promise<MenuItem> {
    const result = await db.update(menuItems)
      .set(menuItem)
      .where(eq(menuItems.id, id))
      .returning();
    return result[0];
  }

  async deleteMenuItem(id: number): Promise<void> {
    await db.delete(menuItems).where(eq(menuItems.id, id));
  }

  // FAQ methods
  async getFAQs(restaurantId: number): Promise<FAQ[]> {
    return await db.select().from(faqs).where(eq(faqs.restaurantId, restaurantId));
  }

  async createFAQ(faq: InsertFAQ): Promise<FAQ> {
    const result = await db.insert(faqs).values(faq).returning();
    return result[0];
  }

  async deleteFAQ(id: number): Promise<void> {
    await db.delete(faqs).where(eq(faqs.id, id));
  }

  // Order methods
  async createOrder(order: InsertOrder): Promise<Order> {
    const result = await db.insert(orders).values(order).returning();
    return result[0];
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id));
    return result[0];
  }

  async getOrdersByRestaurant(restaurantId: number): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.restaurantId, restaurantId));
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.customerName, customerId));
  }

  async updateOrder(id: number, order: Partial<InsertOrder>): Promise<Order> {
    const result = await db.update(orders)
      .set(order)
      .where(eq(orders.id, id))
      .returning();
    return result[0];
  }

  // Chat message methods
  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    return await db.select().from(chatMessages).where(eq(chatMessages.sessionId, sessionId));
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const result = await db.insert(chatMessages).values(message).returning();
    return result[0];
  }

  // Enhanced search methods leveraging database optimizations
  async searchMenuItemsNatural(restaurantId: number, query: string): Promise<MenuItem[]> {
    try {
      const searchQuery = `
        SELECT mi.* FROM menu_search ms
        JOIN menu_items mi ON ms.id = mi.id
        WHERE ms.restaurant_id = $1 
        AND ms.search_doc @@ to_tsquery('simple', $2)
        ORDER BY ts_rank_cd(ms.search_doc, to_tsquery('simple', $2)) DESC
        LIMIT 20
      `;
      
      // Convert query to tsquery format
      const formattedQuery = query.toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 0)
        .join(' | ');
      
      const result = await sql(searchQuery, [restaurantId, formattedQuery]);
      return result as MenuItem[];
    } catch (error) {
      console.error('Natural search error:', error);
      // Fallback to basic search
      return this.getMenuItems(restaurantId);
    }
  }

  async searchMenuItemsFuzzy(restaurantId: number, query: string): Promise<MenuItem[]> {
    try {
      const searchQuery = `
        SELECT mi.*, similarity(mi.name, $2) as sim
        FROM menu_items mi
        WHERE mi.restaurant_id = $1 
        AND (mi.name % $2 OR mi.category % $2)
        ORDER BY similarity(mi.name, $2) DESC, similarity(mi.category, $2) DESC
        LIMIT 20
      `;
      
      const result = await sql(searchQuery, [restaurantId, query]);
      return result as MenuItem[];
    } catch (error) {
      console.error('Fuzzy search error:', error);
      // Fallback to basic search
      return this.getMenuItems(restaurantId);
    }
  }

  async searchMenuItemsCombined(restaurantId: number, query: string): Promise<MenuItem[]> {
    try {
      const searchQuery = `
        SELECT DISTINCT mi.*, 
               COALESCE(ts_rank_cd(ms.search_doc, to_tsquery('simple', $2)), 0) as text_rank,
               COALESCE(similarity(mi.name, $2), 0) as name_sim
        FROM menu_items mi
        LEFT JOIN menu_search ms ON mi.id = ms.id
        WHERE mi.restaurant_id = $1 
        AND (
          ms.search_doc @@ to_tsquery('simple', $2) OR
          mi.name ILIKE $3 OR
          mi.category ILIKE $3 OR
          mi.description ILIKE $3 OR
          mi.name % $2
        )
        ORDER BY (text_rank + name_sim) DESC, mi.name ASC
        LIMIT 20
      `;
      
      // Convert query to tsquery format for full-text search
      const formattedQuery = query.toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 0)
        .join(' | ');
      
      const likeQuery = `%${query}%`;
      
      const result = await sql(searchQuery, [restaurantId, formattedQuery, likeQuery]);
      return result as MenuItem[];
    } catch (error) {
      console.error('Combined search error:', error);
      // Fallback to basic search
      return this.getMenuItems(restaurantId);
    }
  }

  // KDS methods
  async getActiveOrders(): Promise<Order[]> {
    return await db.select().from(orders).where(
      and(
        ne(orders.status, 'completed'),
        ne(orders.status, 'cancelled')
      )
    );
  }

  async updateOrderStatus(orderId: number, status: string): Promise<Order> {
    const result = await db.update(orders)
      .set({ status })
      .where(eq(orders.id, orderId))
      .returning();
    return result[0];
  }
}