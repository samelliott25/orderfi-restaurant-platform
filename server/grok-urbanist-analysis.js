import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://api.x.ai/v1",
  apiKey: process.env.XAI_API_KEY,
});

async function analyzeUrbanistDesign() {
  try {
    const response = await openai.chat.completions.create({
      model: "grok-2-1212",
      messages: [
        {
          role: "system",
          content: "You are a UI/UX design expert specializing in modern design systems. Analyze the Urbanist design scheme and provide complete implementation code."
        },
        {
          role: "user",
          content: `Based on the Urbanist design scheme image I've seen, implement a complete design system with:

1. Color palette: Light green, yellow, black, and supporting grays
2. Card layouts with clean, minimal design
3. Modern typography system
4. Component styling for React/Tailwind

The design shows:
- Clean white backgrounds
- Light green (#4CAF50) accent cards
- Yellow (#FFC107) highlight cards  
- Black (#1C1C1E) dark cards
- Minimal rounded corners (8px)
- Clean typography with good spacing
- Mobile-first card layouts
- Subtle shadows and borders

Please provide:
1. Complete CSS color system
2. Tailwind config updates
3. Card component implementations
4. Typography system
5. Layout grid system`
        }
      ],
      max_tokens: 4000,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Grok analysis error:', error);
    throw error;
  }
}

export { analyzeUrbanistDesign };