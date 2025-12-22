/**
 * Cucumber Hooks for Playwright + QAstell
 *
 * Manages browser lifecycle and attaches audit results on failure.
 */

import { Before, After, Status } from '@cucumber/cucumber';
import { PlaywrightWorld } from './world';
import { CucumberConnector } from 'qastell/connectors';

const connector = new CucumberConnector();

Before(async function (this: PlaywrightWorld) {
  await this.init();
});

After(async function (this: PlaywrightWorld, scenario) {
  // Save report and attach link if scenario failed and we have audit results
  if (scenario.result?.status !== Status.PASSED && this.auditResults) {
    const scenarioName = scenario.pickle.name.replace(/\s+/g, '-').toLowerCase();
    console.log(`Scenario failed, saving security report...`);
    await connector.saveAndLinkReport(this.auditResults, this, {
      outputDir: 'reports',
      filename: `qastell-${scenarioName}`,
    });
  }

  await this.cleanup();
});
