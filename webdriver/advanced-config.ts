/**
 * QAstell Advanced Configuration Example for Selenium WebDriver
 *
 * Demonstrates advanced options including:
 * - Framework detection and override
 * - Custom rule sets
 * - Combining options
 * - Using exported utilities
 *
 * Run this example:
 *   npx ts-node webdriver/advanced-config.ts
 */

import { Builder, WebDriver } from 'selenium-webdriver';
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
  const driver: WebDriver = await new Builder().forBrowser('chrome').build();

  try {
    console.log('\n========================================');
    console.log('   QAstell Advanced Configuration Demo  ');
    console.log('========================================\n');

    // -------------------------------------------------------------------------
    // 1. Framework Detection
    // -------------------------------------------------------------------------
    console.log('1. Framework Detection');
    console.log('   -------------------');

    await driver.get(targetUrl);

    // detectFramework tells you what QAstell detected
    const framework = detectFramework(driver);
    console.log(`   Detected framework: ${framework}`);

    // The auditor also exposes the detected framework
    const auditor1 = new SecurityAuditor(driver);
    console.log(`   Auditor framework: ${auditor1.getFramework()}`);

    // -------------------------------------------------------------------------
    // 2. Force Framework Override
    // -------------------------------------------------------------------------
    console.log('\n2. Force Framework Override');
    console.log('   ------------------------');

    await driver.get(targetUrl);

    // In rare cases where auto-detection doesn't work,
    // you can force the framework explicitly
    const auditor2 = new SecurityAuditor(driver, { framework: 'webdriver' });
    console.log(`   Forced framework: ${auditor2.getFramework()}`);

    // Note: WebDriver cannot access HTTP response headers,
    // so 'headers' category won't find issues
    const results2 = await auditor2.audit({ include: ['forms'] });
    console.log(`   Audit completed: ${results2.raw.results.length} rules checked`);

    // -------------------------------------------------------------------------
    // 3. Custom Rule Subset
    // -------------------------------------------------------------------------
    console.log('\n3. Custom Rule Subset');
    console.log('   ------------------');

    await driver.get(targetUrl);

    // Filter rules to only include specific categories
    const formRules = allRules.filter((r) => r.category === 'forms');
    console.log(`   Using ${formRules.length} form rules out of ${allRules.length} total`);

    const auditor3 = new SecurityAuditor(driver, { rules: formRules });
    const results3 = await auditor3.audit();
    console.log(`   Found ${results3.violations.length} form-related issues`);

    // -------------------------------------------------------------------------
    // 4. Combine Framework and Rules
    // -------------------------------------------------------------------------
    console.log('\n4. Combine Framework and Rules');
    console.log('   ----------------------------');

    await driver.get(targetUrl);

    const linkRules = allRules.filter((r) => r.category === 'links');

    const auditor4 = new SecurityAuditor(driver, {
      framework: 'webdriver',
      rules: linkRules,
    });

    console.log(`   Framework: ${auditor4.getFramework()}`);
    console.log(`   Rules: ${linkRules.length} link rules`);

    const results4 = await auditor4.audit();
    console.log(`   Found ${results4.violations.length} link-related issues`);

    // -------------------------------------------------------------------------
    // 5. Library Version
    // -------------------------------------------------------------------------
    console.log('\n5. Library Version');
    console.log('   ----------------');

    console.log(`   QAstell version: ${VERSION}`);

    // Version also appears in HTML reports
    await driver.get(targetUrl);
    const auditor5 = new SecurityAuditor(driver);
    const results5 = await auditor5.audit({ include: ['links'] });

    const reporter = new HtmlReporter();
    const html = reporter.generate(results5.raw);
    const versionInReport = html.includes(`v${VERSION}`);
    console.log(`   Version in HTML report footer: ${versionInReport ? 'Yes' : 'No'}`);

    // -------------------------------------------------------------------------
    // 6. Legacy Array Syntax
    // -------------------------------------------------------------------------
    console.log('\n6. Legacy Array Syntax (Backwards Compatibility)');
    console.log('   ----------------------------------------------');

    await driver.get(targetUrl);

    const cookieRules = allRules.filter((r) => r.category === 'cookies');

    // Legacy syntax: pass rules array directly (still supported)
    const auditor6 = new SecurityAuditor(driver, cookieRules);
    const results6 = await auditor6.audit();

    console.log(`   Legacy syntax works: Yes`);
    console.log(`   Found ${results6.violations.length} cookie-related issues`);

    console.log('\n========================================');
    console.log('   All demos completed successfully!   ');
    console.log('========================================\n');

  } finally {
    await driver.quit();
  }
}

main().catch(console.error);
