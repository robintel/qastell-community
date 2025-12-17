/**
 * QAstell + Playwright + Allure Reporter Integration Example
 *
 * This example demonstrates real-world security auditing with results
 * attached to Allure reports.
 *
 * Uses https://the-internet.herokuapp.com - a reliable test automation
 * demo site with forms, login pages, and various UI patterns.
 *
 * Allure is a powerful test reporting framework that provides:
 * - Rich HTML reports with history
 * - Attachments (including HTML)
 * - Labels for filtering and categorization
 * - Trend analysis over time
 */

import { test, expect, Page } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { SecurityAuditor } from 'qastell';
import { AllureConnector } from 'qastell/connectors';

const connector = new AllureConnector();
const BASE_URL = 'https://the-internet.herokuapp.com';

// Helper to wait for page to be ready
async function waitForPageReady(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout: 30000 });
}

test.describe('Security Audit Demo @security', () => {
  test.setTimeout(60000);

  /**
   * Test the main landing page
   */
  test('should audit the homepage', async ({ page }) => {
    // Add Allure metadata
    await allure.epic('Security');
    await allure.feature('Homepage Security');
    await allure.story('Landing Page Audit');

    await page.goto(BASE_URL);
    await waitForPageReady(page);

    const auditor = new SecurityAuditor(page);
    const results = await auditor.audit();

    // Attach summary to Allure report (also saves full HTML report to disk)
    // The AllureConnector adds labels for filtering
    // Use attachFullReport: true to also embed the full HTML report as a downloadable attachment
    await connector.attachSummary(results, allure, { attachFullReport: true });

    // Add custom Allure step for visibility
    await allure.step(`Found ${results.summary.total} security issues`, async () => {
      await allure.step(`Critical: ${results.summary.bySeverity.critical}`, async () => {});
      await allure.step(`High: ${results.summary.bySeverity.high}`, async () => {});
      await allure.step(`Medium: ${results.summary.bySeverity.medium}`, async () => {});
      await allure.step(`Low: ${results.summary.bySeverity.low}`, async () => {});
    });

    // Fail test if audit fails (critical/high severity issues found)
    expect(results.passed(), `Security audit failed with ${results.summary.total} violations`).toBe(true);
  });

  /**
   * Test the login page - forms are common attack vectors
   */
  test('should audit the login page', async ({ page }) => {
    await allure.epic('Security');
    await allure.feature('Authentication Security');
    await allure.story('Login Page Audit');

    await page.goto(`${BASE_URL}/login`);
    await waitForPageReady(page);

    const auditor = new SecurityAuditor(page);
    const results = await auditor.audit({
      include: ['forms', 'sensitive-data', 'headers'],
    });

    await connector.attachSummary(results, allure, {
      summaryName: 'Login Page Security Summary',
    });

    // Count form-specific issues
    const formIssues = results.violations.filter((v) => v.rule?.category === 'forms');

    await allure.step(`Form vulnerabilities: ${formIssues.length}`, async () => {
      for (const issue of formIssues.slice(0, 5)) {
        await allure.step(`${issue.rule?.name}: ${issue.element.selector}`, async () => {});
      }
    });

    console.log(`Login Page: ${results.summary.total} form-related issues`);

    // Fail test if audit fails
    expect(results.passed(), `Security audit failed with ${results.summary.total} violations`).toBe(true);
  });

  /**
   * Test the form authentication page
   */
  test('should audit the form authentication page', async ({ page }) => {
    await allure.epic('Security');
    await allure.feature('Authentication Security');
    await allure.story('Form Auth Page Audit');

    await page.goto(`${BASE_URL}/authenticate`);
    await waitForPageReady(page);

    const auditor = new SecurityAuditor(page);
    const results = await auditor.audit();

    await connector.attachSummary(results, allure);

    await allure.step(`Form Auth Page: ${results.summary.total} issues`, async () => {});

    console.log(`Form Auth Page: ${results.summary.total} issues`);

    // Fail test if audit fails
    expect(results.passed(), `Security audit failed with ${results.summary.total} violations`).toBe(true);
  });

  /**
   * Test a page with dynamic content
   */
  test('should audit dynamic content page', async ({ page }) => {
    await allure.epic('Security');
    await allure.feature('Dynamic Content');
    await allure.story('Dynamic Content Audit');

    await page.goto(`${BASE_URL}/dynamic_content`);
    await waitForPageReady(page);

    const auditor = new SecurityAuditor(page);
    const results = await auditor.audit();

    await connector.attachSummary(results, allure);

    await allure.step(`Dynamic Content Page: ${results.summary.total} issues`, async () => {});

    console.log(`Dynamic Content Page: ${results.summary.total} issues`);

    // Fail test if audit fails
    expect(results.passed(), `Security audit failed with ${results.summary.total} violations`).toBe(true);
  });

  /**
   * Test the checkboxes page
   */
  test('should audit the checkboxes page', async ({ page }) => {
    await allure.epic('Security');
    await allure.feature('Form Elements');
    await allure.story('Checkboxes Audit');

    await page.goto(`${BASE_URL}/checkboxes`);
    await waitForPageReady(page);

    const auditor = new SecurityAuditor(page);
    const results = await auditor.audit();

    await connector.attachSummary(results, allure);

    await allure.step(`Checkboxes Page: ${results.summary.total} issues`, async () => {});

    console.log(`Checkboxes Page: ${results.summary.total} issues`);

    // Fail test if audit fails
    expect(results.passed(), `Security audit failed with ${results.summary.total} violations`).toBe(true);
  });

  /**
   * Test the dropdown page
   */
  test('should audit the dropdown page', async ({ page }) => {
    await allure.epic('Security');
    await allure.feature('Form Elements');
    await allure.story('Dropdown Audit');

    await page.goto(`${BASE_URL}/dropdown`);
    await waitForPageReady(page);

    const auditor = new SecurityAuditor(page);
    const results = await auditor.audit();

    await connector.attachSummary(results, allure);

    await allure.step(`Dropdown Page: ${results.summary.total} issues`, async () => {});

    console.log(`Dropdown Page: ${results.summary.total} issues`);

    // Fail test if audit fails
    expect(results.passed(), `Security audit failed with ${results.summary.total} violations`).toBe(true);
  });

  /**
   * Test the inputs page
   */
  test('should audit the inputs page', async ({ page }) => {
    await allure.epic('Security');
    await allure.feature('Form Elements');
    await allure.story('Inputs Audit');

    await page.goto(`${BASE_URL}/inputs`);
    await waitForPageReady(page);

    const auditor = new SecurityAuditor(page);
    const results = await auditor.audit();

    await connector.attachSummary(results, allure);

    await allure.step(`Inputs Page: ${results.summary.total} issues`, async () => {});

    console.log(`Inputs Page: ${results.summary.total} issues`);

    // Fail test if audit fails
    expect(results.passed(), `Security audit failed with ${results.summary.total} violations`).toBe(true);
  });
});

/**
 * Severity breakdown tests
 */
test.describe('Security Severity Analysis @security', () => {
  test.setTimeout(60000);

  test('should categorize issues by severity', async ({ page }) => {
    await allure.epic('Security');
    await allure.feature('Severity Analysis');
    await allure.severity('normal');

    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    const auditor = new SecurityAuditor(page);
    const results = await auditor.audit();

    await connector.attachSummary(results, allure);

    // Create detailed severity breakdown
    await allure.step('Severity Distribution', async () => {
      const { bySeverity } = results.summary;

      if (bySeverity.critical > 0) {
        await allure.step(`CRITICAL (${bySeverity.critical}) - Immediate action required`, async () => {
          const criticals = results.violations.filter((v) => v.rule?.severity === 'critical');
          for (const v of criticals) {
            await allure.step(`${v.rule?.name}`, async () => {});
          }
        });
      }

      if (bySeverity.high > 0) {
        await allure.step(`HIGH (${bySeverity.high}) - Should be fixed soon`, async () => {});
      }

      if (bySeverity.medium > 0) {
        await allure.step(`MEDIUM (${bySeverity.medium}) - Should be addressed`, async () => {});
      }

      if (bySeverity.low > 0) {
        await allure.step(`LOW (${bySeverity.low}) - Minor issues`, async () => {});
      }

      if (bySeverity.info > 0) {
        await allure.step(`INFO (${bySeverity.info}) - Informational`, async () => {});
      }
    });

    // The summary total should match individual counts
    const totalFromSeverities =
      results.summary.bySeverity.critical +
      results.summary.bySeverity.high +
      results.summary.bySeverity.medium +
      results.summary.bySeverity.low +
      results.summary.bySeverity.info;

    expect(results.summary.total).toBe(totalFromSeverities);
  });
});

/**
 * Test comparing summary vs full report sizes
 */
test.describe('Report Size Comparison @security', () => {
  test.setTimeout(60000);

  test('summary HTML should be smaller than full report', async ({ page }) => {
    await allure.epic('Security');
    await allure.feature('Report Generation');

    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    const auditor = new SecurityAuditor(page);
    const results = await auditor.audit();

    // Get both report types
    const fullHtml = results.toHTML();
    const summaryHtml = results.toSummaryHTML();

    await allure.step('Report Size Analysis', async () => {
      await allure.step(`Full report: ${Math.round(fullHtml.length / 1024)}KB`, async () => {});
      await allure.step(`Summary report: ${Math.round(summaryHtml.length / 1024)}KB`, async () => {});
      await allure.step(
        `Reduction: ${Math.round((1 - summaryHtml.length / fullHtml.length) * 100)}%`,
        async () => {}
      );
    });

    console.log(`Full report: ${Math.round(fullHtml.length / 1024)}KB`);
    console.log(`Summary report: ${Math.round(summaryHtml.length / 1024)}KB`);

    // Summary should be significantly smaller
    expect(summaryHtml.length).toBeLessThan(fullHtml.length * 0.5);

    // Attach summary (full report is saved to disk automatically)
    await connector.attachSummary(results, allure);
  });
});

/**
 * Multi-page audit demonstration
 */
test.describe('Multi-Page Security Audit @security', () => {
  test.setTimeout(120000);

  test('should audit multiple pages and compare results', async ({ page }) => {
    await allure.epic('Security');
    await allure.feature('Multi-Page Audit');

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

      await allure.step(`${p.name}: ${results.summary.total} issues`, async () => {});

      console.log(`${p.name}: ${results.summary.total} issues`);
    }

    // Attach final summary
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    const finalResults = await auditor.audit();
    await connector.attachSummary(finalResults, allure, {
      summaryName: 'Multi-Page Audit Summary',
    });

    // Log overall summary
    console.log('\n=== Multi-Page Audit Summary ===');
    allResults.forEach((r) => {
      console.log(`  ${r.name}: ${r.total} total (${r.critical} critical, ${r.high} high)`);
    });
  });
});
