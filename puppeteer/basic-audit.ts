/**
 * Basic Security Audit Example for Puppeteer
 *
 * This example shows the simplest way to add security scanning
 * to your Puppeteer scripts.
 */

import puppeteer from 'puppeteer';
import { SecurityAuditor } from 'qastell';

async function basicAudit() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Navigate to your application
  await page.goto('https://example.com');

  // Create auditor and run scan
  const auditor = new SecurityAuditor(page);
  const results = await auditor.audit();

  // Log summary for visibility
  console.log(`Found ${results.summary.total} issues`);
  console.log(`Critical: ${results.summary.bySeverity.critical}`);
  console.log(`High: ${results.summary.bySeverity.high}`);

  // Assert no violations (will throw if any issues found)
  await auditor.assertNoViolations();

  await browser.close();
}

async function auditMultiplePages() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const pagesToAudit = [
    'https://example.com/',
    'https://example.com/login',
    'https://example.com/dashboard',
  ];

  for (const url of pagesToAudit) {
    await page.goto(url, { waitUntil: 'networkidle0' });
    const auditor = new SecurityAuditor(page);
    await auditor.assertNoViolations();
    console.log(`✓ ${url} passed security audit`);
  }

  await browser.close();
}

async function auditAfterInteractions() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://example.com/login');

  // Perform login
  await page.type('#email', 'test@example.com');
  await page.type('#password', 'password123');
  await page.click('button[type="submit"]');

  // Wait for navigation
  await page.waitForNavigation();

  // Audit the authenticated page
  const auditor = new SecurityAuditor(page);
  await auditor.assertNoViolations();

  await browser.close();
}

// Run the examples
(async () => {
  console.log('Running basic audit...');
  await basicAudit();

  console.log('\nRunning multi-page audit...');
  await auditMultiplePages();

  console.log('\nRunning post-interaction audit...');
  await auditAfterInteractions();
})().catch(console.error);
