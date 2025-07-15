import { Router } from 'express';
import OpenAI from 'openai';

const router = Router();
const openai = new OpenAI({ 
  baseURL: "https://api.x.ai/v1", 
  apiKey: process.env.XAI_API_KEY 
});

// Analyze color palette and generate comprehensive theme system
router.post('/analyze-palette', async (req, res) => {
  try {
    const { imageDescription, currentThemeIssues } = req.body;

    const response = await openai.chat.completions.create({
      model: "grok-2-1212",
      messages: [
        {
          role: "system",
          content: `You are an expert UI/UX designer and color theorist specializing in modern application themes. 
          Analyze the provided color palette and generate a comprehensive CSS theme system for a restaurant management application.
          
          Focus on:
          1. Color harmony and accessibility
          2. Semantic color token assignment
          3. Light/dark mode variants
          4. CSS variable definitions
          5. Component-specific color applications
          6. Gradient combinations
          7. Brand consistency
          
          Provide detailed CSS variables and usage guidelines.`
        },
        {
          role: "user",
          content: `Analyze this Kleurvörm color palette for OrderFi restaurant app:
          
          Color Palette Description: ${imageDescription}
          
          Current Theme Issues: ${currentThemeIssues}
          
          Generate a complete CSS theme system with:
          1. CSS root variables for light/dark modes
          2. Semantic color token assignments
          3. Component-specific color applications
          4. Gradient definitions
          5. Accessibility considerations
          6. Implementation guidelines
          
          The palette appears to have:
          - Primary: Deep purple/blue gradient
          - Secondary: Pink/magenta gradient  
          - Accent: Orange/coral tones
          - Neutral: Light purple/white tones
          - Dark: Deep navy/black
          
          Create a sophisticated, modern theme that maintains the vibrant energy while ensuring readability and accessibility.`
        }
      ],
      max_tokens: 4000,
      temperature: 0.7
    });

    const analysis = response.choices[0].message.content;
    
    res.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Grok theme analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze color palette',
      details: error.message
    });
  }
});

export default router;