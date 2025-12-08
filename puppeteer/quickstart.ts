/**
 * QAstell Quickstart Example for Puppeteer
 *
 * Run this example:
 *
 *   npx ts-node puppeteer/quickstart.ts
 *
 * Or try it in a fresh directory (uses npm package):
 *
 *   mkdir qastell-demo && cd qastell-demo
 *   npm init -y
 *   npm install qastell puppeteer
 *   cat > quickstart.ts << 'EOF'
 *   import puppeteer from 'puppeteer';
 *   import { SecurityAuditor } from 'qastell';
 *   (async () => {
 *     const browser = await puppeteer.launch();
 *     const page = await browser.newPage();
 *     await page.goto('https://qastell.eu');
 *     const auditor = new SecurityAuditor(page);
 *     const results = await auditor.audit();
 *     console.log(`Found ${results.summary.total} issues`);
 *     await browser.close();
 *   })();
 *   EOF
 *   npx ts-node quickstart.ts
 */

import puppeteer from 'puppeteer';
// Use relative import for local development, 'qastell' for npm package
import { SecurityAuditor } from '../../dist';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Navigate to the target page
  await page.goto('https://qastell.eu');

  // Create auditor and run security scan
  const auditor = new SecurityAuditor(page);
  const results = await auditor.audit();

  // Display results
  console.log('\n========================================');
  console.log('         QAstell Security Report        ');
  console.log('========================================\n');
  console.log(`URL: ${page.url()}`);
  console.log(`Total issues: ${results.summary.total}`);
  console.log('');
  console.log('By Severity:');
  console.log(`  Critical: ${results.summary.bySeverity.critical}`);
  console.log(`  High:     ${results.summary.bySeverity.high}`);
  console.log(`  Medium:   ${results.summary.bySeverity.medium}`);
  console.log(`  Low:      ${results.summary.bySeverity.low}`);
  console.log(`  Info:     ${results.summary.bySeverity.info}`);
  console.log('');

  // Show top issues if any
  if (results.violations.length > 0) {
    console.log('Top Issues:');
    results.violations.slice(0, 5).forEach((v, i) => {
      const severity = v.rule?.severity?.toUpperCase() || 'UNKNOWN';
      console.log(`  ${i + 1}. [${severity}] ${v.message}`);
    });
    if (results.violations.length > 5) {
      console.log(`  ... and ${results.violations.length - 5} more`);
    }
  } else {
    console.log('No security issues found!');
  }

  console.log('\n========================================\n');

  await browser.close();
})();
