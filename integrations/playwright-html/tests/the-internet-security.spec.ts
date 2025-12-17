/**
 * QAstell + Playwright + HTML Reporter Integration Example
 *
 * This example demonstrates real-world security auditing with results
 * attached to Playwright's HTML report.
 *
 * Uses https://the-internet.herokuapp.com - a reliable test automation
 * demo site with forms, login pages, and various UI patterns.
 */

import { test, expect, Page } from '@playwright/test';
import { SecurityAuditor } from 'qastell';
import { PlaywrightConnector } from 'qastell/connectors';

// Create a shared connector instance to aggregate all results
const connector = new PlaywrightConnector({ outputDir: 'playwright-report' });
const BASE_URL = 'https://the-internet.herokuapp.com';

// Helper to wait for page to be ready
async function waitForPageReady(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout: 30000 });
}

test.describe('Security Audit Demo @security', () => {
  test.setTimeout(60000);

  // Note: Aggregated report is generated via global teardown (see playwright.config.ts)

  /**
   * Test the main landing page
   */
  test('should audit the homepage', async ({ page }, testInfo) => {
    await page.goto(BASE_URL);
    await waitForPageReady(page);

    const auditor = new SecurityAuditor(page);
    const results = await auditor.audit();

    // Attach summary to Playwright HTML report
    await connector.attachSummary(results, testInfo);

    console.log(`Homepage: ${results.summary.total} issues found`);
    console.log(`  Critical: ${results.summary.bySeverity.critical}`);
    console.log(`  High: ${results.summary.bySeverity.high}`);
    console.log(`  Medium: ${results.summary.bySeverity.medium}`);

    // Fail test if audit fails (critical/high severity issues found)
    expect(results.passed(), `Security audit failed with ${results.summary.total} violations`).toBe(true);
  });

  /**
   * Test the login page - forms are common attack vectors
   */
  test('should audit the login page', async ({ page }, testInfo) => {
    await page.goto(`${BASE_URL}/login`);
    await waitForPageReady(page);

    const auditor = new SecurityAuditor(page);

    // Focus on form-related security rules
    const results = await auditor.audit({
      include: ['forms', 'sensitive-data', 'headers'],
    });

    // Attach summary to report
    await connector.attachSummary(results, testInfo, {
      summaryName: 'Login Page Security Summary',
    });

    console.log(`Login Page: ${results.summary.total} form-related issues`);

    // Check specific form vulnerabilities
    const formViolations = results.violations.filter(
      (v) => v.rule?.category === 'forms'
    );
    console.log(`  Form vulnerabilities: ${formViolations.length}`);

    // Log specific issues for debugging
    formViolations.forEach((v) => {
      console.log(`    - ${v.rule?.name}: ${v.element.selector}`);
    });

    // Fail test if audit fails
    expect(results.passed(), `Security audit failed with ${results.summary.total} violations`).toBe(true);
  });

  /**
   * Test the form authentication page
   */
  test('should audit the form authentication page', async ({ page }, testInfo) => {
    await page.goto(`${BASE_URL}/authenticate`);
    await waitForPageReady(page);

    const auditor = new SecurityAuditor(page);
    const results = await auditor.audit();

    await connector.attachSummary(results, testInfo, {
      summaryName: 'Form Auth Security Summary',
    });

    console.log(`Form Auth Page: ${results.summary.total} issues`);

    // Fail test if audit fails
    expect(results.passed(), `Security audit failed with ${results.summary.total} violations`).toBe(true);
  });

  /**
   * Test a page with dynamic content
   */
  test('should audit dynamic content page', async ({ page }, testInfo) => {
    await page.goto(`${BASE_URL}/dynamic_content`);
    await waitForPageReady(page);

    const auditor = new SecurityAuditor(page);
    const results = await auditor.audit();

    await connector.attachSummary(results, testInfo, {
      summaryName: 'Dynamic Content Security Summary',
    });

    console.log(`Dynamic Content Page: ${results.summary.total} issues`);

    // Fail test if audit fails
    expect(results.passed(), `Security audit failed with ${results.summary.total} violations`).toBe(true);
  });

  /**
   * Test the checkboxes page
   */
  test('should audit the checkboxes page', async ({ page }, testInfo) => {
    await page.goto(`${BASE_URL}/checkboxes`);
    await waitForPageReady(page);

    const auditor = new SecurityAuditor(page);
    const results = await auditor.audit();

    await connector.attachSummary(results, testInfo);

    console.log(`Checkboxes Page: ${results.summary.total} issues`);

    // Fail test if audit fails
    expect(results.passed(), `Security audit failed with ${results.summary.total} violations`).toBe(true);
  });

  /**
   * Test the dropdown page
   */
  test('should audit the dropdown page', async ({ page }, testInfo) => {
    await page.goto(`${BASE_URL}/dropdown`);
    await waitForPageReady(page);

    const auditor = new SecurityAuditor(page);
    const results = await auditor.audit();

    await connector.attachSummary(results, testInfo);

    console.log(`Dropdown Page: ${results.summary.total} issues`);

    // Fail test if audit fails
    expect(results.passed(), `Security audit failed with ${results.summary.total} violations`).toBe(true);
  });

  /**
   * Test the inputs page
   */
  test('should audit the inputs page', async ({ page }, testInfo) => {
    await page.goto(`${BASE_URL}/inputs`);
    await waitForPageReady(page);

    const auditor = new SecurityAuditor(page);
    const results = await auditor.audit();

    await connector.attachSummary(results, testInfo);

    console.log(`Inputs Page: ${results.summary.total} issues`);

    // Fail test if audit fails
    expect(results.passed(), `Security audit failed with ${results.summary.total} violations`).toBe(true);
  });
});

/**
 * Test comparing summary vs full report sizes
 */
test.describe('Report Size Comparison @security', () => {
  test.setTimeout(60000);

  test('summary HTML should be smaller than full report', async ({ page }, testInfo) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    const auditor = new SecurityAuditor(page);
    const results = await auditor.audit();

    // Get both report types
    const fullHtml = results.toHTML();
    const summaryHtml = results.toSummaryHTML();

    console.log(`Full report: ${Math.round(fullHtml.length / 1024)}KB`);
    console.log(`Summary report: ${Math.round(summaryHtml.length / 1024)}KB`);
    console.log(`Reduction: ${Math.round((1 - summaryHtml.length / fullHtml.length) * 100)}%`);

    // Summary should be significantly smaller
    expect(summaryHtml.length).toBeLessThan(fullHtml.length * 0.5);

    // Attach summary (results collected for aggregated report)
    await connector.attachSummary(results, testInfo);
  });
});

/**
 * Multi-page audit demonstration
 */
test.describe('Multi-Page Security Audit @security', () => {
  test.setTimeout(120000);

  test('should audit multiple pages and compare results', async ({ page }, testInfo) => {
    const pages = [
      { path: '/', name: 'Homepage' },
      { path: '/login', name: 'Login' },
      { path: '/dropdown', name: 'Dropdown' },
      { path: '/checkboxes', name: 'Checkboxes' },
    ];

    const auditor = new SecurityAuditor(page);
    const allResults: { name: string; total: number; critical: number; high: number }[] = [];

    for (const p of pages) {
      await page.goto(`${BASE_URL}${p.path}`);
      await page.waitForLoadState('networkidle');

      const results = await auditor.audit();

      allResults.push({
        name: p.name,
        total: results.summary.total,
        critical: results.summary.bySeverity.critical,
        high: results.summary.bySeverity.high,
      });

      console.log(`${p.name}: ${results.summary.total} issues`);
    }

    // Attach final summary
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    const finalResults = await auditor.audit();
    await connector.attachSummary(finalResults, testInfo, {
      summaryName: 'Multi-Page Audit Summary',
    });

    // Log overall summary
    console.log('\n=== Multi-Page Audit Summary ===');
    allResults.forEach((r) => {
      console.log(`  ${r.name}: ${r.total} total (${r.critical} critical, ${r.high} high)`);
    });
  });
});
