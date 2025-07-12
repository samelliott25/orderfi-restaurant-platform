import OpenAI from "openai";

const openai = new OpenAI({ 
  baseURL: "https://api.x.ai/v1", 
  apiKey: process.env.XAI_API_KEY 
});

// Enhanced competitive analysis using Grok-2
export async function enhancedCompetitiveAnalysis(competitorData: string): Promise<string> {
  const prompt = `Analyze this restaurant/POS competitor data and provide strategic insights for OrderFi's competitive positioning. Focus on unique differentiators, market gaps, and implementation opportunities:\n\n${competitorData}`;

  const response = await openai.chat.completions.create({
    model: "grok-2-1212",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content || "";
}

// Feature taste analysis with Grok's perspective
export async function grokFeatureTaste(featureDescription: string): Promise<{
  rating: number,
  confidence: number,
  insights: string
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "grok-2-1212",
      messages: [
        {
          role: "system",
          content: "You are an expert restaurant technology analyst. Evaluate features for OrderFi (AI-powered restaurant platform) on a 1-10 scale. Provide JSON response with rating (1-10), confidence (0-1), and insights string.",
        },
        {
          role: "user",
          content: `Evaluate this feature for a restaurant AI platform: ${featureDescription}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return {
      rating: Math.max(1, Math.min(10, Math.round(result.rating || 5))),
      confidence: Math.max(0, Math.min(1, result.confidence || 0.7)),
      insights: result.insights || "No insights provided",
    };
  } catch (error) {
    throw new Error("Failed to analyze feature taste with Grok: " + error.message);
  }
}

// Menu image analysis using Grok Vision
export async function analyzeMenuImage(base64Image: string): Promise<string> {
  const visionResponse = await openai.chat.completions.create({
    model: "grok-2-vision-1212",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Analyze this restaurant menu image. Extract menu items, prices, categories, and suggest improvements for digital ordering optimization."
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`
            }
          }
        ],
      },
    ],
    max_tokens: 1000,
  });

  return visionResponse.choices[0].message.content || "";
}

// Strategic restaurant insights using Grok's reasoning
export async function generateRestaurantStrategy(businessContext: string): Promise<string> {
  const prompt = `As a restaurant technology strategist, analyze this business context and provide actionable recommendations for OrderFi implementation. Focus on ROI, operational efficiency, and competitive advantages:\n\n${businessContext}`;

  const response = await openai.chat.completions.create({
    model: "grok-2-1212",
    messages: [
      {
        role: "system",
        content: "You are a restaurant industry expert specializing in technology adoption and operational optimization. Provide strategic, actionable insights."
      },
      { role: "user", content: prompt }
    ],
    max_tokens: 1500,
  });

  return response.choices[0].message.content || "";
}

// Test Grok connection
export async function testGrokConnection(): Promise<boolean> {
  try {
    const response = await openai.chat.completions.create({
      model: "grok-2-1212",
      messages: [{ role: "user", content: "Test connection - respond with 'Connected'" }],
      max_tokens: 10,
    });

    return response.choices[0].message.content?.includes("Connected") || false;
  } catch (error) {
    console.error("Grok connection test failed:", error);
    return false;
  }
}