import { WebScraper } from '../server/utils/web-scraper.js';
import fs from 'fs/promises';
import path from 'path';

// Major POS and restaurant tech competitors to analyze
const COMPETITORS = [
  {
    name: 'Toast POS',
    url: 'https://pos.toasttab.com/products/pos-system',
    category: 'Full-Service POS',
    focus: 'Restaurant operations, kitchen display, payment processing'
  },
  {
    name: 'Square Restaurant',
    url: 'https://squareup.com/us/en/point-of-sale/restaurants',
    category: 'Small Business POS',
    focus: 'Simple setup, integrated payments, mobile ordering'
  },
  {
    name: 'Clover POS',
    url: 'https://www.clover.com/pos-systems/restaurant',
    category: 'Merchant Services',
    focus: 'Hardware integration, app marketplace, analytics'
  },
  {
    name: 'Lightspeed Restaurant',
    url: 'https://www.lightspeedhq.com/pos/restaurant/',
    category: 'Enterprise POS',
    focus: 'Multi-location, advanced reporting, inventory management'
  },
  {
    name: 'Revel Systems',
    url: 'https://revelsystems.com/industries/restaurants/',
    category: 'iPad POS',
    focus: 'iPad-based, customer engagement, loyalty programs'
  },
  {
    name: 'TouchBistro',
    url: 'https://www.touchbistro.com/',
    category: 'iPad Restaurant POS',
    focus: 'Table management, menu design, staff scheduling'
  },
  {
    name: 'Upserve (Breadcrumb)',
    url: 'https://upserve.com/',
    category: 'Restaurant Platform',
    focus: 'Analytics, customer insights, marketing automation'
  },
  {
    name: 'Aloha POS',
    url: 'https://www.ncr.com/restaurants/aloha-pos',
    category: 'Enterprise Restaurant',
    focus: 'Chain restaurants, kitchen management, labor optimization'
  }
];

// Modern QR ordering and mobile-first competitors
const QR_COMPETITORS = [
  {
    name: 'me&u',
    url: 'https://meandu.com/',
    category: 'QR Ordering',
    focus: 'Mobile ordering, customer engagement, seamless payments'
  },
  {
    name: 'Mr Yum',
    url: 'https://www.mryum.com/',
    category: 'QR Menu',
    focus: 'Digital menus, contactless ordering, data insights'
  },
  {
    name: 'Zomato Base',
    url: 'https://www.zomato.com/business/pos',
    category: 'Restaurant Tech',
    focus: 'Online ordering, delivery integration, customer data'
  },
  {
    name: 'OpenTable',
    url: 'https://www.opentable.com/start/pos',
    category: 'Reservation + POS',
    focus: 'Table management, reservations, guest management'
  }
];

// Advanced scraping patterns for different types of content
const SCRAPING_PATTERNS = {
  features: [
    '[data-feature]', '.feature', '.capability', '.benefit',
    'h3 + p', 'h2 + ul', '.feature-list li', '.benefits li',
    '.product-feature', '.solution-item', '.service-item'
  ],
  navigation: [
    'nav a', '.nav-link', '.menu-item', '.main-nav a',
    '.header-nav a', '.navigation a', '.menu a'
  ],
  pricing: [
    '.price', '.pricing', '[data-price]', '.cost',
    '.plan-price', '.subscription-price', '.pricing-tier'
  ],
  testimonials: [
    '.testimonial', '.review', '.quote', '.customer-story',
    '.case-study', '.success-story', '.client-testimonial'
  ],
  screenshots: [
    '.screenshot', '.product-image', '.demo-image',
    '.interface-preview', '.app-screenshot', '.dashboard-preview'
  ],
  callouts: [
    '.cta', '.call-to-action', '.highlight', '.standout',
    '.key-benefit', '.unique-value', '.differentiator'
  ]
};

class CompetitiveIntelligence {
  constructor() {
    this.scraper = new WebScraper();
    this.results = {
      competitors: [],
      patterns: {},
      insights: [],
      recommendations: []
    };
  }

  async analyzeCompetitors() {
    console.log('🔍 Starting comprehensive competitive analysis...');
    
    // Combine all competitors for analysis
    const allCompetitors = [...COMPETITORS, ...QR_COMPETITORS];
    
    for (const competitor of allCompetitors) {
      try {
        console.log(`\n📊 Analyzing ${competitor.name}...`);
        
        const data = await this.scraper.scrapeWebsite(competitor.url, {
          selectors: {
            features: SCRAPING_PATTERNS.features.join(', '),
            navigation: SCRAPING_PATTERNS.navigation.join(', '),
            pricing: SCRAPING_PATTERNS.pricing.join(', '),
            testimonials: SCRAPING_PATTERNS.testimonials.join(', '),
            screenshots: SCRAPING_PATTERNS.screenshots.join(', '),
            callouts: SCRAPING_PATTERNS.callouts.join(', ')
          },
          waitForSelector: 'body',
          delay: 2000
        });
        
        // Extract meaningful insights
        const insights = this.extractInsights(data, competitor);
        
        this.results.competitors.push({
          ...competitor,
          data,
          insights,
          scrapedAt: new Date().toISOString()
        });
        
        console.log(`✅ ${competitor.name} analyzed - ${insights.keyFeatures.length} features found`);
        
      } catch (error) {
        console.error(`❌ Failed to analyze ${competitor.name}:`, error.message);
        this.results.competitors.push({
          ...competitor,
          error: error.message,
          scrapedAt: new Date().toISOString()
        });
      }
    }
    
    // Generate strategic insights
    this.generateStrategicInsights();
    
    // Save results
    await this.saveResults();
    
    return this.results;
  }

  extractInsights(data, competitor) {
    const insights = {
      keyFeatures: [],
      navigationPatterns: [],
      pricingStrategy: [],
      valuePropositions: [],
      userExperience: []
    };
    
    // Extract key features
    if (data.content.features) {
      insights.keyFeatures = data.content.features
        .map(f => f.text)
        .filter(text => text && text.length > 10)
        .slice(0, 20); // Top 20 features
    }
    
    // Extract navigation patterns
    if (data.content.navigation) {
      insights.navigationPatterns = data.content.navigation
        .map(n => n.text)
        .filter(text => text && text.length > 2)
        .slice(0, 15); // Top 15 nav items
    }
    
    // Extract pricing information
    if (data.content.pricing) {
      insights.pricingStrategy = data.content.pricing
        .map(p => p.text)
        .filter(text => text && (text.includes('$') || text.includes('price') || text.includes('plan')))
        .slice(0, 10);
    }
    
    // Extract value propositions
    if (data.content.callouts) {
      insights.valuePropositions = data.content.callouts
        .map(c => c.text)
        .filter(text => text && text.length > 15)
        .slice(0, 10);
    }
    
    return insights;
  }

  generateStrategicInsights() {
    console.log('\n🧠 Generating strategic insights...');
    
    // Analyze feature frequency across competitors
    const featureFrequency = {};
    this.results.competitors.forEach(comp => {
      if (comp.insights && comp.insights.keyFeatures) {
        comp.insights.keyFeatures.forEach(feature => {
          const normalized = feature.toLowerCase().trim();
          featureFrequency[normalized] = (featureFrequency[normalized] || 0) + 1;
        });
      }
    });
    
    // Identify most common features (table stakes)
    const tableStakes = Object.entries(featureFrequency)
      .filter(([feature, count]) => count >= 3)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([feature]) => feature);
    
    // Identify unique features (differentiators)
    const differentiators = Object.entries(featureFrequency)
      .filter(([feature, count]) => count === 1)
      .map(([feature]) => feature);
    
    // Generate recommendations
    this.results.insights = [
      {
        type: 'table_stakes',
        title: 'Essential Features (Must Have)',
        items: tableStakes,
        description: 'Features present in 3+ competitors - baseline expectations'
      },
      {
        type: 'differentiators',
        title: 'Unique Features (Competitive Advantage)',
        items: differentiators.slice(0, 20),
        description: 'Features mentioned by only one competitor - potential differentiation opportunities'
      }
    ];
    
    // Generate first principles recommendations
    this.results.recommendations = this.generateFirstPrinciplesRecommendations();
  }

  generateFirstPrinciplesRecommendations() {
    return [
      {
        principle: 'Simplicity Over Complexity',
        current_problem: 'Most POS systems have overcomplicated interfaces with too many features',
        orderfi_solution: 'Focus on 5 core workflows: Order, Pay, Cook, Serve, Analyze',
        implementation: 'Single-screen workflows, progressive disclosure, voice-first interface'
      },
      {
        principle: 'Mobile-First Design',
        current_problem: 'Traditional POS systems are desktop-centric with poor mobile experience',
        orderfi_solution: 'Native mobile experience with gesture controls and one-handed operation',
        implementation: 'Touch-optimized UI, swipe navigation, voice commands, haptic feedback'
      },
      {
        principle: 'Real-Time Everything',
        current_problem: 'Delayed updates between kitchen, front-of-house, and customers',
        orderfi_solution: 'Real-time sync across all touchpoints with WebSocket connections',
        implementation: 'Live kitchen display, instant order updates, real-time inventory'
      },
      {
        principle: 'AI-Powered Automation',
        current_problem: 'Manual processes for ordering, inventory, and customer service',
        orderfi_solution: 'Conversational AI for orders, predictive inventory, automated customer service',
        implementation: 'ChatOps for restaurant management, AI menu recommendations, smart reordering'
      },
      {
        principle: 'Blockchain-Native Payments',
        current_problem: 'High payment processing fees and slow settlement times',
        orderfi_solution: 'Native crypto payments with instant settlement and loyalty tokens',
        implementation: 'USDC payments, MIMI loyalty tokens, DeFi integration for treasury management'
      }
    ];
  }

  async saveResults() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `competitive-intelligence-${timestamp}.json`;
    const filepath = path.join(process.cwd(), filename);
    
    await fs.writeFile(filepath, JSON.stringify(this.results, null, 2));
    console.log(`\n💾 Results saved to ${filename}`);
    
    // Also save a summary report
    const summaryPath = path.join(process.cwd(), 'competitive-analysis-summary.json');
    const summary = {
      analyzedAt: new Date().toISOString(),
      competitorsAnalyzed: this.results.competitors.length,
      successfulAnalyses: this.results.competitors.filter(c => !c.error).length,
      keyInsights: this.results.insights,
      recommendations: this.results.recommendations,
      nextSteps: [
        'Implement table stakes features to meet baseline expectations',
        'Develop unique differentiators identified in analysis',
        'Focus on mobile-first design principles',
        'Integrate AI and blockchain advantages',
        'Conduct user testing with simplified workflows'
      ]
    };
    
    await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));
    console.log(`📋 Summary saved to competitive-analysis-summary.json`);
  }

  async cleanup() {
    await this.scraper.close();
  }
}

// Execute the analysis
async function runCompetitiveAnalysis() {
  const intelligence = new CompetitiveIntelligence();
  
  try {
    const results = await intelligence.analyzeCompetitors();
    console.log('\n🎯 Competitive Analysis Complete!');
    console.log(`📊 Analyzed ${results.competitors.length} competitors`);
    console.log(`💡 Generated ${results.insights.length} strategic insights`);
    console.log(`🚀 Created ${results.recommendations.length} first principles recommendations`);
    
    return results;
  } catch (error) {
    console.error('❌ Analysis failed:', error);
    throw error;
  } finally {
    await intelligence.cleanup();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runCompetitiveAnalysis()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { runCompetitiveAnalysis, CompetitiveIntelligence };