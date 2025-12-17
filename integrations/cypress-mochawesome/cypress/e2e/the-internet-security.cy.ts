/**
 * QAstell + Cypress + Mochawesome Integration Example
 *
 * This example demonstrates real-world security auditing with results
 * attached to Mochawesome reports.
 *
 * Uses https://the-internet.herokuapp.com - a reliable test automation
 * demo site with forms, login pages, and various UI patterns.
 */

import { SecurityAuditor, VERSION, getTierDisplayName } from 'qastell/cypress';

const BASE_URL = 'https://the-internet.herokuapp.com';

/**
 * Helper to attach QAstell results to Mochawesome report and optionally assert
 * cypress-mochawesome-reporter provides cy.addTestContext() for adding context
 *
 * Since Mochawesome only supports JSON context (not HTML attachments),
 * we also save the full HTML report to disk for detailed viewing.
 */
function attachSecurityResults(
  results: Awaited<ReturnType<SecurityAuditor['audit']>>,
  testName: string,
  options: { assertPasses?: boolean } = {}
) {
  const summary = results.summary;
  const status = results.skipped ? 'SKIPPED' : results.passed() ? 'PASSED' : 'FAILED';

  // Save full HTML report to disk (Mochawesome doesn't support HTML attachments)
  const sanitizedName = testName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  const reportPath = `cypress/results/qastell-${sanitizedName}.html`;
  cy.writeFile(reportPath, results.toHTML());

  // Build a summary object for Mochawesome context
  const tier = results.tier;
  const tierDisplayName = getTierDisplayName(tier);
  const securitySummary = {
    title: 'QAstell Security Summary',
    value: {
      status,
      totalViolations: summary.total,
      bySeverity: summary.bySeverity,
      topViolations: results.violations.slice(0, 5).map((v) => ({
        severity: v.rule?.severity || 'info',
        rule: v.rule?.name || v.ruleId,
        message: v.message,
      })),
      url: results.raw.url,
      fullReport: reportPath,
      generatedBy: `QAstell v${VERSION} (${tierDisplayName}) - https://qastell.eu`,
    },
  };

  // Add context to Mochawesome report, then optionally assert
  // @ts-expect-error - cy.addTestContext is added by cypress-mochawesome-reporter
  cy.addTestContext(securitySummary).then(() => {
    // Assert after context is added so report still captures the results
    if (options.assertPasses) {
      expect(results.passed(), `Security audit failed with ${summary.total} violations`).to.be.true;
    }
  });
}

describe('Security Audit Demo @security', function () {
  /**
   * Test the main landing page
   */
  it('should audit the homepage', function () {
    cy.visit(BASE_URL);

    // Wait for the page to fully load
    cy.get('h1', { timeout: 10000 }).should('be.visible');

    cy.window().then(async (win) => {
      const auditor = new SecurityAuditor(win);
      const results = await auditor.audit();

      // Attach results to Mochawesome report and fail if audit fails
      attachSecurityResults(results, 'homepage', { assertPasses: true });

      // Log summary to Cypress command log
      cy.log(`Security Audit: ${results.summary.total} issues found`);
      cy.log(`Critical: ${results.summary.bySeverity.critical}, High: ${results.summary.bySeverity.high}`);
    });
  });

  /**
   * Test the login page - forms are common attack vectors
   */
  it('should audit the login page', function () {
    cy.visit(`${BASE_URL}/login`);

    // Wait for form to be visible
    cy.get('form', { timeout: 10000 }).should('be.visible');

    cy.window().then(async (win) => {
      const auditor = new SecurityAuditor(win);

      // Focus on form-related security rules
      const results = await auditor.audit({
        include: ['forms', 'sensitive-data', 'headers'],
      });

      attachSecurityResults(results, 'login-page', { assertPasses: true });

      cy.log(`Login Page: ${results.summary.total} form-related issues`);

      // Check specific form vulnerabilities
      const formViolations = results.violations.filter((v) => v.rule?.category === 'forms');
      cy.log(`Form vulnerabilities: ${formViolations.length}`);
    });
  });

  /**
   * Test the form authentication page (Secure Area)
   */
  it('should audit the secure area page', function () {
    cy.visit(`${BASE_URL}/secure`);

    // Wait for page load
    cy.get('body', { timeout: 10000 }).should('be.visible');

    cy.window().then(async (win) => {
      const auditor = new SecurityAuditor(win);
      const results = await auditor.audit();

      attachSecurityResults(results, 'secure-area', { assertPasses: true });

      cy.log(`Secure Area Page: ${results.summary.total} issues`);
    });
  });

  /**
   * Test the checkboxes page
   */
  it('should audit the checkboxes page', function () {
    cy.visit(`${BASE_URL}/checkboxes`);

    cy.get('input[type="checkbox"]', { timeout: 10000 }).should('be.visible');

    cy.window().then(async (win) => {
      const auditor = new SecurityAuditor(win);
      const results = await auditor.audit();

      attachSecurityResults(results, 'checkboxes', { assertPasses: true });

      cy.log(`Checkboxes Page: ${results.summary.total} issues`);
    });
  });

  /**
   * Test the dropdown page
   */
  it('should audit the dropdown page', function () {
    cy.visit(`${BASE_URL}/dropdown`);

    cy.get('select', { timeout: 10000 }).should('be.visible');

    cy.window().then(async (win) => {
      const auditor = new SecurityAuditor(win);
      const results = await auditor.audit();

      attachSecurityResults(results, 'dropdown', { assertPasses: true });

      cy.log(`Dropdown Page: ${results.summary.total} issues`);
    });
  });

  /**
   * Test the inputs page
   */
  it('should audit the inputs page', function () {
    cy.visit(`${BASE_URL}/inputs`);

    cy.get('input[type="number"]', { timeout: 10000 }).should('be.visible');

    cy.window().then(async (win) => {
      const auditor = new SecurityAuditor(win);
      const results = await auditor.audit();

      attachSecurityResults(results, 'inputs', { assertPasses: true });

      cy.log(`Inputs Page: ${results.summary.total} issues`);
    });
  });

  /**
   * Test a page with dynamic content
   */
  it('should audit dynamic content page', function () {
    cy.visit(`${BASE_URL}/dynamic_content`);

    cy.get('.large-10', { timeout: 10000 }).should('be.visible');

    cy.window().then(async (win) => {
      const auditor = new SecurityAuditor(win);
      const results = await auditor.audit();

      attachSecurityResults(results, 'dynamic-content', { assertPasses: true });

      cy.log(`Dynamic Content Page: ${results.summary.total} issues`);
    });
  });
});

/**
 * Summary test that aggregates findings
 */
describe('Security Audit Summary @security', function () {
  it('should generate HTML report', function () {
    cy.visit(BASE_URL);
    cy.get('h1', { timeout: 10000 }).should('be.visible');

    cy.window().then(async (win) => {
      const auditor = new SecurityAuditor(win);
      const results = await auditor.audit();

      // Generate full HTML report
      const html = results.toHTML();

      // Log report size
      cy.log(`Full report size: ${Math.round(html.length / 1024)}KB`);

      // Verify the report contains expected elements
      expect(html).to.include('QAstell');
      expect(html).to.include('Security Audit');

      // Attach the security results and fail if audit fails
      attachSecurityResults(results, 'html-report-test', { assertPasses: true });
    });
  });
});
