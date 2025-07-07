import OpenAI from 'openai';
import { storage } from '../storage';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface OnboardingState {
  step: 'welcome' | 'venue_name' | 'menu_upload' | 'menu_review' | 'complete';
  venueName?: string;
  menuItems?: any[];
  categories?: string[];
  restaurantId?: number;
}

export async function processOnboardingMessage(
  message: string, 
  sessionId: string,
  requestBody: any
): Promise<{ message: string; action?: string; data?: any }> {
  
  // Get or initialize onboarding state
  const stateKey = `onboarding_${sessionId}`;
  let state: OnboardingState = requestBody.onboardingState || { step: 'welcome' };

  try {
    switch (state.step) {
      case 'welcome':
        return handleWelcome(message, state);
      
      case 'venue_name':
        return await handleVenueName(message, state);
      
      case 'menu_upload':
        return await handleMenuUpload(message, state, requestBody);
      
      case 'menu_review':
        return await handleMenuReview(message, state);
      
      case 'complete':
        return await handleComplete(message, state);
      
      default:
        return {
          message: "I'll help you set up your restaurant! What would you like to do?",
          action: 'update_state',
          data: { step: 'welcome' }
        };
    }
  } catch (error) {
    console.error('Onboarding error:', error);
    return {
      message: "I encountered an error. Let me help you start over. What's your restaurant called?",
      action: 'update_state',
      data: { step: 'venue_name' }
    };
  }
}

function handleWelcome(message: string, state: OnboardingState) {
  // Check if user mentions restaurant setup or wants to start
  const setupKeywords = ['setup', 'start', 'create', 'restaurant', 'venue', 'onboard'];
  const hasSetupIntent = setupKeywords.some(keyword => 
    message.toLowerCase().includes(keyword)
  );

  if (hasSetupIntent || message.toLowerCase().includes('yes')) {
    return {
      message: "Perfect! Let's get your restaurant set up in just a few minutes. First, what's your venue called?",
      action: 'update_state',
      data: { step: 'venue_name' }
    };
  }

  return {
    message: `Welcome to OrderFi! 🍽️ 

I'm here to help you set up your restaurant in under 10 minutes - no forms, no complexity, just conversation.

Would you like to:
• Set up your restaurant now
• See a demo first
• Ask me questions about OrderFi

What sounds good to you?`,
    action: 'update_state',
    data: { step: 'welcome' }
  };
}

async function handleVenueName(message: string, state: OnboardingState) {
  // Extract venue name from the message
  const venueName = extractVenueName(message);
  
  if (!venueName) {
    return {
      message: "I didn't catch the restaurant name. Could you tell me what you'd like to call your venue? For example: 'Tony's Italian Kitchen' or 'The Corner Cafe'",
      action: 'update_state',
      data: { step: 'venue_name' }
    };
  }

  return {
    message: `Great! "${venueName}" sounds perfect. 

Now for the easiest part - your menu. You can:
• Paste your menu text directly here
• Upload a photo of your menu  
• Tell me your dishes and I'll organize them

Just send me your menu however is easiest for you!`,
    action: 'update_state',
    data: { step: 'menu_upload', venueName }
  };
}

async function handleMenuUpload(message: string, state: OnboardingState, requestBody: any) {
  let menuContent = '';
  
  // Check if there's an uploaded image
  if (requestBody.image) {
    try {
      const base64Image = requestBody.image;
      const visionResponse = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Extract all menu items from this image. List each item with its price and description if available."
              },
              {
                type: "image_url",
                image_url: { url: `data:image/jpeg;base64,${base64Image}` }
              }
            ],
          },
        ],
        max_tokens: 1000,
      });
      
      menuContent = visionResponse.choices[0].message.content || '';
    } catch (error) {
      return {
        message: "I had trouble reading that image. Could you try uploading it again or just tell me about your menu items?",
        action: 'update_state',
        data: { step: 'menu_upload', venueName: state.venueName }
      };
    }
  } else {
    menuContent = message;
  }

  // Parse the menu content
  try {
    const parseResponse = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are a menu parsing expert. Parse the provided menu text and extract structured data. 
          
          Return a JSON object with this exact structure:
          {
            "items": [
              {
                "name": "item name",
                "description": "brief description",
                "price": 18.50,
                "category": "category name"
              }
            ],
            "categories": ["category 1", "category 2"]
          }
          
          Create logical categories like "Mains", "Starters", "Desserts", "Drinks"`
        },
        {
          role: "user",
          content: menuContent
        }
      ],
      response_format: { type: "json_object" },
    });

    const parsedData = JSON.parse(parseResponse.choices[0].message.content || '{}');
    
    if (!parsedData.items || parsedData.items.length === 0) {
      return {
        message: "I couldn't find any menu items in that. Could you tell me about a few of your dishes? For example: 'We serve burgers for $18, pizza for $22, and caesar salad for $16'",
        action: 'update_state',
        data: { step: 'menu_upload', venueName: state.venueName }
      };
    }

    const summary = parsedData.categories.map((cat: string) => {
      const itemCount = parsedData.items.filter((item: any) => item.category === cat).length;
      return `${cat} (${itemCount} items)`;
    }).join(', ');

    return {
      message: `Perfect! I found ${parsedData.items.length} menu items across ${parsedData.categories.length} categories: ${summary}

Here's what I organized for ${state.venueName}:

${formatMenuForDisplay(parsedData)}

Does this look right? Say "yes" to continue, or tell me what to change!`,
      action: 'update_state',
      data: { 
        step: 'menu_review', 
        venueName: state.venueName,
        menuItems: parsedData.items,
        categories: parsedData.categories
      }
    };

  } catch (error) {
    return {
      message: "I had trouble parsing that menu. Could you try describing a few items differently? Like: 'Chicken pasta $24, beef burger $19, garden salad $16'",
      action: 'update_state',
      data: { step: 'menu_upload', venueName: state.venueName }
    };
  }
}

async function handleMenuReview(message: string, state: OnboardingState) {
  if (message.toLowerCase().includes('yes') || message.toLowerCase().includes('looks good') || message.toLowerCase().includes('correct')) {
    // Create the restaurant
    try {
      const restaurant = await storage.createRestaurant({
        name: state.venueName!,
        description: `${state.venueName} - Set up via OrderFi ChatOps`,
        cuisine: 'Various',
        phone: '',
        email: '',
        address: ''
      });

      // Add menu items
      for (const item of state.menuItems || []) {
        await storage.createMenuItem({
          restaurantId: restaurant.id,
          name: item.name,
          description: item.description || '',
          price: item.price,
          category: item.category,
          available: true
        });
      }

      return {
        message: `🎉 Congratulations! ${state.venueName} is now live on OrderFi!

Here's what happens next:
• Your restaurant is ready to take orders
• Customers can scan a QR code to see your menu
• You'll see live orders in your dashboard
• Start earning $ORDER token rewards

You can now:
• View your dashboard
• Generate customer QR codes  
• Start taking orders immediately

Welcome to the future of restaurant operations! 🚀`,
        action: 'complete_onboarding',
        data: { 
          restaurantId: restaurant.id,
          venueName: state.venueName
        }
      };

    } catch (error) {
      return {
        message: "I encountered an error creating your restaurant. Let me try again. Could you confirm your restaurant name?",
        action: 'update_state',
        data: { step: 'venue_name' }
      };
    }
  }

  return {
    message: "No problem! What would you like me to change about the menu? You can add items, remove items, or adjust prices - just tell me what needs updating.",
    action: 'update_state',
    data: { 
      step: 'menu_upload', 
      venueName: state.venueName
    }
  };
}

async function handleComplete(message: string, state: OnboardingState) {
  return {
    message: `Your restaurant ${state.venueName} is all set up! You can ask me to:
• Generate QR codes for customers
• Show you the dashboard
• Help with menu changes
• Explain features

What would you like to do first?`,
    action: 'stay_complete',
    data: state
  };
}

function extractVenueName(message: string): string | null {
  // Remove common prefixes and extract name
  const cleanMessage = message.replace(/^(my restaurant is called|it's called|the name is|restaurant name is|venue name is|call it)/i, '').trim();
  
  // Remove quotes if present
  const withoutQuotes = cleanMessage.replace(/^["']|["']$/g, '');
  
  // Basic validation - should be 2-50 characters
  if (withoutQuotes.length >= 2 && withoutQuotes.length <= 50) {
    return withoutQuotes;
  }
  
  return null;
}

function formatMenuForDisplay(parsedData: any): string {
  return parsedData.categories.map((category: string) => {
    const items = parsedData.items.filter((item: any) => item.category === category);
    const itemList = items.map((item: any) => 
      `  • ${item.name} - $${item.price}${item.description ? ` (${item.description})` : ''}`
    ).join('\n');
    return `**${category}:**\n${itemList}`;
  }).join('\n\n');
}