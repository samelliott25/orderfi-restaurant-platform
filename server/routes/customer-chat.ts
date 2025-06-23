import { Router } from 'express';
import { processChatMessage, type ChatContext } from '../services/openai';
import { storage } from '../storage';

const router = Router();

// Customer chat endpoint for menu assistance and ordering help
router.post('/', async (req, res) => {
  try {
    const { message, context = "customer_ordering", currentCart = [] } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Get restaurant and menu data for context
    const restaurant = await storage.getRestaurant(1);
    const menuItems = await storage.getMenuItems(1);
    const faqs = await storage.getFAQs(1);
    
    // Build proper context for the AI
    const chatContext: ChatContext = {
      restaurantName: restaurant?.name || "Our Restaurant",
      restaurantDescription: restaurant?.description || "A delightful dining experience",
      tone: "friendly and helpful",
      welcomeMessage: "Hi! I'm Mimi, your AI dining assistant. How can I help you today?",
      menuItems: menuItems.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description || "",
        price: item.price,
        category: item.category,
        tags: item.tags || []
      })),
      faqs: faqs.map(faq => ({
        question: faq.question,
        answer: faq.answer
      }))
    };

    // Process the customer's message
    const response = await processChatMessage(message, chatContext);
    
    // Extract menu recommendations if the AI suggests specific items
    const menuRecommendations = response.suggestedItems || [];

    res.json({
      message: response.message,
      menuRecommendations,
      sessionId: Date.now().toString()
    });

  } catch (error) {
    console.error("Customer chat error:", error);
    res.status(500).json({ 
      message: "I'm having trouble processing that request right now. Please try asking about our menu items, ingredients, or let me help you place an order!" 
    });
  }
});

export default router;