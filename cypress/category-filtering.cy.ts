/**
 * Category Filtering Example for Cypress
 *
 * This example shows how to include or exclude specific rule categories.
 * Useful for focusing on specific security areas or gradually rolling out
 * security scanning.
 */

import { SecurityAuditor } from 'qastell';

describe('Security Audit with Category Filtering', () => {
  beforeEach(() => {
    cy.visit('https://example.com');
  });

  it('should only check header-related rules', () => {
    cy.window().then(async (win) => {
      const auditor = new SecurityAuditor(win);
      const results = await auditor.audit({
        include: ['headers', 'csp', 'cookies'],
      });

      cy.log(`Checked header-related rules, found ${results.summary.total} issues`);

      // Only these categories should have violations
      const allowedCategories = ['headers', 'csp', 'cookies'];
      Object.entries(results.summary.byCategory).forEach(([category, count]) => {
        if (count > 0 && !allowedCategories.includes(category)) {
          throw new Error(`Unexpected category ${category} has violations`);
        }
      });

      await auditor.assertNoViolations({ include: ['headers', 'csp', 'cookies'] });
    });
  });

  it('should check everything except links', () => {
    cy.window().then(async (win) => {
      const auditor = new SecurityAuditor(win);
      const results = await auditor.audit({
        exclude: ['links', 'tabnabbing'],
      });

      cy.log(`Skipped link rules, found ${results.summary.total} issues`);

      // Links category should have 0 violations (excluded)
      expect(results.summary.byCategory.links).to.equal(0);
      expect(results.summary.byCategory.tabnabbing).to.equal(0);
    });
  });

  it('should focus on high-impact categories', () => {
    cy.window().then(async (win) => {
      const auditor = new SecurityAuditor(win);
      const results = await auditor.audit({
        include: [
          'csp', // Content Security Policy
          'headers', // Security headers
          'cookies', // Cookie security
          'forms', // Form security
          'cors', // Cross-origin
          'clickjacking', // UI redressing
        ],
      });

      cy.log('High-impact security scan results:');
      cy.log(`CSP issues: ${results.summary.byCategory.csp}`);
      cy.log(`Header issues: ${results.summary.byCategory.headers}`);
      cy.log(`Cookie issues: ${results.summary.byCategory.cookies}`);
      cy.log(`Form issues: ${results.summary.byCategory.forms}`);
      cy.log(`CORS issues: ${results.summary.byCategory.cors}`);
      cy.log(`Clickjacking issues: ${results.summary.byCategory.clickjacking}`);

      // Fail only on critical/high from these categories
      const failures = results.getFailures().filter(
        (f) => f.rule.severity === 'critical' || f.rule.severity === 'high'
      );

      if (failures.length > 0) {
        throw new Error(`Found ${failures.length} high-severity issues in key categories`);
      }
    });
  });

  it('should skip specific rules by ID', () => {
    cy.window().then(async (win) => {
      const auditor = new SecurityAuditor(win);
      const results = await auditor.audit({
        skipRules: [
          'missing-noopener', // Known issue, fix planned
          'insecure-cookie-httponly', // Third-party cookies
        ],
      });

      cy.log(`Skipped 2 rules, found ${results.summary.total} issues`);

      // Verify skipped rules have no violations
      results.raw.results.forEach((r) => {
        if (r.rule.id === 'missing-noopener' || r.rule.id === 'insecure-cookie-httponly') {
          expect(r.violations.length).to.equal(0);
        }
      });
    });
  });
});
