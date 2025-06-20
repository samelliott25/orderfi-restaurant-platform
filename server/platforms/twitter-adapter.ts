import { virtualsIntegration, type PlatformMessage } from '../services/virtuals-integration';

interface TwitterWebhookEvent {
  tweet_create_events?: Array<{
    id_str: string;
    text: string;
    user: {
      id_str: string;
      screen_name: string;
    };
    in_reply_to_status_id_str?: string;
  }>;
  direct_message_events?: Array<{
    id: string;
    text: string;
    sender_id: string;
    created_timestamp: string;
  }>;
}

export class TwitterAdapter {
  private apiKey: string;
  private apiSecret: string;
  private accessToken: string;
  private accessTokenSecret: string;

  constructor() {
    this.apiKey = process.env.TWITTER_API_KEY || '';
    this.apiSecret = process.env.TWITTER_API_SECRET || '';
    this.accessToken = process.env.TWITTER_ACCESS_TOKEN || '';
    this.accessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET || '';
  }

  async handleWebhook(event: TwitterWebhookEvent): Promise<void> {
    // Handle mentions and replies
    if (event.tweet_create_events) {
      for (const tweet of event.tweet_create_events) {
        await this.processTweet(tweet);
      }
    }

    // Handle direct messages
    if (event.direct_message_events) {
      for (const dm of event.direct_message_events) {
        await this.processDM(dm);
      }
    }
  }

  private async processTweet(tweet: any): Promise<void> {
    // Skip our own tweets
    if (tweet.user.screen_name === 'MimiWaitress') return;

    // Check if we're mentioned or if it's a reply to us
    const isMention = tweet.text.includes('@MimiWaitress');
    const isReply = tweet.in_reply_to_status_id_str !== null;

    if (isMention || isReply) {
      const message: PlatformMessage = {
        platform: 'twitter',
        userId: tweet.user.id_str,
        username: tweet.user.screen_name,
        content: tweet.text.replace('@MimiWaitress', '').trim(),
        messageId: tweet.id_str,
        metadata: {
          isReply,
          originalTweetId: tweet.in_reply_to_status_id_str
        }
      };

      const response = await virtualsIntegration.processVirtualsMessage(message);
      await this.replyToTweet(tweet.id_str, response.content);

      // Distribute token rewards if applicable
      if (response.tokenReward && response.tokenReward > 0) {
        await virtualsIntegration.distributeTokenReward(
          tweet.user.id_str,
          response.tokenReward,
          'twitter_interaction'
        );
      }
    }
  }

  private async processDM(dm: any): Promise<void> {
    const message: PlatformMessage = {
      platform: 'twitter',
      userId: dm.sender_id,
      username: dm.sender_id, // DMs don't include username
      content: dm.text,
      messageId: dm.id,
      metadata: {
        isDM: true
      }
    };

    const response = await virtualsIntegration.processVirtualsMessage(message);
    await this.sendDM(dm.sender_id, response.content);

    // Token rewards for DM orders
    if (response.tokenReward && response.tokenReward > 0) {
      await virtualsIntegration.distributeTokenReward(
        dm.sender_id,
        response.tokenReward,
        'order_via_dm'
      );
    }
  }

  private async replyToTweet(tweetId: string, content: string): Promise<void> {
    // Twitter API v2 tweet creation
    const tweetData = {
      text: content,
      reply: {
        in_reply_to_tweet_id: tweetId
      }
    };

    try {
      // In real implementation, this would use Twitter API
      console.log(`Twitter reply to ${tweetId}: ${content}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error('Failed to reply to tweet:', error);
    }
  }

  private async sendDM(userId: string, content: string): Promise<void> {
    const dmData = {
      text: content,
      media_id: undefined // Could attach menu images
    };

    try {
      console.log(`Twitter DM to ${userId}: ${content}`);
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error('Failed to send DM:', error);
    }
  }

  // Proactive tweet capabilities
  async tweetMenuUpdate(menuItem: any): Promise<void> {
    const content = `🍽️ NEW on our menu: ${menuItem.name}! ${menuItem.description}\n\n💰 ${menuItem.price}\n\nReply to order or DM us! #MimiWaitress #FoodieLife`;
    
    try {
      console.log('Tweeting menu update:', content);
      // Would post to Twitter API
    } catch (error) {
      console.error('Failed to tweet menu update:', error);
    }
  }

  async tweetSpecialOffer(offer: string): Promise<void> {
    const content = `🎉 Special Offer Alert! 🎉\n\n${offer}\n\nMention us in a tweet to claim! Limited time only.\n\n#MimiWaitress #SpecialOffer #FoodDeals`;
    
    try {
      console.log('Tweeting special offer:', content);
      // Would post to Twitter API
    } catch (error) {
      console.error('Failed to tweet offer:', error);
    }
  }
}

export const twitterAdapter = new TwitterAdapter();