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

// Phase 1 Implementation: Comprehensive competitive analysis for restaurant POS systems
export async function phase1CompetitiveAnalysis(): Promise<any> {
  try {
    const prompt = `Perform a comprehensive competitive analysis for restaurant POS systems focusing on major players like Toast, Square, Clover, Lightspeed, me&u, and Mr Yum. Analyze:

    1. CORE FEATURES ANALYSIS:
       - Order management systems
       - Kitchen display systems (KDS)
       - Payment processing capabilities
       - Inventory management
       - Staff scheduling and management
       - Customer relationship management
       - Analytics and reporting

    2. TECHNOLOGY STACK ASSESSMENT:
       - Frontend frameworks and mobile compatibility
       - Backend architecture and scalability
       - Database systems and real-time capabilities
       - AI/ML integration levels
       - API ecosystem and third-party integrations

    3. PRICING STRATEGY ANALYSIS:
       - Transaction fees and processing costs
       - Monthly subscription models
       - Hardware requirements and costs
       - Setup and onboarding fees
       - Hidden costs and long-term value

    4. MARKET POSITIONING:
       - Target market segments (QSR, full-service, casual dining)
       - Geographic presence and expansion
       - Brand perception and market share
       - Customer acquisition strategies

    5. INNOVATION GAPS:
       - Emerging technologies not yet adopted
       - AI-powered features missing from market
       - Blockchain/Web3 integration opportunities
       - Voice-first interfaces potential
       - Real-time operational intelligence gaps

    6. COMPETITIVE DIFFERENTIATION OPPORTUNITIES:
       - Unique value propositions to explore
       - Underserved market segments
       - Technology advantages to leverage
       - Customer pain points to address

    Provide specific, actionable recommendations for building a next-generation restaurant management platform that outperforms existing solutions.`;

    const response = await openai.chat.completions.create({
      model: "grok-2-1212",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 4000,
      temperature: 0.3,
    });

    return {
      analysis: response.choices[0].message.content,
      timestamp: new Date().toISOString(),
      source: "grok-2-1212",
      analysisType: "phase1_competitive_analysis",
      focus: "restaurant_pos_systems"
    };
  } catch (error) {
    console.error('Phase 1 competitive analysis error:', error);
    throw new Error('Failed to perform Phase 1 competitive analysis');
  }
}

// Strategic development roadmap using Grok-4 insights
export async function generatePhase1Roadmap(competitiveInsights: string): Promise<any> {
  try {
    const prompt = `Based on the competitive analysis insights provided, create a detailed Phase 1 development roadmap for OrderFi. Focus on:

    1. IMMEDIATE PRIORITIES (0-30 days):
       - Critical features needed for MVP
       - High-impact, low-effort improvements
       - Competitive parity features

    2. QUICK WINS (30-60 days):
       - Differentiation features
       - User experience improvements
       - Integration capabilities

    3. STRATEGIC INITIATIVES (60-90 days):
       - Innovation features
       - Market expansion capabilities
       - Long-term competitive advantages

    For each initiative, provide:
    - Technical implementation approach
    - Resource requirements
    - Expected business impact
    - Success metrics
    - Risk factors and mitigation strategies

    Competitive insights: ${competitiveInsights}`;

    const response = await openai.chat.completions.create({
      model: "grok-2-1212",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 3000,
      temperature: 0.2,
    });

    return {
      roadmap: response.choices[0].message.content,
      timestamp: new Date().toISOString(),
      source: "grok-2-1212",
      roadmapType: "phase1_development_roadmap"
    };
  } catch (error) {
    console.error('Phase 1 roadmap generation error:', error);
    throw new Error('Failed to generate Phase 1 roadmap');
  }
}

// Phase 2 Implementation: Mobile optimization analysis with Grok-4
export async function analyzeMobileOptimization(currentAdminPages: string): Promise<any> {
  try {
    const prompt = `Analyze the current OrderFi admin pages for mobile optimization opportunities. Focus on restaurant industry best practices from Toast, Square, and Lightspeed. Current pages: ${currentAdminPages}

    MOBILE OPTIMIZATION ANALYSIS:

    1. TOUCH TARGET REQUIREMENTS:
       - Identify components that need 44px+ minimum touch targets
       - Analyze button spacing and accessibility for tablet use
       - Recommend touch-friendly interaction patterns

    2. RESPONSIVE LAYOUT IMPROVEMENTS:
       - Evaluate current grid systems for mobile/tablet compatibility
       - Suggest stacked layouts for narrow screens
       - Recommend swipe navigation patterns

    3. PROGRESSIVE DISCLOSURE ARCHITECTURE:
       - Design Executive Summary view (4 primary KPIs)
       - Create Operational View (live orders, alerts)
       - Build Analytics View (charts, forecasting)

    4. COMPETITOR MOBILE PATTERNS:
       - Toast POS mobile dashboard patterns
       - Square mobile management interface
       - Lightspeed tablet-optimized layouts

    5. IMPLEMENTATION RECOMMENDATIONS:
       - Specific React component modifications
       - CSS/Tailwind improvements for touch interfaces
       - Mobile-first design system enhancements

    Provide detailed technical recommendations with code examples and implementation priorities.`;

    const response = await openai.chat.completions.create({
      model: "grok-2-1212",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 4000,
      temperature: 0.3,
    });

    return {
      analysis: response.choices[0].message.content,
      timestamp: new Date().toISOString(),
      source: "grok-2-1212",
      analysisType: "mobile_optimization_analysis"
    };
  } catch (error) {
    console.error('Mobile optimization analysis error:', error);
    throw new Error('Failed to analyze mobile optimization');
  }
}

// Phase 2 Implementation: Generate mobile-optimized components
export async function generateMobileComponents(specifications: string): Promise<any> {
  try {
    const prompt = `Generate mobile-optimized React components for OrderFi admin pages based on these specifications: ${specifications}

    COMPONENT GENERATION REQUIREMENTS:

    1. EXECUTIVE SUMMARY COMPONENT:
       - 4 primary KPIs: revenue, orders, customers, avg order value
       - Real-time updates with WebSocket integration
       - Touch-friendly card design with 44px+ touch targets
       - Responsive grid: 1 column mobile, 2 columns tablet, 4 columns desktop

    2. OPERATIONAL VIEW COMPONENT:
       - Live orders display with status indicators
       - Critical alerts and notifications
       - Quick action buttons for common tasks
       - Swipe navigation for order management

    3. ANALYTICS VIEW COMPONENT:
       - Chart integration with Recharts
       - AI-powered forecasting display
       - Mobile-optimized data visualization
       - Touch-friendly chart interactions

    4. MOBILE LAYOUT PATTERNS:
       - Progressive disclosure architecture
       - Stacked layouts for narrow screens
       - Touch-optimized tabs and navigation
       - Swipe gestures for efficiency

    Generate complete TypeScript React components with:
    - Proper TypeScript interfaces
    - Tailwind CSS for styling
    - Mobile-first responsive design
    - Accessibility compliance
    - Integration with existing OrderFi design system

    Provide production-ready code with proper imports and structure.`;

    const response = await openai.chat.completions.create({
      model: "grok-2-1212",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 4000,
      temperature: 0.2,
    });

    return {
      components: response.choices[0].message.content,
      timestamp: new Date().toISOString(),
      source: "grok-2-1212",
      componentType: "mobile_optimized_components"
    };
  } catch (error) {
    console.error('Mobile component generation error:', error);
    throw new Error('Failed to generate mobile components');
  }
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