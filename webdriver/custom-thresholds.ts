/**
 * Custom Thresholds Example for Selenium WebDriver
 *
 * This example shows how to configure severity thresholds to gradually
 * adopt security scanning without breaking your build on day one.
 */

import { Builder, WebDriver } from 'selenium-webdriver';
import { SecurityAuditor } from 'qastell';

async function allowInfoAndLow() {
  const driver: WebDriver = await new Builder().forBrowser('chrome').build();
  await driver.get('https://your-app.com');

  const auditor = new SecurityAuditor(driver);

  // Only fail on medium+ severity - allow info and low
  await auditor.assertNoViolations({
    thresholds: {
      info: 999,    // Allow unlimited info-level issues
      low: 50,      // Allow up to 50 low-severity issues
      medium: 0,    // Fail on any medium severity
      high: 0,      // Fail on any high severity
      critical: 0,  // Fail on any critical severity
    },
  });

  await driver.quit();
}

async function gradualAdoption() {
  const driver: WebDriver = await new Builder().forBrowser('chrome').build();
  await driver.get('https://your-app.com');

  const auditor = new SecurityAuditor(driver);

  // Start permissive, tighten over time
  // Week 1: Only fail on critical
  await auditor.assertNoViolations({
    thresholds: {
      info: 999,
      low: 999,
      medium: 999,
      high: 999,
      critical: 0,
    },
  });

  // Week 2: Fail on critical and high
  // await auditor.assertNoViolations({
  //   thresholds: {
  //     info: 999,
  //     low: 999,
  //     medium: 999,
  //     high: 0,
  //     critical: 0,
  //   },
  // });

  // Week 3: Fail on medium+
  // await auditor.assertNoViolations({
  //   thresholds: {
  //     info: 999,
  //     low: 999,
  //     medium: 0,
  //     high: 0,
  //     critical: 0,
  //   },
  // });

  await driver.quit();
}

async function perRuleThresholds() {
  const driver: WebDriver = await new Builder().forBrowser('chrome').build();
  await driver.get('https://your-app.com');

  const auditor = new SecurityAuditor(driver);

  // Set different thresholds for specific rules
  await auditor.assertNoViolations({
    ruleThresholds: {
      'missing-sri-attribute': 5,    // Allow up to 5 missing SRI
      'inline-event-handlers': 10,   // Legacy code being refactored
      'cookie-without-secure': 2,    // Tracked in JIRA-456
    },
    // Per-rule thresholds take precedence over severity thresholds
    thresholds: {
      info: 50,
      low: 10,
      medium: 0,
      high: 0,
      critical: 0,
    },
  });

  await driver.quit();
}

async function allowKnownViolations() {
  const driver: WebDriver = await new Builder().forBrowser('chrome').build();
  await driver.get('https://your-app.com');

  const auditor = new SecurityAuditor(driver);

  // Allow specific known issues you're planning to fix
  await auditor.assertNoViolations({
    allowedViolations: [
      'missing-csp-header',        // Tracked in JIRA-123
      'inline-event-handlers',     // Legacy code, refactoring in Q2
    ],
  });

  await driver.quit();
}

// Run examples
(async () => {
  console.log('Testing thresholds...');
  await allowInfoAndLow();
  await gradualAdoption();
  await perRuleThresholds();
  await allowKnownViolations();
  console.log('Done!');
})().catch(console.error);
