import fs from "fs";
import OpenAI from "openai";
import { runCompetitiveAnalysis } from "./dev-agent.js";

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
Evaluate this feature for a QR ordering app against these criteria:

Feature: ${feature}
Context: ${JSON.stringify(context)}

Criteria:
${Object.entries(this.criteria).map(([key, value]) => 
  `${key} (${value.weight}): ${value.factors.join(", ")}`
).join("\n")}

Rate each criterion 1-10 and explain your reasoning.
Consider: user behavior, restaurant operations, technical complexity, market trends.
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
    // Extract scores and calculate weighted total
    const scores = {};
    let totalScore = 0;
    
    Object.keys(this.criteria).forEach(criterion => {
      const regex = new RegExp(`${criterion}[^\\d]*(\\d+)`, 'i');
      const match = content.match(regex);
      const score = match ? parseInt(match[1]) : 5;
      scores[criterion] = score;
      totalScore += score * this.criteria[criterion].weight;
    });

    return {
      feature,
      scores,
      totalScore: Math.round(totalScore * 10) / 10,
      reasoning: content,
      recommendation: totalScore > 7 ? "implement" : totalScore > 5 ? "consider" : "skip"
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
Create a detailed implementation plan for these top-ranked features:

${topFeatures.map(f => `${f.feature} (score: ${f.totalScore}/10)`).join("\n")}

For each feature, provide:
1. User story and acceptance criteria
2. Technical implementation approach
3. Required components/files
4. Testing strategy
5. Rollout plan
6. Success metrics

Consider the OrderFi architecture: React frontend, Express backend, PostgreSQL, Tailwind CSS.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a senior technical lead creating detailed implementation plans." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2
    });

    return response.choices[0].message.content;
  }

  getInsights() {
    const recent = this.history.evaluations.slice(-20);
    const avgScore = recent.reduce((sum, e) => sum + e.evaluation.totalScore, 0) / recent.length;
    
    const topCategories = {};
    Object.keys(this.criteria).forEach(category => {
      topCategories[category] = recent.reduce((sum, e) => sum + e.evaluation.scores[category], 0) / recent.length;
    });

    return {
      averageScore: Math.round(avgScore * 10) / 10,
      categoryAverages: topCategories,
      totalEvaluations: this.history.evaluations.length,
      successRate: this.history.successful.length / (this.history.successful.length + this.history.failed.length)
    };
  }
}

// Main taste-driven development function
async function runTasteDrivenDevelopment() {
  console.log("🎨 Starting taste-driven feature development...");
  
  // 1. Run competitive analysis
  const competitiveReport = await runCompetitiveAnalysis();
  
  // 2. Initialize taste engine
  const tasteEngine = new FeatureTasteEngine();
  
  // 3. Evaluate all potential features
  const potentialFeatures = [
    ...competitiveReport.recommendations.add,
    "AI-powered upselling",
    "Social proof badges",
    "Gamified loyalty system",
    "Voice ordering optimization",
    "One-click reordering",
    "Group ordering features",
    "Dietary preference memory",
    "Real-time kitchen timing",
    "Personalized recommendations"
  ];
  
  const context = {
    currentUsage: competitiveReport.usageMetrics,
    performanceScore: competitiveReport.performanceData.performanceScore,
    competitorFeatures: competitiveReport.competitorFeatures,
    testResults: competitiveReport.uiTestResults
  };
  
  // 4. Rank features by taste
  const rankedFeatures = await tasteEngine.rankFeatures(potentialFeatures, context);
  
  // 5. Generate implementation plan for top features
  const implementationPlan = await tasteEngine.generateImplementationPlan(
    rankedFeatures.implement.slice(0, 3)
  );
  
  // 6. Generate comprehensive report
  const tasteReport = {
    timestamp: new Date().toISOString(),
    competitiveAnalysis: competitiveReport.summary,
    featureRankings: rankedFeatures,
    implementationPlan,
    insights: tasteEngine.getInsights(),
    nextActions: {
      immediate: rankedFeatures.implement.slice(0, 2).map(f => f.feature),
      nextSprint: rankedFeatures.implement.slice(2, 5).map(f => f.feature),
      backlog: rankedFeatures.consider.map(f => f.feature)
    }
  };
  
  // Save report
  fs.writeFileSync("taste-driven-development-report.json", JSON.stringify(tasteReport, null, 2));
  
  console.log("\n🎉 Taste-driven development complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`🏆 Top features to implement:`);
  tasteReport.nextActions.immediate.forEach((feature, i) => {
    console.log(`${i + 1}. ${feature}`);
  });
  
  console.log(`\n📊 Insights:`);
  console.log(`Average feature score: ${tasteReport.insights.averageScore}/10`);
  console.log(`Total evaluations: ${tasteReport.insights.totalEvaluations}`);
  
  return tasteReport;
}

// Export for use in other scripts
export { FeatureTasteEngine, runTasteDrivenDevelopment };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTasteDrivenDevelopment().catch(console.error);
}