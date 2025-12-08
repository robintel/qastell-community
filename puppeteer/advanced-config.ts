/**
 * QAstell Advanced Configuration Example for Puppeteer
 *
 * Demonstrates advanced options including:
 * - Framework detection and override
 * - Custom rule sets
 * - Combining options
 * - Using exported utilities
 *
 * Run this example:
 *   npx ts-node puppeteer/advanced-config.ts
 */

import puppeteer from 'puppeteer';
// Use relative import for local development, 'qastell' for npm package
import {
  SecurityAuditor,
  detectFramework,
  allRules,
  VERSION,
  HtmlReporter,
} from '../../dist';

const targetUrl = 'https://qastell.eu';

async function main() {
  const browser = await puppeteer.launch({ headless: true });

  try {
    console.log('\n========================================');
    console.log('   QAstell Advanced Configuration Demo  ');
    console.log('========================================\n');

    // -------------------------------------------------------------------------
    // 1. Framework Detection
    // -------------------------------------------------------------------------
    console.log('1. Framework Detection');
    console.log('   -------------------');

    const page1 = await browser.newPage();
    await page1.goto(targetUrl);

    // detectFramework tells you what QAstell detected
    const framework = detectFramework(page1);
    console.log(`   Detected framework: ${framework}`);

    // The auditor also exposes the detected framework
    const auditor1 = new SecurityAuditor(page1);
    console.log(`   Auditor framework: ${auditor1.getFramework()}`);
    await page1.close();

    // -------------------------------------------------------------------------
    // 2. Force Framework Override
    // -------------------------------------------------------------------------
    console.log('\n2. Force Framework Override');
    console.log('   ------------------------');

    const page2 = await browser.newPage();
    await page2.goto(targetUrl);

    // In rare cases where auto-detection doesn't work,
    // you can force the framework explicitly
    const auditor2 = new SecurityAuditor(page2, { framework: 'puppeteer' });
    console.log(`   Forced framework: ${auditor2.getFramework()}`);

    const results2 = await auditor2.audit({ include: ['headers'] });
    console.log(`   Audit completed: ${results2.raw.results.length} rules checked`);
    await page2.close();

    // -------------------------------------------------------------------------
    // 3. Custom Rule Subset
    // -------------------------------------------------------------------------
    console.log('\n3. Custom Rule Subset');
    console.log('   ------------------');

    const page3 = await browser.newPage();
    await page3.goto(targetUrl);

    // Filter rules to only include specific categories
    const headerRules = allRules.filter((r) => r.category === 'headers');
    console.log(`   Using ${headerRules.length} header rules out of ${allRules.length} total`);

    const auditor3 = new SecurityAuditor(page3, { rules: headerRules });
    const results3 = await auditor3.audit();
    console.log(`   Found ${results3.violations.length} header-related issues`);
    await page3.close();

    // -------------------------------------------------------------------------
    // 4. Combine Framework and Rules
    // -------------------------------------------------------------------------
    console.log('\n4. Combine Framework and Rules');
    console.log('   ----------------------------');

    const page4 = await browser.newPage();
    await page4.goto(targetUrl);

    const formRules = allRules.filter((r) => r.category === 'forms');

    const auditor4 = new SecurityAuditor(page4, {
      framework: 'puppeteer',
      rules: formRules,
    });

    console.log(`   Framework: ${auditor4.getFramework()}`);
    console.log(`   Rules: ${formRules.length} form rules`);

    const results4 = await auditor4.audit();
    console.log(`   Found ${results4.violations.length} form-related issues`);
    await page4.close();

    // -------------------------------------------------------------------------
    // 5. Library Version
    // -------------------------------------------------------------------------
    console.log('\n5. Library Version');
    console.log('   ----------------');

    console.log(`   QAstell version: ${VERSION}`);

    // Version also appears in HTML reports
    const page5 = await browser.newPage();
    await page5.goto(targetUrl);
    const auditor5 = new SecurityAuditor(page5);
    const results5 = await auditor5.audit({ include: ['headers'] });

    const reporter = new HtmlReporter();
    const html = reporter.generate(results5.raw);
    const versionInReport = html.includes(`v${VERSION}`);
    console.log(`   Version in HTML report footer: ${versionInReport ? 'Yes' : 'No'}`);
    await page5.close();

    // -------------------------------------------------------------------------
    // 6. Legacy Array Syntax
    // -------------------------------------------------------------------------
    console.log('\n6. Legacy Array Syntax (Backwards Compatibility)');
    console.log('   ----------------------------------------------');

    const page6 = await browser.newPage();
    await page6.goto(targetUrl);

    const linkRules = allRules.filter((r) => r.category === 'links');

    // Legacy syntax: pass rules array directly (still supported)
    const auditor6 = new SecurityAuditor(page6, linkRules);
    const results6 = await auditor6.audit();

    console.log(`   Legacy syntax works: Yes`);
    console.log(`   Found ${results6.violations.length} link-related issues`);
    await page6.close();

    console.log('\n========================================');
    console.log('   All demos completed successfully!   ');
    console.log('========================================\n');

  } finally {
    await browser.close();
  }
}

main().catch(console.error);
