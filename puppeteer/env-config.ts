/**
 * Environment Configuration Example for Puppeteer
 *
 * This example shows how to configure QAstell license key
 * using environment variables or .env files.
 */

import puppeteer from 'puppeteer';
import { SecurityAuditor, initLicense } from 'qastell';

// Load .env file if using dotenv
// import 'dotenv/config';

// Method 1: Auto-detect from environment
// QAstell automatically reads QASTELL_LICENSE environment variable
// Just set it before running:
//   QASTELL_LICENSE="your-key" npx ts-node puppeteer/env-config.ts

// Method 2: Programmatic initialization
// Useful when you need to load from a different env var or config
async function withProgrammaticLicense() {
  // Initialize license from environment or config
  initLicense(process.env.QASTELL_LICENSE || process.env.MY_CUSTOM_KEY);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://your-app.com');

  const auditor = new SecurityAuditor(page);
  const results = await auditor.audit();

  console.log(`License tier: ${results.license?.tier || 'free'}`);
  console.log(`Scans remaining: ${results.license?.remaining || 'N/A'}`);

  await browser.close();
}

// Method 3: Different configs for different environments
async function environmentSpecificConfig() {
  const env = process.env.NODE_ENV || 'development';

  // Use different license keys per environment
  const licenseKeys: Record<string, string | undefined> = {
    development: process.env.QASTELL_DEV_LICENSE,
    staging: process.env.QASTELL_STAGING_LICENSE,
    production: process.env.QASTELL_PROD_LICENSE,
  };

  const license = licenseKeys[env];
  if (license) {
    initLicense(license);
  }

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://your-app.com');

  const auditor = new SecurityAuditor(page);
  await auditor.assertNoViolations();

  await browser.close();
}

// Run example
(async () => {
  console.log('Testing env configuration...');
  await withProgrammaticLicense();
  await environmentSpecificConfig();
  console.log('Done!');
})().catch(console.error);
