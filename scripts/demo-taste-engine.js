import { FeatureTasteEngine } from './taste-engine-simple.js';

async function runDemo() {
  console.log('🎯 OrderFi Taste Engine Demo');
  console.log('═══════════════════════════════════');
  
  const engine = new FeatureTasteEngine();
  
  // Demo features to evaluate
  const features = [
    'AI-powered upselling',
    'One-click reordering', 
    'Social proof badges'
  ];
  
  const context = {
    usageMetrics: {
      'Add to Cart': { count: 1823, trend: '+8%' },
      'Checkout Started': { count: 1456, trend: '+15%' },
      'QR Code Scanned': { count: 3421, trend: '+22%' }
    },
    currentFeatures: ['QR Code Scanning', 'Menu Grid', 'Cart Drawer', 'Voice Search']
  };
  
  console.log('🚀 Evaluating features against taste criteria...\n');
  
  for (const feature of features) {
    try {
      console.log(`📊 Evaluating: ${feature}`);
      const result = await engine.evaluateFeature(feature, context);
      
      console.log(`   Score: ${result.totalScore}/10`);
      console.log(`   Recommendation: ${result.recommendation.toUpperCase()}`);
      console.log(`   Insight: ${result.insight}`);
      console.log('   ─────────────────────────────────────');
    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}`);
    }
  }
  
  console.log('\n🎉 Demo complete!');
  console.log('Full analysis with 25+ features available via: node run-taste-analysis.js');
}

runDemo().catch(console.error);