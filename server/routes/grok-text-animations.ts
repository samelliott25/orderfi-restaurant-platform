import { Request, Response } from 'express';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://api.x.ai/v1',
  apiKey: process.env.XAI_API_KEY,
});

export async function analyzeTextAnimations(req: Request, res: Response) {
  try {
    const { textContent, currentAnimations, designContext } = req.body;

    const prompt = `You are an expert CSS animation designer specializing in creating engaging, modern text animations for web applications. 

Analyze this text element and current animations:
TEXT CONTENT: "${textContent}"
CURRENT ANIMATIONS: ${currentAnimations}
DESIGN CONTEXT: ${designContext}

Please provide 5 innovative animation enhancement suggestions that would make this text more engaging:

1. **Text Reveal Animations**: Character-by-character reveals, typewriter effects, or staggered entrances
2. **Morphing Effects**: Text transformations, scaling, or shape changes
3. **Particle Systems**: Text-integrated particle effects, floating elements, or dynamic backgrounds
4. **Interactive States**: Hover effects, click animations, or scroll-triggered animations
5. **Advanced CSS Techniques**: Complex keyframes, 3D transforms, or physics-based animations

For each suggestion, provide:
- Animation name and description
- Complete CSS implementation
- JavaScript integration if needed
- Performance considerations
- Browser compatibility notes

Focus on animations that enhance user experience without being overwhelming, suitable for a restaurant platform landing page.

Respond in JSON format with this structure:
{
  "analysis": "Brief analysis of current animations and improvement opportunities",
  "recommendations": [
    {
      "name": "Animation name",
      "description": "Detailed description",
      "css": "Complete CSS code",
      "javascript": "JavaScript code if needed",
      "performance": "Performance notes",
      "compatibility": "Browser support info"
    }
  ],
  "bestPractices": ["List of animation best practices"],
  "implementation": "Step-by-step implementation guide"
}`;

    const response = await openai.chat.completions.create({
      model: 'grok-2-1212',
      messages: [
        {
          role: 'system',
          content: 'You are an expert CSS animation designer with deep knowledge of modern web animation techniques, performance optimization, and user experience principles.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
    });

    const result = JSON.parse(response.choices[0].message.content);
    res.json(result);

  } catch (error) {
    console.error('Error analyzing text animations:', error);
    res.status(500).json({ 
      error: 'Failed to analyze text animations',
      message: error.message 
    });
  }
}

export async function generateAdvancedTextAnimations(req: Request, res: Response) {
  try {
    const { textElement, animationType, complexity = 'medium' } = req.body;

    const prompt = `Create advanced CSS animations for this text element:

TEXT ELEMENT: ${textElement}
ANIMATION TYPE: ${animationType}
COMPLEXITY LEVEL: ${complexity}

Generate a comprehensive animation system including:

1. **Primary Animation**: Main text animation effect
2. **Secondary Effects**: Supporting visual elements
3. **Interactive States**: Hover, focus, and click states
4. **Responsive Design**: Mobile-optimized animations
5. **Performance Optimization**: GPU acceleration and efficient keyframes

Create animations that are:
- Visually striking but not distracting
- Performant on all devices
- Accessible (respects prefers-reduced-motion)
- Modern and professional
- Suitable for a restaurant platform

Provide complete implementation with:
- CSS keyframes and animations
- JavaScript for interactive elements
- HTML structure if needed
- Performance optimization techniques
- Accessibility considerations

Respond in JSON format:
{
  "animationSystem": {
    "primaryAnimation": {
      "name": "Main animation name",
      "css": "Complete CSS code",
      "keyframes": "Keyframe definitions"
    },
    "secondaryEffects": [
      {
        "name": "Effect name",
        "css": "CSS code",
        "purpose": "What this effect achieves"
      }
    ],
    "interactiveStates": {
      "hover": "Hover animation CSS",
      "focus": "Focus animation CSS",
      "click": "Click animation CSS"
    },
    "responsiveDesign": {
      "mobile": "Mobile-specific animations",
      "tablet": "Tablet optimizations",
      "desktop": "Desktop enhancements"
    }
  },
  "implementation": {
    "html": "Required HTML structure",
    "css": "Complete CSS implementation",
    "javascript": "JavaScript code if needed"
  },
  "performance": {
    "optimizations": ["Performance optimization techniques"],
    "browserSupport": "Browser compatibility info",
    "accessibility": "Accessibility considerations"
  }
}`;

    const response = await openai.chat.completions.create({
      model: 'grok-2-1212',
      messages: [
        {
          role: 'system',
          content: 'You are a master CSS animation developer specializing in creating cutting-edge, performant web animations that enhance user experience.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.9,
    });

    const result = JSON.parse(response.choices[0].message.content);
    res.json(result);

  } catch (error) {
    console.error('Error generating advanced text animations:', error);
    res.status(500).json({ 
      error: 'Failed to generate advanced text animations',
      message: error.message 
    });
  }
}