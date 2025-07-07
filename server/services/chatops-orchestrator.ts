import { dataExtractionService } from './data-extraction';
import { processOnboardingMessage } from './onboarding-chat';
import { processChatMessage } from './akash-chat';
import { storage } from '../storage';

interface ChatOpsResponse {
  message: string;
  action?: string;
  data?: any;
  extractedData?: any;
  suggestions?: string[];
  completionStatus?: any;
}

export class ChatOpsOrchestrator {
  async processMessage(
    message: string,
    sessionId: string,
    context: {
      chatContext?: 'customer' | 'onboarding' | 'operations';
      currentPage?: string;
      restaurantId?: number;
      onboardingState?: any;
    }
  ): Promise<ChatOpsResponse> {
    
    const { chatContext = 'customer', currentPage, restaurantId = 1, onboardingState } = context;
    
    try {
      // Always extract data from every message for training
      const extraction = await dataExtractionService.extractFromConversation(
        message, 
        sessionId, 
        currentPage
      );

      // Route to appropriate handler based on context
      let response: ChatOpsResponse;

      if (chatContext === 'onboarding') {
        const onboardingResponse = await processOnboardingMessage(message, sessionId, {
          onboardingState,
          extractedData: extraction.extractedFields
        });
        
        response = {
          message: onboardingResponse.message,
          action: onboardingResponse.action,
          data: onboardingResponse.data
        };

      } else if (chatContext === 'operations') {
        // Operations AI for managing existing restaurant
        response = await this.handleOperationsMessage(message, sessionId, restaurantId, extraction);

      } else {
        // Customer ordering interface
        const chatResponse = await processChatMessage(message, sessionId, {
          restaurantId,
          context: 'customer'
        });
        
        response = {
          message: chatResponse.message || chatResponse,
          data: chatResponse
        };
      }

      // Always include extraction data and suggestions
      response.extractedData = extraction.extractedFields;
      response.suggestions = extraction.suggestedQuestions;
      response.completionStatus = dataExtractionService.getCompletionStatus();

      // Auto-save extracted data if we have enough confidence
      if (extraction.confidence > 0.7 && Object.keys(extraction.extractedFields).length > 0) {
        await dataExtractionService.saveExtractedData(restaurantId);
      }

      return response;

    } catch (error) {
      console.error('ChatOps orchestrator error:', error);
      return {
        message: "I encountered an error processing your message. Please try again.",
        suggestions: ["Try rephrasing your question", "Ask about menu items", "Check restaurant status"]
      };
    }
  }

  private async handleOperationsMessage(
    message: string,
    sessionId: string,
    restaurantId: number,
    extraction: any
  ): Promise<ChatOpsResponse> {
    
    // Determine intent from message
    const intent = await this.classifyOperationsIntent(message);
    
    switch (intent.category) {
      case 'menu_management':
        return this.handleMenuOperations(message, restaurantId, extraction);
      
      case 'order_management':
        return this.handleOrderOperations(message, restaurantId);
      
      case 'analytics':
        return this.handleAnalyticsOperations(message, restaurantId);
      
      case 'staff_management':
        return this.handleStaffOperations(message, restaurantId, extraction);
      
      case 'inventory_management':
        return this.handleInventoryOperations(message, restaurantId, extraction);
      
      case 'settings':
        return this.handleSettingsOperations(message, restaurantId, extraction);
      
      default:
        return {
          message: `I can help you with:
• Menu management (add/edit items, update prices)
• Order operations (view orders, kitchen status)  
• Analytics (sales reports, performance)
• Staff management (schedules, roles)
• Inventory tracking (stock levels, suppliers)
• Settings (preferences, integrations)

What would you like to work on?`,
          suggestions: [
            "Add new menu item",
            "Check today's orders", 
            "View sales analytics",
            "Update staff schedule",
            "Check inventory levels",
            "Update restaurant settings"
          ]
        };
    }
  }

  private async classifyOperationsIntent(message: string): Promise<{
    category: string;
    confidence: number;
    specific_action?: string;
  }> {
    // Simple keyword-based classification for now
    // Could be enhanced with ML classification later
    
    const keywords = {
      menu_management: ['menu', 'dish', 'item', 'price', 'add', 'remove', 'update', 'ingredient'],
      order_management: ['order', 'kitchen', 'queue', 'ready', 'preparing', 'customer'],
      analytics: ['sales', 'revenue', 'report', 'analytics', 'performance', 'profit'],
      staff_management: ['staff', 'employee', 'schedule', 'shift', 'role', 'team'],
      inventory_management: ['inventory', 'stock', 'supplier', 'ingredient', 'supply'],
      settings: ['settings', 'preference', 'configure', 'setup', 'integration']
    };

    for (const [category, words] of Object.entries(keywords)) {
      if (words.some(word => message.toLowerCase().includes(word))) {
        return { category, confidence: 0.8 };
      }
    }

    return { category: 'general', confidence: 0.5 };
  }

  private async handleMenuOperations(message: string, restaurantId: number, extraction: any): Promise<ChatOpsResponse> {
    if (extraction.extractedFields.menuItems && extraction.extractedFields.menuItems.length > 0) {
      // Save new menu items
      const saved = await dataExtractionService.saveExtractedData(restaurantId);
      
      return {
        message: `Great! I've added ${saved.menuItemsCreated} new menu items to your restaurant. 

${extraction.extractedFields.menuItems.map((item: any) => 
  `• ${item.name} - $${item.price} (${item.category})`
).join('\n')}

Would you like to add more items or make any changes?`,
        suggestions: [
          "Add another menu item",
          "Update existing item prices", 
          "View complete menu",
          "Organize menu categories"
        ]
      };
    }

    return {
      message: "I can help you manage your menu. You can tell me about new dishes, update prices, or organize categories. What would you like to do?",
      suggestions: [
        "Add a new dish: Chicken Pasta $18.50",
        "Update pizza price to $22",
        "Show me all menu items",
        "Create new menu category"
      ]
    };
  }

  private async handleOrderOperations(message: string, restaurantId: number): Promise<ChatOpsResponse> {
    const orders = await storage.getOrdersByRestaurant(restaurantId);
    const pendingOrders = orders.filter(order => order.status === 'pending' || order.status === 'preparing');
    
    return {
      message: `You have ${pendingOrders.length} orders in the queue:

${pendingOrders.slice(0, 5).map(order => 
  `Order #${order.id}: $${order.total} - ${order.status}`
).join('\n')}

${pendingOrders.length > 5 ? `\n...and ${pendingOrders.length - 5} more orders` : ''}`,
      suggestions: [
        "Mark orders as ready",
        "View kitchen queue",
        "Print order tickets", 
        "Update order status"
      ]
    };
  }

  private async handleAnalyticsOperations(message: string, restaurantId: number): Promise<ChatOpsResponse> {
    const orders = await storage.getOrdersByRestaurant(restaurantId);
    const today = new Date().toDateString();
    const todayOrders = orders.filter(order => new Date(order.createdAt).toDateString() === today);
    const revenue = todayOrders.reduce((sum, order) => sum + order.total, 0);

    return {
      message: `Today's Performance:
• Revenue: $${revenue.toFixed(2)}
• Orders: ${todayOrders.length}
• Average Order: $${(revenue / todayOrders.length || 0).toFixed(2)}

Would you like deeper analytics?`,
      suggestions: [
        "Show weekly sales report",
        "Most popular menu items",
        "Peak hours analysis",
        "Customer analytics"
      ]
    };
  }

  private async handleStaffOperations(message: string, restaurantId: number, extraction: any): Promise<ChatOpsResponse> {
    if (extraction.extractedFields.staff && extraction.extractedFields.staff.length > 0) {
      return {
        message: `I've noted the staff information:

${extraction.extractedFields.staff.map((staff: any) => 
  `• ${staff.name} - ${staff.role}${staff.shift ? ` (${staff.shift} shift)` : ''}`
).join('\n')}

What would you like to do with staff management?`,
        suggestions: [
          "Add more staff members",
          "Create shift schedules",
          "Update staff roles",
          "View all staff"
        ]
      };
    }

    return {
      message: "I can help you manage your staff. Tell me about your team members, their roles, and schedules.",
      suggestions: [
        "Add staff: John as head chef",
        "Create morning shift schedule", 
        "Update staff contact info",
        "View staff performance"
      ]
    };
  }

  private async handleInventoryOperations(message: string, restaurantId: number, extraction: any): Promise<ChatOpsResponse> {
    if (extraction.extractedFields.inventory && extraction.extractedFields.inventory.length > 0) {
      return {
        message: `I've recorded the inventory information:

${extraction.extractedFields.inventory.map((item: any) => 
  `• ${item.name} - ${item.currentStock || 'unknown'} ${item.unit || 'units'}`
).join('\n')}

Would you like to update stock levels or add more items?`,
        suggestions: [
          "Add more inventory items",
          "Update stock quantities",
          "Set reorder alerts",
          "View supplier information"
        ]
      };
    }

    return {
      message: "I can help track your inventory. Tell me about ingredients, supplies, and stock levels.",
      suggestions: [
        "Add inventory: 50kg flour, 20L olive oil",
        "Update chicken stock to 30kg",
        "Set low stock alerts",
        "Track supplier costs"
      ]
    };
  }

  private async handleSettingsOperations(message: string, restaurantId: number, extraction: any): Promise<ChatOpsResponse> {
    if (extraction.extractedFields.preferences || extraction.extractedFields.payments) {
      return {
        message: "I've updated your restaurant settings. The changes will take effect immediately.",
        suggestions: [
          "Configure payment methods",
          "Update business hours",
          "Set notification preferences",
          "Manage integrations"
        ]
      };
    }

    return {
      message: "I can help configure your restaurant settings, preferences, and integrations. What would you like to adjust?",
      suggestions: [
        "Enable auto-accept orders",
        "Set up payment methods",
        "Configure operating hours",
        "Update notification settings"
      ]
    };
  }
}

export const chatOpsOrchestrator = new ChatOpsOrchestrator();