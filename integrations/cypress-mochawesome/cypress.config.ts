import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'https://the-internet.herokuapp.com',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    setupNodeEvents(on, config) {
      // Required for cypress-mochawesome-reporter to generate HTML
      require('cypress-mochawesome-reporter/plugin')(on);

      // Pass QASTELL_LICENSE env var to the browser
      config.env.QASTELL_LICENSE = process.env.QASTELL_LICENSE;
      return config;
    },
    // Mochawesome reporter configuration
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
      reportDir: 'cypress/results',
      overwrite: false,
      html: true,
      json: true,
      charts: true,
      embeddedScreenshots: true,
      inlineAssets: true,
    },
    // Video recording for debugging
    video: false,
    screenshotOnRunFailure: true,
  },
});
