/**
 * Advanced Configuration Example for Cypress
 *
 * This example shows advanced usage patterns including:
 * - Framework detection verification
 * - Custom rules
 * - License configuration
 * - Combining multiple configuration options
 */

import { SecurityAuditor, initLicense, getLicenseUsage, allRules } from 'qastell';
import { detectFramework } from 'qastell/adapters';

describe('Advanced Security Audit Configuration', () => {
  before(() => {
    // Initialize license at the start of the test suite
    // (reads from QASTELL_LICENSE env var if not provided)
    initLicense();

    const usage = getLicenseUsage();
    cy.log(`License tier: ${usage.tier}`);
    cy.log(`Scans remaining today: ${usage.remaining}`);
  });

  it('should verify Cypress framework detection', () => {
    cy.visit('https://example.com');

    cy.window().then(async (win) => {
      // Verify framework detection
      const detected = detectFramework(win);
      expect(detected).to.equal('cypress');

      const auditor = new SecurityAuditor(win);
      expect(auditor.getFramework()).to.equal('cypress');

      cy.log('Framework correctly detected as Cypress');
    });
  });

  it('should use custom rules subset', () => {
    cy.visit('https://example.com');

    cy.window().then(async (win) => {
      // Get only header-related rules
      const headerRules = allRules.filter((r) =>
        ['headers', 'csp', 'cookies'].includes(r.category)
      );

      cy.log(`Using ${headerRules.length} header-related rules`);

      const auditor = new SecurityAuditor(win, { rules: headerRules });
      const results = await auditor.audit();

      cy.log(`Found ${results.summary.total} header-related issues`);
    });
  });

  it('should use custom rules with high severity only', () => {
    cy.visit('https://example.com');

    cy.window().then(async (win) => {
      // Get only critical and high severity rules
      const highSeverityRules = allRules.filter((r) =>
        ['critical', 'high'].includes(r.severity)
      );

      cy.log(`Using ${highSeverityRules.length} high-severity rules`);

      const auditor = new SecurityAuditor(win, { rules: highSeverityRules });
      const results = await auditor.audit();

      cy.log(`Found ${results.summary.total} high-severity issues`);

      // All violations should be critical or high
      results.violations.forEach((v) => {
        expect(['critical', 'high']).to.include(v.rule.severity);
      });
    });
  });

  it('should force Cypress framework when auto-detection might fail', () => {
    cy.visit('https://example.com');

    cy.window().then(async (win) => {
      // Force Cypress framework (useful if auto-detection fails)
      const auditor = new SecurityAuditor(win, { framework: 'cypress' });

      expect(auditor.getFramework()).to.equal('cypress');

      const results = await auditor.audit();
      cy.log(`Audit completed with forced Cypress framework: ${results.summary.total} issues`);
    });
  });

  it('should combine multiple configuration options', () => {
    cy.visit('https://example.com');

    cy.window().then(async (win) => {
      const auditor = new SecurityAuditor(win);

      const results = await auditor.audit({
        // Category filtering
        include: ['headers', 'cookies', 'csp', 'forms'],

        // Skip specific problematic rules
        skipRules: ['missing-noopener'],

        // Severity thresholds
        thresholds: {
          critical: 0, // Fail on any critical
          high: 2, // Allow up to 2 high
          medium: 5, // Allow up to 5 medium
          low: 999, // Allow unlimited low
          info: 999, // Allow unlimited info
        },

        // Per-rule thresholds (override severity thresholds)
        ruleThresholds: {
          'insecure-cookie-httponly': 3, // Allow 3 httpOnly violations
        },
      });

      cy.log('Combined configuration audit results:');
      cy.log(`Total: ${results.summary.total}`);
      cy.log(`Passed: ${results.passed()}`);

      if (!results.passed()) {
        const failures = results.getFailures();
        failures.forEach((f) => {
          cy.log(`FAILED: [${f.rule.severity}] ${f.rule.name} (${f.violations.length} violations)`);
        });
      }
    });
  });

  it('should handle audit results programmatically', () => {
    cy.visit('https://example.com');

    cy.window().then(async (win) => {
      const auditor = new SecurityAuditor(win);
      const results = await auditor.audit();

      // Access raw results
      const raw = results.raw;
      cy.log(`URL audited: ${raw.url}`);
      cy.log(`Duration: ${raw.duration}ms`);

      // Filter violations by severity
      const criticalViolations = results.violations.filter(
        (v) => v.rule.severity === 'critical'
      );
      const highViolations = results.violations.filter(
        (v) => v.rule.severity === 'high'
      );

      cy.log(`Critical violations: ${criticalViolations.length}`);
      cy.log(`High violations: ${highViolations.length}`);

      // Get violations by category
      const headerViolations = results.violations.filter(
        (v) => v.rule.category === 'headers'
      );
      cy.log(`Header violations: ${headerViolations.length}`);

      // Check specific rule
      const cspResults = raw.results.find((r) => r.rule.id === 'missing-csp');
      if (cspResults) {
        cy.log(`CSP violations: ${cspResults.violations.length}`);
      }
    });
  });
});
