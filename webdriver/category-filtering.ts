/**
 * Category Filtering Example for Selenium WebDriver
 *
 * This example shows how to include or exclude specific rule categories
 * to focus on areas most relevant to your application.
 */

import { Builder, WebDriver } from 'selenium-webdriver';
import { SecurityAuditor } from 'qastell';

async function includeCategories() {
  const driver: WebDriver = await new Builder().forBrowser('chrome').build();
  await driver.get('https://your-app.com');

  const auditor = new SecurityAuditor(driver);

  // Only check specific categories
  const results = await auditor.audit({
    include: [
      'inline-handlers',   // onclick, onerror, etc.
      'dom-clobbering',    // DOM pollution attacks
      'html-injection',    // HTML injection points
    ],
  });

  console.log(`Checked ${results.summary.rulesRun} rules`);
  console.log(`Found ${results.summary.total} issues`);

  await driver.quit();
}

async function excludeCategories() {
  const driver: WebDriver = await new Builder().forBrowser('chrome').build();
  await driver.get('https://your-app.com');

  const auditor = new SecurityAuditor(driver);

  // Run all categories except specific ones
  await auditor.assertNoViolations({
    exclude: [
      'third-party',       // External scripts you can't control
      'sri',               // SRI for CDN resources (if using dynamic versions)
    ],
  });

  await driver.quit();
}

async function skipSpecificRules() {
  const driver: WebDriver = await new Builder().forBrowser('chrome').build();
  await driver.get('https://your-app.com');

  const auditor = new SecurityAuditor(driver);

  // More granular: skip individual rules by ID
  await auditor.assertNoViolations({
    skipRules: [
      'missing-x-frame-options',  // Using CSP frame-ancestors instead
      'missing-referrer-policy',  // Intentionally permissive
    ],
  });

  await driver.quit();
}

async function focusOnForms() {
  const driver: WebDriver = await new Builder().forBrowser('chrome').build();
  await driver.get('https://your-app.com');

  const auditor = new SecurityAuditor(driver);

  // Focus audit on form security only
  // Note: WebDriver cannot access HTTP response headers,
  // so 'headers', 'csp', 'cors' categories won't find issues
  const results = await auditor.audit({
    include: ['forms', 'links', 'cookies'],
  });

  console.log('Form Security Report:');
  results.violations.forEach(v => {
    console.log(`- [${v.rule?.severity}] ${v.message}`);
  });

  await driver.quit();
}

async function focusOnClientSide() {
  const driver: WebDriver = await new Builder().forBrowser('chrome').build();
  await driver.get('https://your-app.com');

  const auditor = new SecurityAuditor(driver);

  // Focus on client-side vulnerabilities
  const results = await auditor.audit({
    include: [
      'inline-handlers',
      'dom-clobbering',
      'prototype-pollution',
      'html-injection',
      'sensitive-data',
    ],
  });

  console.log('Client-Side Security Report:');
  console.log(`Found ${results.summary.total} potential XSS vectors`);

  await driver.quit();
}

// Run examples
(async () => {
  console.log('Testing category filtering...');
  await includeCategories();
  await excludeCategories();
  await skipSpecificRules();
  await focusOnForms();
  await focusOnClientSide();
  console.log('Done!');
})().catch(console.error);
