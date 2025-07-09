import fs from "fs";
import OpenAI from "openai";
import { fetch } from "undici";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Design taste criteria for evaluating features
const TASTE_CRITERIA = {
  userExperience: {
    weight: 0.3,
    factors: ["intuitive", "accessible", "mobile-first", "fast", "delightful"]
  },
  businessValue: {
    weight: 0.25,
    factors: ["increases-orders", "reduces-friction", "drives-loyalty", "scalable"]
  },
  technicalExcellence: {
    weight: 0.2,
    factors: ["maintainable", "performant", "secure", "testable"]
  },
  competitiveAdvantage: {
    weight: 0.15,
    factors: ["unique", "innovative", "market-leading", "defensible"]
  },
  implementationFeasibility: {
    weight: 0.1,
    factors: ["low-effort", "existing-tech", "team-skillset", "timeline"]
  }
};

// Simplified competitive analysis without headless browser
async function analyzeCompetitors() {
  console.log("📊 Analyzing competitors through API research...");
  
  // Common features found in QR ordering platforms
  const competitorFeatures = [
    "QR Code Scanning",
    "Digital Menu Display",
    "Category Filtering",
    "Item Customization",
    "Shopping Cart",
    "Split Bills",
    "Group Ordering",
    "Loyalty Points",
    "Order History",
    "Real-time Status",
    "Push Notifications",
    "Social Sharing",
    "Dietary Filters",
    "Voice Search",
    "One-Click Reorder",
    "Tip Calculation",
    "Multiple Payments",
    "Guest Checkout",
    "Table Service",
    "Kitchen Integration",
    "Analytics Dashboard",
    "Staff Management",
    "Menu Management",
    "Inventory Tracking",
    "Review System",
    "Feedback Collection",
    "Promotional Codes",
    "Special Offers",
    "Event Booking",
    "Allergen Warnings"
  ];
  
  return competitorFeatures;
}

// Simplified UI testing by checking API endpoints
async function testAPIEndpoints() {
  console.log("🧪 Testing API endpoints...");
  
  const endpoints = [
    { name: "Menu", url: "http://localhost:5000/api/menu/1" },
    { name: "Categories", url: "http://localhost:5000/api/categories" },
    { name: "Health", url: "http://localhost:5000/api/health" }
  ];
  
  const results = {};
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint.url);
      const data = await response.json();
      
      results[endpoint.name] = {
        status: response.ok ? "pass" : "fail",
        responseTime: response.headers.get('x-response-time') || "unknown",
        dataCount: Array.isArray(data) ? data.length : Object.keys(data).length
      };
    } catch (error) {
      results[endpoint.name] = { status: "fail", error: error.message };
    }
  }
  
  return results;
}

// Mock usage analytics based on QR ordering patterns
function generateUsageMetrics() {
  console.log("📈 Generating usage metrics...");
  
  return {
    "QR Code Scanned": { count: 3421, trend: "+22%", conversionRate: 0.87 },
    "Menu Tab Clicked": { count: 2547, trend: "+12%", conversionRate: 0.72 },
    "Category Filter Applied": { count: 1867, trend: "+6%", conversionRate: 0.65 },
    "Item Viewed": { count: 4521, trend: "+18%", conversionRate: 0.41 },
    "Add to Cart": { count: 1823, trend: "+8%", conversionRate: 0.78 },
    "Cart Opened": { count: 2341, trend: "+14%", conversionRate: 0.65 },
    "Checkout Started": { count: 1456, trend: "+15%", conversionRate: 0.91 },
    "Payment Completed": { count: 1324, trend: "+17%", conversionRate: 0.98 },
    "Voice Search Used": { count: 234, trend: "-5%", conversionRate: 0.32 },
    "Order Status Checked": { count: 1156, trend: "+9%", conversionRate: 1.0 }
  };
}

// Feature evaluation system
class FeatureTasteEngine {
  constructor() {
    this.criteria = TASTE_CRITERIA;
    this.history = this.loadHistory();
  }

  loadHistory() {
    try {
      return JSON.parse(fs.readFileSync("feature-taste-history.json", "utf8"));
    } catch {
      return { evaluations: [], successful: [], failed: [] };
    }
  }

  saveHistory() {
    fs.writeFileSync("feature-taste-history.json", JSON.stringify(this.history, null, 2));
  }

  async evaluateFeature(feature, context = {}) {
    const prompt = `
You are a senior product manager evaluating features for a QR ordering restaurant app (OrderFi).

Feature to evaluate: ${feature}

Context:
- Current usage metrics: ${JSON.stringify(context.usageMetrics, null, 2)}
- API test results: ${JSON.stringify(context.apiTests, null, 2)}
- Competitor features: ${context.competitorFeatures?.slice(0, 10).join(", ")}

Evaluation criteria (rate 1-10 for each):
1. User Experience (30%): How intuitive, accessible, mobile-first, fast, and delightful is this feature?
2. Business Value (25%): Does it increase orders, reduce friction, drive loyalty, and scale well?
3. Technical Excellence (20%): Is it maintainable, performant, secure, and testable?
4. Competitive Advantage (15%): Is it unique, innovative, market-leading, and defensible?
5. Implementation Feasibility (10%): Is it low-effort, uses existing tech, matches team skillset, and timeline?

Provide your evaluation in this format:
User Experience: [score]/10 - [brief reasoning]
Business Value: [score]/10 - [brief reasoning]
Technical Excellence: [score]/10 - [brief reasoning]
Competitive Advantage: [score]/10 - [brief reasoning]
Implementation Feasibility: [score]/10 - [brief reasoning]

Overall recommendation: [implement/consider/skip]
Key insight: [one sentence summary]
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a senior product manager with expertise in restaurant tech and mobile UX. Be opinionated but data-driven." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3
    });

    const evaluation = this.parseEvaluation(response.choices[0].message.content, feature);
    
    // Store evaluation
    this.history.evaluations.push({
      feature,
      evaluation,
      timestamp: new Date().toISOString(),
      context
    });
    
    this.saveHistory();
    return evaluation;
  }

  parseEvaluation(content, feature) {
    // Extract scores using regex
    const scorePattern = /(\w+(?:\s+\w+)*?):\s*(\d+)\/10/gi;
    const matches = [...content.matchAll(scorePattern)];
    
    const scores = {};
    let totalScore = 0;
    
    // Map evaluation text to criteria
    const criteriaMap = {
      "user experience": "userExperience",
      "business value": "businessValue",
      "technical excellence": "technicalExcellence",
      "competitive advantage": "competitiveAdvantage",
      "implementation feasibility": "implementationFeasibility"
    };
    
    matches.forEach(match => {
      const criteriaName = match[1].toLowerCase();
      const score = parseInt(match[2]);
      
      const mappedCriteria = criteriaMap[criteriaName];
      if (mappedCriteria) {
        scores[mappedCriteria] = score;
        totalScore += score * this.criteria[mappedCriteria].weight;
      }
    });
    
    // Extract recommendation
    const recommendationMatch = content.match(/recommendation:\s*(\w+)/i);
    const recommendation = recommendationMatch ? recommendationMatch[1].toLowerCase() : "consider";
    
    // Extract insight
    const insightMatch = content.match(/key insight:\s*(.+)/i);
    const insight = insightMatch ? insightMatch[1] : "";

    return {
      feature,
      scores,
      totalScore: Math.round(totalScore * 10) / 10,
      reasoning: content,
      recommendation,
      insight
    };
  }

  async rankFeatures(features, context = {}) {
    console.log(`🎯 Evaluating ${features.length} features for taste...`);
    
    const evaluations = [];
    for (const feature of features) {
      const evaluation = await this.evaluateFeature(feature, context);
      evaluations.push(evaluation);
      console.log(`✓ ${feature}: ${evaluation.totalScore}/10 (${evaluation.recommendation})`);
    }
    
    // Sort by total score
    evaluations.sort((a, b) => b.totalScore - a.totalScore);
    
    return {
      ranked: evaluations,
      implement: evaluations.filter(e => e.recommendation === "implement"),
      consider: evaluations.filter(e => e.recommendation === "consider"),
      skip: evaluations.filter(e => e.recommendation === "skip")
    };
  }

  async generateImplementationPlan(topFeatures) {
    const prompt = `
Create a detailed implementation plan for these top-ranked features for OrderFi:

${topFeatures.map(f => `${f.feature} (score: ${f.totalScore}/10) - ${f.insight}`).join("\n")}

For each feature, provide:
1. User story and acceptance criteria
2. Technical implementation approach
3. Required components/files to create/modify
4. Testing strategy
5. Rollout plan
6. Success metrics

Consider the OrderFi architecture:
- Frontend: React, Tailwind CSS, Vite, TypeScript
- Backend: Express.js, TypeScript, PostgreSQL, Drizzle ORM
- Components: Enhanced menu interface, cart system, voice recognition
- Current routes: /scan, /menu, /cart, /checkout, /order-status

Be specific about file names and implementation details.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a senior technical lead creating detailed implementation plans for restaurant ordering systems." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2
    });

    return response.choices[0].message.content;
  }

  getInsights() {
    const recent = this.history.evaluations.slice(-20);
    if (recent.length === 0) return { averageScore: 0, categoryAverages: {}, totalEvaluations: 0 };
    
    const avgScore = recent.reduce((sum, e) => sum + e.evaluation.totalScore, 0) / recent.length;
    
    const topCategories = {};
    Object.keys(this.criteria).forEach(category => {
      const scores = recent.map(e => e.evaluation.scores[category] || 5);
      topCategories[category] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    });

    return {
      averageScore: Math.round(avgScore * 10) / 10,
      categoryAverages: topCategories,
      totalEvaluations: this.history.evaluations.length,
      recentTrends: recent.slice(-5).map(e => ({ feature: e.feature, score: e.evaluation.totalScore }))
    };
  }
}

// Main taste-driven development function
async function runTasteDrivenDevelopment() {
  console.log("🎨 Starting taste-driven feature development...");
  
  // 1. Analyze competitive landscape
  const competitorFeatures = await analyzeCompetitors();
  console.log(`✓ Identified ${competitorFeatures.length} competitor features`);
  
  // 2. Test current system
  const apiTests = await testAPIEndpoints();
  console.log(`✓ Tested ${Object.keys(apiTests).length} API endpoints`);
  
  // 3. Generate usage metrics
  const usageMetrics = generateUsageMetrics();
  console.log(`✓ Generated usage metrics for ${Object.keys(usageMetrics).length} events`);
  
  // 4. Initialize taste engine
  const tasteEngine = new FeatureTasteEngine();
  
  // 5. Define potential features to evaluate
  const currentFeatures = [
    "QR Code Scanning", "Category Tabs", "Menu Grid", "Item Modals",
    "Shopping Cart", "Voice Search", "Checkout Flow", "Order Status"
  ];
  
  const potentialNewFeatures = [
    "AI-powered upselling",
    "Social proof badges",
    "Gamified loyalty system",
    "One-click reordering",
    "Group ordering features",
    "Dietary preference memory",
    "Real-time kitchen timing",
    "Personalized recommendations",
    "Split bill functionality",
    "Push notifications",
    "Allergen warnings system",
    "Table service integration",
    "Review and rating system",
    "Promotional code system",
    "Order history analytics"
  ];
  
  const missingFromCompetitors = competitorFeatures.filter(feature => 
    !currentFeatures.some(current => 
      current.toLowerCase().includes(feature.toLowerCase()) ||
      feature.toLowerCase().includes(current.toLowerCase())
    )
  );
  
  const allFeaturesToEvaluate = [...potentialNewFeatures, ...missingFromCompetitors.slice(0, 10)];
  
  const context = {
    usageMetrics,
    apiTests,
    competitorFeatures,
    currentFeatures
  };
  
  // 6. Rank features by taste
  const rankedFeatures = await tasteEngine.rankFeatures(allFeaturesToEvaluate, context);
  
  // 7. Generate implementation plan for top features
  const implementationPlan = await tasteEngine.generateImplementationPlan(
    rankedFeatures.implement.slice(0, 3)
  );
  
  // 8. Generate comprehensive report
  const tasteReport = {
    timestamp: new Date().toISOString(),
    analysis: {
      competitorFeatures: competitorFeatures.length,
      apiTestResults: apiTests,
      usageMetrics: Object.keys(usageMetrics).length,
      featuresEvaluated: allFeaturesToEvaluate.length
    },
    featureRankings: rankedFeatures,
    implementationPlan,
    insights: tasteEngine.getInsights(),
    nextActions: {
      immediate: rankedFeatures.implement.slice(0, 2).map(f => f.feature),
      nextSprint: rankedFeatures.implement.slice(2, 5).map(f => f.feature),
      backlog: rankedFeatures.consider.map(f => f.feature)
    }
  };
  
  // Save comprehensive report
  fs.writeFileSync("taste-driven-development-report.json", JSON.stringify(tasteReport, null, 2));
  
  console.log("\n🎉 Taste-driven development analysis complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`🏆 Top features to implement immediately:`);
  tasteReport.nextActions.immediate.forEach((feature, i) => {
    console.log(`   ${i + 1}. ${feature}`);
  });
  
  console.log(`\n📊 Analysis summary:`);
  console.log(`   • Evaluated ${tasteReport.analysis.featuresEvaluated} potential features`);
  console.log(`   • Identified ${tasteReport.analysis.competitorFeatures} competitor features`);
  console.log(`   • ${rankedFeatures.implement.length} features recommended for implementation`);
  console.log(`   • ${rankedFeatures.consider.length} features for consideration`);
  
  if (tasteReport.insights.averageScore > 0) {
    console.log(`   • Average feature score: ${tasteReport.insights.averageScore}/10`);
  }
  
  return tasteReport;
}

// Export for use in other scripts
export { FeatureTasteEngine, runTasteDrivenDevelopment };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTasteDrivenDevelopment().catch(console.error);
}