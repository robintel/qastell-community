/**
 * CI/CD Integration Example
 *
 * Patterns for integrating QAstell into your continuous
 * integration and deployment pipelines.
 */

import { test, expect } from '@playwright/test';
import { SecurityAuditor, initLicense, getLicenseUsage } from 'qastell';
import * as fs from 'fs';
import * as path from 'path';

// Initialize license from environment variable
// Set QASTELL_LICENSE in your CI environment
test.beforeAll(() => {
  const license = initLicense(process.env.QASTELL_LICENSE);
  console.log(`QAstell initialized: ${license.tier} tier`);

  const usage = getLicenseUsage();
  console.log(`Scans remaining today: ${usage.remaining}`);
});

test.describe('CI Pipeline Security Scans', () => {
  test('fast smoke test for PRs', async ({ page }) => {
    // Quick scan focusing on critical issues only
    await page.goto(process.env.APP_URL || 'https://staging.example.com');

    const auditor = new SecurityAuditor(page);

    // Fast scan: only critical categories
    await auditor.assertNoViolations({
      include: ['csp', 'headers', 'forms'],
      thresholds: {
        info: 999,
        low: 999,
        medium: 10,
        high: 0,
        critical: 0,
      },
    });
  });

  test('comprehensive scan for main branch', async ({ page }) => {
    // Full scan with zero tolerance
    await page.goto(process.env.APP_URL || 'https://staging.example.com');

    const auditor = new SecurityAuditor(page);
    const results = await auditor.audit();

    // Save artifacts for CI
    const artifactsDir = process.env.CI_ARTIFACTS_DIR || './test-results';
    if (!fs.existsSync(artifactsDir)) {
      fs.mkdirSync(artifactsDir, { recursive: true });
    }

    // Always save HTML report as artifact
    const reportPath = path.join(artifactsDir, 'security-report.html');
    fs.writeFileSync(reportPath, results.toHTML());

    // Log summary for CI output
    console.log('=== Security Audit Summary ===');
    console.log(`Total issues: ${results.summary.total}`);
    console.log(`Critical: ${results.summary.bySeverity.critical}`);
    console.log(`High: ${results.summary.bySeverity.high}`);
    console.log(`Medium: ${results.summary.bySeverity.medium}`);
    console.log(`Low: ${results.summary.bySeverity.low}`);
    console.log(`Info: ${results.summary.bySeverity.info}`);
    console.log(`Report: ${reportPath}`);

    // Fail if any high or critical issues
    const severeCount = results.summary.bySeverity.critical + results.summary.bySeverity.high;
    expect(severeCount, `Found ${severeCount} severe security issues`).toBe(0);
  });

  test('audit staging environment before deploy', async ({ page }) => {
    const stagingUrl = process.env.STAGING_URL;
    if (!stagingUrl) {
      test.skip(true, 'STAGING_URL not set');
    }

    await page.goto(stagingUrl!);

    const auditor = new SecurityAuditor(page);
    const results = await auditor.audit();

    // Block deployment on critical issues
    if (results.summary.bySeverity.critical > 0) {
      console.error('DEPLOYMENT BLOCKED: Critical security issues found');
      console.error('Review the security report before deploying to production');

      // Save report for review
      fs.writeFileSync('./security-block-report.html', results.toHTML());
    }

    expect(results.summary.bySeverity.critical).toBe(0);
  });
});

test.describe('Multi-Environment Scanning', () => {
  const environments = [
    { name: 'staging', url: process.env.STAGING_URL },
    { name: 'production', url: process.env.PRODUCTION_URL },
  ].filter(env => env.url); // Only test configured environments

  for (const { name, url } of environments) {
    test(`security audit: ${name}`, async ({ page }) => {
      await page.goto(url!);

      const auditor = new SecurityAuditor(page);
      const results = await auditor.audit();

      // Environment-specific thresholds
      const thresholds = name === 'production'
        ? { critical: 0, high: 0, medium: 0, low: 5, info: 999 }
        : { critical: 0, high: 0, medium: 5, low: 999, info: 999 };

      // Log findings
      console.log(`[${name}] Total issues: ${results.summary.total}`);

      // Assert based on environment
      await auditor.assertNoViolations({ thresholds });
    });
  }
});

test.describe('Scheduled Full Scan', () => {
  // Run this on a schedule (e.g., nightly) for comprehensive coverage
  test('full application security scan', async ({ page }) => {
    const baseUrl = process.env.APP_URL || 'https://example.com';

    const pagesToScan = [
      '/',
      '/login',
      '/register',
      '/dashboard',
      '/settings',
      '/api-docs',
      '/contact',
    ];

    const auditor = new SecurityAuditor(page);
    const allResults: { url: string; issues: number; critical: number }[] = [];

    for (const path of pagesToScan) {
      const url = `${baseUrl}${path}`;

      try {
        await page.goto(url, { timeout: 30000 });
        const results = await auditor.audit();

        allResults.push({
          url,
          issues: results.summary.total,
          critical: results.summary.bySeverity.critical,
        });

        console.log(`[${path}] ${results.summary.total} issues`);
      } catch (error) {
        console.warn(`[${path}] Failed to scan: ${error}`);
      }
    }

    // Summary report
    console.log('\n=== Full Scan Summary ===');
    console.log(`Pages scanned: ${allResults.length}`);
    console.log(`Total issues: ${allResults.reduce((sum, r) => sum + r.issues, 0)}`);
    console.log(`Critical issues: ${allResults.reduce((sum, r) => sum + r.critical, 0)}`);

    // Fail if any critical issues anywhere
    const totalCritical = allResults.reduce((sum, r) => sum + r.critical, 0);
    expect(totalCritical).toBe(0);
  });
});
