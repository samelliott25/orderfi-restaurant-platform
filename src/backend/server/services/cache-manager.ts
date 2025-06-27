interface CacheItem<T> {
  data: T;
  expiry: number;
  hits: number;
}

interface CacheStats {
  totalEntries: number;
  hitRate: number;
  memoryUsage: number;
  topKeys: string[];
}

class MemoryCache {
  private cache = new Map<string, CacheItem<any>>();
  private totalHits = 0;
  private totalMisses = 0;
  private maxSize = 1000;
  private defaultTTL = 300000; // 5 minutes

  set<T>(key: string, data: T, ttl?: number): void {
    const expiry = Date.now() + (ttl || this.defaultTTL);
    
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, {
      data,
      expiry,
      hits: 0
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      this.totalMisses++;
      return null;
    }

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      this.totalMisses++;
      return null;
    }

    item.hits++;
    this.totalHits++;
    return item.data as T;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
    this.totalHits = 0;
    this.totalMisses = 0;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  private evictOldest(): void {
    // Find least recently used item (lowest hits)
    let oldestKey = '';
    let oldestHits = Infinity;
    
    for (const [key, item] of this.cache) {
      if (item.hits < oldestHits) {
        oldestHits = item.hits;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  getStats(): CacheStats {
    const totalRequests = this.totalHits + this.totalMisses;
    const hitRate = totalRequests > 0 ? this.totalHits / totalRequests : 0;
    
    // Calculate approximate memory usage
    const memoryUsage = JSON.stringify([...this.cache.entries()]).length;
    
    // Get top accessed keys
    const topKeys = [...this.cache.entries()]
      .sort(([,a], [,b]) => b.hits - a.hits)
      .slice(0, 10)
      .map(([key]) => key);

    return {
      totalEntries: this.cache.size,
      hitRate: Math.round(hitRate * 100) / 100,
      memoryUsage,
      topKeys
    };
  }

  // Clean expired entries
  cleanup(): number {
    const now = Date.now();
    let removed = 0;
    
    for (const [key, item] of this.cache) {
      if (now > item.expiry) {
        this.cache.delete(key);
        removed++;
      }
    }
    
    return removed;
  }
}

class CacheManager {
  private cache = new MemoryCache();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Run cleanup every 5 minutes
    this.cleanupInterval = setInterval(() => {
      const removed = this.cache.cleanup();
      if (removed > 0) {
        console.log(`Cache cleanup: removed ${removed} expired entries`);
      }
    }, 300000);
  }

  // Restaurant data caching
  async getRestaurants(): Promise<any[] | null> {
    return this.cache.get('restaurants:all');
  }

  setRestaurants(restaurants: any[], ttl = 600000): void {
    this.cache.set('restaurants:all', restaurants, ttl);
  }

  async getRestaurant(id: number): Promise<any | null> {
    return this.cache.get(`restaurant:${id}`);
  }

  setRestaurant(id: number, restaurant: any, ttl = 600000): void {
    this.cache.set(`restaurant:${id}`, restaurant, ttl);
  }

  // Menu items caching
  async getMenuItems(restaurantId: number): Promise<any[] | null> {
    return this.cache.get(`menu:${restaurantId}`);
  }

  setMenuItems(restaurantId: number, items: any[], ttl = 300000): void {
    this.cache.set(`menu:${restaurantId}`, items, ttl);
  }

  // Chat session caching
  async getChatSession(sessionId: string): Promise<any | null> {
    return this.cache.get(`chat:${sessionId}`);
  }

  setChatSession(sessionId: string, session: any, ttl = 1800000): void {
    this.cache.set(`chat:${sessionId}`, session, ttl);
  }

  // AI response caching for common queries
  async getAIResponse(prompt: string): Promise<any | null> {
    const key = `ai:${Buffer.from(prompt).toString('base64').slice(0, 50)}`;
    return this.cache.get(key);
  }

  setAIResponse(prompt: string, response: any, ttl = 3600000): void {
    const key = `ai:${Buffer.from(prompt).toString('base64').slice(0, 50)}`;
    this.cache.set(key, response, ttl);
  }

  // Orders caching
  async getOrders(restaurantId: number): Promise<any[] | null> {
    return this.cache.get(`orders:${restaurantId}`);
  }

  setOrders(restaurantId: number, orders: any[], ttl = 60000): void {
    this.cache.set(`orders:${restaurantId}`, orders, ttl);
  }

  // Invalidate related cache entries
  invalidateRestaurant(id: number): void {
    this.cache.delete(`restaurant:${id}`);
    this.cache.delete(`menu:${id}`);
    this.cache.delete(`orders:${id}`);
    this.cache.delete('restaurants:all');
  }

  invalidateMenu(restaurantId: number): void {
    this.cache.delete(`menu:${restaurantId}`);
  }

  invalidateOrders(restaurantId: number): void {
    this.cache.delete(`orders:${restaurantId}`);
  }

  // Cache warming - preload frequently accessed data
  async warmCache(): Promise<void> {
    try {
      console.log('Warming cache with frequently accessed data...');
      
      // This would typically fetch from database
      // For now, we'll just log the warming process
      console.log('Cache warming completed');
    } catch (error) {
      console.error('Cache warming failed:', error);
    }
  }

  getStats(): CacheStats {
    return this.cache.getStats();
  }

  clear(): void {
    this.cache.clear();
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.cache.clear();
  }
}

export const cacheManager = new CacheManager();