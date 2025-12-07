/**
 * Environment Configuration Example
 *
 * This example demonstrates how to load your QAstell license key from a .env file.
 *
 * Setup:
 * 1. Copy .env.example to .env: `cp .env.example .env`
 * 2. Replace the placeholder with your actual license key
 * 3. Install dotenv: `npm install dotenv`
 * 4. Run the test: `npx playwright test env-config.spec.ts`
 */

import { test, expect } from '@playwright/test';
import 'dotenv/config';

// Verify environment is configured
test.describe('Environment Configuration', () => {
  test('should load license key from environment', async () => {
    const licenseKey = process.env.QASTELL_LICENSE;

    // Check if the environment variable is set
    if (!licenseKey) {
      console.log('ℹ️  No license key found - using Free tier (10 scans/day)');
      console.log('   To use Enterprise/Corporate features, set QASTELL_LICENSE in your .env file');
    } else if (licenseKey === 'your-license-key-here') {
      console.log('⚠️  License key is still the placeholder value');
      console.log('   Replace it with your actual key in .env file');
    } else {
      console.log('✅ License key loaded from environment');
      console.log(`   Key prefix: ${licenseKey.substring(0, 8)}...`);
    }

    // This test always passes - it's for demonstration purposes
    expect(true).toBe(true);
  });

  test('should run basic audit with configured license', async ({ page }) => {
    // Navigate to a test page
    await page.goto('https://example.com');

    // Import QAstell (uncomment when qastell is installed)
    // import { SecurityAuditor } from 'qastell';
    //
    // const auditor = new SecurityAuditor(page);
    //
    // // The license key is automatically picked up from QASTELL_LICENSE env var
    // const results = await auditor.audit();
    //
    // console.log(`Found ${results.violations.length} security issues`);
    // await auditor.assertNoViolations();

    // Placeholder assertion for demonstration
    const title = await page.title();
    expect(title).toContain('Example');

    console.log('✅ Page loaded successfully');
    console.log('   Uncomment the QAstell code above to run actual security audits');
  });
});
