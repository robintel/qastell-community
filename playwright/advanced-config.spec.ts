/**
 * QAstell Advanced Configuration Example
 *
 * Demonstrates advanced options including:
 * - Framework detection and override
 * - Custom rule sets
 * - Combining options
 * - Using exported utilities
 *
 * Run this example:
 *   cd examples && npx playwright test advanced-config.spec.ts --reporter=list
 */

import { test, expect } from '@playwright/test';
// Use relative import for local development, 'qastell' for npm package
import {
  SecurityAuditor,
  detectFramework,
  allRules,
  VERSION,
} from '../../dist';

const targetUrl = 'https://qastell.eu';

test.describe('Advanced Configuration', () => {
  test('check framework detection', async ({ page }) => {
    await page.goto(targetUrl);

    // detectFramework tells you what QAstell detected
    const framework = detectFramework(page);
    console.log(`Detected framework: ${framework}`);

    expect(framework).toBe('playwright');

    // The auditor also exposes the detected framework
    const auditor = new SecurityAuditor(page);
    expect(auditor.getFramework()).toBe('playwright');
  });

  test('force framework when auto-detection fails', async ({ page }) => {
    await page.goto(targetUrl);

    // In rare cases where auto-detection doesn't work,
    // you can force the framework explicitly
    const auditor = new SecurityAuditor(page, { framework: 'playwright' });

    expect(auditor.getFramework()).toBe('playwright');

    // Audit still works normally
    const results = await auditor.audit({ include: ['headers'] });
    expect(results.raw.results.length).toBeGreaterThan(0);
  });

  test('use custom rule subset', async ({ page }) => {
    await page.goto(targetUrl);

    // Filter rules to only include specific categories
    const headerRules = allRules.filter((r) => r.category === 'headers');
    console.log(`Using ${headerRules.length} header rules out of ${allRules.length} total`);

    const auditor = new SecurityAuditor(page, { rules: headerRules });
    const results = await auditor.audit();

    // All violations should be from headers category
    for (const violation of results.violations) {
      expect(violation.rule?.category).toBe('headers');
    }
  });

  test('combine framework and rules options', async ({ page }) => {
    await page.goto(targetUrl);

    // You can combine framework override with custom rules
    const formRules = allRules.filter((r) => r.category === 'forms');

    const auditor = new SecurityAuditor(page, {
      framework: 'playwright',
      rules: formRules,
    });

    expect(auditor.getFramework()).toBe('playwright');

    const results = await auditor.audit();

    // All violations should be from forms category
    for (const violation of results.violations) {
      expect(violation.rule?.category).toBe('forms');
    }
  });

  test('check library version', async ({ page }) => {
    await page.goto(targetUrl);

    // VERSION is exported for programmatic access
    console.log(`QAstell version: ${VERSION}`);
    expect(VERSION).toMatch(/^\d+\.\d+\.\d+/);

    // Version also appears in HTML reports
    const auditor = new SecurityAuditor(page);
    const results = await auditor.audit({ include: ['headers'] });

    // Generate report (version shown in footer)
    const { HtmlReporter } = await import('../../dist');
    const reporter = new HtmlReporter();
    const html = reporter.generate(results.raw);

    expect(html).toContain(`v${VERSION}`);
  });

  test('legacy array syntax still works', async ({ page }) => {
    await page.goto(targetUrl);

    // For backwards compatibility, you can still pass rules as an array
    const linkRules = allRules.filter((r) => r.category === 'links');

    // Legacy syntax (still supported)
    const auditor = new SecurityAuditor(page, linkRules);
    const results = await auditor.audit();

    // All violations should be from links category
    for (const violation of results.violations) {
      expect(violation.rule?.category).toBe('links');
    }
  });
});
