# QAstell + Playwright + Cucumber + Multiple Cucumber HTML Reporter

This example demonstrates how to integrate QAstell security auditing with Playwright, Cucumber BDD, and **multiple-cucumber-html-reporter** for enhanced reporting.

## Why Use multiple-cucumber-html-reporter?

The built-in Cucumber HTML reporter has limitations with **Scenario Outlines** - it may not properly display all examples as separate entries. The `multiple-cucumber-html-reporter` package provides:

- **Proper Scenario Outline support** - Each example is displayed as a separate entry
- **Better visualization** - Charts, statistics, and detailed breakdowns
- **Metadata support** - Browser, platform, and custom data
- **Feature/Scenario filtering** - Easy navigation through large test suites

## Features

- **BDD-style security tests** - Write security scenarios in Gherkin syntax
- **Playwright browser automation** - Fast, reliable browser control
- **Enhanced HTML reports** - Better visualization of Scenario Outlines
- **QAstell integration** - Security audit results embedded in reports
- **TypeScript support** - Full type safety

## Quick Start

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium

# Run tests and generate report
npm run test:report
```

## Project Structure

```
playwright-cucumber-multi/
├── features/                 # Gherkin feature files
│   └── security-audit.feature
├── steps/                    # Step definitions
│   └── security.steps.ts
├── support/                  # Cucumber support files
│   ├── world.ts              # Custom World with Playwright
│   └── hooks.ts              # Before/After hooks
├── scripts/                  # Report generation
│   └── generate-report.js    # multiple-cucumber-html-reporter script
├── cucumber.js               # Cucumber configuration
├── tsconfig.json
└── package.json
```

## How It Works

### 1. Run Tests (JSON Output Only)

Cucumber is configured to output JSON only (no built-in HTML):

```javascript
// cucumber.js
format: [
  'progress-bar',
  'json:reports/cucumber-report.json',
]
```

### 2. Generate Enhanced HTML Report

After tests complete, run the report generator:

```bash
npm run report
```

This uses `multiple-cucumber-html-reporter` to create a comprehensive HTML report at `reports/html/index.html`.

### 3. Combined Command

Run tests and generate report in one step:

```bash
npm run test:report
```

## Scenario Outline Example

This example includes a Scenario Outline that tests multiple pages:

```gherkin
Scenario Outline: Audit different pages for security issues
  Given the browser is launched
  When I navigate to "<url>"
  And I perform a security audit
  Then the security audit should pass
  And the audit results should be attached to the report

  Examples:
    | page       | url                                                 |
    | checkboxes | https://the-internet.herokuapp.com/checkboxes       |
    | dropdown   | https://the-internet.herokuapp.com/dropdown         |
    | inputs     | https://the-internet.herokuapp.com/inputs           |
```

In the generated HTML report, each example (checkboxes, dropdown, inputs) appears as a **separate scenario entry** with its own results and QAstell security audit attachment.

## Reports

After running `npm run test:report`:

- `reports/cucumber-report.json` - Raw JSON data
- `reports/html/index.html` - Enhanced HTML report with:
  - Feature overview with charts
  - Individual scenario results
  - Proper Scenario Outline example breakdowns
  - QAstell security audit attachments
  - Execution metadata

## Configuration

### Cucumber Options

Edit `cucumber.js` for test configuration:

```javascript
module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['steps/**/*.ts', 'support/**/*.ts'],
    paths: ['features/**/*.feature'],
    format: ['progress-bar', 'json:reports/cucumber-report.json'],
  },
};
```

### Report Options

Edit `scripts/generate-report.js` for report customization:

```javascript
report.generate({
  jsonDir: 'reports',
  reportPath: 'reports/html',
  metadata: {
    browser: { name: 'chromium', version: 'latest' },
    // ...
  },
  customData: {
    title: 'Test Information',
    data: [
      { label: 'Project', value: 'Your Project Name' },
      // ...
    ],
  },
});
```

### Tags

Run specific scenarios using tags:

```bash
# Run only login tests
npm test -- --tags @login

# Run all security tests
npm test -- --tags @security

# Exclude slow tests
npm test -- --tags "not @slow"
```

## Comparison: Built-in vs multiple-cucumber-html-reporter

| Feature | Built-in HTML | multiple-cucumber-html-reporter |
|---------|---------------|----------------------------------|
| Scenario Outline examples | May group together | Shows each example separately |
| Charts/Statistics | Basic | Comprehensive |
| Attachments | Simple display | Enhanced rendering |
| Metadata | Limited | Full support |
| Filtering | None | Feature/scenario filtering |

## New Architecture (Recommended)

QAstell v0.7+ introduces a new **formatters + adapters** architecture:

```typescript
import { After } from '@cucumber/cucumber';
import { ReportConnector, adapters } from 'qastell';

After(async function() {
  if (this.auditResults) {
    // Create adapter for Cucumber
    const adapter = adapters.cucumber(this);
    const connector = new ReportConnector(adapter);

    // Attach results
    await connector.attach(this.auditResults, {
      inline: 'markdown',
    });
  }
});
```

### Benefits of the New Architecture

- **Single `adapters.cucumber()` function** - Works with any Cucumber World context
- **Formatters are tier-gated** - JSON/JUnit require Enterprise+, SARIF requires Corporate
- **More output formats** - HTML, Markdown, JSON, JUnit XML, SARIF
- **Customizable** - Create your own adapter for any reporter

## Architecture

This example uses the **formatters + adapters** pattern:

```
AuditResults → ReportConnector → CucumberAdapter → World.attach()
                     ↓
              formatters.markdown() / formatters.html()
```

- **Formatters** transform audit results into output formats (markdown, HTML, JSON, etc.)
- **Adapters** interface with specific reporters (Cucumber World, Allure, Playwright testInfo)
- **ReportConnector** orchestrates formatters and adapters

See [ARCHITECTURE.md](../../../ARCHITECTURE.md) for detailed documentation.

## License

See the main QAstell repository for license information.
