/**
 * QAstell Quickstart Example for Selenium WebDriver
 *
 * Run this example:
 *
 *   npx ts-node webdriver/quickstart.ts
 *
 * Or try it in a fresh directory (uses npm package):
 *
 *   mkdir qastell-demo && cd qastell-demo
 *   npm init -y
 *   npm install qastell selenium-webdriver
 *   cat > quickstart.ts << 'EOF'
 *   import { Builder } from 'selenium-webdriver';
 *   import { SecurityAuditor } from 'qastell';
 *   (async () => {
 *     const driver = await new Builder().forBrowser('chrome').build();
 *     await driver.get('https://qastell.eu');
 *     const auditor = new SecurityAuditor(driver);
 *     const results = await auditor.audit();
 *     console.log(`Found ${results.summary.total} issues`);
 *     await driver.quit();
 *   })();
 *   EOF
 *   npx ts-node quickstart.ts
 */

import { Builder, WebDriver } from 'selenium-webdriver';
// Use relative import for local development, 'qastell' for npm package
import { SecurityAuditor } from '../../dist';

(async () => {
  const driver: WebDriver = await new Builder().forBrowser('chrome').build();

  // Navigate to the target page
  await driver.get('https://qastell.eu');

  // Create auditor and run security scan
  const auditor = new SecurityAuditor(driver);
  const results = await auditor.audit();

  // Display results
  console.log('\n========================================');
  console.log('         QAstell Security Report        ');
  console.log('========================================\n');
  console.log(`URL: ${await driver.getCurrentUrl()}`);
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

  await driver.quit();
})();
