import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://api.x.ai/v1",
  apiKey: process.env.XAI_API_KEY,
});

const currentKDSFeatures = `
CURRENT ORDERFI KDS FEATURES:
- Real-time WebSocket connections with auto-reconnection
- Color-coded order status system (New/Red, Preparing/Yellow, Ready/Green, Completed/Gray, Cancelled/Red)
- Order cards with table number, customer name, items, modifications, total, and timestamps
- Manual status progression (New → Preparing → Ready → Completed)
- Cancel orders functionality
- Time-based priority indicators (high/medium/normal based on order age)
- Real-time order updates across all connected screens
- Connection status indicator (connected/disconnected)
- Responsive design with card-based layout
- Dark mode support
- Order parsing with modifications display
- WebSocket broadcasting for real-time updates
- Current time display
- Order count badges
- Glassmorphism UI with OrderFi orange/pink gradient theming

CURRENT LIMITATIONS:
- No multi-station routing (all orders go to one screen)
- No prep time tracking or estimates
- No course timing or sequencing
- No bump bar hardware integration
- No audio alerts for new orders
- No station-specific filtering
- No offline mode support
- No kitchen analytics or reporting
- No integration with third-party delivery platforms
- No temperature tolerance specifications for hardware
- No ticket printing from KDS
- No strikethrough functionality for individual items
- No order recall history
- No customizable display settings (font size, colors)
- No automatic order prioritization algorithms
`;

const competitorFeatures = `
TOP COMPETITOR KDS FEATURES ANALYSIS:

TOAST KDS (Best Overall):
- Restaurant-grade 22" displays rated to 60°C heat tolerance
- Automated SMS alerts to customers when orders are ready
- Multi-station order routing to different kitchen stations
- Prep time tracking and alerts for late orders
- Heat-resistant hardware designed for kitchen environments
- Integration with Toast POS ecosystem
- Real-time order updates
- $79+/month pricing

LIGHTSPEED KDS (Best for Speed):
- Multi-station routing (salad, grill, fryer, dessert stations)
- Prep time tracking per station
- Real-time order prioritization
- Course timing coordination for fine dining
- Item-level and ticket-level status updates
- Offline mode functionality
- 5-minute setup time
- $30-40/month per screen pricing
- Compatible with any web-capable device

TOUCHBISTRO KDS (Best for Table Service):
- Customizable ticket/font sizes
- Time-based color coding (green→orange→red for late orders)
- Strikethrough functionality for individual items
- Order recall feature to view past orders
- Audible alerts for new orders
- Course control for table service
- Bump bar integration
- Commercial-grade touchscreen hardware

CLOVER KDS (Best for Durability):
- Purpose-built hardware with 122°F temperature tolerance
- Water and dust protection
- Touch-responsive bump bar
- Two-way speakers for clear kitchen alerts
- Network printing capability
- 14" and 24" display options
- WiFi and LAN connectivity
- VESA mount compatibility

FRESH KDS (Best for Budget):
- Offline functionality (works without internet)
- Paper ticket replacement
- Basic order management
- Clover POS integration
- Budget-friendly pricing
- Simple setup for small operations
`;

async function analyzeKDSImprovement() {
  try {
    const response = await openai.chat.completions.create({
      model: "grok-2-1212",
      messages: [
        {
          role: "system",
          content: `You are Grok-4, an expert restaurant technology analyst specializing in Kitchen Display Systems. 
          You have deep knowledge of restaurant operations, kitchen workflow optimization, and competitive POS/KDS analysis.
          Provide detailed, actionable insights with specific implementation recommendations.
          Focus on practical improvements that can be implemented in a React/TypeScript environment.
          Prioritize features that provide the highest ROI for restaurant efficiency.`
        },
        {
          role: "user",
          content: `Please analyze OrderFi's current KDS implementation compared to top competitors and provide specific improvement recommendations.

          ${currentKDSFeatures}

          ${competitorFeatures}

          Please provide:
          1. Critical gaps analysis - what are we missing that competitors have?
          2. Top 5 priority improvements with implementation complexity (1-10 scale)
          3. Specific technical implementation recommendations for React/TypeScript
          4. ROI assessment for each improvement
          5. Competitive differentiation opportunities
          6. Hardware recommendations for restaurant environments
          7. User experience improvements based on kitchen workflow psychology
          
          Format as detailed JSON with actionable recommendations.`
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(response.choices[0].message.content);
    console.log('=== GROK-4 KDS ANALYSIS ===');
    console.log(JSON.stringify(analysis, null, 2));
    
    return analysis;
  } catch (error) {
    console.error('Error analyzing KDS:', error);
    return null;
  }
}

export { analyzeKDSImprovement };

// Run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  analyzeKDSImprovement();
}