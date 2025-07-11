import { createBrowser } from '../puppeteer-config.js';

export class WebScraper {
  constructor() {
    this.browser = null;
  }

  async initialize() {
    if (!this.browser) {
      this.browser = await createBrowser();
    }
    return this.browser;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async scrapeWebsite(url, options = {}) {
    const browser = await this.initialize();
    const page = await browser.newPage();
    
    try {
      // Set viewport for consistent rendering
      await page.setViewport({ width: 1920, height: 1080 });
      
      // Set user agent to avoid bot detection
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36');
      
      // Navigate to the website
      await page.goto(url, { 
        waitUntil: 'networkidle2', 
        timeout: 30000 
      });
      
      // Wait for specific selector if provided
      if (options.waitForSelector) {
        await page.waitForSelector(options.waitForSelector, { timeout: 10000 });
      }
      
      // Extract data based on options
      const data = await page.evaluate((opts) => {
        const result = {
          title: document.title,
          url: window.location.href,
          content: {}
        };
        
        // Extract specific elements if selectors provided
        if (opts.selectors) {
          for (const [key, selector] of Object.entries(opts.selectors)) {
            const elements = document.querySelectorAll(selector);
            result.content[key] = Array.from(elements).map(el => ({
              text: el.textContent?.trim(),
              html: el.innerHTML,
              attributes: Array.from(el.attributes).reduce((acc, attr) => {
                acc[attr.name] = attr.value;
                return acc;
              }, {})
            }));
          }
        }
        
        // Extract all text content if no specific selectors
        if (!opts.selectors) {
          result.content.fullText = document.body.textContent?.trim();
        }
        
        return result;
      }, options);
      
      return data;
      
    } catch (error) {
      console.error(`Error scraping ${url}:`, error.message);
      throw error;
    } finally {
      await page.close();
    }
  }

  async scrapeMultiplePages(urls, options = {}) {
    const results = [];
    
    for (const url of urls) {
      try {
        console.log(`Scraping: ${url}`);
        const data = await this.scrapeWebsite(url, options);
        results.push(data);
        
        // Add delay between requests to be respectful
        if (options.delay) {
          await new Promise(resolve => setTimeout(resolve, options.delay));
        }
      } catch (error) {
        console.error(`Failed to scrape ${url}:`, error.message);
        results.push({
          url,
          error: error.message,
          success: false
        });
      }
    }
    
    return results;
  }

  async takeScreenshot(url, options = {}) {
    const browser = await this.initialize();
    const page = await browser.newPage();
    
    try {
      await page.setViewport({ 
        width: options.width || 1920, 
        height: options.height || 1080 
      });
      
      await page.goto(url, { waitUntil: 'networkidle2' });
      
      if (options.waitForSelector) {
        await page.waitForSelector(options.waitForSelector);
      }
      
      const screenshot = await page.screenshot({
        fullPage: options.fullPage || false,
        type: options.format || 'png'
      });
      
      return screenshot;
      
    } finally {
      await page.close();
    }
  }
}

// Singleton instance for reuse
export const webScraper = new WebScraper();

// Utility function for ADA system
export const scrapeCompetitorSites = async (competitors) => {
  const scraper = new WebScraper();
  
  try {
    const results = await scraper.scrapeMultiplePages(
      competitors.map(comp => comp.url),
      {
        delay: 2000, // 2 second delay between requests
        selectors: {
          navigation: 'nav a, .nav-link, .menu-item',
          features: '[data-feature], .feature, .capability',
          pricing: '.price, .pricing, [data-price]',
          testimonials: '.testimonial, .review, .quote'
        }
      }
    );
    
    return results;
  } finally {
    await scraper.close();
  }
};