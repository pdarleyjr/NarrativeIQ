/**
 * End-to-End Test for EZ Narratives
 * 
 * This script uses Puppeteer to test the web application.
 * It performs the following steps:
 * 1. Opens the Reflex web server
 * 2. Logs in
 * 3. Fills in the EMS form
 * 4. Generates a narrative
 * 5. Switches to the Fire tab
 * 6. Fills in the Fire form
 * 7. Generates a fire narrative
 */

const puppeteer = require('puppeteer');
require('dotenv').config({ path: '.env.local' });

// Test configuration
const config = {
  baseUrl: 'http://localhost:3000',
  credentials: {
    email: process.env.TEST_USER_EMAIL || 'test@example.com',
    password: process.env.TEST_USER_PASSWORD || 'password123'
  },
  timeout: 30000 // 30 seconds
};

// Helper function to wait for a specific time
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  console.log('Starting E2E test...');
  
  // Launch the browser
  const browser = await puppeteer.launch({
    headless: false, // Set to true for CI environments
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1280, height: 800 }
  });
  
  const page = await browser.newPage();
  
  try {
    // Step 1: Navigate to the application
    console.log('Navigating to the application...');
    await page.goto(config.baseUrl, { waitUntil: 'networkidle2', timeout: config.timeout });
    
    // Step 2: Log in
    console.log('Logging in...');
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', config.credentials.email);
    await page.type('input[type="password"]', config.credentials.password);
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await page.waitForSelector('[data-testid="dashboard"]', { timeout: config.timeout });
    console.log('Successfully logged in!');
    
    // Step 3: Fill in EMS form
    console.log('Filling in EMS form...');
    // Click on EMS tab
    await page.click('[data-testid="ems-tab"]');
    await wait(1000);
    
    // Fill in dispatch section
    await page.type('[data-testid="unit-input"]', 'Medic 1');
    await page.type('[data-testid="dispatch-reason-input"]', '123 Main St for chest pain');
    
    // Fill in patient information
    await page.select('[data-testid="patient-sex-select"]', 'Male');
    await page.type('[data-testid="patient-age-input"]', '65');
    await page.type('[data-testid="chief-complaint-input"]', 'Chest pain');
    await page.type('[data-testid="duration-input"]', '30 minutes');
    await page.type('[data-testid="patient-presentation-input"]', 'Patient found sitting upright in chair, clutching chest.');
    
    // Fill in assessment section
    await page.click('[data-testid="next-section-button"]');
    await wait(500);
    
    // Fill in treatment section
    await page.click('[data-testid="next-section-button"]');
    await wait(500);
    await page.type('[data-testid="treatment-provided-input"]', 'Administered 324mg aspirin PO, established IV access.');
    
    // Fill in transport section
    await page.click('[data-testid="next-section-button"]');
    await wait(500);
    await page.type('[data-testid="transport-destination-input"]', 'Memorial Hospital');
    
    // Step 4: Generate EMS narrative
    console.log('Generating EMS narrative...');
    await page.click('[data-testid="generate-narrative-button"]');
    
    // Wait for narrative to be generated
    await page.waitForSelector('[data-testid="narrative-text"]', { timeout: config.timeout });
    
    // Verify narrative was generated
    const emsNarrativeText = await page.$eval('[data-testid="narrative-text"]', el => el.textContent);
    console.log('EMS Narrative generated successfully!');
    console.log('Narrative preview:', emsNarrativeText.substring(0, 100) + '...');
    
    // Step 5: Switch to Fire tab
    console.log('Switching to Fire tab...');
    await page.click('[data-testid="fire-tab"]');
    await wait(1000);
    
    // Step 6: Fill in Fire form
    console.log('Filling in Fire form...');
    await page.type('[data-testid="unit-input"]', 'Engine 3');
    await page.select('[data-testid="emergency-type-select"]', 'Structure Fire');
    await page.type('[data-testid="additional-info-input"]', 'Two-story residential structure with heavy smoke showing from second floor.');
    
    // Step 7: Generate Fire narrative
    console.log('Generating Fire narrative...');
    await page.click('[data-testid="generate-fire-narrative-button"]');
    
    // Wait for narrative to be generated
    await page.waitForSelector('[data-testid="fire-narrative-text"]', { timeout: config.timeout });
    
    // Verify narrative was generated
    const fireNarrativeText = await page.$eval('[data-testid="fire-narrative-text"]', el => el.textContent);
    console.log('Fire Narrative generated successfully!');
    console.log('Narrative preview:', fireNarrativeText.substring(0, 100) + '...');
    
    console.log('E2E test completed successfully!');
  } catch (error) {
    console.error('E2E test failed:', error);
    
    // Take a screenshot of the failure
    await page.screenshot({ path: 'e2e-test-failure.png' });
    
    throw error;
  } finally {
    // Close the browser
    await browser.close();
  }
})();