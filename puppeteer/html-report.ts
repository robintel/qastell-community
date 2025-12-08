/**
 * HTML Report Example for Puppeteer
 *
 * This example shows how to generate and save HTML reports.
 * HTML reports are available on all license tiers including Free.
 */

import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import { SecurityAuditor } from 'qastell';

async function generateBasicReport() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://your-app.com');

  const auditor = new SecurityAuditor(page);
  const results = await auditor.audit();

  // Generate HTML report
  const html = results.toHTML();

  // Save to file
  const reportPath = path.join(process.cwd(), 'security-report.html');
  fs.writeFileSync(reportPath, html);
  console.log(`Report saved to: ${reportPath}`);

  await browser.close();
}

async function generateTimestampedReport() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://your-app.com');

  const auditor = new SecurityAuditor(page);
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

  await browser.close();
}

async function generateMultiPageReport() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const pagesToAudit = [
    { name: 'homepage', url: 'https://your-app.com/' },
    { name: 'login', url: 'https://your-app.com/login' },
    { name: 'dashboard', url: 'https://your-app.com/dashboard' },
  ];

  // Ensure reports directory exists
  const reportsDir = path.join(process.cwd(), 'reports');
  fs.mkdirSync(reportsDir, { recursive: true });

  for (const { name, url } of pagesToAudit) {
    await page.goto(url, { waitUntil: 'networkidle0' });
    const auditor = new SecurityAuditor(page);
    const results = await auditor.audit();

    const reportPath = path.join(reportsDir, `${name}-security-report.html`);
    fs.writeFileSync(reportPath, results.toHTML());
    console.log(`${name}: ${results.summary.total} issues -> ${reportPath}`);
  }

  await browser.close();
}

async function conditionalReportGeneration() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://your-app.com');

  const auditor = new SecurityAuditor(page);
  const results = await auditor.audit();

  // Only generate report if issues found
  if (results.summary.total > 0) {
    const reportPath = path.join(process.cwd(), 'security-issues.html');
    fs.writeFileSync(reportPath, results.toHTML());
    console.log(`Found ${results.summary.total} issues, report saved to: ${reportPath}`);
  } else {
    console.log('No issues found, skipping report generation');
  }

  await browser.close();
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
