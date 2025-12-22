/**
 * QAstell + Playwright + Cucumber Step Definitions
 *
 * Demonstrates security auditing in BDD scenarios using QAstell
 * with Playwright for browser automation and Cucumber for BDD.
 */

import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { SecurityAuditor, AuditResults, RuleCategory } from 'qastell';
import { CucumberConnector } from 'qastell/connectors';
import { CustomWorld } from '../support/world';

const connector = new CucumberConnector();

Given('the browser is launched', async function (this: CustomWorld) {
  // Browser is launched in Before hook (see support/hooks.ts)
  expect(this.page).toBeDefined();
});

When('I navigate to {string}', async function (this: CustomWorld, url: string) {
  await this.page.goto(url);
  await this.page.waitForLoadState('networkidle', { timeout: 30000 });
});

When('I perform a security audit', async function (this: CustomWorld) {
  const auditor = new SecurityAuditor(this.page);
  this.auditResults = await auditor.audit();

  console.log(`Audit complete: ${this.auditResults.summary.total} issues found`);
  console.log(`  Critical: ${this.auditResults.summary.bySeverity.critical}`);
  console.log(`  High: ${this.auditResults.summary.bySeverity.high}`);
  console.log(`  Medium: ${this.auditResults.summary.bySeverity.medium}`);
});

When(
  'I perform a security audit focusing on {string}',
  async function (this: CustomWorld, categories: string) {
    const include = categories.split(',').map((c) => c.trim()) as RuleCategory[];
    const auditor = new SecurityAuditor(this.page);
    this.auditResults = await auditor.audit({ include });

    console.log(`Focused audit (${categories}): ${this.auditResults.summary.total} issues found`);
  }
);

Then('the security audit should pass', async function (this: CustomWorld) {
  expect(this.auditResults).toBeDefined();

  const results = this.auditResults as AuditResults;
  const passed = results.passed();

  if (!passed) {
    console.log('Security audit FAILED:');
    results.violations.slice(0, 5).forEach((v) => {
      console.log(`  - [${v.rule?.severity}] ${v.rule?.name}: ${v.message}`);
    });
  }

  expect(passed, `Security audit failed with ${results.summary.total} violations`).toBe(true);
});

Then('the audit results should be attached to the report', async function (this: CustomWorld) {
  expect(this.auditResults).toBeDefined();

  const result = await connector.attachSummary(this.auditResults as AuditResults, this);

  if (!result.success) {
    console.warn(`Failed to attach audit results: ${result.error}`);
  }
});
