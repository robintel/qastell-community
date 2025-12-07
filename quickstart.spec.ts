/**
 * QAstell Quickstart Example
 *
 * Run this example from the repo root:
 *
 *   cd examples && npx playwright test quickstart.spec.ts --reporter=list
 *
 * Or try it in a fresh directory (uses npm package):
 *
 *   mkdir qastell-demo && cd qastell-demo
 *   npm init -y
 *   npm install qastell @playwright/test
 *   npx playwright install chromium
 *   cat > quickstart.spec.ts << 'EOF'
 *   import { test } from '@playwright/test';
 *   import { SecurityAuditor } from 'qastell';
 *   test('security audit', async ({ page }) => {
 *     await page.goto('https://qastell.eu');
 *     const auditor = new SecurityAuditor(page);
 *     const results = await auditor.audit();
 *     console.log(`Found ${results.summary.total} issues`);
 *   });
 *   EOF
 *   npx playwright test quickstart.spec.ts --reporter=list
 */

import { test } from '@playwright/test';
// Use relative import for local development, 'qastell' for npm package
import { SecurityAuditor } from '../dist';

test('QAstell security audit - qastell.eu', async ({ page }) => {
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

  // Optional: fail test if critical or high severity issues found
  // await auditor.assertNoViolations({ minSeverity: 'high' });
});
