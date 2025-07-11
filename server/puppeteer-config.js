import puppeteer from 'puppeteer';

// Puppeteer configuration for Replit environment
export const createBrowser = async (options = {}) => {
  const defaultOptions = {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    ],
    // Use system-installed Chromium
    executablePath: '/nix/store/zi4f80l169xlmivz8vja8wlphq74qqk0-chromium-125.0.6422.141/bin/chromium',
    ...options
  };

  try {
    const browser = await puppeteer.launch(defaultOptions);
    console.log('✓ Puppeteer browser launched successfully');
    return browser;
  } catch (error) {
    console.error('Failed to launch Puppeteer browser:', error.message);
    
    // Fallback: try without executablePath (use bundled Chromium)
    try {
      const { executablePath, ...fallbackOptions } = defaultOptions;
      const browser = await puppeteer.launch(fallbackOptions);
      console.log('✓ Puppeteer browser launched with fallback configuration');
      return browser;
    } catch (fallbackError) {
      console.error('Failed to launch Puppeteer browser with fallback:', fallbackError.message);
      throw fallbackError;
    }
  }
};

// Test function to verify Puppeteer is working
export const testPuppeteer = async () => {
  try {
    const browser = await createBrowser();
    const page = await browser.newPage();
    
    // Test basic functionality
    await page.goto('https://example.com');
    const title = await page.title();
    
    await browser.close();
    
    console.log('✓ Puppeteer test successful - Page title:', title);
    return true;
  } catch (error) {
    console.error('✗ Puppeteer test failed:', error.message);
    return false;
  }
};