/**
 * Generate HTML Report using multiple-cucumber-html-reporter
 *
 * This script reads the Cucumber JSON output and generates a
 * comprehensive HTML report that properly displays Scenario Outlines
 * with all their examples as separate entries.
 */

const report = require('multiple-cucumber-html-reporter');
const fs = require('fs');
const path = require('path');

const jsonReportPath = path.join(__dirname, '..', 'reports', 'cucumber-report.json');
const outputDir = path.join(__dirname, '..', 'reports', 'html');

// Check if JSON report exists
if (!fs.existsSync(jsonReportPath)) {
  console.error('Error: Cucumber JSON report not found at:', jsonReportPath);
  console.error('Run "npm test" first to generate the JSON report.');
  process.exit(1);
}

// Generate the HTML report
report.generate({
  jsonDir: path.join(__dirname, '..', 'reports'),
  reportPath: outputDir,
  metadata: {
    browser: {
      name: 'chromium',
      version: 'latest',
    },
    device: 'Local Machine',
    platform: {
      name: process.platform,
      version: process.version,
    },
  },
  customData: {
    title: 'Test Information',
    data: [
      { label: 'Project', value: 'QAstell Integration Example' },
      { label: 'Framework', value: 'Playwright + Cucumber' },
      { label: 'Reporter', value: 'multiple-cucumber-html-reporter' },
      { label: 'Execution Date', value: new Date().toISOString() },
    ],
  },
  pageTitle: 'QAstell Security Audit Report',
  reportName: 'QAstell + Playwright + Cucumber',
  displayDuration: true,
  displayReportTime: true,
  hideMetadata: false,
});

console.log('HTML report generated at:', outputDir);
console.log('Open reports/html/index.html in your browser to view the report.');
