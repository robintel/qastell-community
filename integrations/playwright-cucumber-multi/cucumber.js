module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['steps/**/*.ts', 'support/**/*.ts'],
    paths: ['features/**/*.feature'],
    format: [
      'progress-bar',
      // JSON format for multiple-cucumber-html-reporter
      'json:reports/cucumber-report.json',
    ],
    formatOptions: {
      snippetInterface: 'async-await',
    },
  },
};
