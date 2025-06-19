import OpenAI from "openai";
import { storage } from "../storage";

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
    const systemPrompt = `You are Mimi, the efficient AI waitress for ${context.restaurantName}. 

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

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...conversationHistory,
      { role: "user", content: userMessage }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      max_tokens: 150,
      temperature: 0.7,
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

export async function processOperationsAiMessage(
  userMessage: string,
  context: string = "restaurant_operations",
  imageData?: string
): Promise<OperationsAiResponse> {
  try {
    const systemPrompt = `You are Mimi, an autonomous Operations AI Agent for a restaurant business. You can:

1. Generate reports (sales, inventory, staff performance)
2. Send emails to suppliers, staff, or customers
3. Load and analyze data from various sources
4. Analyze images for menu extraction, receipts, invoices, and business documents
5. Extract menu items from images with names, prices, descriptions, and allergens
6. Automate routine tasks
7. Provide business insights and recommendations

When analyzing menu images, extract:
- Item names (exact text from image)
- Prices (with currency symbols)
- Descriptions (full text descriptions)
- Allergens (if mentioned: dairy, gluten, nuts, etc.)
- Categories (appetizers, mains, desserts, drinks, etc.)

For menu extraction tasks, provide detailed item-by-item breakdown with all visible text and organize by category.

Available action types:
- "report": Generate business reports
- "email": Send emails to stakeholders  
- "data_load": Import and process data
- "analysis": Analyze business metrics
- "menu_extract": Extract menu items from images

Always be professional, autonomous, and action-oriented. For text-only requests, respond in JSON format with "message" and optionally "actions" array.`;

    const messages: any[] = [
      { role: "system", content: systemPrompt }
    ];

    if (imageData) {
      // Check if user wants menu extraction
      const isMenuExtraction = userMessage?.toLowerCase().includes('extract') && 
                              (userMessage?.toLowerCase().includes('menu') || 
                               userMessage?.toLowerCase().includes('items') ||
                               userMessage?.toLowerCase().includes('products'));
      
      if (isMenuExtraction) {
        // Use specialized menu extraction
        const imageBuffer = Buffer.from(imageData, 'base64');
        const extractionResult = await extractMenuItemsFromImage(imageBuffer, 1); // Default restaurant ID
        
        return {
          message: extractionResult.message,
          actions: extractionResult.items.length > 0 ? [{
            id: `menu-extract-${Date.now()}`,
            type: 'data_load' as const,
            description: `Added ${extractionResult.items.length} menu items to system`,
            status: 'completed' as const,
            result: `Items: ${extractionResult.items.map(i => i.name).join(', ')}`
          }] : []
        };
      } else {
        // Regular image analysis
        messages.push({
          role: "user",
          content: [
            {
              type: "text",
              text: userMessage || "Please analyze this image for restaurant operations insights."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageData}`
              }
            }
          ]
        });
      }
    } else {
      messages.push({ role: "user", content: userMessage });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages,
      ...(imageData ? {} : { response_format: { type: "json_object" } }), // Only use JSON format for text-only requests
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content || '';
    
    let result: any;
    if (imageData) {
      // For image responses, wrap the content in proper format
      result = {
        message: content,
        actions: []
      };
    } else {
      // For text responses, parse JSON
      try {
        result = JSON.parse(content);
      } catch {
        result = { message: content, actions: [] };
      }
    }
    
    // Ensure proper response format
    return {
      message: result.message || "I'll help you with that request.",
      actions: result.actions || []
    };

  } catch (error) {
    console.error("OpenAI API error:", error);
    return {
      message: "I'm ready to help with your restaurant operations. What would you like me to do today?",
      actions: []
    };
  }
}

export async function extractMenuItemsFromImage(
  imageBuffer: Buffer,
  restaurantId: number
): Promise<{ items: any[], message: string }> {
  try {
    const base64Image = imageBuffer.toString('base64');
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Extract ALL menu items from this image with complete details. Return ONLY a valid JSON object (no markdown formatting) with:
          {
            "items": [
              {
                "name": "exact item name",
                "price": "price as string (no currency symbols)",
                "description": "full description text",
                "category": "category (appetizers/mains/desserts/drinks/etc)",
                "allergens": ["list", "of", "allergens"],
                "tags": ["dietary", "tags"]
              }
            ],
            "message": "summary of extraction"
          }
          
          Categories should be: appetizers, salads, soups, mains, sides, desserts, drinks, specials
          Extract every single visible item with its exact text. Return raw JSON only, no code blocks or markdown.`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract all menu items from this image with names, prices, descriptions, categories, and any allergen information."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 2000,
    });

    let content = completion.choices[0].message.content || '{"items": [], "message": "No items found"}';
    
    // Clean up the response - remove markdown code blocks and extra whitespace
    content = content.trim();
    if (content.includes('```json')) {
      content = content.replace(/```json\n?/g, '').replace(/\n?```/g, '').trim();
    }
    if (content.includes('```')) {
      content = content.replace(/```/g, '').trim();
    }
    
    let result;
    try {
      result = JSON.parse(content);
    } catch (parseError) {
      console.error("JSON parse error, content:", content.substring(0, 200));
      // Try to extract JSON from the content
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          result = JSON.parse(jsonMatch[0]);
        } catch {
          result = { items: [], message: "Failed to parse menu extraction response" };
        }
      } else {
        result = { items: [], message: "No valid JSON found in response" };
      }
    }
    
    // Add items to restaurant menu via storage
    const addedItems = [];
    for (const item of result.items || []) {
      try {
        const menuItem = await storage.createMenuItem({
          restaurantId,
          name: item.name,
          description: item.description || "",
          price: item.price || "0",
          category: item.category || "mains",
          tags: [...(item.tags || []), ...(item.allergens || [])], // Combine allergens into tags
          isAvailable: true
        });
        addedItems.push(menuItem);
      } catch (error) {
        console.error(`Failed to add menu item ${item.name}:`, error);
      }
    }
    
    return {
      items: addedItems,
      message: `Successfully extracted and added ${addedItems.length} menu items: ${addedItems.map(i => i.name).join(', ')}`
    };
    
  } catch (error) {
    console.error("Menu extraction error:", error);
    return {
      items: [],
      message: "Failed to extract menu items from image"
    };
  }
}

export async function processMenuImage(imageBuffer: Buffer): Promise<any[]> {
  try {
    const base64Image = imageBuffer.toString('base64');
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an AI that extracts menu items from restaurant menu images. 
          
          Analyze the image and extract all menu items with their details. Return a JSON array of menu items.
          
          For each item, provide:
          - name: The item name
          - description: Brief description (if available)
          - price: Numeric price (extract just the number)
          - category: Categorize as one of: pizza, burger, appetizer, salad, dessert, drink, main, pasta, seafood, or other
          
          Only return the JSON array, no other text.`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract all menu items from this restaurant menu image with their names, descriptions, prices, and categories."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content || "[]";
    
    try {
      const menuItems = JSON.parse(responseText);
      return Array.isArray(menuItems) ? menuItems : [];
    } catch (parseError) {
      console.error("Failed to parse menu items JSON:", parseError);
      return [];
    }
  } catch (error) {
    console.error("Menu image processing error:", error);
    throw new Error("Failed to process menu image");
  }
}
