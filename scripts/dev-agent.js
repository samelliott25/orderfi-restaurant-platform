import fs from "fs";
import OpenAI from "openai";
import { spawnSync } from "child_process";
import puppeteer from "puppeteer";
import { performance } from "perf_hooks";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// System prompt for the autonomous dev agent
const systemPrompt = `
You are DevOpsChat, an AI agent that can:
1) Scrape competitor apps for feature lists and UX patterns
2) Run UI test suites and performance audits
3) Fetch usage analytics and user behavior metrics
4) Recommend feature changes based on competitive analysis
5) Generate code files and run shell commands
6) Make data-driven decisions about feature prioritization

Use ONLY the defined functions. Be opinionated about good UX and follow modern design patterns.
`;

// Function schemas for the agent
const functions = [
  {
    name: "scrape_competitor_features",
    description: "Extract main UI/feature headings and patterns from a competitor site.",
    parameters: {
      type: "object",
      properties: {
        competitor: { type: "string" },
        url: { type: "string", format: "uri" }
      },
      required: ["competitor", "url"]
    }
  },
  {
    name: "run_ui_tests",
    description: "Run automated UI tests against the current build.",
    parameters: {
      type: "object",
      properties: {
        testSuite: { type: "string" }
      },
      required: ["testSuite"]
    }
  },
  {
    name: "fetch_usage_metrics",
    description: "Get event counts and user behavior data for the last 7 days.",
    parameters: {
      type: "object",
      properties: {
        eventNames: {
          type: "array",
          items: { type: "string" }
        }
      },
      required: ["eventNames"]
    }
  },
  {
    name: "analyze_performance",
    description: "Run Lighthouse audit and performance analysis.",
    parameters: {
      type: "object",
      properties: {
        url: { type: "string" }
      },
      required: ["url"]
    }
  },
  {
    name: "prioritize_features",
    description: "Recommend keep/add/remove lists based on competitive analysis.",
    parameters: {
      type: "object",
      properties: {
        competitorFeatures: { type: "array", items: { type: "string" } },
        uiTestReport: { type: "object" },
        usageMetrics: { type: "object" },
        performanceData: { type: "object" }
      },
      required: ["competitorFeatures", "uiTestReport", "usageMetrics"]
    }
  },
  {
    name: "generate_feature_implementation",
    description: "Generate code for a specific feature improvement.",
    parameters: {
      type: "object",
      properties: {
        feature: { type: "string" },
        description: { type: "string" },
        files: { type: "array", items: { type: "string" } }
      },
      required: ["feature", "description"]
    }
  },
  {
    name: "run_command",
    description: "Run a shell command in the project root.",
    parameters: {
      type: "object",
      properties: {
        cmd: { type: "string" }
      },
      required: ["cmd"]
    }
  }
];

// Helper to invoke agent with function calling
async function callAgent(fnName, args) {
  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `CALL ${fnName} ${JSON.stringify(args)}` }
    ],
    functions,
    function_call: { name: fnName }
  });
  return JSON.parse(res.choices[0].message.function_call.arguments);
}

// Competitor scraping implementation
async function scrapeCompetitorFeatures(competitor, url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    // Extract main navigation and feature elements
    const features = await page.evaluate(() => {
      const selectors = [
        'nav a', 'button', '[role="button"]', 
        'h1', 'h2', 'h3', '.feature', '.menu-item',
        '[data-testid]', '.tab', '.category'
      ];
      
      const elements = [];
      selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
          if (el.textContent.trim()) {
            elements.push(el.textContent.trim());
          }
        });
      });
      
      return [...new Set(elements)].slice(0, 50); // Limit to 50 unique features
    });
    
    await browser.close();
    return features;
  } catch (error) {
    console.error(`Error scraping ${competitor}:`, error);
    await browser.close();
    return [];
  }
}

// UI testing implementation
async function runUITests(testSuite) {
  const results = {};
  
  // Basic navigation tests
  if (testSuite === "basic-navigation") {
    const testPages = [
      { name: "HomePage", url: "http://localhost:5000/" },
      { name: "MenuPage", url: "http://localhost:5000/menu" },
      { name: "ScanPage", url: "http://localhost:5000/scan" },
      { name: "CartPage", url: "http://localhost:5000/cart" }
    ];
    
    const browser = await puppeteer.launch({ headless: true });
    
    for (const test of testPages) {
      try {
        const page = await browser.newPage();
        const start = performance.now();
        
        await page.goto(test.url, { waitUntil: 'networkidle2', timeout: 10000 });
        
        const loadTime = performance.now() - start;
        const hasErrors = await page.evaluate(() => {
          return window.console.error.length > 0;
        });
        
        results[test.name] = {
          status: hasErrors ? "fail" : "pass",
          loadTime: Math.round(loadTime),
          errors: hasErrors
        };
        
        await page.close();
      } catch (error) {
        results[test.name] = { status: "fail", error: error.message };
      }
    }
    
    await browser.close();
  }
  
  return results;
}

// Mock analytics fetcher (would connect to PostHog/GA4 in production)
async function fetchUsageMetrics(eventNames) {
  // In production, this would connect to your analytics service
  // For now, return mock data based on typical QR ordering patterns
  return {
    "Menu Tab Clicked": { count: 2547, trend: "+12%" },
    "Add to Cart": { count: 1823, trend: "+8%" },
    "Checkout Started": { count: 1456, trend: "+15%" },
    "Voice Search Used": { count: 234, trend: "-5%" },
    "QR Code Scanned": { count: 3421, trend: "+22%" },
    "Category Filter Applied": { count: 1867, trend: "+6%" }
  };
}

// Performance analysis using Lighthouse
async function analyzePerformance(url) {
  const lighthouse = await import('lighthouse');
  const chromeLauncher = await import('chrome-launcher');
  
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = { logLevel: 'info', output: 'json', onlyCategories: ['performance'], port: chrome.port };
  
  try {
    const runnerResult = await lighthouse(url, options);
    const score = runnerResult.report.categories.performance.score * 100;
    
    await chrome.kill();
    
    return {
      performanceScore: score,
      metrics: {
        firstContentfulPaint: runnerResult.report.audits['first-contentful-paint'].displayValue,
        largestContentfulPaint: runnerResult.report.audits['largest-contentful-paint'].displayValue,
        cumulativeLayoutShift: runnerResult.report.audits['cumulative-layout-shift'].displayValue
      }
    };
  } catch (error) {
    await chrome.kill();
    return { performanceScore: 0, error: error.message };
  }
}

// Feature prioritization algorithm
async function prioritizeFeatures(competitorFeatures, uiTestReport, usageMetrics, performanceData) {
  // Analyze test failures
  const failedTests = Object.entries(uiTestReport)
    .filter(([_, result]) => result.status === "fail")
    .map(([name, _]) => name);
  
  // Find high-usage features
  const highUsageFeatures = Object.entries(usageMetrics)
    .filter(([_, data]) => data.count > 1000)
    .map(([name, _]) => name);
  
  // Find competitor features we're missing
  const currentFeatures = [
    "QR Code Scanning", "Menu Grid", "Category Tabs", "Cart Drawer",
    "Voice Search", "Checkout Flow", "Order Status", "Payment Processing"
  ];
  
  const missingFeatures = competitorFeatures.filter(feature => 
    !currentFeatures.some(current => 
      current.toLowerCase().includes(feature.toLowerCase()) ||
      feature.toLowerCase().includes(current.toLowerCase())
    )
  );
  
  return {
    keep: highUsageFeatures,
    add: missingFeatures.slice(0, 5), // Top 5 missing features
    remove: failedTests.length > 0 ? [`Fix: ${failedTests.join(', ')}`] : [],
    performance: performanceData?.performanceScore < 80 ? ["Optimize Performance"] : []
  };
}

// Main orchestration function
async function runCompetitiveAnalysis() {
  console.log("🚀 Starting competitive analysis and feature refinement...");
  
  // 1. Scrape competitor features
  console.log("📊 Analyzing competitors...");
  const competitors = [
    { name: "me&u", url: "https://meandu.com" },
    { name: "Mr Yum", url: "https://mryum.au" },
    { name: "Toast", url: "https://pos.toasttab.com" }
  ];
  
  let allCompetitorFeatures = [];
  for (const comp of competitors) {
    try {
      const features = await scrapeCompetitorFeatures(comp.name, comp.url);
      allCompetitorFeatures = [...allCompetitorFeatures, ...features];
      console.log(`✓ Scraped ${features.length} features from ${comp.name}`);
    } catch (error) {
      console.log(`✗ Failed to scrape ${comp.name}: ${error.message}`);
    }
  }
  
  // 2. Run UI tests
  console.log("🧪 Running UI tests...");
  const uiTestReport = await runUITests("basic-navigation");
  console.log(`✓ Completed UI tests: ${Object.keys(uiTestReport).length} tests`);
  
  // 3. Fetch usage metrics
  console.log("📈 Fetching usage metrics...");
  const usageMetrics = await fetchUsageMetrics([
    "Menu Tab Clicked", "Add to Cart", "Checkout Started",
    "Voice Search Used", "QR Code Scanned", "Category Filter Applied"
  ]);
  console.log("✓ Retrieved usage analytics");
  
  // 4. Analyze performance
  console.log("⚡ Analyzing performance...");
  const performanceData = await analyzePerformance("http://localhost:5000/menu");
  console.log(`✓ Performance score: ${performanceData.performanceScore}/100`);
  
  // 5. Prioritize features
  console.log("🎯 Prioritizing features...");
  const recommendations = await prioritizeFeatures(
    [...new Set(allCompetitorFeatures)], 
    uiTestReport, 
    usageMetrics, 
    performanceData
  );
  
  // 6. Generate report
  const report = {
    timestamp: new Date().toISOString(),
    competitorFeatures: [...new Set(allCompetitorFeatures)].slice(0, 20),
    uiTestResults: uiTestReport,
    usageMetrics,
    performanceData,
    recommendations,
    summary: {
      totalCompetitorFeatures: allCompetitorFeatures.length,
      passedTests: Object.values(uiTestReport).filter(r => r.status === "pass").length,
      failedTests: Object.values(uiTestReport).filter(r => r.status === "fail").length,
      performanceScore: performanceData.performanceScore
    }
  };
  
  // Save report
  fs.writeFileSync("competitive-analysis-report.json", JSON.stringify(report, null, 2));
  
  console.log("\n🎉 Analysis complete! Results:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`📊 Analyzed ${report.summary.totalCompetitorFeatures} competitor features`);
  console.log(`✅ ${report.summary.passedTests} tests passed`);
  console.log(`❌ ${report.summary.failedTests} tests failed`);
  console.log(`⚡ Performance score: ${report.summary.performanceScore}/100`);
  console.log("\n🚀 Recommendations:");
  console.log("Keep:", recommendations.keep.join(", "));
  console.log("Add:", recommendations.add.join(", "));
  console.log("Fix:", recommendations.remove.join(", "));
  
  return report;
}

// Export functions for use in other scripts
export { runCompetitiveAnalysis, callAgent, scrapeCompetitorFeatures, runUITests };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runCompetitiveAnalysis().catch(console.error);
}