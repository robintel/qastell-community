/**
 * Basic Security Audit Example for Cypress
 *
 * This example shows the simplest way to add security scanning
 * to your Cypress tests.
 *
 * Key difference from other frameworks:
 * - Cypress runs inside the browser, so we use cy.window() to get the Window object
 * - The SecurityAuditor is used inside a .then() callback
 */

import { SecurityAuditor } from 'qastell';

describe('Security Audit', () => {
  it('should pass basic security audit', () => {
    cy.visit('https://your-app.com');

    // Get the window object and run the security audit
    cy.window().then(async (win) => {
      const auditor = new SecurityAuditor(win);
      const results = await auditor.audit();

      // Log summary for visibility
      cy.log(`Found ${results.summary.total} issues`);
      cy.log(`Critical: ${results.summary.bySeverity.critical}`);
      cy.log(`High: ${results.summary.bySeverity.high}`);

      // Assert no violations (will throw if any issues found)
      await auditor.assertNoViolations();
    });
  });

  it('should audit multiple pages', () => {
    const pagesToAudit = [
      'https://your-app.com/',
      'https://your-app.com/login',
      'https://your-app.com/dashboard',
    ];

    pagesToAudit.forEach((url) => {
      cy.visit(url);
      cy.window().then(async (win) => {
        const auditor = new SecurityAuditor(win);
        await auditor.assertNoViolations();
        cy.log(`✓ ${url} passed security audit`);
      });
    });
  });

  it('should audit after user interactions', () => {
    cy.visit('https://your-app.com/login');

    // Perform login
    cy.get('#email').type('test@example.com');
    cy.get('#password').type('password123');
    cy.get('button[type="submit"]').click();

    // Wait for navigation to complete
    cy.url().should('include', '/dashboard');

    // Audit the authenticated page
    cy.window().then(async (win) => {
      const auditor = new SecurityAuditor(win);
      await auditor.assertNoViolations();
    });
  });
});
