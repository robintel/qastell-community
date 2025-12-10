/**
 * Quickstart Example for Cypress
 *
 * The simplest possible security audit in Cypress.
 * Copy this to get started immediately.
 */

import { SecurityAuditor } from 'qastell';

it('security audit', () => {
  cy.visit('https://example.com');

  cy.window().then(async (win) => {
    const auditor = new SecurityAuditor(win);
    const results = await auditor.audit();

    cy.log(`Issues: ${results.summary.total}`);
    cy.log(`Critical: ${results.summary.bySeverity.critical}`);
    cy.log(`High: ${results.summary.bySeverity.high}`);

    // Uncomment to fail on violations:
    // await auditor.assertNoViolations();
  });
});
