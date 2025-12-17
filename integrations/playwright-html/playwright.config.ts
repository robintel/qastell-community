import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Generate aggregated QAstell security report after all tests
  globalTeardown: './global-teardown.ts',

  // HTML reporter with attachments embedded
  reporter: [
    ['html', {
      open: 'never',
      outputFolder: 'playwright-report',
    }],
    ['list'],
  ],

  use: {
    // Base URL for the test site
    baseURL: 'https://the-internet.herokuapp.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  // Preserve test output including attachments
  outputDir: './test-results',
  preserveOutput: 'always',

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
