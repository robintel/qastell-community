/**
 * Custom Thresholds Example
 *
 * Configure severity thresholds to gradually adopt security scanning
 * without blocking your CI pipeline on day one.
 */

import { test, expect } from '@playwright/test';
import { SecurityAuditor } from 'qastell';

test.describe('Security Audit with Thresholds', () => {
  test('allow info-level issues but fail on anything higher', async ({ page }) => {
    await page.goto('https://your-app.com');

    const auditor = new SecurityAuditor(page);

    // Set thresholds: allow unlimited info issues, zero tolerance for others
    await auditor.assertNoViolations({
      thresholds: {
        info: 999,     // Allow up to 999 info-level issues
        low: 0,        // Fail on any low severity
        medium: 0,     // Fail on any medium severity
        high: 0,       // Fail on any high severity
        critical: 0,   // Fail on any critical severity
      },
    });
  });

  test('gradual rollout - start permissive, tighten over time', async ({ page }) => {
    await page.goto('https://your-app.com');

    const auditor = new SecurityAuditor(page);

    // Week 1: Only fail on critical issues
    await auditor.assertNoViolations({
      thresholds: {
        info: 999,
        low: 999,
        medium: 999,
        high: 999,
        critical: 0,   // Zero tolerance for critical
      },
    });

    // Week 2: Add high severity (update thresholds)
    // Week 3: Add medium severity
    // Week 4: Full enforcement
  });

  test('allow specific known issues while fixing them', async ({ page }) => {
    await page.goto('https://your-app.com');

    const auditor = new SecurityAuditor(page);

    // Allow specific rule IDs that you're aware of and planning to fix
    await auditor.assertNoViolations({
      allowedViolations: [
        'missing-csp-header',           // Tracked in JIRA-123
        'inline-event-handlers',        // Legacy code, refactoring in progress
      ],
    });
  });

  test('combine thresholds with allowed violations', async ({ page }) => {
    await page.goto('https://your-app.com');

    const auditor = new SecurityAuditor(page);

    await auditor.assertNoViolations({
      // Allow some info/low issues during transition
      thresholds: {
        info: 10,
        low: 5,
        medium: 0,
        high: 0,
        critical: 0,
      },
      // Plus specific known issues being tracked
      allowedViolations: [
        'missing-sri-attribute',
      ],
    });
  });

  test('per-rule thresholds for granular control', async ({ page }) => {
    await page.goto('https://your-app.com');

    const auditor = new SecurityAuditor(page);

    // Set different thresholds for specific rules
    await auditor.assertNoViolations({
      ruleThresholds: {
        'missing-sri-attribute': 5,    // Allow up to 5 missing SRI attributes
        'inline-event-handlers': 10,   // Allow up to 10 inline handlers (legacy code)
        'missing-csp-header': 1,       // Allow 1 missing CSP (multi-page app)
      },
      // Severity thresholds as fallback for rules not in ruleThresholds
      thresholds: {
        info: 999,
        low: 0,
        medium: 0,
        high: 0,
        critical: 0,
      },
    });
  });

  test('combine per-rule and severity thresholds', async ({ page }) => {
    await page.goto('https://your-app.com');

    const auditor = new SecurityAuditor(page);

    await auditor.assertNoViolations({
      // Per-rule thresholds take precedence
      ruleThresholds: {
        'missing-sri-attribute': 3,    // Known issue: 3 CDN scripts without SRI
        'cookie-without-secure': 2,    // Tracked in JIRA-456
      },
      // Everything else follows severity thresholds
      thresholds: {
        info: 50,
        low: 10,
        medium: 0,
        high: 0,
        critical: 0,
      },
    });
  });
});
