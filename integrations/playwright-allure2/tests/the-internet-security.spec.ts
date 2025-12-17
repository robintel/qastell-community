/**
 * QAstell + Playwright + Allure 2 (Stable) Integration Example
 *
 * This example demonstrates real-world security auditing with results
 * attached to Allure 2 reports.
 *
 * Uses https://the-internet.herokuapp.com - a reliable test automation
 * demo site with forms, login pages, and various UI patterns.
 *
 * Allure 2 is the stable version of the Allure reporting framework.
 * It requires Java to generate reports.
 */

import { test, expect, Page } from '@playwright/test';
import { SecurityAuditor, AuditResults, VERSION, getTierDisplayName } from 'qastell';
import { allure } from 'allure-playwright';

const BASE_URL = 'https://the-internet.herokuapp.com';

// Get QAstell info string from audit results
function getQAstellInfo(results: AuditResults): string {
  const tierName = getTierDisplayName(results.tier);
  return `QAstell v${VERSION} (${tierName})`;
}

// Helper to wait for page to be ready
async function waitForPageReady(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout: 30000 });
}

// Attach security results to Allure report
async function attachSecurityResults(results: AuditResults): Promise<void> {
  const { summary } = results;

  // Add severity label based on findings
  if (summary.bySeverity.critical > 0) {
    await allure.severity('critical');
  } else if (summary.bySeverity.high > 0) {
    await allure.severity('blocker');
  } else if (summary.bySeverity.medium > 0) {
    await allure.severity('normal');
  } else {
    await allure.severity('minor');
  }

  // Add QAstell label
  await allure.label('qastell', getQAstellInfo(results));

  // Attach HTML summary report
  const summaryHtml = results.toSummaryHTML();
  await allure.attachment('QAstell Security Summary', summaryHtml, 'text/html');

  // Attach full HTML report
  const fullHtml = results.toHTML();
  await allure.attachment('QAstell Full Report', fullHtml, 'text/html');
}

test.describe('Security Audit Demo @security', () => {
  test.setTimeout(60000);

  test('should audit the homepage', async ({ page }) => {
    await allure.epic('Security');
    await allure.feature('Homepage Security');
    await allure.story('Landing Page Audit');

    await page.goto(BASE_URL);
    await waitForPageReady(page);

    const auditor = new SecurityAuditor(page);
    const results = await auditor.audit();

    await attachSecurityResults(results);

    await allure.step(`Found ${results.summary.total} security issues`, async () => {
      await allure.logStep(`Critical: ${results.summary.bySeverity.critical}`);
      await allure.logStep(`High: ${results.summary.bySeverity.high}`);
      await allure.logStep(`Medium: ${results.summary.bySeverity.medium}`);
      await allure.logStep(`Low: ${results.summary.bySeverity.low}`);
    });

    expect(results.passed(), `Security audit failed with ${results.summary.total} violations`).toBe(true);
  });

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

    await attachSecurityResults(results);

    const formIssues = results.violations.filter((v) => v.rule?.category === 'forms');

    await allure.step(`Form vulnerabilities: ${formIssues.length}`, async () => {
      for (const issue of formIssues.slice(0, 5)) {
        await allure.logStep(`${issue.rule?.name}: ${issue.element.selector}`);
      }
    });

    console.log(`Login Page: ${results.summary.total} form-related issues`);

    expect(results.passed(), `Security audit failed with ${results.summary.total} violations`).toBe(true);
  });

  test('should audit the form authentication page', async ({ page }) => {
    await allure.epic('Security');
    await allure.feature('Authentication Security');
    await allure.story('Form Auth Page Audit');

    await page.goto(`${BASE_URL}/authenticate`);
    await waitForPageReady(page);

    const auditor = new SecurityAuditor(page);
    const results = await auditor.audit();

    await attachSecurityResults(results);

    await allure.logStep(`Form Auth Page: ${results.summary.total} issues`);

    console.log(`Form Auth Page: ${results.summary.total} issues`);

    expect(results.passed(), `Security audit failed with ${results.summary.total} violations`).toBe(true);
  });

  test('should audit dynamic content page', async ({ page }) => {
    await allure.epic('Security');
    await allure.feature('Dynamic Content');
    await allure.story('Dynamic Content Audit');

    await page.goto(`${BASE_URL}/dynamic_content`);
    await waitForPageReady(page);

    const auditor = new SecurityAuditor(page);
    const results = await auditor.audit();

    await attachSecurityResults(results);

    await allure.logStep(`Dynamic Content Page: ${results.summary.total} issues`);

    console.log(`Dynamic Content Page: ${results.summary.total} issues`);

    expect(results.passed(), `Security audit failed with ${results.summary.total} violations`).toBe(true);
  });

  test('should audit the checkboxes page', async ({ page }) => {
    await allure.epic('Security');
    await allure.feature('Form Elements');
    await allure.story('Checkboxes Audit');

    await page.goto(`${BASE_URL}/checkboxes`);
    await waitForPageReady(page);

    const auditor = new SecurityAuditor(page);
    const results = await auditor.audit();

    await attachSecurityResults(results);

    await allure.logStep(`Checkboxes Page: ${results.summary.total} issues`);

    console.log(`Checkboxes Page: ${results.summary.total} issues`);

    expect(results.passed(), `Security audit failed with ${results.summary.total} violations`).toBe(true);
  });

  test('should audit the dropdown page', async ({ page }) => {
    await allure.epic('Security');
    await allure.feature('Form Elements');
    await allure.story('Dropdown Audit');

    await page.goto(`${BASE_URL}/dropdown`);
    await waitForPageReady(page);

    const auditor = new SecurityAuditor(page);
    const results = await auditor.audit();

    await attachSecurityResults(results);

    await allure.logStep(`Dropdown Page: ${results.summary.total} issues`);

    console.log(`Dropdown Page: ${results.summary.total} issues`);

    expect(results.passed(), `Security audit failed with ${results.summary.total} violations`).toBe(true);
  });

  test('should audit the inputs page', async ({ page }) => {
    await allure.epic('Security');
    await allure.feature('Form Elements');
    await allure.story('Inputs Audit');

    await page.goto(`${BASE_URL}/inputs`);
    await waitForPageReady(page);

    const auditor = new SecurityAuditor(page);
    const results = await auditor.audit();

    await attachSecurityResults(results);

    await allure.logStep(`Inputs Page: ${results.summary.total} issues`);

    console.log(`Inputs Page: ${results.summary.total} issues`);

    expect(results.passed(), `Security audit failed with ${results.summary.total} violations`).toBe(true);
  });
});

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

    await attachSecurityResults(results);

    await allure.step('Severity Distribution', async () => {
      const { bySeverity } = results.summary;

      if (bySeverity.critical > 0) {
        await allure.step(`CRITICAL (${bySeverity.critical}) - Immediate action required`, async () => {
          const criticals = results.violations.filter((v) => v.rule?.severity === 'critical');
          for (const v of criticals) {
            await allure.logStep(`${v.rule?.name}`);
          }
        });
      }

      if (bySeverity.high > 0) {
        await allure.logStep(`HIGH (${bySeverity.high}) - Should be fixed soon`);
      }

      if (bySeverity.medium > 0) {
        await allure.logStep(`MEDIUM (${bySeverity.medium}) - Should be addressed`);
      }

      if (bySeverity.low > 0) {
        await allure.logStep(`LOW (${bySeverity.low}) - Minor issues`);
      }

      if (bySeverity.info > 0) {
        await allure.logStep(`INFO (${bySeverity.info}) - Informational`);
      }
    });

    const totalFromSeverities =
      results.summary.bySeverity.critical +
      results.summary.bySeverity.high +
      results.summary.bySeverity.medium +
      results.summary.bySeverity.low +
      results.summary.bySeverity.info;

    expect(results.summary.total).toBe(totalFromSeverities);
  });
});

test.describe('Report Size Comparison @security', () => {
  test.setTimeout(60000);

  test('summary HTML should be smaller than full report', async ({ page }) => {
    await allure.epic('Security');
    await allure.feature('Report Generation');

    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    const auditor = new SecurityAuditor(page);
    const results = await auditor.audit();

    const fullHtml = results.toHTML();
    const summaryHtml = results.toSummaryHTML();

    await allure.step('Report Size Analysis', async () => {
      await allure.logStep(`Full report: ${Math.round(fullHtml.length / 1024)}KB`);
      await allure.logStep(`Summary report: ${Math.round(summaryHtml.length / 1024)}KB`);
      await allure.logStep(`Reduction: ${Math.round((1 - summaryHtml.length / fullHtml.length) * 100)}%`);
    });

    console.log(`Full report: ${Math.round(fullHtml.length / 1024)}KB`);
    console.log(`Summary report: ${Math.round(summaryHtml.length / 1024)}KB`);

    expect(summaryHtml.length).toBeLessThan(fullHtml.length * 0.5);

    await attachSecurityResults(results);
  });
});
