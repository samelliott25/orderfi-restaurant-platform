import { Router } from 'express';
import OpenAI from 'openai';

const router = Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate speech using OpenAI TTS
router.post('/speech', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Use OpenAI's TTS with a natural female voice
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova", // Nova is a warm, friendly female voice
      input: text,
      speed: 0.9, // Slightly slower for friendliness
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': buffer.length.toString(),
    });
    
    res.send(buffer);
  } catch (error) {
    console.error('TTS Error:', error);
    res.status(500).json({ error: 'Failed to generate speech' });
  }
});

export default router;