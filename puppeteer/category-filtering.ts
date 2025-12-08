/**
 * Category Filtering Example for Puppeteer
 *
 * This example shows how to include or exclude specific rule categories
 * to focus on areas most relevant to your application.
 */

import puppeteer from 'puppeteer';
import { SecurityAuditor } from 'qastell';

async function includeCategories() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://your-app.com');

  const auditor = new SecurityAuditor(page);

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

  await browser.close();
}

async function excludeCategories() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://your-app.com');

  const auditor = new SecurityAuditor(page);

  // Run all categories except specific ones
  await auditor.assertNoViolations({
    exclude: [
      'third-party',       // External scripts you can't control
      'sri',               // SRI for CDN resources (if using dynamic versions)
    ],
  });

  await browser.close();
}

async function skipSpecificRules() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://your-app.com');

  const auditor = new SecurityAuditor(page);

  // More granular: skip individual rules by ID
  await auditor.assertNoViolations({
    skipRules: [
      'missing-x-frame-options',  // Using CSP frame-ancestors instead
      'missing-referrer-policy',  // Intentionally permissive
    ],
  });

  await browser.close();
}

async function focusOnHeaders() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://your-app.com');

  const auditor = new SecurityAuditor(page);

  // Focus audit on security headers only
  const results = await auditor.audit({
    include: ['headers', 'csp', 'cors'],
  });

  console.log('Security Headers Report:');
  results.violations.forEach(v => {
    console.log(`- [${v.rule?.severity}] ${v.message}`);
  });

  await browser.close();
}

async function focusOnClientSide() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://your-app.com');

  const auditor = new SecurityAuditor(page);

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

  await browser.close();
}

// Run examples
(async () => {
  console.log('Testing category filtering...');
  await includeCategories();
  await excludeCategories();
  await skipSpecificRules();
  await focusOnHeaders();
  await focusOnClientSide();
  console.log('Done!');
})().catch(console.error);
