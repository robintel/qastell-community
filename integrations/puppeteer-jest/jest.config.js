/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  testTimeout: 60000, // 60 seconds for network tests
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        pageTitle: 'QAstell Security Audit Report',
        outputPath: 'test-report/index.html',
        includeFailureMsg: true,
        includeSuiteFailure: true,
        includeConsoleLog: true,
        dateFormat: 'yyyy-mm-dd HH:MM:ss',
      },
    ],
  ],
};
