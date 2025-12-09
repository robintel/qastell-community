/**
 * HTML Report Example for Selenium WebDriver
 *
 * This example shows how to generate and save HTML reports.
 * HTML reports are available on all license tiers including Free.
 */

import { Builder, WebDriver } from 'selenium-webdriver';
import * as fs from 'fs';
import * as path from 'path';
import { SecurityAuditor } from 'qastell';

async function generateBasicReport() {
  const driver: WebDriver = await new Builder().forBrowser('chrome').build();
  await driver.get('https://your-app.com');

  const auditor = new SecurityAuditor(driver);
  const results = await auditor.audit();

  // Generate HTML report
  const html = results.toHTML();

  // Save to file
  const reportPath = path.join(process.cwd(), 'security-report.html');
  fs.writeFileSync(reportPath, html);
  console.log(`Report saved to: ${reportPath}`);

  await driver.quit();
}

async function generateTimestampedReport() {
  const driver: WebDriver = await new Builder().forBrowser('chrome').build();
  await driver.get('https://your-app.com');

  const auditor = new SecurityAuditor(driver);
  const results = await auditor.audit();

  // Generate report with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(
    process.cwd(),
    'reports',
    `security-report-${timestamp}.html`
  );

  // Ensure reports directory exists
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });

  fs.writeFileSync(reportPath, results.toHTML());
  console.log(`Report saved to: ${reportPath}`);

  await driver.quit();
}

async function generateMultiPageReport() {
  const driver: WebDriver = await new Builder().forBrowser('chrome').build();

  const pagesToAudit = [
    { name: 'homepage', url: 'https://your-app.com/' },
    { name: 'login', url: 'https://your-app.com/login' },
    { name: 'dashboard', url: 'https://your-app.com/dashboard' },
  ];

  // Ensure reports directory exists
  const reportsDir = path.join(process.cwd(), 'reports');
  fs.mkdirSync(reportsDir, { recursive: true });

  for (const { name, url } of pagesToAudit) {
    await driver.get(url);
    // Wait for page to stabilize (WebDriver doesn't have networkidle)
    await driver.sleep(1000);

    const auditor = new SecurityAuditor(driver);
    const results = await auditor.audit();

    const reportPath = path.join(reportsDir, `${name}-security-report.html`);
    fs.writeFileSync(reportPath, results.toHTML());
    console.log(`${name}: ${results.summary.total} issues -> ${reportPath}`);
  }

  await driver.quit();
}

async function conditionalReportGeneration() {
  const driver: WebDriver = await new Builder().forBrowser('chrome').build();
  await driver.get('https://your-app.com');

  const auditor = new SecurityAuditor(driver);
  const results = await auditor.audit();

  // Only generate report if issues found
  if (results.summary.total > 0) {
    const reportPath = path.join(process.cwd(), 'security-issues.html');
    fs.writeFileSync(reportPath, results.toHTML());
    console.log(`Found ${results.summary.total} issues, report saved to: ${reportPath}`);
  } else {
    console.log('No issues found, skipping report generation');
  }

  await driver.quit();
}

// Run examples
(async () => {
  console.log('Generating reports...');
  await generateBasicReport();
  await generateTimestampedReport();
  await generateMultiPageReport();
  await conditionalReportGeneration();
  console.log('Done!');
})().catch(console.error);
