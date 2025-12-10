/**
 * HTML Report Generation Example for Cypress
 *
 * This example shows how to generate HTML security reports.
 * Reports can be generated and saved after the audit completes.
 *
 * Note: File writing in Cypress tests requires using cy.writeFile()
 * or a custom task for file system access.
 */

import { SecurityAuditor, HtmlReporter } from 'qastell';

describe('Security Audit with Reports', () => {
  it('should generate HTML report', () => {
    cy.visit('https://your-app.com');

    cy.window().then(async (win) => {
      const auditor = new SecurityAuditor(win);
      const results = await auditor.audit();

      // Generate HTML report
      const html = results.toHTML();

      // Save the report using Cypress writeFile
      cy.writeFile('cypress/reports/security-report.html', html);

      cy.log('HTML report generated: cypress/reports/security-report.html');
    });
  });

  it('should generate report with custom reporter', () => {
    cy.visit('https://your-app.com');

    cy.window().then(async (win) => {
      const auditor = new SecurityAuditor(win);
      const results = await auditor.audit();

      // Use reporter directly for more control
      const reporter = new HtmlReporter();
      const html = reporter.generate(results.raw);

      // Save with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      cy.writeFile(`cypress/reports/security-${timestamp}.html`, html);

      cy.log('Report generated with timestamp');
    });
  });

  it('should generate report for multiple pages', () => {
    const pages = [
      { name: 'home', url: 'https://your-app.com/' },
      { name: 'login', url: 'https://your-app.com/login' },
      { name: 'dashboard', url: 'https://your-app.com/dashboard' },
    ];

    pages.forEach((page) => {
      cy.visit(page.url);

      cy.window().then(async (win) => {
        const auditor = new SecurityAuditor(win);
        const results = await auditor.audit();

        // Generate report for each page
        const html = results.toHTML();
        cy.writeFile(`cypress/reports/${page.name}-security.html`, html);

        cy.log(`Report generated for ${page.name}: ${results.summary.total} issues`);
      });
    });
  });

  it('should generate JSON report for CI integration', () => {
    cy.visit('https://your-app.com');

    cy.window().then(async (win) => {
      const auditor = new SecurityAuditor(win);
      const results = await auditor.audit();

      // Generate JSON report (requires Enterprise tier)
      try {
        const json = results.toJSON();
        cy.writeFile('cypress/reports/security-report.json', json);
        cy.log('JSON report generated');
      } catch (e) {
        // Free tier only supports HTML reports
        cy.log('JSON reports require Enterprise tier');
        // Fall back to HTML
        const html = results.toHTML();
        cy.writeFile('cypress/reports/security-report.html', html);
      }
    });
  });
});
