import { storage } from '../storage';

interface TrainingExample {
  userInput: string;
  expectedResponse: string;
  menuContext: string[];
  category: string;
}

// Enhanced training data for better AI responses
export const mimiTrainingExamples: TrainingExample[] = [
  {
    userInput: "I want something healthy",
    expectedResponse: "Perfect! For healthy options, I highly recommend our Craft Caesar Salad with fresh romaine and house-made croutons for $12. If you'd like more protein, our Pan-Seared Salmon with seasonal vegetables is excellent - both nutritious and delicious! Any dietary preferences I should know about?",
    menuContext: ["Craft Caesar Salad", "Pan-Seared Salmon"],
    category: "healthy"
  },
  {
    userInput: "What's your best burger?",
    expectedResponse: "Our signature Classic Burger is absolutely fantastic! It comes with a juicy beef patty, fresh lettuce, tomato, and our special sauce. Would you like to add cheese or bacon? And how about some crispy fries or onion rings on the side?",
    menuContext: ["Classic Burger", "Truffle Burger"],
    category: "burgers"
  },
  {
    userInput: "I'm vegetarian",
    expectedResponse: "Wonderful! I have some great vegetarian options for you. Our Margherita Pizza with fresh mozzarella and basil is a classic, or if you prefer something lighter, the Craft Caesar Salad is perfect. We can also customize many dishes to be vegetarian. What sounds appealing?",
    menuContext: ["Margherita Pizza", "Craft Caesar Salad"],
    category: "dietary"
  },
  {
    userInput: "Something spicy",
    expectedResponse: "Love the heat! While our menu focuses on fresh, quality ingredients, I can recommend dishes that pair well with our spicy condiments. Our Classic Burger can be spiced up with jalapeños, or any of our proteins can be prepared with a kick. What level of spice are you comfortable with?",
    menuContext: ["Classic Burger", "Hot Wings"],
    category: "spicy"
  },
  {
    userInput: "I'm on a budget",
    expectedResponse: "I totally understand! Let me suggest some delicious, wallet-friendly options. Our appetizers are perfect for sharing and very reasonably priced. Also, our lunch portions offer great value. What type of cuisine are you in the mood for?",
    menuContext: ["Appetizers", "Lunch Specials"],
    category: "budget"
  }
];

export class AITrainingService {
  private trainingData: Map<string, TrainingExample[]> = new Map();

  constructor() {
    this.initializeTrainingData();
  }

  private initializeTrainingData() {
    // Organize training examples by category
    mimiTrainingExamples.forEach(example => {
      const category = example.category;
      if (!this.trainingData.has(category)) {
        this.trainingData.set(category, []);
      }
      this.trainingData.get(category)!.push(example);
    });
  }

  public async generateContextualPrompt(userMessage: string, restaurantId: number): Promise<string> {
    const restaurant = await storage.getRestaurant(restaurantId);
    const menuItems = await storage.getMenuItems(restaurantId);
    
    // Analyze user intent
    const intent = this.analyzeUserIntent(userMessage);
    const relevantTraining = this.getRelevantTraining(intent);
    
    // Build enhanced system prompt
    return `You are Mimi, the AI restaurant assistant at ${restaurant?.name || 'our restaurant'}. You're friendly, knowledgeable, and great at reading between the lines of what customers want.

RESTAURANT CONTEXT:
- Name: ${restaurant?.name}
- Style: ${restaurant?.description}
- Tone: Warm, helpful, and enthusiastic about food

COMPLETE MENU:
${menuItems.map(item => `• ${item.name} ($${item.price}) - ${item.description} [${item.category}]`).join('\n')}

CUSTOMER PSYCHOLOGY TRAINING:
When customers say "${userMessage}", they typically want:
${relevantTraining.map(ex => `- "${ex.userInput}" → Focus on: ${ex.menuContext.join(', ')}`).join('\n')}

CONVERSATION GUIDELINES:
1. Match the energy level of the customer
2. When asked about "healthy" - emphasize fresh ingredients, grilled proteins, salads
3. When asked about "best" items - recommend signature dishes with enthusiasm  
4. When dietary restrictions mentioned - immediately offer alternatives and customizations
5. Always suggest complementary items (sides, drinks, appetizers)
6. Ask clarifying questions to personalize recommendations
7. Keep responses conversational, not robotic
8. Show genuine excitement about the food

RESPONSE FORMAT:
- Start with enthusiasm that matches their request
- Give 1-2 specific menu recommendations with prices
- Explain WHY these items fit their needs
- Ask a follow-up question to continue the conversation
- Suggest complementary items when appropriate

Current customer message: "${userMessage}"

Respond as Mimi with personality, knowledge, and genuine helpfulness.`;
  }

  private analyzeUserIntent(message: string): string {
    const lowercaseMessage = message.toLowerCase();
    
    if (lowercaseMessage.includes('healthy') || lowercaseMessage.includes('light') || lowercaseMessage.includes('fresh')) {
      return 'healthy';
    }
    if (lowercaseMessage.includes('burger') || lowercaseMessage.includes('beef')) {
      return 'burgers';
    }
    if (lowercaseMessage.includes('vegetarian') || lowercaseMessage.includes('vegan') || lowercaseMessage.includes('plant')) {
      return 'dietary';
    }
    if (lowercaseMessage.includes('spicy') || lowercaseMessage.includes('hot') || lowercaseMessage.includes('heat')) {
      return 'spicy';
    }
    if (lowercaseMessage.includes('cheap') || lowercaseMessage.includes('budget') || lowercaseMessage.includes('affordable')) {
      return 'budget';
    }
    if (lowercaseMessage.includes('best') || lowercaseMessage.includes('recommend') || lowercaseMessage.includes('popular')) {
      return 'recommendations';
    }
    
    return 'general';
  }

  private getRelevantTraining(intent: string): TrainingExample[] {
    return this.trainingData.get(intent) || [];
  }

  public async analyzeMenuForHealthyOptions(restaurantId: number): Promise<string[]> {
    const menuItems = await storage.getMenuItems(restaurantId);
    
    return menuItems
      .filter(item => 
        item.category.toLowerCase().includes('salad') ||
        item.description?.toLowerCase().includes('grilled') ||
        item.description?.toLowerCase().includes('fresh') ||
        item.description?.toLowerCase().includes('seasonal') ||
        item.name.toLowerCase().includes('salmon') ||
        item.name.toLowerCase().includes('chicken breast')
      )
      .map(item => `${item.name} ($${item.price})`);
  }

  public async getPersonalizedRecommendations(
    userMessage: string, 
    restaurantId: number,
    conversationHistory: Array<{role: string, content: string}> = []
  ): Promise<{items: string[], reasoning: string}> {
    const intent = this.analyzeUserIntent(userMessage);
    const menuItems = await storage.getMenuItems(restaurantId);
    
    let recommendedItems: string[] = [];
    let reasoning = '';
    
    switch (intent) {
      case 'healthy':
        recommendedItems = await this.analyzeMenuForHealthyOptions(restaurantId);
        reasoning = 'Based on your request for healthy options, I\'ve selected items with fresh ingredients, grilled preparations, and lighter cooking methods.';
        break;
      
      case 'burgers':
        recommendedItems = menuItems
          .filter(item => item.name.toLowerCase().includes('burger'))
          .map(item => `${item.name} ($${item.price})`);
        reasoning = 'These are our signature burger selections, each crafted with quality ingredients.';
        break;
      
      default:
        recommendedItems = menuItems
          .slice(0, 3)
          .map(item => `${item.name} ($${item.price})`);
        reasoning = 'Here are some of our most popular dishes to get you started.';
    }
    
    return { items: recommendedItems, reasoning };
  }
}

export const aiTrainingService = new AITrainingService();