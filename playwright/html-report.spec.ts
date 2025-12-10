/**
 * HTML Report Generation Example
 *
 * Generate beautiful, interactive HTML reports for sharing
 * with your team or stakeholders.
 */

import { test, expect } from '@playwright/test';
import { SecurityAuditor } from 'qastell';
import * as fs from 'fs';
import * as path from 'path';

// Create reports directory
const reportsDir = path.join(__dirname, '../reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

test.describe('Security Reports', () => {
  test('generate HTML report for a single page', async ({ page }) => {
    await page.goto('https://example.com');

    const auditor = new SecurityAuditor(page);
    const results = await auditor.audit();

    // Generate HTML report
    const html = results.toHTML();

    // Save to file
    const reportPath = path.join(reportsDir, 'security-report.html');
    fs.writeFileSync(reportPath, html);

    console.log(`Report saved to: ${reportPath}`);

    // Still assert no violations in CI
    expect(results.passed()).toBe(true);
  });

  test('generate timestamped reports', async ({ page }) => {
    await page.goto('https://example.com');

    const auditor = new SecurityAuditor(page);
    const results = await auditor.audit();

    // Create timestamped filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join(reportsDir, `security-${timestamp}.html`);

    fs.writeFileSync(reportPath, results.toHTML());
    console.log(`Report saved to: ${reportPath}`);
  });

  test('generate reports for multiple pages', async ({ page }) => {
    const pages = [
      { url: 'https://example.com/', name: 'homepage' },
      { url: 'https://example.com/login', name: 'login' },
      { url: 'https://example.com/dashboard', name: 'dashboard' },
    ];

    const auditor = new SecurityAuditor(page);

    for (const { url, name } of pages) {
      await page.goto(url);
      const results = await auditor.audit();

      const reportPath = path.join(reportsDir, `${name}-security.html`);
      fs.writeFileSync(reportPath, results.toHTML());

      console.log(`${name}: ${results.summary.total} issues (saved to ${reportPath})`);
    }
  });

  test('conditional reporting based on findings', async ({ page }) => {
    await page.goto('https://example.com');

    const auditor = new SecurityAuditor(page);
    const results = await auditor.audit();

    // Only generate report if issues found
    if (results.summary.total > 0) {
      const reportPath = path.join(reportsDir, 'issues-found.html');
      fs.writeFileSync(reportPath, results.toHTML());
      console.log(`Issues found! Report saved to: ${reportPath}`);
    }

    // Only generate report for critical/high issues
    const severeIssues = results.summary.bySeverity.critical + results.summary.bySeverity.high;
    if (severeIssues > 0) {
      const reportPath = path.join(reportsDir, 'severe-issues.html');
      fs.writeFileSync(reportPath, results.toHTML());
      console.error(`${severeIssues} severe issues found! Review: ${reportPath}`);
    }
  });
});

test.describe('JSON Reports (Enterprise+)', () => {
  test('generate JSON report for automation', async ({ page }) => {
    await page.goto('https://example.com');

    const auditor = new SecurityAuditor(page);
    const results = await auditor.audit();

    // JSON reports require Enterprise or Corporate license
    try {
      const json = results.toJSON();
      const reportPath = path.join(reportsDir, 'security-report.json');
      fs.writeFileSync(reportPath, json);
      console.log(`JSON report saved to: ${reportPath}`);
    } catch (error) {
      console.log('JSON reports require Enterprise license or higher');
    }
  });
});

test.describe('SARIF Reports (Corporate)', () => {
  test('generate SARIF for GitHub/GitLab integration', async ({ page }) => {
    await page.goto('https://example.com');

    const auditor = new SecurityAuditor(page);
    const results = await auditor.audit();

    // SARIF reports require Corporate license
    try {
      const sarif = results.toSARIF();
      const reportPath = path.join(reportsDir, 'security-report.sarif');
      fs.writeFileSync(reportPath, sarif);
      console.log(`SARIF report saved to: ${reportPath}`);
    } catch (error) {
      console.log('SARIF reports require Corporate license');
    }
  });
});
