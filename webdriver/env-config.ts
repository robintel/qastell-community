/**
 * Environment Configuration Example for Selenium WebDriver
 *
 * This example shows how to configure QAstell license key
 * using environment variables or .env files.
 */

import { Builder, WebDriver } from 'selenium-webdriver';
import { SecurityAuditor, initLicense } from 'qastell';

// Load .env file if using dotenv
// import 'dotenv/config';

// Method 1: Auto-detect from environment
// QAstell automatically reads QASTELL_LICENSE environment variable
// Just set it before running:
//   QASTELL_LICENSE="your-key" npx ts-node webdriver/env-config.ts

// Method 2: Programmatic initialization
// Useful when you need to load from a different env var or config
async function withProgrammaticLicense() {
  // Initialize license from environment or config
  initLicense(process.env.QASTELL_LICENSE || process.env.MY_CUSTOM_KEY);

  const driver: WebDriver = await new Builder().forBrowser('chrome').build();
  await driver.get('https://example.com');

  const auditor = new SecurityAuditor(driver);
  const results = await auditor.audit();

  console.log(`License tier: ${results.license?.tier || 'free'}`);
  console.log(`Scans remaining: ${results.license?.remaining || 'N/A'}`);

  await driver.quit();
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

  const driver: WebDriver = await new Builder().forBrowser('chrome').build();
  await driver.get('https://example.com');

  const auditor = new SecurityAuditor(driver);
  await auditor.assertNoViolations();

  await driver.quit();
}

// Run example
(async () => {
  console.log('Testing env configuration...');
  await withProgrammaticLicense();
  await environmentSpecificConfig();
  console.log('Done!');
})().catch(console.error);
