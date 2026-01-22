import { Router, Request, Response } from "express";
import OpenAI from "openai";
import { storage } from "./storage";

export const voiceRouter = Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    // Build system prompt
    const systemPrompt = `You are Mimi, a voice-based AI ordering assistant for ${restaurant?.name || "our restaurant"}.

INSTRUCTIONS:
- Keep responses SHORT (1-2 sentences max) - this is for voice output
- Be friendly but efficient
- When customer orders items, confirm and add to order
- Parse quantities and item names from natural speech
- If unclear, ask one clarifying question

MENU:
${menuItems.map((item) => `- ${item.name}: $${item.price} - ${item.description || ""}`).join("\n")}

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
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        ...session.conversationHistory,
        { role: "user", content: transcript },
      ],
      max_tokens: 200,
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const aiResponse = completion.choices[0].message.content || "{}";
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

    // Process order actions
    if (parsed.orderAction) {
      const { action, item } = parsed.orderAction;
      
      if (action === "add" && item) {
        const menuItem = menuItems.find(
          (m) => m.name.toLowerCase().includes(item.name.toLowerCase())
        );
        if (menuItem) {
          session.currentOrder.push({
            menuItemId: menuItem.id,
            name: menuItem.name,
            price: parseFloat(menuItem.price),
            quantity: item.quantity || 1,
          });
        }
      } else if (action === "remove" && item) {
        session.currentOrder = session.currentOrder.filter(
          (o) => !o.name.toLowerCase().includes(item.name.toLowerCase())
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
voiceRouter.post("/speak", async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Missing text" });
    }

    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input: text,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    res.set("Content-Type", "audio/mpeg");
    res.send(buffer);
  } catch (error) {
    console.error("TTS error:", error);
    res.status(500).json({ error: "Failed to generate speech" });
  }
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
