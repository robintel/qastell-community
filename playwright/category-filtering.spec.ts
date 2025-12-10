/**
 * Category Filtering Example
 *
 * Include or exclude specific rule categories to focus your scans
 * on what matters most for your application.
 */

import { test, expect } from '@playwright/test';
import { SecurityAuditor } from 'qastell';

test.describe('Filtered Security Audits', () => {
  test('scan only for XSS-related issues', async ({ page }) => {
    await page.goto('https://example.com');

    const auditor = new SecurityAuditor(page);

    // Only run rules in these categories
    const results = await auditor.audit({
      include: [
        'inline-handlers',   // onclick, onerror, etc.
        'dom-clobbering',    // DOM pollution attacks
        'mutation-xss',      // mXSS vulnerabilities
        'html-injection',    // HTML injection points
      ],
    });

    console.log(`XSS scan found ${results.summary.total} issues`);
    await auditor.assertNoViolations({ include: ['inline-handlers', 'dom-clobbering'] });
  });

  test('scan everything except third-party issues', async ({ page }) => {
    await page.goto('https://example.com');

    const auditor = new SecurityAuditor(page);

    // Exclude categories you can't control
    await auditor.assertNoViolations({
      exclude: [
        'third-party',       // External scripts
        'sri',               // SRI for CDN resources
      ],
    });
  });

  test('focus on header security', async ({ page }) => {
    await page.goto('https://example.com');

    const auditor = new SecurityAuditor(page);

    const results = await auditor.audit({
      include: [
        'headers',           // Security headers
        'csp',               // Content Security Policy
        'cors',              // CORS configuration
        'cookies',           // Cookie security
        'permissions-policy', // Permissions Policy
      ],
    });

    // Check specific findings
    if (results.summary.byCategory.csp > 0) {
      console.warn('CSP issues detected - review Content-Security-Policy header');
    }

    if (results.summary.byCategory.cookies > 0) {
      console.warn('Cookie security issues - check Secure, HttpOnly, SameSite flags');
    }
  });

  test('skip specific rules by ID', async ({ page }) => {
    await page.goto('https://example.com');

    const auditor = new SecurityAuditor(page);

    // Skip individual rules (more granular than category exclusion)
    await auditor.assertNoViolations({
      skipRules: [
        'missing-x-frame-options',  // Using CSP frame-ancestors instead
        'missing-referrer-policy',  // Intentionally permissive for analytics
      ],
    });
  });

  test('different scans for different page types', async ({ page }) => {
    const auditor = new SecurityAuditor(page);

    // Public pages: focus on headers and links
    await page.goto('https://example.com/');
    await auditor.assertNoViolations({
      include: ['headers', 'links', 'csp'],
    });

    // Login page: focus on forms and sensitive data
    await page.goto('https://example.com/login');
    await auditor.assertNoViolations({
      include: ['forms', 'sensitive-data', 'headers'],
    });

    // Admin area: full scan
    await page.goto('https://example.com/admin');
    await auditor.assertNoViolations(); // All categories
  });
});
