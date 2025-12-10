/**
 * Custom Thresholds Example for Cypress
 *
 * This example shows how to configure thresholds for different severity levels.
 * Useful when you need to gradually adopt security scanning without failing
 * on every issue.
 */

import { SecurityAuditor } from 'qastell';

describe('Security Audit with Thresholds', () => {
  beforeEach(() => {
    cy.visit('https://example.com');
  });

  it('should allow low severity issues', () => {
    cy.window().then(async (win) => {
      const auditor = new SecurityAuditor(win);
      const results = await auditor.audit({
        thresholds: {
          // Allow unlimited low and info severity issues
          low: 999,
          info: 999,
          // Fail on any medium or higher
          medium: 0,
          high: 0,
          critical: 0,
        },
      });

      // Check if passed with thresholds
      if (results.passed()) {
        cy.log('Audit passed with thresholds');
      } else {
        // Get failures that exceeded thresholds
        const failures = results.getFailures();
        throw new Error(`Audit failed with ${failures.length} rule(s) exceeding thresholds`);
      }
    });
  });

  it('should allow specific number of violations per rule', () => {
    cy.window().then(async (win) => {
      const auditor = new SecurityAuditor(win);
      const results = await auditor.audit({
        // Per-rule thresholds take precedence over severity thresholds
        ruleThresholds: {
          'missing-noopener': 5, // Allow up to 5 missing noopener violations
          'insecure-cookie': 2, // Allow up to 2 insecure cookie violations
        },
        thresholds: {
          low: 10,
          info: 999,
        },
      });

      if (!results.passed()) {
        const failures = results.getFailures();
        failures.forEach((f) => {
          cy.log(`[${f.rule.severity}] ${f.rule.name}: ${f.violations.length} violations`);
        });
        throw new Error('Security audit failed');
      }
    });
  });

  it('should report all issues but only fail on critical', () => {
    cy.window().then(async (win) => {
      const auditor = new SecurityAuditor(win);
      const results = await auditor.audit({
        thresholds: {
          // Only fail on critical issues
          critical: 0,
          high: 999,
          medium: 999,
          low: 999,
          info: 999,
        },
      });

      // Log all issues for awareness
      cy.log(`Total issues found: ${results.summary.total}`);
      cy.log(`Critical: ${results.summary.bySeverity.critical}`);
      cy.log(`High: ${results.summary.bySeverity.high}`);
      cy.log(`Medium: ${results.summary.bySeverity.medium}`);

      // Only fail if critical issues exist
      if (results.summary.bySeverity.critical > 0) {
        throw new Error(`Found ${results.summary.bySeverity.critical} critical security issues`);
      }
    });
  });
});
