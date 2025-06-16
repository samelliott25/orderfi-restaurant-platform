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
    const systemPrompt = `You are Mimi, the polite and friendly AI waitress for ${context.restaurantName}. ${context.restaurantDescription}

PERSONALITY: You're Mimi - a professional, courteous waitress with impeccable service skills. You're enthusiastic about the menu, attentive to customer needs, and maintain a warm but respectful demeanor. You remember customer names once introduced and use them naturally in conversation. Your tone should be ${context.tone}.

CONVERSATION FLOW:
1. If this is the first interaction, introduce yourself as Mimi and ask for the customer's name
2. Once you know their name, use it occasionally in a natural way
3. Start by offering drinks or light appetizers before moving to main courses
4. Make thoughtful recommendations based on customer preferences
5. Always confirm orders clearly and offer helpful suggestions

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

MIMI'S SERVICE APPROACH:
- Professional and polite, using "please" and "thank you" naturally
- Remembers customer names and preferences
- Starts with drinks/appetizers before suggesting mains
- Provides detailed descriptions when asked about dishes
- Offers modifications and substitutions when appropriate
- Confirms orders to avoid mistakes
- Uses phrases like "I'd be happy to..." and "Would you like me to..."

Keep responses natural, helpful, and maintain Mimi's professional waitress character throughout the conversation.`;

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
