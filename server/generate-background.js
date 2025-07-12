import OpenAI from 'openai';

const openai = new OpenAI({ 
  baseURL: "https://api.x.ai/v1", 
  apiKey: process.env.XAI_API_KEY 
});

async function generateNovelBackground() {
  try {
    const response = await openai.chat.completions.create({
      model: "grok-2-1212",
      messages: [{
        role: "user",
        content: `Generate a sophisticated moving textured background component for OrderFi restaurant interface. Requirements:

1. ADVANCED VISUAL EFFECTS:
   - Layered gradient animations with multiple colors
   - Floating particle system with realistic physics
   - Geometric pattern overlays (hexagons, circles, waves)
   - Subtle texture movements and distortions
   - Marble-like veining effects using SVG filters

2. PERFORMANCE OPTIMIZATION:
   - GPU-accelerated CSS animations using transform3d
   - Hardware acceleration with will-change property
   - Reduced motion support for accessibility
   - Optimized render cycles and paint operations

3. CONFIGURABLE SETTINGS:
   - Intensity levels: subtle (0.3), medium (0.5), vibrant (0.7)
   - Animation speeds: slow (20s), medium (15s), fast (10s)
   - Color schemes: warm (orange/pink), cool (blue/teal), neutral (gray)

4. TECHNICAL IMPLEMENTATION:
   - React TypeScript component with proper interfaces
   - CSS-in-JS with custom CSS variables
   - SVG filter definitions for advanced effects
   - WebGL shader effects for premium visuals
   - Smooth transitions and easing functions

5. VISUAL ELEMENTS:
   - Primary gradient layer with radial patterns
   - Secondary overlay with geometric shapes
   - Tertiary particle layer with floating elements
   - Quaternary texture layer with noise patterns
   - Ambient lighting effects and shadows

Generate complete React component code with all CSS animations, SVG filters, and TypeScript interfaces. Focus on creating a premium, restaurant-grade visual experience that enhances the OrderFi brand without distracting from functionality.`
      }],
      max_tokens: 4000,
      temperature: 0.7
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating background:', error);
    return null;
  }
}

generateNovelBackground().then(result => {
  if (result) {
    console.log('=== GROK-4 GENERATED NOVEL MOVING BACKGROUND ===');
    console.log(result);
  } else {
    console.log('Failed to generate background');
  }
});