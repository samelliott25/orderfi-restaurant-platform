import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "your-openai-api-key"
});

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

export async function processChatMessage(
  userMessage: string,
  context: ChatContext,
  currentOrder: OrderItem[] = [],
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<ChatResponse> {
  try {
    const systemPrompt = `You are an AI waiter for ${context.restaurantName}. ${context.restaurantDescription}

Your personality should be ${context.tone}. 

MENU ITEMS:
${context.menuItems.map(item => 
  `- ${item.name} ($${item.price}): ${item.description} [Category: ${item.category}] [Tags: ${item.tags.join(', ')}]`
).join('\n')}

FREQUENTLY ASKED QUESTIONS:
${context.faqs.map(faq => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n')}

CURRENT ORDER:
${currentOrder.length > 0 ? 
  currentOrder.map(item => `${item.quantity}x ${item.name} - $${item.price * item.quantity}`).join('\n') : 
  'No items in order yet'
}

Your tasks:
1. Help customers understand the menu and make selections
2. Answer questions about ingredients, allergies, and preparation
3. Suggest items based on preferences
4. Keep track of their order and provide updates
5. Be helpful, friendly, and knowledgeable about the restaurant

When responding, provide helpful suggestions and always be ready to add items to their order. If they ask about prices, always include the price. If they want to place an order, confirm the items and quantities.

Respond in a conversational, helpful manner that matches the ${context.tone} tone. Keep responses concise but informative.`;

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...conversationHistory,
      { role: "user", content: userMessage }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      max_tokens: 500,
      temperature: 0.8,
    });

    const aiMessage = response.choices[0].message.content || "I'm sorry, I didn't understand that. Could you please rephrase?";

    // Simple logic to suggest items based on keywords
    const suggestedItems = getSuggestedItems(userMessage, context.menuItems);

    return {
      message: aiMessage,
      suggestedItems: suggestedItems.length > 0 ? suggestedItems : undefined,
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    return {
      message: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment, or feel free to browse our menu directly.",
    };
  }
}

function getSuggestedItems(userMessage: string, menuItems: any[]) {
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

export async function generateMenuSuggestions(
  preferences: string,
  context: ChatContext
): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Based on the customer preferences "${preferences}", suggest 3 menu items from this menu. Return only the item names as a JSON array.

MENU:
${context.menuItems.map(item => `${item.name}: ${item.description}`).join('\n')}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{"suggestions": []}');
    return result.suggestions || [];
  } catch (error) {
    console.error("Error generating menu suggestions:", error);
    return [];
  }
}
