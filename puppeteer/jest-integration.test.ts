/**
 * Jest Integration Example for Puppeteer
 *
 * This example shows how to integrate QAstell security audits
 * into your Jest test suite with Puppeteer.
 *
 * Run with: npx jest puppeteer/jest-integration.test.ts
 */

import puppeteer, { Browser, Page } from 'puppeteer';
import { SecurityAuditor } from 'qastell';

describe('Security Audits', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
  });

  afterEach(async () => {
    await page.close();
  });

  test('homepage should pass security audit', async () => {
    await page.goto('https://your-app.com');

    const auditor = new SecurityAuditor(page);
    await auditor.assertNoViolations();
  });

  test('login page should have secure forms', async () => {
    await page.goto('https://your-app.com/login');

    const auditor = new SecurityAuditor(page);
    await auditor.assertNoViolations({
      include: ['forms', 'sensitive-data'],
    });
  });

  test('API docs should have proper security headers', async () => {
    await page.goto('https://your-app.com/api/docs');

    const auditor = new SecurityAuditor(page);
    await auditor.assertNoViolations({
      include: ['headers', 'csp', 'cors'],
    });
  });

  test('should not expose sensitive data in HTML', async () => {
    await page.goto('https://your-app.com/dashboard');

    const auditor = new SecurityAuditor(page);
    const results = await auditor.audit({
      include: ['sensitive-data'],
    });

    expect(results.violations).toHaveLength(0);
  });

  test('all pages should pass basic security', async () => {
    const urls = [
      'https://your-app.com/',
      'https://your-app.com/login',
      'https://your-app.com/signup',
      'https://your-app.com/contact',
    ];

    for (const url of urls) {
      await page.goto(url, { waitUntil: 'networkidle0' });
      const auditor = new SecurityAuditor(page);

      // Allow some known issues during gradual adoption
      await auditor.assertNoViolations({
        thresholds: {
          info: 999,
          low: 10,
          medium: 0,
          high: 0,
          critical: 0,
        },
      });
    }
  });
});
