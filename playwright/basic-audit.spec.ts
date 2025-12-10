/**
 * Basic Security Audit Example
 *
 * This example shows the simplest way to add security scanning
 * to your existing Playwright tests.
 */

import { test, expect } from '@playwright/test';
import { SecurityAuditor } from 'qastell';

test.describe('Security Audit', () => {
  test('should pass security audit on homepage', async ({ page }) => {
    // Navigate to your application
    await page.goto('https://example.com');

    // Create auditor and run scan
    const auditor = new SecurityAuditor(page);
    const results = await auditor.audit();

    // Log summary for visibility
    console.log(`Found ${results.summary.total} issues`);
    console.log(`Critical: ${results.summary.bySeverity.critical}`);
    console.log(`High: ${results.summary.bySeverity.high}`);

    // Assert no violations (will fail if any issues found)
    await auditor.assertNoViolations();
  });

  test('should audit multiple pages', async ({ page }) => {
    const pagesToAudit = [
      'https://example.com/',
      'https://example.com/login',
      'https://example.com/dashboard',
    ];

    const auditor = new SecurityAuditor(page);

    for (const url of pagesToAudit) {
      await page.goto(url);
      await auditor.assertNoViolations();
      console.log(`✓ ${url} passed security audit`);
    }
  });

  test('should audit after user interactions', async ({ page }) => {
    await page.goto('https://example.com/login');

    // Perform login
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'password123');
    await page.click('button[type="submit"]');

    // Wait for navigation
    await page.waitForURL('**/dashboard');

    // Audit the authenticated page
    const auditor = new SecurityAuditor(page);
    await auditor.assertNoViolations();
  });
});
