/**
 * Basic Security Audit Example for Selenium WebDriver
 *
 * This example shows the simplest way to add security scanning
 * to your Selenium WebDriver scripts.
 */

import { Builder, WebDriver } from 'selenium-webdriver';
import { SecurityAuditor } from 'qastell';

async function basicAudit() {
  const driver: WebDriver = await new Builder().forBrowser('chrome').build();

  // Navigate to your application
  await driver.get('https://your-app.com');

  // Create auditor and run scan
  const auditor = new SecurityAuditor(driver);
  const results = await auditor.audit();

  // Log summary for visibility
  console.log(`Found ${results.summary.total} issues`);
  console.log(`Critical: ${results.summary.bySeverity.critical}`);
  console.log(`High: ${results.summary.bySeverity.high}`);

  // Assert no violations (will throw if any issues found)
  await auditor.assertNoViolations();

  await driver.quit();
}

async function auditMultiplePages() {
  const driver: WebDriver = await new Builder().forBrowser('chrome').build();

  const pagesToAudit = [
    'https://your-app.com/',
    'https://your-app.com/login',
    'https://your-app.com/dashboard',
  ];

  for (const url of pagesToAudit) {
    await driver.get(url);
    // Wait for page to stabilize (WebDriver doesn't have networkidle)
    await driver.sleep(1000);
    const auditor = new SecurityAuditor(driver);
    await auditor.assertNoViolations();
    console.log(`✓ ${url} passed security audit`);
  }

  await driver.quit();
}

async function auditAfterInteractions() {
  const driver: WebDriver = await new Builder().forBrowser('chrome').build();

  await driver.get('https://your-app.com/login');

  // Perform login
  const emailField = await driver.findElement({ id: 'email' });
  await emailField.sendKeys('test@example.com');

  const passwordField = await driver.findElement({ id: 'password' });
  await passwordField.sendKeys('password123');

  const submitButton = await driver.findElement({ css: 'button[type="submit"]' });
  await submitButton.click();

  // Wait for navigation
  await driver.sleep(2000);

  // Audit the authenticated page
  const auditor = new SecurityAuditor(driver);
  await auditor.assertNoViolations();

  await driver.quit();
}

// Run the examples
(async () => {
  console.log('Running basic audit...');
  await basicAudit();

  console.log('\nRunning multi-page audit...');
  await auditMultiplePages();

  console.log('\nRunning post-interaction audit...');
  await auditAfterInteractions();
})().catch(console.error);
