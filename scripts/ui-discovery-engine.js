#!/usr/bin/env node

import fs from "fs";
import OpenAI from "openai";
import puppeteer from "puppeteer";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export class UIDiscoveryEngine {
  constructor() {
    this.sources = {
      dribbble: {
        popular: "https://dribbble.com/shots/popular",
        featured: "https://dribbble.com/shots"
      },
      behance: {
        webDesign: "https://www.behance.net/galleries/ui-ux"
      },
      productHunt: {
        apps: "https://www.producthunt.com/topics/web-app"
      }
    };
    this.uiCatalog = this.loadUICatalog();
  }

  loadUICatalog() {
    try {
      return JSON.parse(fs.readFileSync("ui-discovery-catalog.json", "utf8"));
    } catch {
      return { entries: [], lastUpdated: null };
    }
  }

  saveUICatalog() {
    this.uiCatalog.lastUpdated = new Date().toISOString();
    fs.writeFileSync("ui-discovery-catalog.json", JSON.stringify(this.uiCatalog, null, 2));
  }

  async crawlUIInspiration() {
    console.log("🎨 Crawling UI inspiration sources...");
    
    const browser = await puppeteer.launch({ 
      headless: true,
      executablePath: '/nix/store/zi4f80l169xlmivz8vja8wlphq74qqk0-chromium-125.0.6422.141/bin/chromium',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const discoveries = [];

    try {
      // Crawl Dribbble Popular
      const dribbbleShots = await this.crawlDribbble(browser);
      discoveries.push(...dribbbleShots);

      // Crawl Behance Web Design
      const behanceProjects = await this.crawlBehance(browser);
      discoveries.push(...behanceProjects);

      // Crawl Product Hunt Apps
      const productHuntApps = await this.crawlProductHunt(browser);
      discoveries.push(...productHuntApps);

    } catch (error) {
      console.error("Crawling error:", error);
    } finally {
      await browser.close();
    }

    return discoveries;
  }

  async crawlDribbble(browser) {
    const page = await browser.newPage();
    await page.goto(this.sources.dribbble.popular);
    
    // Extract shot data
    const shots = await page.evaluate(() => {
      const shotElements = document.querySelectorAll('.shot-thumbnail');
      return Array.from(shotElements).slice(0, 20).map(shot => ({
        name: shot.querySelector('.shot-title')?.textContent?.trim() || 'Untitled',
        url: shot.querySelector('a')?.href || '',
        imageUrl: shot.querySelector('img')?.src || '',
        designer: shot.querySelector('.display-name')?.textContent?.trim() || 'Unknown',
        source: 'dribbble'
      }));
    });

    await page.close();
    return shots;
  }

  async crawlBehance(browser) {
    const page = await browser.newPage();
    await page.goto(this.sources.behance.webDesign);
    
    // Extract project data
    const projects = await page.evaluate(() => {
      const projectElements = document.querySelectorAll('.project-card');
      return Array.from(projectElements).slice(0, 15).map(project => ({
        name: project.querySelector('.project-title')?.textContent?.trim() || 'Untitled',
        url: project.querySelector('a')?.href || '',
        imageUrl: project.querySelector('img')?.src || '',
        designer: project.querySelector('.owner-name')?.textContent?.trim() || 'Unknown',
        source: 'behance'
      }));
    });

    await page.close();
    return projects;
  }

  async crawlProductHunt(browser) {
    const page = await browser.newPage();
    await page.goto(this.sources.productHunt.apps);
    
    // Extract app data
    const apps = await page.evaluate(() => {
      const appElements = document.querySelectorAll('[data-test="post-item"]');
      return Array.from(appElements).slice(0, 10).map(app => ({
        name: app.querySelector('h3')?.textContent?.trim() || 'Untitled',
        url: app.querySelector('a')?.href || '',
        imageUrl: app.querySelector('img')?.src || '',
        description: app.querySelector('.post-description')?.textContent?.trim() || '',
        source: 'product-hunt'
      }));
    });

    await page.close();
    return apps;
  }

  async extractUIFeatures(uiEntry) {
    const prompt = `
Analyze this UI design and extract specific interface elements and patterns:

UI Entry:
- Name: ${uiEntry.name}
- Source: ${uiEntry.source}
- Designer: ${uiEntry.designer || 'Unknown'}
- Description: ${uiEntry.description || 'No description'}

Based on the UI design, identify and categorize these elements:

1. Navigation Patterns:
   - Bottom navigation, tab bar, hamburger menu, breadcrumbs
   - Floating action buttons, sticky headers

2. Layout Types:
   - Card layouts, list views, grid systems
   - Masonry layouts, carousel/swiper patterns

3. Interactive Elements:
   - Gestures (swipe, pull-to-refresh, long-press)
   - Micro-interactions (hover effects, loading states)
   - Form patterns (input styles, validation feedback)

4. Visual Design:
   - Typography hierarchy and font choices
   - Color scheme and gradients
   - Spacing and padding patterns
   - Shadow and elevation usage

5. Restaurant/Food App Specific:
   - Menu organization and filtering
   - Cart and checkout flows
   - Order status and tracking
   - Payment interfaces

Return your analysis in this JSON format:
{
  "elements": [
    {
      "type": "navigation|layout|interaction|visual|restaurant-specific",
      "category": "specific element type",
      "description": "detailed description",
      "applicability": "how this could apply to OrderFi",
      "implementation_complexity": "low|medium|high"
    }
  ],
  "overall_innovation_score": 1-10,
  "restaurant_relevance": 1-10,
  "technical_feasibility": 1-10
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a senior UX designer and frontend developer specializing in restaurant technology and mobile interfaces." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3
    });

    try {
      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error("Failed to parse UI analysis:", error);
      return null;
    }
  }

  async scoreUIIdeas(uiEntries) {
    const scoredEntries = [];

    for (const entry of uiEntries) {
      const analysis = await this.extractUIFeatures(entry);
      if (!analysis) continue;

      // Enhanced taste scoring with UI Innovation weight
      const score = this.calculateUITasteScore(analysis);
      
      scoredEntries.push({
        ...entry,
        analysis,
        tasteScore: score,
        timestamp: new Date().toISOString()
      });
    }

    return scoredEntries.sort((a, b) => b.tasteScore.total - a.tasteScore.total);
  }

  calculateUITasteScore(analysis) {
    // Existing criteria + new UI Innovation weight
    const weights = {
      userExperience: 0.25,        // 25%
      businessValue: 0.20,         // 20%
      technicalExcellence: 0.15,   // 15%
      competitiveAdvantage: 0.15,  // 15%
      implementationFeasibility: 0.10, // 10%
      uiInnovation: 0.15           // 15% - NEW
    };

    const scores = {
      userExperience: analysis.restaurant_relevance * 0.7 + analysis.overall_innovation_score * 0.3,
      businessValue: analysis.restaurant_relevance * 0.8 + analysis.overall_innovation_score * 0.2,
      technicalExcellence: analysis.technical_feasibility,
      competitiveAdvantage: analysis.overall_innovation_score,
      implementationFeasibility: analysis.technical_feasibility,
      uiInnovation: analysis.overall_innovation_score
    };

    const total = Object.entries(scores).reduce((sum, [key, score]) => {
      return sum + (score * weights[key]);
    }, 0);

    return {
      total: Math.round(total * 100) / 100,
      breakdown: scores,
      confidence: Math.min(0.95, total / 10)
    };
  }

  async generateUIImplementation(topUIIdeas) {
    const implementations = [];

    for (const idea of topUIIdeas.slice(0, 5)) { // Top 5 ideas
      const implementation = await this.createReactImplementation(idea);
      if (implementation) {
        implementations.push(implementation);
      }
    }

    return implementations;
  }

  async createReactImplementation(uiIdea) {
    const prompt = `
Create a React component implementation for this UI idea in OrderFi:

UI Idea: ${uiIdea.name}
Source: ${uiIdea.source}
Analysis: ${JSON.stringify(uiIdea.analysis, null, 2)}

OrderFi Architecture:
- React 18 + TypeScript + Tailwind CSS
- shadcn/ui components
- Wouter routing
- TanStack Query for state management
- Restaurant theme: cream (#ffe6b0), orange-pink gradients

Generate:
1. Complete React component with TypeScript
2. Tailwind CSS styling following OrderFi design system
3. Props interface and proper typing
4. Integration with existing OrderFi components
5. Responsive design for mobile-first

Return implementation in JSON format:
{
  "componentName": "ComponentName",
  "filePath": "client/src/components/ui/component-name.tsx",
  "code": "complete React component code",
  "storybook": "Storybook story code",
  "tests": "Cypress test code",
  "integrationSteps": ["step 1", "step 2", "..."],
  "dependencies": ["any new dependencies needed"]
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a senior React developer specializing in restaurant technology and component libraries." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2
    });

    try {
      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error("Failed to parse UI implementation:", error);
      return null;
    }
  }

  async runUIDiscoveryPipeline() {
    console.log("🚀 Starting UI Discovery & Automated Improvement Pipeline");
    console.log("═══════════════════════════════════════════════════════════");

    // 1. UI Discovery
    const discoveries = await this.crawlUIInspiration();
    console.log(`📱 Discovered ${discoveries.length} UI inspirations`);

    // 2. Feature Extraction & Scoring
    const scoredIdeas = await this.scoreUIIdeas(discoveries);
    console.log(`🎯 Analyzed and scored ${scoredIdeas.length} UI ideas`);

    // 3. Update Catalog
    this.uiCatalog.entries = scoredIdeas;
    this.saveUICatalog();

    // 4. Generate Implementations
    const implementations = await this.generateUIImplementation(scoredIdeas);
    console.log(`⚡ Generated ${implementations.length} React implementations`);

    // 5. Create Report
    const report = {
      timestamp: new Date().toISOString(),
      discoveries: discoveries.length,
      analyzed: scoredIdeas.length,
      implementations: implementations.length,
      topIdeas: scoredIdeas.slice(0, 10),
      readyImplementations: implementations,
      stats: {
        avgInnovationScore: scoredIdeas.reduce((sum, idea) => sum + idea.analysis.overall_innovation_score, 0) / scoredIdeas.length,
        avgRelevanceScore: scoredIdeas.reduce((sum, idea) => sum + idea.analysis.restaurant_relevance, 0) / scoredIdeas.length,
        avgTechnicalFeasibility: scoredIdeas.reduce((sum, idea) => sum + idea.analysis.technical_feasibility, 0) / scoredIdeas.length
      }
    };

    fs.writeFileSync("ui-discovery-report.json", JSON.stringify(report, null, 2));
    
    return report;
  }
}

// Export for use in agent orchestrator
export async function runUIDiscoveryPipeline() {
  const engine = new UIDiscoveryEngine();
  return await engine.runUIDiscoveryPipeline();
}