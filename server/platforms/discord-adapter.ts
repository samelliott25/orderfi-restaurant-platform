import { virtualsIntegration, type PlatformMessage } from '../services/virtuals-integration';

interface DiscordMessage {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    bot: boolean;
  };
  channel_id: string;
  guild_id?: string;
  mentions: Array<{
    id: string;
    username: string;
  }>;
  referenced_message?: {
    id: string;
    author: {
      id: string;
    };
  };
}

export class DiscordAdapter {
  private botToken: string;
  private applicationId: string;
  private mimiUserId: string = ''; // Set when bot starts

  constructor() {
    this.botToken = process.env.DISCORD_BOT_TOKEN || '';
    this.applicationId = process.env.DISCORD_APPLICATION_ID || '';
  }

  async handleMessage(message: DiscordMessage): Promise<void> {
    // Skip bot messages
    if (message.author.bot) return;

    // Check if Mimi is mentioned or if it's a reply to Mimi
    const isMentioned = message.mentions.some(mention => mention.id === this.mimiUserId);
    const isReplyToMimi = message.referenced_message?.author.id === this.mimiUserId;
    const isDirectChannel = !message.guild_id; // DM channel

    if (isMentioned || isReplyToMimi || isDirectChannel) {
      const platformMessage: PlatformMessage = {
        platform: 'discord',
        userId: message.author.id,
        username: message.author.username,
        content: message.content.replace(`<@${this.mimiUserId}>`, '').trim(),
        messageId: message.id,
        channelId: message.channel_id,
        metadata: {
          guildId: message.guild_id,
          isDirectMessage: isDirectChannel,
          isReply: isReplyToMimi
        }
      };

      const response = await virtualsIntegration.processVirtualsMessage(platformMessage);
      await this.sendResponse(message.channel_id, response.content, message.id);

      // Handle suggested menu items with embeds
      if (response.suggestedItems && response.suggestedItems.length > 0) {
        await this.sendMenuEmbed(message.channel_id, response.suggestedItems);
      }

      // Distribute token rewards
      if (response.tokenReward && response.tokenReward > 0) {
        await virtualsIntegration.distributeTokenReward(
          message.author.id,
          response.tokenReward,
          'discord_interaction'
        );
      }
    }
  }

  private async sendResponse(channelId: string, content: string, replyToMessageId?: string): Promise<void> {
    const messageData: any = {
      content: content
    };

    if (replyToMessageId) {
      messageData.message_reference = {
        message_id: replyToMessageId
      };
    }

    try {
      console.log(`Discord response to channel ${channelId}: ${content}`);
      // Would use Discord API here
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error('Failed to send Discord message:', error);
    }
  }

  private async sendMenuEmbed(channelId: string, menuItems: any[]): Promise<void> {
    const embed = {
      title: "🍽️ Recommended Menu Items",
      color: 0xFFE6B0, // Cream color in hex
      fields: menuItems.slice(0, 5).map(item => ({
        name: `${item.name} - ${item.price}`,
        value: item.description || 'Delicious menu item',
        inline: true
      })),
      footer: {
        text: "React with 🛒 to add to cart or reply with the item name!"
      }
    };

    try {
      console.log(`Discord menu embed to channel ${channelId}:`, embed);
      // Would send embed via Discord API
    } catch (error) {
      console.error('Failed to send Discord embed:', error);
    }
  }

  // Handle Discord slash commands
  async handleSlashCommand(interaction: any): Promise<void> {
    const { command_name, options, user, channel_id } = interaction;

    switch (command_name) {
      case 'menu':
        await this.handleMenuCommand(interaction);
        break;
      case 'order':
        await this.handleOrderCommand(interaction);
        break;
      case 'specials':
        await this.handleSpecialsCommand(interaction);
        break;
      default:
        await this.respondToInteraction(interaction, "I don't recognize that command. Try /menu or /order!");
    }
  }

  private async handleMenuCommand(interaction: any): Promise<void> {
    const category = interaction.options?.[0]?.value || 'all';
    
    const platformMessage: PlatformMessage = {
      platform: 'discord',
      userId: interaction.user.id,
      username: interaction.user.username,
      content: `Show me the ${category} menu`,
      messageId: interaction.id,
      channelId: interaction.channel_id
    };

    const response = await virtualsIntegration.processVirtualsMessage(platformMessage);
    await this.respondToInteraction(interaction, response.content);

    if (response.suggestedItems) {
      await this.sendMenuEmbed(interaction.channel_id, response.suggestedItems);
    }
  }

  private async handleOrderCommand(interaction: any): Promise<void> {
    const itemName = interaction.options?.[0]?.value;
    
    if (!itemName) {
      await this.respondToInteraction(interaction, "Please specify what you'd like to order! Example: `/order pizza margherita`");
      return;
    }

    const platformMessage: PlatformMessage = {
      platform: 'discord',
      userId: interaction.user.id,
      username: interaction.user.username,
      content: `I want to order ${itemName}`,
      messageId: interaction.id,
      channelId: interaction.channel_id
    };

    const response = await virtualsIntegration.processVirtualsMessage(platformMessage);
    await this.respondToInteraction(interaction, response.content);

    // Give extra tokens for direct orders
    if (response.tokenReward) {
      await virtualsIntegration.distributeTokenReward(
        interaction.user.id,
        response.tokenReward + 5, // Bonus for using slash command
        'discord_slash_order'
      );
    }
  }

  private async handleSpecialsCommand(interaction: any): Promise<void> {
    const specialsMessage = "🎉 Today's Specials:\n\n• **Happy Hour**: 20% off all drinks 4-6 PM\n• **Chef's Choice**: Mystery pasta dish for $15\n• **Family Deal**: 2 mains + 2 sides for $35\n\nUse `/order` to place your order!";
    
    await this.respondToInteraction(interaction, specialsMessage);
  }

  private async respondToInteraction(interaction: any, content: string): Promise<void> {
    try {
      console.log(`Discord interaction response: ${content}`);
      // Would respond via Discord interactions API
    } catch (error) {
      console.error('Failed to respond to Discord interaction:', error);
    }
  }

  // Proactive Discord features
  async announceToChannel(channelId: string, announcement: string): Promise<void> {
    try {
      console.log(`Discord announcement to ${channelId}: ${announcement}`);
      // Would post via Discord API
    } catch (error) {
      console.error('Failed to announce to Discord channel:', error);
    }
  }

  async createEventForSpecial(guildId: string, eventDetails: any): Promise<void> {
    try {
      console.log(`Creating Discord event in guild ${guildId}:`, eventDetails);
      // Would create event via Discord API
    } catch (error) {
      console.error('Failed to create Discord event:', error);
    }
  }
}

export const discordAdapter = new DiscordAdapter();