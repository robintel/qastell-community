/**
 * WebDriverIO 8 Configuration for QAstell + Allure 2 Example
 *
 * This configuration sets up WebDriverIO 8 with:
 * - Chrome browser in headless mode
 * - Mocha test framework
 * - Allure 2 and Spec reporters
 * - TypeScript support via ts-node
 */

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
