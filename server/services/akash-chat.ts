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
    
    // Handle different endpoint configurations
    let endpoint = process.env.AKASH_API_ENDPOINT || '';
    
    // If endpoint looks like an API key, use it as the API key and construct a default endpoint
    if (endpoint.startsWith('sk-') || endpoint.length < 20 || !endpoint.includes('.')) {
      if (endpoint.startsWith('sk-') && !this.apiKey) {
        this.apiKey = endpoint;
      }
      // Use the correct Akash Chat API endpoint
      this.baseUrl = 'https://chatapi.akash.network/v1';
    } else {
      this.baseUrl = endpoint;
    }
    
    console.log('Akash Chat initialized with endpoint:', this.baseUrl);
  }

  async makeRequest(messages: any[], options: any = {}) {
    try {
      // Validate API configuration
      if (!this.apiKey) {
        throw new Error('Akash API key not configured');
      }

      if (!this.baseUrl || this.baseUrl.startsWith('sk-') || this.baseUrl.length < 10) {
        throw new Error('Invalid Akash API endpoint configuration');
      }

      let endpoint = this.baseUrl;
      
      // Ensure endpoint has proper protocol
      if (!endpoint.startsWith('http')) {
        endpoint = `https://${endpoint}`;
      }
      
      // Try different endpoint structures for Akash Chat API
      if (!endpoint.includes('/chat/completions')) {
        // First try without /v1 prefix (many Akash providers use direct paths)
        if (endpoint.endsWith('/v1')) {
          endpoint = endpoint.replace('/v1', '/chat/completions');
        } else if (endpoint.includes('/v1')) {
          endpoint = endpoint.replace('/v1', '/v1/chat/completions');
        } else {
          // Try direct /chat/completions path first
          endpoint = endpoint.endsWith('/') ? `${endpoint}chat/completions` : `${endpoint}/chat/completions`;
        }
      }

      console.log('Making request to Akash endpoint:', endpoint.substring(0, 50) + '...');

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: options.model || 'llama-3.1-8b',
          messages,
          max_tokens: options.max_tokens || 1000,
          temperature: options.temperature || 0.7,
          stream: false,
          ...(options.response_format && { response_format: options.response_format })
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Akash API error response:', errorText);
        throw new Error(`Akash API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || data.content || '';
      
      if (!content) {
        console.warn('No content received from Akash API, response:', JSON.stringify(data, null, 2));
        throw new Error('No content returned from Akash API');
      }

      return content;

    } catch (error) {
      console.error('Akash Chat API error:', error);
      // Re-throw to be handled by the calling function
      throw error;
    }
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
      
      // Intelligent fallback based on user message content
      const suggestedItems = this.getSuggestedItems(userMessage, context.menuItems);
      
      return this.generateIntelligentFallback(userMessage, context, suggestedItems);
    }
  }

  private generateIntelligentFallback(
    userMessage: string, 
    context: ChatContext, 
    suggestedItems: any[]
  ): ChatResponse {
    const message = userMessage.toLowerCase();
    
    // Greeting responses
    if (message.includes('hi') || message.includes('hello') || message.includes('hey')) {
      return {
        message: `Hi! Welcome to ${context.restaurantName}. What can I get you today?`,
        suggestedItems: suggestedItems.length > 0 ? suggestedItems : context.menuItems.slice(0, 2)
      };
    }
    
    // Recommendation requests
    if (message.includes('recommend') || message.includes('suggest') || message.includes('best') || message.includes('popular')) {
      const popular = context.menuItems.filter(item => item.tags.includes('popular')).slice(0, 2);
      return {
        message: "Try our popular items - they're customer favorites!",
        suggestedItems: popular.length > 0 ? popular : context.menuItems.slice(0, 2)
      };
    }
    
    // Menu browsing
    if (message.includes('menu') || message.includes('options') || message.includes('have')) {
      return {
        message: "Here are some of our menu highlights:",
        suggestedItems: context.menuItems.slice(0, 3)
      };
    }
    
    // Dietary preferences
    if (message.includes('vegetarian') || message.includes('vegan')) {
      const vegOptions = context.menuItems.filter(item => 
        item.tags.includes('vegetarian') || item.tags.includes('vegan')
      );
      return {
        message: "Here are our vegetarian options:",
        suggestedItems: vegOptions.length > 0 ? vegOptions.slice(0, 2) : undefined
      };
    }
    
    // Default helpful response
    return {
      message: "I'm here to help you order! What would you like to try?",
      suggestedItems: suggestedItems.length > 0 ? suggestedItems : context.menuItems.slice(0, 2)
    };
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