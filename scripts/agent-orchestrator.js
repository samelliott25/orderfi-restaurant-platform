#!/usr/bin/env node

import fs from "fs";
import OpenAI from "openai";
import { runTasteDrivenDevelopment } from "./taste-engine-simple.js";
import { runUIDiscoveryPipeline } from "./ui-discovery-engine.js";
import { UIInfraUpgradeEngine } from "./ui-infra-upgrade-engine.js";
import { POSBackOfficeUpgrade } from "./pos-backoffice-upgrade.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Agent that can generate and implement features
class AutonomousDevAgent {
  constructor() {
    this.projectRoot = process.cwd();
    this.history = this.loadHistory();
  }

  loadHistory() {
    try {
      return JSON.parse(fs.readFileSync("agent-history.json", "utf8"));
    } catch {
      return { implementations: [], decisions: [], iterations: 0 };
    }
  }

  saveHistory() {
    fs.writeFileSync("agent-history.json", JSON.stringify(this.history, null, 2));
  }

  async generateFeatureImplementation(feature, context) {
    const prompt = `
You are an autonomous developer implementing a feature for OrderFi, a QR ordering restaurant app.

Feature to implement: ${feature}
Context: ${JSON.stringify(context, null, 2)}

Current OrderFi architecture:
- Frontend: React + TypeScript + Tailwind CSS
- Backend: Express.js + PostgreSQL + Drizzle ORM
- Key pages: /scan, /menu, /cart, /checkout, /order-status
- Key components: Header, CategoryTabs, MenuGrid, ItemCard, CartDrawer

Generate the complete implementation including:
1. File path and complete code for each file to create/modify
2. Database schema changes if needed
3. API endpoints to add/modify
4. Integration points with existing code
5. Testing approach

Return your response in this JSON format:
{
  "files": [
    {
      "path": "client/src/components/...",
      "action": "create|modify",
      "content": "complete file content"
    }
  ],
  "apiEndpoints": [
    {
      "method": "GET|POST|PUT|DELETE",
      "path": "/api/...",
      "handler": "complete handler code"
    }
  ],
  "databaseChanges": [
    {
      "table": "table_name",
      "changes": "schema modifications"
    }
  ],
  "integrationSteps": [
    "step by step integration instructions"
  ],
  "testingStrategy": "testing approach"
}

Be specific and provide production-ready code.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a senior full-stack developer specializing in restaurant technology and React applications." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2
    });

    try {
      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error("Failed to parse implementation JSON:", error);
      return null;
    }
  }

  async implementFeature(feature, implementation) {
    console.log(`🚀 Implementing feature: ${feature}`);
    
    const results = {
      feature,
      timestamp: new Date().toISOString(),
      filesCreated: [],
      filesModified: [],
      errors: []
    };

    // Create/modify files
    for (const file of implementation.files || []) {
      try {
        const fullPath = file.path;
        const dir = fullPath.substring(0, fullPath.lastIndexOf('/'));
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        // Write file content
        fs.writeFileSync(fullPath, file.content, 'utf8');
        
        if (file.action === 'create') {
          results.filesCreated.push(fullPath);
        } else {
          results.filesModified.push(fullPath);
        }
        
        console.log(`✓ ${file.action === 'create' ? 'Created' : 'Modified'} ${fullPath}`);
      } catch (error) {
        results.errors.push(`Failed to ${file.action} ${file.path}: ${error.message}`);
        console.error(`✗ Failed to ${file.action} ${file.path}:`, error.message);
      }
    }

    // Record implementation
    this.history.implementations.push(results);
    this.saveHistory();
    
    return results;
  }

  async evaluateImplementation(feature, results) {
    console.log(`🔍 Evaluating implementation of ${feature}...`);
    
    // Simple evaluation - check if files were created successfully
    const success = results.errors.length === 0;
    const filesCount = results.filesCreated.length + results.filesModified.length;
    
    if (success) {
      console.log(`✅ Successfully implemented ${feature} (${filesCount} files)`);
      this.history.decisions.push({
        feature,
        decision: "successful",
        timestamp: new Date().toISOString(),
        metrics: { filesCount, errors: 0 }
      });
    } else {
      console.log(`❌ Failed to implement ${feature} (${results.errors.length} errors)`);
      this.history.decisions.push({
        feature,
        decision: "failed",
        timestamp: new Date().toISOString(),
        metrics: { filesCount, errors: results.errors.length }
      });
    }
    
    this.saveHistory();
    return success;
  }

  async runAutonomousIteration() {
    this.history.iterations++;
    console.log(`\n🤖 Starting autonomous iteration #${this.history.iterations}`);
    console.log("═══════════════════════════════════════════════════════════");
    
    // 1. Run taste analysis
    const tasteReport = await runTasteDrivenDevelopment();
    
    // 2. Select top feature for implementation
    const topFeature = tasteReport.nextActions.immediate[0];
    if (!topFeature) {
      console.log("No immediate features to implement");
      return;
    }
    
    console.log(`\n🎯 Selected feature for implementation: ${topFeature}`);
    
    // 3. Generate implementation
    const context = {
      usageMetrics: tasteReport.analysis.usageMetrics,
      apiTestResults: tasteReport.analysis.apiTestResults,
      competitorFeatures: tasteReport.analysis.competitorFeatures,
      currentScore: tasteReport.insights.averageScore
    };
    
    const implementation = await this.generateFeatureImplementation(topFeature, context);
    
    if (!implementation) {
      console.log("❌ Failed to generate implementation");
      return;
    }
    
    // 4. Implement the feature
    const results = await this.implementFeature(topFeature, implementation);
    
    // 5. Evaluate success
    const success = await this.evaluateImplementation(topFeature, results);
    
    // 6. Generate summary
    const summary = {
      iteration: this.history.iterations,
      feature: topFeature,
      success,
      filesCreated: results.filesCreated.length,
      filesModified: results.filesModified.length,
      errors: results.errors.length,
      nextFeature: tasteReport.nextActions.immediate[1] || "None",
      timestamp: new Date().toISOString()
    };
    
    console.log("\n📊 Iteration Summary:");
    console.log(`   Feature: ${summary.feature}`);
    console.log(`   Success: ${summary.success ? '✅' : '❌'}`);
    console.log(`   Files created: ${summary.filesCreated}`);
    console.log(`   Files modified: ${summary.filesModified}`);
    console.log(`   Errors: ${summary.errors}`);
    console.log(`   Next feature: ${summary.nextFeature}`);
    
    // Save iteration summary
    fs.writeFileSync("latest-iteration-summary.json", JSON.stringify(summary, null, 2));
    
    return summary;
  }

  async implementUIComponent(uiImplementation) {
    console.log(`🎨 Implementing UI component: ${uiImplementation.componentName}`);
    
    const results = {
      success: false,
      filesCreated: [],
      filesModified: [],
      errors: [],
      component: uiImplementation.componentName
    };

    try {
      // Create the React component
      if (uiImplementation.code) {
        fs.writeFileSync(uiImplementation.filePath, uiImplementation.code);
        results.filesCreated.push(uiImplementation.filePath);
        console.log(`✅ Created ${uiImplementation.filePath}`);
      }

      // Create Storybook story if provided
      if (uiImplementation.storybook) {
        const storyPath = uiImplementation.filePath.replace('.tsx', '.stories.tsx');
        fs.writeFileSync(storyPath, uiImplementation.storybook);
        results.filesCreated.push(storyPath);
        console.log(`✅ Created Storybook story: ${storyPath}`);
      }

      // Create Cypress tests if provided
      if (uiImplementation.tests) {
        const testPath = `cypress/e2e/${uiImplementation.componentName.toLowerCase()}.cy.ts`;
        fs.writeFileSync(testPath, uiImplementation.tests);
        results.filesCreated.push(testPath);
        console.log(`✅ Created Cypress test: ${testPath}`);
      }

      // Update UI tests tracking
      const uiTestResults = {
        component: uiImplementation.componentName,
        timestamp: new Date().toISOString(),
        files: results.filesCreated,
        integrationSteps: uiImplementation.integrationSteps || [],
        dependencies: uiImplementation.dependencies || []
      };

      // Save UI test results
      const existingTests = this.loadUITestResults();
      existingTests.push(uiTestResults);
      fs.writeFileSync("ui-tests.json", JSON.stringify(existingTests, null, 2));

      results.success = true;
      
    } catch (error) {
      console.error(`❌ Failed to implement UI component: ${error.message}`);
      results.errors.push(error.message);
    }

    return results;
  }

  loadUITestResults() {
    try {
      return JSON.parse(fs.readFileSync("ui-tests.json", "utf8"));
    } catch {
      return [];
    }
  }

  getStats() {
    return {
      totalIterations: this.history.iterations,
      successfulImplementations: this.history.decisions.filter(d => d.decision === "successful").length,
      failedImplementations: this.history.decisions.filter(d => d.decision === "failed").length,
      totalImplementations: this.history.implementations.length,
      recentFeatures: this.history.implementations.slice(-5).map(i => i.feature)
    };
  }
}

// Main execution
async function main() {
  console.log("🤖 OrderFi Autonomous Development Agent");
  console.log("═════════════════════════════════════════");
  
  const agent = new AutonomousDevAgent();
  
  // Check if OpenAI API key is available
  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ OPENAI_API_KEY environment variable is required");
    process.exit(1);
  }
  
  // Check for UI upgrade flags
  const uiUpgradeFlag = process.argv.includes('--ui-upgrade');
  const uiInfraUpgradeFlag = process.argv.includes('--ui-infra-upgrade');
  const posBackOfficeUpgradeFlag = process.argv.includes('--pos-backoffice-upgrade');
  
  try {
    let summary;
    
    if (posBackOfficeUpgradeFlag) {
      console.log("\n🏢 POS Back Office UI/UX Discovery Mode Activated");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      
      // Run POS Back Office upgrade
      const posUpgrade = new POSBackOfficeUpgrade();
      const posResults = await posUpgrade.run();
      
      summary = {
        mode: "pos-backoffice-upgrade",
        platformsAnalyzed: posResults.metadata.totalPlatforms,
        patternsDiscovered: posResults.metadata.totalPatterns,
        implementationsGenerated: posResults.metadata.totalImplementations,
        success: posResults.metadata.totalImplementations > 0,
        timestamp: new Date().toISOString(),
        topRecommendations: posResults.recommendations.immediateImplementations.slice(0, 3)
      };
      
    } else if (uiInfraUpgradeFlag) {
      console.log("\n🚀 UI Infrastructure Upgrade Mode Activated");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      
      // Run extreme UI infrastructure upgrade
      const uiInfraEngine = new UIInfraUpgradeEngine();
      const infraResults = await uiInfraEngine.runUIInfraUpgrade();
      
      summary = {
        mode: "ui-infra-upgrade",
        ...infraResults,
        timestamp: new Date().toISOString(),
        success: infraResults.implementationsCreated > 0
      };
      
    } else if (uiUpgradeFlag) {
      console.log("\n🎨 UI Discovery Mode Activated");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      
      // Run UI discovery pipeline
      const uiReport = await runUIDiscoveryPipeline();
      
      // Integrate UI discoveries into feature implementation
      if (uiReport.readyImplementations.length > 0) {
        console.log(`\n🚀 Implementing top UI innovation: ${uiReport.readyImplementations[0].componentName}`);
        const implementation = await agent.implementUIComponent(uiReport.readyImplementations[0]);
        
        summary = {
          mode: "ui-discovery",
          discoveries: uiReport.discoveries,
          implementations: uiReport.implementations,
          success: implementation.success,
          timestamp: new Date().toISOString(),
          topUI: uiReport.readyImplementations[0]
        };
      } else {
        summary = {
          mode: "ui-discovery",
          discoveries: uiReport.discoveries,
          implementations: 0,
          success: false,
          message: "No implementable UI innovations found"
        };
      }
    } else {
      // Run standard autonomous iteration
      summary = await agent.runAutonomousIteration();
    }
    
    // Display final stats
    const stats = agent.getStats();
    
    console.log("\n🎉 Agent Statistics:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`Total iterations: ${stats.totalIterations}`);
    console.log(`Successful implementations: ${stats.successfulImplementations}`);
    console.log(`Failed implementations: ${stats.failedImplementations}`);
    console.log(`Recent features: ${stats.recentFeatures.join(", ")}`);
    
    console.log("\n📁 Generated files:");
    console.log("• taste-driven-development-report.json - Full analysis report");
    console.log("• latest-iteration-summary.json - Current iteration results");
    console.log("• agent-history.json - Complete agent history");
    console.log("• feature-taste-history.json - Feature evaluation history");
    console.log("• ui-innovation-catalog.json - UI infrastructure upgrade catalog");
    console.log("• ui-tests.json - UI component test results");
    
    if (uiUpgradeFlag) {
      console.log("• ui-discovery-report.json - UI inspiration analysis");
      console.log("• ui-discovery-catalog.json - UI inspiration catalog");
      console.log("• ui-tests.json - UI component test results");
    }
    
    if (posBackOfficeUpgradeFlag) {
      console.log("• pos-backoffice-discovery-report.json - POS platform analysis");
      console.log("• pos-ui-catalog.json - POS UI pattern catalog");
      console.log("• Generated React components in client/src/components/pos-backoffice/");
    }
    
    if (summary.success) {
      if (summary.mode === "pos-backoffice-upgrade") {
        console.log(`\n✅ Successfully analyzed ${summary.platformsAnalyzed} POS platforms`);
        console.log(`📊 Discovered ${summary.patternsDiscovered} UI patterns`);
        console.log(`🛠️ Generated ${summary.implementationsGenerated} React components`);
        console.log("The app now has enhanced back-office UI based on leading POS systems!");
      } else if (summary.mode === "ui-discovery") {
        console.log(`\n✅ Successfully implemented UI component: ${summary.topUI?.componentName}`);
        console.log("The app now has enhanced UI based on design inspiration!");
      } else {
        console.log(`\n✅ Successfully implemented: ${summary.feature}`);
        console.log("The app now has enhanced capabilities based on competitive analysis!");
      }
    } else {
      if (summary.mode === "pos-backoffice-upgrade") {
        console.log(`\n❌ POS Back Office upgrade failed`);
        console.log("Check the error logs and try again.");
      } else if (summary.mode === "ui-discovery") {
        console.log(`\n❌ UI Discovery implementation failed`);
        console.log(summary.message || "Check the error logs and try again.");
      } else {
        console.log(`\n❌ Implementation failed for: ${summary.feature}`);
        console.log("Check the error logs and try again.");
      }
    }
    
  } catch (error) {
    console.error("❌ Agent execution failed:", error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { AutonomousDevAgent };