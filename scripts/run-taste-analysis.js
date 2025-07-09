#!/usr/bin/env node

import { runTasteDrivenDevelopment } from "./taste-engine-simple.js";

// Run the taste-driven development analysis
console.log("🚀 OrderFi Taste Engine - Autonomous Feature Development");
console.log("═══════════════════════════════════════════════════════════");

runTasteDrivenDevelopment()
  .then(report => {
    console.log("\n✨ Analysis complete! Check 'taste-driven-development-report.json' for full details.");
    console.log("\nNext steps:");
    console.log("1. Review the implementation plan");
    console.log("2. Prioritize the top-ranked features");
    console.log("3. Begin development of immediate features");
    console.log("4. Schedule regular taste analysis runs");
  })
  .catch(error => {
    console.error("❌ Analysis failed:", error);
    process.exit(1);
  });