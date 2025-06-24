interface ConversationContext {
  sessionId: string;
  customerPreferences: {
    dietary?: string[];
    spiceLevel?: 'mild' | 'medium' | 'hot';
    priceRange?: 'budget' | 'moderate' | 'premium';
    previousOrders?: string[];
    allergens?: string[];
  };
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
  lastActivity: Date;
}

export class ConversationMemoryService {
  private sessions = new Map<string, ConversationContext>();
  
  // Clean up old sessions every hour
  constructor() {
    setInterval(() => this.cleanupOldSessions(), 60 * 60 * 1000);
  }

  public getOrCreateSession(sessionId: string): ConversationContext {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, {
        sessionId,
        customerPreferences: {},
        conversationHistory: [],
        lastActivity: new Date()
      });
    }
    
    const session = this.sessions.get(sessionId)!;
    session.lastActivity = new Date();
    return session;
  }

  public addMessage(sessionId: string, role: 'user' | 'assistant', content: string) {
    const session = this.getOrCreateSession(sessionId);
    session.conversationHistory.push({
      role,
      content,
      timestamp: new Date()
    });
    
    // Keep only last 10 messages for context
    if (session.conversationHistory.length > 10) {
      session.conversationHistory = session.conversationHistory.slice(-10);
    }
    
    // Extract preferences from user messages
    if (role === 'user') {
      this.extractPreferences(session, content);
    }
  }

  private extractPreferences(session: ConversationContext, message: string) {
    const lowercaseMsg = message.toLowerCase();
    
    // Dietary preferences
    if (lowercaseMsg.includes('vegetarian') || lowercaseMsg.includes('veggie')) {
      session.customerPreferences.dietary = ['vegetarian'];
    }
    if (lowercaseMsg.includes('vegan')) {
      session.customerPreferences.dietary = ['vegan'];
    }
    if (lowercaseMsg.includes('gluten free') || lowercaseMsg.includes('celiac')) {
      session.customerPreferences.dietary = [...(session.customerPreferences.dietary || []), 'gluten-free'];
    }
    
    // Spice preferences
    if (lowercaseMsg.includes('spicy') || lowercaseMsg.includes('hot')) {
      session.customerPreferences.spiceLevel = 'hot';
    }
    if (lowercaseMsg.includes('mild') || lowercaseMsg.includes('not spicy')) {
      session.customerPreferences.spiceLevel = 'mild';
    }
    
    // Budget preferences
    if (lowercaseMsg.includes('budget') || lowercaseMsg.includes('cheap') || lowercaseMsg.includes('affordable')) {
      session.customerPreferences.priceRange = 'budget';
    }
    
    // Allergens
    if (lowercaseMsg.includes('allergic to') || lowercaseMsg.includes('allergy')) {
      const allergens = [];
      if (lowercaseMsg.includes('nuts') || lowercaseMsg.includes('peanut')) allergens.push('nuts');
      if (lowercaseMsg.includes('dairy') || lowercaseMsg.includes('lactose')) allergens.push('dairy');
      if (lowercaseMsg.includes('shellfish') || lowercaseMsg.includes('seafood')) allergens.push('seafood');
      session.customerPreferences.allergens = allergens;
    }
  }

  public getContextualHistory(sessionId: string): string {
    const session = this.sessions.get(sessionId);
    if (!session) return '';
    
    const preferences = session.customerPreferences;
    let context = '';
    
    if (preferences.dietary?.length) {
      context += `Customer is ${preferences.dietary.join(' and ')}.`;
    }
    if (preferences.spiceLevel) {
      context += ` Prefers ${preferences.spiceLevel} spice level.`;
    }
    if (preferences.priceRange) {
      context += ` Looking for ${preferences.priceRange} options.`;
    }
    if (preferences.allergens?.length) {
      context += ` Has allergies to: ${preferences.allergens.join(', ')}.`;
    }
    
    return context;
  }

  public getRecentHistory(sessionId: string): Array<{role: string, content: string}> {
    const session = this.sessions.get(sessionId);
    if (!session) return [];
    
    return session.conversationHistory.slice(-5); // Last 5 messages
  }

  private cleanupOldSessions() {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.lastActivity < oneHourAgo) {
        this.sessions.delete(sessionId);
      }
    }
  }
}

export const conversationMemory = new ConversationMemoryService();