import { storage } from '../storage';
import type { InsertRestaurant, Restaurant } from '@shared/schema';

interface RestaurantOnboardingData {
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  cuisine?: string;
  ownerId: string;
  contactEmail: string;
  
  // AI customization
  tone?: string;
  welcomeMessage?: string;
  aiPersonality?: string;
  
  // Business settings
  businessHours?: Record<string, { open: string; close: string }>;
  paymentMethods?: string[];
  timezone?: string;
}

export class RestaurantManagementService {
  
  /**
   * Create a URL-friendly slug from restaurant name
   */
  private createSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /**
   * Generate default AI personality based on cuisine type
   */
  private generateDefaultPersonality(cuisine?: string): string {
    const personalities = {
      'italian': 'Warm and passionate about authentic Italian flavors, uses occasional Italian phrases',
      'mexican': 'Enthusiastic and vibrant, knowledgeable about spice levels and traditional preparations', 
      'asian': 'Respectful and detail-oriented, focuses on fresh ingredients and balanced flavors',
      'american': 'Friendly and casual, great at suggesting comfort food combinations',
      'mediterranean': 'Health-conscious and knowledgeable about fresh, seasonal ingredients',
      'default': 'Friendly, helpful, and enthusiastic about food recommendations'
    };
    
    return personalities[cuisine?.toLowerCase() || 'default'] || personalities.default;
  }

  /**
   * Generate default welcome message
   */
  private generateWelcomeMessage(name: string, cuisine?: string): string {
    const cuisinePhrase = cuisine ? ` specializing in ${cuisine} cuisine` : '';
    return `Welcome to ${name}${cuisinePhrase}! I'm Mimi, your AI dining assistant. I'm here to help you discover our delicious menu and place your order. What sounds good to you today?`;
  }

  /**
   * Onboard a new restaurant to the platform
   */
  async onboardRestaurant(data: RestaurantOnboardingData): Promise<Restaurant> {
    // Generate slug and ensure uniqueness
    let slug = this.createSlug(data.name);
    let counter = 1;
    
    while (await this.isSlugTaken(slug)) {
      slug = `${this.createSlug(data.name)}-${counter}`;
      counter++;
    }

    // Generate default AI settings if not provided
    const aiPersonality = data.aiPersonality || this.generateDefaultPersonality(data.cuisine);
    const welcomeMessage = data.welcomeMessage || this.generateWelcomeMessage(data.name, data.cuisine);

    // Default business hours (9 AM - 10 PM)
    const defaultBusinessHours = {
      monday: { open: "09:00", close: "22:00" },
      tuesday: { open: "09:00", close: "22:00" },
      wednesday: { open: "09:00", close: "22:00" },
      thursday: { open: "09:00", close: "22:00" },
      friday: { open: "09:00", close: "23:00" },
      saturday: { open: "09:00", close: "23:00" },
      sunday: { open: "10:00", close: "21:00" }
    };

    const restaurantData: InsertRestaurant = {
      name: data.name,
      slug,
      description: data.description || `Experience great ${data.cuisine || 'food'} at ${data.name}`,
      address: data.address,
      phone: data.phone,
      email: data.email,
      cuisine: data.cuisine,
      priceRange: "moderate",
      isActive: true,
      
      // AI settings
      tone: data.tone || "friendly",
      welcomeMessage,
      aiPersonality,
      
      // Business settings
      businessHours: JSON.stringify(data.businessHours || defaultBusinessHours),
      paymentMethods: data.paymentMethods || ["credit_card", "debit_card"],
      orderSettings: JSON.stringify({
        minimumOrder: 10.00,
        deliveryFee: 2.99,
        taxRate: 0.08,
        tipSuggestions: [0.15, 0.18, 0.20, 0.25]
      }),
      
      // Owner info
      ownerId: data.ownerId,
      contactEmail: data.contactEmail,
      timezone: data.timezone || "America/New_York"
    };

    const restaurant = await storage.createRestaurant(restaurantData);
    
    // Create default FAQ entries
    await this.createDefaultFAQs(restaurant.id);
    
    return restaurant;
  }

  /**
   * Check if slug is already taken
   */
  private async isSlugTaken(slug: string): Promise<boolean> {
    try {
      const restaurants = await storage.getAllRestaurants();
      return restaurants.some(r => r.slug === slug);
    } catch {
      return false;
    }
  }

  /**
   * Get restaurant by slug
   */
  async getRestaurantBySlug(slug: string): Promise<Restaurant | undefined> {
    const restaurants = await storage.getAllRestaurants();
    return restaurants.find(r => r.slug === slug && r.isActive);
  }

  /**
   * Update restaurant settings
   */
  async updateRestaurantSettings(
    restaurantId: number, 
    updates: Partial<InsertRestaurant>
  ): Promise<Restaurant> {
    return await storage.updateRestaurant(restaurantId, updates);
  }

  /**
   * Create default FAQ entries for new restaurant
   */
  private async createDefaultFAQs(restaurantId: number): Promise<void> {
    const defaultFAQs = [
      {
        question: "What are your hours?",
        answer: "We're open daily! Check our business hours in the restaurant info section."
      },
      {
        question: "Do you offer delivery?",
        answer: "Yes! We offer delivery within our service area. Delivery fee and minimum order may apply."
      },
      {
        question: "Can I modify my order after placing it?",
        answer: "Please contact us immediately if you need to modify your order. We'll do our best to accommodate changes if the order hasn't started preparation."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards, debit cards, and digital payments through our platform."
      },
      {
        question: "Do you have vegetarian/vegan options?",
        answer: "Yes! Just ask our AI assistant about vegetarian or vegan options and we'll show you all available choices."
      }
    ];

    for (const faq of defaultFAQs) {
      await storage.createFAQ({
        restaurantId,
        question: faq.question,
        answer: faq.answer
      });
    }
  }

  /**
   * Get restaurant dashboard analytics
   */
  async getRestaurantAnalytics(restaurantId: number, days: number = 30): Promise<any> {
    const orders = await storage.getOrdersByRestaurant(restaurantId);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentOrders = orders.filter(order => 
      new Date(order.createdAt) >= cutoffDate
    );

    const totalRevenue = recentOrders.reduce((sum, order) => 
      sum + parseFloat(order.total), 0
    );

    const averageOrderValue = recentOrders.length > 0 
      ? totalRevenue / recentOrders.length 
      : 0;

    return {
      totalOrders: recentOrders.length,
      totalRevenue: totalRevenue.toFixed(2),
      averageOrderValue: averageOrderValue.toFixed(2),
      period: `${days} days`,
      ordersToday: recentOrders.filter(order => 
        new Date(order.createdAt).toDateString() === new Date().toDateString()
      ).length
    };
  }

  /**
   * Get all restaurants for admin dashboard
   */
  async getAllRestaurantsWithStats(): Promise<any[]> {
    const restaurants = await storage.getAllRestaurants();
    
    const restaurantsWithStats = await Promise.all(
      restaurants.map(async (restaurant) => {
        const analytics = await this.getRestaurantAnalytics(restaurant.id, 7);
        return {
          ...restaurant,
          analytics
        };
      })
    );

    return restaurantsWithStats;
  }

  /**
   * Toggle restaurant active status
   */
  async toggleRestaurantStatus(restaurantId: number): Promise<Restaurant> {
    const restaurant = await storage.getRestaurant(restaurantId);
    if (!restaurant) {
      throw new Error('Restaurant not found');
    }

    return await storage.updateRestaurant(restaurantId, {
      isActive: !restaurant.isActive
    });
  }
}

export const restaurantManagement = new RestaurantManagementService();