import { Router, Request, Response } from "express";
import Anthropic from "@anthropic-ai/sdk";
import { storage } from "./storage";

export const voiceRouter = Router();

let anthropic: Anthropic | null = null;
function getAnthropicClient(): Anthropic {
  if (!anthropic) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is required for voice ordering. Set it in your environment.");
    }
    anthropic = new Anthropic();
  }
  return anthropic;
}

interface OrderItem {
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
  modifications?: string;
}

interface VoiceSession {
  sessionId: string;
  currentOrder: OrderItem[];
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }>;
  tableNumber?: string;
}

export const sessions = new Map<string, VoiceSession>();

export type { VoiceSession, OrderItem };

// Process voice transcript and return AI response
voiceRouter.post("/process", async (req: Request, res: Response) => {
  try {
    const { transcript, sessionId, tableNumber } = req.body;

    if (!transcript || !sessionId) {
      return res.status(400).json({ error: "Missing transcript or sessionId" });
    }

    // Get or create session
    let session = sessions.get(sessionId);
    if (!session) {
      session = {
        sessionId,
        currentOrder: [],
        conversationHistory: [],
        tableNumber,
      };
      sessions.set(sessionId, session);
    }

    // Get menu items for context
    const menuItems = await storage.getMenuItems(1);
    const restaurant = await storage.getRestaurant(1);

    // Build enhanced menu with weighted keywords for AI matching
    const menuWithKeywords = menuItems.map((item) => {
      const keywords = item.weightedKeywords || {};
      const keywordStr = Object.entries(keywords)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .map(([k, w]) => `${k}(${w})`)
        .join(", ");
      const dietary = (item.dietaryTags || []).join(", ");
      const aliases = (item.aliases || []).join(", ");
      
      return `- ${item.name}: $${item.price}
  Description: ${item.description || "N/A"}
  ${keywordStr ? `Keywords: ${keywordStr}` : ""}
  ${dietary ? `Dietary: ${dietary}` : ""}
  ${aliases ? `Also known as: ${aliases}` : ""}`;
    }).join("\n");

    // Build system prompt
    const systemPrompt = `You are Mimi, a voice-based AI ordering assistant for ${restaurant?.name || "our restaurant"}.

INSTRUCTIONS:
- Keep responses SHORT (1-2 sentences max) - this is for voice output
- Be friendly but efficient
- When customer orders items, confirm and add to order
- Parse quantities and item names from natural speech
- Use the weighted keywords to match customer requests to menu items (higher weight = stronger match)
- If a customer asks for something "spicy" or "light" etc, match items with relevant keywords
- If unclear, ask one clarifying question

MENU:
${menuWithKeywords}

CURRENT ORDER:
${
  session.currentOrder.length > 0
    ? session.currentOrder.map((i) => `${i.quantity}x ${i.name}`).join(", ")
    : "Empty"
}

Respond in JSON format:
{
  "message": "your spoken response",
  "orderAction": null | { "action": "add"|"remove"|"clear", "item": { "name": "...", "quantity": 1 } },
  "orderComplete": false
}`;

    // Get AI response
    const completion = await getAnthropicClient().messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 200,
      system: systemPrompt,
      messages: [
        ...session.conversationHistory.map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
        { role: "user", content: transcript },
      ],
    });

    const aiResponse =
      completion.content[0].type === "text"
        ? completion.content[0].text
        : "{}";
    let parsed;

    try {
      parsed = JSON.parse(aiResponse);
    } catch {
      parsed = { message: "I didn't catch that. Could you repeat?", orderAction: null };
    }

    // Update conversation history
    session.conversationHistory.push(
      { role: "user", content: transcript },
      { role: "assistant", content: parsed.message }
    );

    // Smart menu item matching with weighted keywords
    function findBestMenuItem(searchTerm: string): typeof menuItems[number] | null {
      const searchLower = searchTerm.toLowerCase();
      const searchTokens = searchLower.split(/\s+/);
      
      let bestMatch: typeof menuItems[number] | null = null;
      let bestScore = 0;
      
      for (const item of menuItems) {
        let score = 0;
        
        // Direct name match (highest priority)
        if (item.name.toLowerCase().includes(searchLower)) {
          score += 10;
        }
        
        // Check aliases for matches
        const aliases = (item.aliases || []) as string[];
        for (const alias of aliases) {
          if (alias.toLowerCase().includes(searchLower) || searchLower.includes(alias.toLowerCase())) {
            score += 8;
          }
        }
        
        // Weighted keyword matching
        const keywords = (item.weightedKeywords || {}) as Record<string, number>;
        for (const token of searchTokens) {
          for (const [keyword, weight] of Object.entries(keywords)) {
            if (keyword.toLowerCase().includes(token) || token.includes(keyword.toLowerCase())) {
              score += weight * 5;
            }
          }
        }
        
        // Dietary tag matching
        const dietaryTags = (item.dietaryTags || []) as string[];
        for (const tag of dietaryTags) {
          if (searchLower.includes(tag.toLowerCase())) {
            score += 3;
          }
        }
        
        if (score > bestScore) {
          bestScore = score;
          bestMatch = item;
        }
      }
      
      return bestScore >= 3 ? bestMatch : null;
    }

    // Process order actions
    if (parsed.orderAction) {
      const { action, item } = parsed.orderAction;
      
      if (action === "add" && item) {
        const menuItem = findBestMenuItem(item.name);
        if (menuItem) {
          session.currentOrder.push({
            menuItemId: menuItem.id,
            name: menuItem.name,
            price: parseFloat(menuItem.price),
            quantity: item.quantity || 1,
          });
        }
      } else if (action === "remove" && item) {
        const itemLower = item.name.toLowerCase();
        session.currentOrder = session.currentOrder.filter(
          (o) => !o.name.toLowerCase().includes(itemLower)
        );
      } else if (action === "clear") {
        session.currentOrder = [];
      }
    }

    // Calculate total
    const total = session.currentOrder.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    res.json({
      message: parsed.message,
      currentOrder: session.currentOrder,
      total: total.toFixed(2),
      orderComplete: parsed.orderComplete || false,
    });
  } catch (error) {
    console.error("Voice processing error:", error);
    res.status(500).json({ error: "Failed to process voice input" });
  }
});

// Text-to-speech endpoint
// Claude does not provide a TTS API — the client should use the browser's
// built-in SpeechSynthesis API (Web Speech API) instead.
voiceRouter.post("/speak", async (req: Request, res: Response) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Missing text" });
  }
  // Return the text so the client can speak it via the browser's speechSynthesis API
  res.json({ text, useBrowserTTS: true });
});

// Speech-to-text endpoint (for audio file uploads)
voiceRouter.post("/transcribe", async (req: Request, res: Response) => {
  try {
    // Note: This would require multer for file uploads
    // For now, return a placeholder
    res.json({ transcript: "Voice transcription endpoint ready" });
  } catch (error) {
    res.status(500).json({ error: "Failed to transcribe audio" });
  }
});

// Get current session state
voiceRouter.get("/session/:sessionId", (req: Request, res: Response) => {
  const session = sessions.get(req.params.sessionId);
  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }
  
  const total = session.currentOrder.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  
  res.json({
    currentOrder: session.currentOrder,
    total: total.toFixed(2),
    tableNumber: session.tableNumber,
  });
});

// Complete order from voice session
voiceRouter.post("/complete/:sessionId", async (req: Request, res: Response) => {
  try {
    const session = sessions.get(req.params.sessionId);
    if (!session || session.currentOrder.length === 0) {
      return res.status(400).json({ error: "No items in order" });
    }

    const subtotal = session.currentOrder.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    const order = await storage.createOrder({
      restaurantId: 1,
      tableNumber: session.tableNumber,
      items: JSON.stringify(session.currentOrder),
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
      status: "pending",
    });

    // Clear session
    sessions.delete(req.params.sessionId);

    res.json({
      orderId: order.id,
      total: total.toFixed(2),
      message: `Order confirmed! Your total is $${total.toFixed(2)}`,
    });
  } catch (error) {
    console.error("Order completion error:", error);
    res.status(500).json({ error: "Failed to complete order" });
  }
});
