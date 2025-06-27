import { storage } from "../storage";
import { menuCategorizationService } from "./menu-categorization";

export interface ChatContext {
  restaurantName: string;
  restaurantDescription: string;
  tone: string;
  welcomeMessage: string;
  menuItems: Array<{
    id: number;
    name: string;
    description: string;
    price: string;
    category: string;
    tags: string[];
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export interface OrderItem {
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
  modifications?: string;
}

export interface ChatResponse {
  message: string;
  suggestedItems?: Array<{
    id: number;
    name: string;
    description: string;
    price: string;
  }>;
  orderUpdate?: {
    action: 'add' | 'remove' | 'modify';
    item: OrderItem;
  };
}

export interface OperationsTaskAction {
  id: string;
  type: 'report' | 'email' | 'data_load' | 'analysis';
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: string;
}

export interface OperationsAiResponse {
  message: string;
  actions?: OperationsTaskAction[];
}

// Akash Chat API integration
class AkashChatService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.AKASH_API_KEY || '';
    this.baseUrl = 'https://chatapi.akash.network/v1'; // Adjust based on actual Akash Chat API endpoint
  }

  async makeRequest(messages: any[], options: any = {}) {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: options.model || 'llama-3.1-8b', // Default Akash model
        messages,
        max_tokens: options.max_tokens || 1000,
        temperature: options.temperature || 0.7,
        stream: false,
        ...(options.response_format && { response_format: options.response_format })
      }),
    });

    if (!response.ok) {
      throw new Error(`Akash API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  async processChatMessage(
    userMessage: string,
    context: ChatContext,
    currentOrder: OrderItem[] = [],
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
  ): Promise<ChatResponse> {
    try {
      const systemPrompt = `You are OrderFi AI, the efficient AI assistant for ${context.restaurantName}. 

RESPONSE STYLE: Keep all responses short (1-2 sentences max). Be direct, friendly, and efficient. No long explanations.

MENU ITEMS:
${context.menuItems.map(item => 
  `- ${item.name} ($${item.price}): ${item.description}`
).join('\n')}

FAQS:
${context.faqs.map(faq => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n')}

CURRENT ORDER:
${currentOrder.length > 0 ? 
  currentOrder.map(item => `${item.quantity}x ${item.name} - $${item.price * item.quantity}`).join('\n') : 
  'No items yet'
}

Be concise, helpful, and get straight to the point. Maximum 15 words per response unless specifically asked for details.`;

      const messages = [
        { role: "system", content: systemPrompt },
        ...conversationHistory,
        { role: "user", content: userMessage }
      ];

      const aiMessage = await this.makeRequest(messages, {
        max_tokens: 150,
        temperature: 0.7,
      });

      // Simple logic to suggest items based on keywords
      const suggestedItems = this.getSuggestedItems(userMessage, context.menuItems);

      return {
        message: aiMessage || "I'm sorry, I didn't understand that. Could you please rephrase?",
        suggestedItems: suggestedItems.length > 0 ? suggestedItems : undefined,
      };
    } catch (error) {
      console.error("Akash Chat API error:", error);
      return {
        message: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment, or feel free to browse our menu directly.",
      };
    }
  }

  async processOperationsAiMessage(
    userMessage: string,
    context: string = "restaurant_operations",
    imageData?: string
  ): Promise<OperationsAiResponse> {
    try {
      const systemPrompt = `You are OrderFi Operations AI Agent for a restaurant business. You can:

1. Generate reports (sales, inventory, staff performance)
2. Send emails to suppliers, staff, or customers
3. Load and analyze data from various sources
4. Analyze images for menu extraction, receipts, invoices, and business documents
5. Extract menu items from images with names, prices, descriptions, and allergens
6. Automate routine tasks
7. Provide business insights and recommendations

Available action types:
- "report": Generate business reports
- "email": Send emails to stakeholders  
- "data_load": Import and process data
- "analysis": Analyze business metrics
- "menu_extract": Extract menu items from images

Always be professional, autonomous, and action-oriented. Respond in JSON format with "message" and optionally "actions" array.`;

      const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ];

      const responseContent = await this.makeRequest(messages, {
        max_tokens: 1000,
        response_format: { type: "json_object" }
      });
      
      let result: any;
      try {
        result = JSON.parse(responseContent);
      } catch {
        result = { message: responseContent, actions: [] };
      }
      
      return {
        message: result.message || "I'll help you with that request.",
        actions: result.actions || []
      };

    } catch (error) {
      console.error("Akash Chat API error:", error);
      return {
        message: "I'm ready to help with your restaurant operations. What would you like me to do today?",
        actions: []
      };
    }
  }

  async generateMenuSuggestions(
    preferences: string,
    context: ChatContext
  ): Promise<string[]> {
    try {
      const messages = [
        {
          role: "system",
          content: `Based on the customer preferences "${preferences}", suggest 3 menu items from this menu. Return only the item names as a JSON array.

MENU:
${context.menuItems.map(item => `${item.name}: ${item.description}`).join('\n')}`,
        },
      ];

      const responseContent = await this.makeRequest(messages, {
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(responseContent || '{"suggestions": []}');
      return result.suggestions || [];
    } catch (error) {
      console.error("Error generating menu suggestions:", error);
      return [];
    }
  }

  private getSuggestedItems(userMessage: string, menuItems: any[]) {
    const message = userMessage.toLowerCase();
    const suggestions = [];

    // Look for dietary preferences
    if (message.includes('vegetarian') || message.includes('veggie')) {
      suggestions.push(...menuItems.filter(item => 
        item.tags.includes('vegetarian')
      ).slice(0, 2));
    }

    if (message.includes('gluten free') || message.includes('gluten-free')) {
      suggestions.push(...menuItems.filter(item => 
        item.tags.includes('gluten-free')
      ).slice(0, 2));
    }

    // Look for food categories
    if (message.includes('pizza')) {
      suggestions.push(...menuItems.filter(item => 
        item.category.toLowerCase().includes('pizza')
      ).slice(0, 2));
    }

    if (message.includes('salad')) {
      suggestions.push(...menuItems.filter(item => 
        item.category.toLowerCase().includes('salad')
      ).slice(0, 2));
    }

    // If no specific matches, suggest popular items
    if (suggestions.length === 0 && (message.includes('recommend') || message.includes('popular') || message.includes('best'))) {
      suggestions.push(...menuItems.filter(item => 
        item.tags.includes('popular')
      ).slice(0, 2));
    }

    return suggestions.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
    }));
  }
}

export const akashChatService = new AkashChatService();
export { AkashChatService };

// Export functions to maintain compatibility with existing code
export async function processChatMessage(
  userMessage: string,
  context: ChatContext,
  currentOrder: OrderItem[] = [],
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<ChatResponse> {
  return akashChatService.processChatMessage(userMessage, context, currentOrder, conversationHistory);
}

export async function processOperationsAiMessage(
  userMessage: string,
  context: string = "restaurant_operations",
  imageData?: string
): Promise<OperationsAiResponse> {
  return akashChatService.processOperationsAiMessage(userMessage, context, imageData);
}

export async function generateMenuSuggestions(
  preferences: string,
  context: ChatContext
): Promise<string[]> {
  return akashChatService.generateMenuSuggestions(preferences, context);
}