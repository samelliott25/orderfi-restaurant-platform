import { Request, Response } from 'express';
import OpenAI from 'openai';
import multer from 'multer';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

export const uploadMiddleware = upload.single('image');

export async function parseMenuHandler(req: Request, res: Response) {
  try {
    const { text } = req.body;
    const image = req.file;

    if (!text && !image) {
      return res.status(400).json({ error: 'Either text or image is required' });
    }

    let menuContent = '';
    
    if (image) {
      // Convert image to base64 for OpenAI Vision API
      const base64Image = image.buffer.toString('base64');
      const imageUrl = `data:${image.mimetype};base64,${base64Image}`;
      
      const visionResponse = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Extract all menu items from this image. For each item, provide the name, description (if available), and price. Format as a structured list."
              },
              {
                type: "image_url",
                image_url: { url: imageUrl }
              }
            ],
          },
        ],
        max_tokens: 1000,
      });

      menuContent = visionResponse.choices[0].message.content || '';
    } else {
      menuContent = text;
    }

    // Parse the menu content with GPT-4o
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
                "category": "category name",
                "modifiers": ["optional modifier 1", "optional modifier 2"]
              }
            ],
            "categories": ["category 1", "category 2"]
          }
          
          Guidelines:
          - Extract clear, concise item names
          - Include descriptions when available
          - Convert prices to numbers (remove $ signs)
          - Group items into logical categories (Mains, Starters, Desserts, Drinks, etc.)
          - Suggest common modifiers for items (size, extras, cooking preferences)
          - If no clear categories exist, create sensible ones based on food type`
        },
        {
          role: "user",
          content: menuContent
        }
      ],
      response_format: { type: "json_object" },
    });

    const parsedData = JSON.parse(parseResponse.choices[0].message.content || '{}');
    
    // Validate the parsed data
    if (!parsedData.items || !Array.isArray(parsedData.items)) {
      throw new Error('Invalid menu data structure');
    }

    // Clean up the data
    const cleanedItems = parsedData.items.map((item: any) => ({
      name: item.name || 'Unnamed Item',
      description: item.description || '',
      price: Number(item.price) || 0,
      category: item.category || 'Other',
      modifiers: Array.isArray(item.modifiers) ? item.modifiers : []
    }));

    const categories = parsedData.categories || [];

    res.json({
      items: cleanedItems,
      categories: categories,
      success: true
    });

  } catch (error) {
    console.error('Menu parsing error:', error);
    res.status(500).json({ 
      error: 'Failed to parse menu',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}