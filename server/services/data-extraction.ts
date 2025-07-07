import OpenAI from 'openai';
import { storage } from '../storage';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define all the fields that need to be populated across different app pages
interface DataExtractionSchema {
  restaurant: {
    name?: string;
    description?: string;
    cuisine?: string;
    phone?: string;
    email?: string;
    address?: string;
    hours?: {
      open: string;
      close: string;
      days: string[];
    };
    website?: string;
    socialMedia?: {
      instagram?: string;
      facebook?: string;
      twitter?: string;
    };
  };
  menuItems: Array<{
    name: string;
    description?: string;
    price: number;
    category: string;
    allergens?: string[];
    dietary?: string[];
    ingredients?: string[];
    preparationTime?: number;
    spicyLevel?: number;
    tags?: string[];
  }>;
  staff: Array<{
    name: string;
    role: string;
    email?: string;
    phone?: string;
    shift?: string;
  }>;
  inventory: Array<{
    name: string;
    category: string;
    currentStock?: number;
    unit?: string;
    supplier?: string;
    cost?: number;
  }>;
  payments: {
    acceptsCash?: boolean;
    acceptsCards?: boolean;
    acceptsCrypto?: boolean;
    stripeConnected?: boolean;
    walletAddress?: string;
  };
  preferences: {
    autoAcceptOrders?: boolean;
    printOrdersAutomatically?: boolean;
    sendSMSNotifications?: boolean;
    loyaltyProgramEnabled?: boolean;
    language?: string;
    timezone?: string;
  };
}

export class DataExtractionService {
  private extractedData: Partial<DataExtractionSchema> = {};
  private conversationContext: string[] = [];

  async extractFromConversation(
    message: string, 
    sessionId: string,
    currentPage?: string
  ): Promise<{
    extractedFields: Partial<DataExtractionSchema>;
    confidence: number;
    suggestedQuestions: string[];
    missingCriticalFields: string[];
  }> {
    
    // Add message to conversation context
    this.conversationContext.push(message);
    
    // Keep only last 10 messages for context
    if (this.conversationContext.length > 10) {
      this.conversationContext = this.conversationContext.slice(-10);
    }

    const extractionPrompt = `
You are an expert data extraction AI for restaurant management systems. Extract structured data from conversation messages and populate restaurant database fields.

CONVERSATION CONTEXT:
${this.conversationContext.join('\n')}

CURRENT PAGE CONTEXT: ${currentPage || 'general'}

Extract any relevant information and return a JSON object with this structure:
{
  "extractedFields": {
    "restaurant": {
      "name": "extracted restaurant name",
      "description": "extracted description",
      "cuisine": "extracted cuisine type",
      "phone": "extracted phone number",
      "email": "extracted email",
      "address": "extracted address",
      "hours": {
        "open": "HH:MM",
        "close": "HH:MM", 
        "days": ["monday", "tuesday", ...]
      },
      "website": "extracted website",
      "socialMedia": {
        "instagram": "handle",
        "facebook": "handle"
      }
    },
    "menuItems": [
      {
        "name": "item name",
        "description": "item description",
        "price": 19.99,
        "category": "category",
        "allergens": ["gluten", "dairy"],
        "dietary": ["vegetarian", "vegan"],
        "ingredients": ["ingredient1", "ingredient2"],
        "preparationTime": 15,
        "spicyLevel": 2,
        "tags": ["popular", "signature"]
      }
    ],
    "staff": [
      {
        "name": "staff name",
        "role": "chef/server/manager",
        "email": "email",
        "phone": "phone",
        "shift": "morning/evening/night"
      }
    ],
    "inventory": [
      {
        "name": "ingredient name",
        "category": "proteins/vegetables/dairy",
        "currentStock": 50,
        "unit": "kg/pieces/liters",
        "supplier": "supplier name",
        "cost": 12.50
      }
    ],
    "payments": {
      "acceptsCash": true,
      "acceptsCards": true,
      "acceptsCrypto": false,
      "stripeConnected": false,
      "walletAddress": "0x..."
    },
    "preferences": {
      "autoAcceptOrders": true,
      "printOrdersAutomatically": false,
      "sendSMSNotifications": true,
      "loyaltyProgramEnabled": true,
      "language": "en",
      "timezone": "UTC"
    }
  },
  "confidence": 0.85,
  "suggestedQuestions": [
    "What are your restaurant's operating hours?",
    "Do you have any signature dishes?"
  ],
  "missingCriticalFields": [
    "restaurant.phone",
    "restaurant.address"
  ]
}

EXTRACTION RULES:
1. Only extract explicitly mentioned information - don't infer or guess
2. For prices, convert to numbers (remove currency symbols)
3. For hours, use 24-hour format
4. For phone numbers, extract as-is (don't format)
5. For emails, validate format
6. For social media, extract handles without @ symbols
7. Confidence should reflect how certain you are about extracted data
8. Suggest questions to fill missing critical information
9. If no relevant data found, return empty extractedFields but still provide suggestions

Focus on extracting data relevant to: ${currentPage || 'restaurant setup, menu management, staff, inventory, payments, and settings'}
`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: extractionPrompt
          },
          {
            role: "user", 
            content: message
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1 // Low temperature for consistent extraction
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      // Merge extracted data with existing data
      this.mergeExtractedData(result.extractedFields || {});
      
      return {
        extractedFields: result.extractedFields || {},
        confidence: result.confidence || 0.5,
        suggestedQuestions: result.suggestedQuestions || [],
        missingCriticalFields: result.missingCriticalFields || []
      };

    } catch (error) {
      console.error('Data extraction error:', error);
      return {
        extractedFields: {},
        confidence: 0,
        suggestedQuestions: [],
        missingCriticalFields: []
      };
    }
  }

  private mergeExtractedData(newData: Partial<DataExtractionSchema>) {
    // Deep merge new data with existing extracted data
    this.extractedData = this.deepMerge(this.extractedData, newData);
  }

  private deepMerge(target: any, source: any): any {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(result[key] || {}, source[key]);
      } else if (Array.isArray(source[key])) {
        // For arrays, append new items (avoiding duplicates for menu items by name)
        result[key] = result[key] || [];
        if (key === 'menuItems') {
          source[key].forEach((newItem: any) => {
            const existingIndex = result[key].findIndex((item: any) => item.name === newItem.name);
            if (existingIndex >= 0) {
              result[key][existingIndex] = { ...result[key][existingIndex], ...newItem };
            } else {
              result[key].push(newItem);
            }
          });
        } else {
          result[key] = [...result[key], ...source[key]];
        }
      } else if (source[key] !== undefined) {
        result[key] = source[key];
      }
    }
    
    return result;
  }

  async saveExtractedData(restaurantId: number): Promise<{
    restaurant?: any;
    menuItemsCreated: number;
    staffCreated: number;
    inventoryCreated: number;
  }> {
    const results = {
      restaurant: undefined,
      menuItemsCreated: 0,
      staffCreated: 0,
      inventoryCreated: 0
    };

    try {
      // Save restaurant data
      if (this.extractedData.restaurant) {
        const restaurantData = this.extractedData.restaurant;
        results.restaurant = await storage.updateRestaurant(restaurantId, {
          name: restaurantData.name,
          description: restaurantData.description,
          cuisine: restaurantData.cuisine,
          phone: restaurantData.phone,
          email: restaurantData.email,
          address: restaurantData.address
        });
      }

      // Save menu items
      if (this.extractedData.menuItems) {
        for (const item of this.extractedData.menuItems) {
          await storage.createMenuItem({
            restaurantId,
            name: item.name,
            description: item.description || '',
            price: item.price,
            category: item.category,
            available: true,
            tags: item.tags || [],
            allergens: item.allergens || [],
            dietary: item.dietary || []
          });
          results.menuItemsCreated++;
        }
      }

      // Additional saves for staff, inventory, etc. would go here
      // when those tables are implemented

    } catch (error) {
      console.error('Error saving extracted data:', error);
    }

    return results;
  }

  getExtractedData(): Partial<DataExtractionSchema> {
    return this.extractedData;
  }

  getCompletionStatus(): {
    overallCompletion: number;
    sectionCompletion: {
      restaurant: number;
      menuItems: number;
      staff: number;
      inventory: number;
      payments: number;
      preferences: number;
    };
    missingCritical: string[];
  } {
    const critical = {
      restaurant: ['name', 'phone', 'address'],
      menuItems: ['name', 'price', 'category'],
      payments: ['acceptsCash', 'acceptsCards']
    };

    const sectionCompletion = {
      restaurant: this.calculateSectionCompletion(this.extractedData.restaurant, ['name', 'description', 'cuisine', 'phone', 'email', 'address']),
      menuItems: this.extractedData.menuItems ? Math.min(100, this.extractedData.menuItems.length * 20) : 0,
      staff: this.extractedData.staff ? Math.min(100, this.extractedData.staff.length * 25) : 0,
      inventory: this.extractedData.inventory ? Math.min(100, this.extractedData.inventory.length * 10) : 0,
      payments: this.calculateSectionCompletion(this.extractedData.payments, ['acceptsCash', 'acceptsCards', 'acceptsCrypto']),
      preferences: this.calculateSectionCompletion(this.extractedData.preferences, ['autoAcceptOrders', 'language', 'timezone'])
    };

    const overallCompletion = Object.values(sectionCompletion).reduce((sum, val) => sum + val, 0) / 6;

    return {
      overallCompletion,
      sectionCompletion,
      missingCritical: this.findMissingCriticalFields(critical)
    };
  }

  private calculateSectionCompletion(section: any, requiredFields: string[]): number {
    if (!section) return 0;
    const completed = requiredFields.filter(field => section[field] !== undefined).length;
    return (completed / requiredFields.length) * 100;
  }

  private findMissingCriticalFields(critical: any): string[] {
    const missing: string[] = [];
    
    for (const [section, fields] of Object.entries(critical)) {
      const sectionData = (this.extractedData as any)[section];
      if (!sectionData) {
        missing.push(...(fields as string[]).map(f => `${section}.${f}`));
      } else {
        for (const field of fields as string[]) {
          if (!sectionData[field]) {
            missing.push(`${section}.${field}`);
          }
        }
      }
    }
    
    return missing;
  }

  reset() {
    this.extractedData = {};
    this.conversationContext = [];
  }
}

// Global instance
export const dataExtractionService = new DataExtractionService();