/**
 * Global teardown - generates the aggregated QAstell security report
 * after all tests complete.
 *
 * Note: We write to a separate 'qastell-report' directory because
 * Playwright's HTML reporter may overwrite 'playwright-report' after
 * this teardown runs.
 */

import { PlaywrightConnector } from 'qastell/connectors';

export default async function globalTeardown() {
  // Temp files are stored in playwright-report/.qastell-temp (set by tests)
  // We write the final report to qastell-report/ to avoid being overwritten
  const connector = new PlaywrightConnector({ outputDir: 'playwright-report' });
  const result = await connector.generateAggregatedReport({ outputDir: 'qastell-report' });

  if (result.success) {
    console.log(`\nQAstell aggregated security report: qastell-report/${connector.getReportFilename()}`);

    // Clean up temp files after successful report generation
    connector.clearResults();
  } else {
    console.log(`\nFailed to generate QAstell report: ${result.error}`);
  }
}
