/**
 * WebDriverIO Configuration for QAstell + Allure Example
 *
 * This configuration sets up WebDriverIO with:
 * - Chrome browser in headless mode
 * - Mocha test framework
 * - Allure and Spec reporters
 * - TypeScript support via ts-node
 */

// WebDriverIO v9 config uses a different type structure
// We export a plain object that conforms to the expected shape
export const config = {
  runner: 'local',

  specs: ['./tests/**/*.ts'],
  exclude: [],

  maxInstances: 1,
  capabilities: [
    {
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: ['--headless=new', '--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
      },
    },
  ],

  logLevel: 'warn',
  bail: 0,
  baseUrl: 'https://the-internet.herokuapp.com',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  // WebDriverIO v9 handles browser drivers automatically
  services: [],

  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },

  reporters: [
    'spec',
    [
      'allure',
      {
        outputDir: 'allure-results',
        // Disable low-level WebDriverIO command logging (e.g., getElementAttribute, $, $$)
        // This makes reports cleaner by only showing meaningful test steps
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false,
      },
    ],
  ],
};
