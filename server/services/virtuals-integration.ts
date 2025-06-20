import { processChatMessage, type ChatContext } from './openai';
import { storage } from '../storage';

// Virtuals.io Agent Configuration
export interface VirtualsAgentConfig {
  agentId: string;
  name: string;
  personality: {
    traits: string[];
    tone: string;
    expertise: string[];
  };
  capabilities: string[];
  tokenRewards: {
    orderCompletion: number;
    reviewSubmission: number;
    referralBonus: number;
  };
}

export interface PlatformMessage {
  platform: 'twitter' | 'discord' | 'telegram' | 'web';
  userId: string;
  username: string;
  content: string;
  messageId: string;
  channelId?: string;
  metadata?: any;
}

export interface VirtualsResponse {
  content: string;
  actions?: Array<{
    type: 'order' | 'recommendation' | 'token_reward';
    data: any;
  }>;
  tokenReward?: number;
  suggestedItems?: any[];
}

export class VirtualsIntegrationService {
  private agentConfig: VirtualsAgentConfig = {
    agentId: 'mimi-waitress-001',
    name: 'Mimi',
    personality: {
      traits: ['friendly', 'knowledgeable', 'efficient', 'food-enthusiast'],
      tone: 'warm and professional',
      expertise: ['restaurant operations', 'menu consultation', 'food pairing', 'dietary restrictions']
    },
    capabilities: [
      'order_processing',
      'menu_recommendations', 
      'dietary_consultation',
      'restaurant_analytics',
      'social_engagement',
      'loyalty_rewards'
    ],
    tokenRewards: {
      orderCompletion: 10,
      reviewSubmission: 5,
      referralBonus: 20
    }
  };

  async processVirtualsMessage(message: PlatformMessage): Promise<VirtualsResponse> {
    try {
      // Get restaurant context
      const restaurants = await storage.getAllRestaurants();
      const restaurant = restaurants[0]; // Default to first restaurant for now
      
      if (!restaurant) {
        return {
          content: "I'm sorry, I don't have access to any restaurant menus right now. Please try again later!",
          tokenReward: 0
        };
      }

      const menuItems = await storage.getMenuItems(restaurant.id);
      const faqs = await storage.getFAQs(restaurant.id);

      const context: ChatContext = {
        restaurantName: restaurant.name,
        restaurantDescription: restaurant.description || "A delicious restaurant experience",
        tone: this.agentConfig.personality.tone,
        welcomeMessage: `Hi! I'm Mimi, your AI waitress for ${restaurant.name}. How can I help you today?`,
        menuItems: menuItems.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description || '',
          price: item.price,
          category: item.category,
          tags: item.tags || []
        })),
        faqs: faqs.map(faq => ({
          question: faq.question,
          answer: faq.answer
        }))
      };

      // Add platform-specific context
      const enhancedMessage = this.enhanceMessageForPlatform(message);
      
      // Process with OpenAI
      const aiResponse = await processChatMessage(enhancedMessage, context);
      
      // Format response for Virtuals protocol
      const virtualsResponse = this.formatForVirtuals(aiResponse, message);
      
      // Log interaction for analytics
      await this.logVirtualsInteraction(message, virtualsResponse);
      
      return virtualsResponse;
    } catch (error) {
      console.error('Virtuals message processing error:', error);
      return {
        content: "I'm having trouble processing your request right now. Please try again in a moment!",
        tokenReward: 0
      };
    }
  }

  private enhanceMessageForPlatform(message: PlatformMessage): string {
    const platformContext = {
      twitter: "Keep responses under 280 characters when possible.",
      discord: "Use Discord formatting like **bold** and *italic* when appropriate.",
      telegram: "Use emojis and be conversational.",
      web: "Provide detailed responses with full explanations."
    };

    const context = platformContext[message.platform] || platformContext.web;
    return `${context}\n\nUser message: ${message.content}`;
  }

  private formatForVirtuals(aiResponse: any, originalMessage: PlatformMessage): VirtualsResponse {
    const response: VirtualsResponse = {
      content: aiResponse.message,
      tokenReward: 0,
      actions: []
    };

    // Add suggested items if available
    if (aiResponse.suggestedItems?.length > 0) {
      response.suggestedItems = aiResponse.suggestedItems;
      response.actions?.push({
        type: 'recommendation',
        data: { items: aiResponse.suggestedItems }
      });
    }

    // Calculate token rewards
    if (this.isOrderIntent(aiResponse.message)) {
      response.tokenReward = this.agentConfig.tokenRewards.orderCompletion;
      response.actions?.push({
        type: 'token_reward',
        data: { amount: response.tokenReward, reason: 'order_completion' }
      });
    }

    // Format for specific platforms
    response.content = this.formatContentForPlatform(response.content, originalMessage.platform);

    return response;
  }

  private formatContentForPlatform(content: string, platform: string): string {
    switch (platform) {
      case 'twitter':
        return this.truncateForTwitter(content);
      case 'discord':
        return this.formatForDiscord(content);
      case 'telegram':
        return this.formatForTelegram(content);
      default:
        return content;
    }
  }

  private truncateForTwitter(content: string): string {
    if (content.length <= 280) return content;
    return content.substring(0, 270) + "... 🍽️";
  }

  private formatForDiscord(content: string): string {
    // Add Discord-style formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '**$1**') // Keep bold
      .replace(/\*(.*?)\*/g, '*$1*'); // Keep italic
  }

  private formatForTelegram(content: string): string {
    // Add appropriate emojis for Telegram
    return content
      .replace(/menu/gi, 'menu 📋')
      .replace(/order/gi, 'order 🛎️')
      .replace(/food/gi, 'food 🍽️');
  }

  private isOrderIntent(message: string): boolean {
    const orderKeywords = ['order', 'buy', 'purchase', 'get', 'want', 'take', 'add to cart'];
    return orderKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  private async logVirtualsInteraction(message: PlatformMessage, response: VirtualsResponse): Promise<void> {
    // Log to blockchain for immutable records
    try {
      const interactionData = {
        timestamp: Date.now(),
        platform: message.platform,
        userId: message.userId,
        messageLength: message.content.length,
        responseLength: response.content.length,
        tokenReward: response.tokenReward,
        actionsTriggered: response.actions?.length || 0
      };
      
      console.log('Virtuals interaction logged:', interactionData);
      // In a full implementation, this would write to blockchain
    } catch (error) {
      console.error('Failed to log interaction:', error);
    }
  }

  // Platform-specific API methods
  async sendToTwitter(content: string, replyToTweetId?: string): Promise<void> {
    // Twitter API integration would go here
    console.log('Twitter response:', content);
  }

  async sendToDiscord(content: string, channelId: string): Promise<void> {
    // Discord API integration would go here
    console.log('Discord response:', content);
  }

  async sendToTelegram(content: string, chatId: string): Promise<void> {
    // Telegram API integration would go here
    console.log('Telegram response:', content);
  }

  // Token reward management
  async distributeTokenReward(userId: string, amount: number, reason: string): Promise<void> {
    try {
      // This would integrate with Virtuals.io token contract
      console.log(`Distributing ${amount} $VIRTUAL tokens to ${userId} for ${reason}`);
      
      // Log reward to blockchain
      const rewardData = {
        userId,
        amount,
        reason,
        timestamp: Date.now(),
        agentId: this.agentConfig.agentId
      };
      
      console.log('Token reward distributed:', rewardData);
    } catch (error) {
      console.error('Token distribution failed:', error);
    }
  }

  // Agent analytics for Virtuals.io ecosystem
  async getAgentMetrics(): Promise<any> {
    return {
      agentId: this.agentConfig.agentId,
      totalInteractions: 0, // Would track real metrics
      tokenRewardsDistributed: 0,
      averageResponseTime: 0,
      platformBreakdown: {
        twitter: 0,
        discord: 0,
        telegram: 0,
        web: 0
      },
      successfulOrders: 0,
      customerSatisfaction: 0
    };
  }
}

export const virtualsIntegration = new VirtualsIntegrationService();