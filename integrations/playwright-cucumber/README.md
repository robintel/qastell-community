# QAstell + Playwright + Cucumber Example

This example demonstrates how to integrate QAstell security auditing with Playwright and Cucumber BDD.

## Features

- **BDD-style security tests** - Write security scenarios in Gherkin syntax
- **Playwright browser automation** - Fast, reliable browser control
- **Cucumber HTML reports** - Security results embedded in Cucumber reports
- **TypeScript support** - Full type safety

> **Note:** This example uses Cucumber's built-in HTML reporter. For better visualization of Scenario Outlines (where each example appears as a separate entry), see the [playwright-cucumber-multi](../playwright-cucumber-multi/) example which uses `multiple-cucumber-html-reporter`.

## Quick Start

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium

# Run tests
npm test
```

## Project Structure

```
playwright-cucumber/
├── features/                 # Gherkin feature files
│   └── security-audit.feature
├── steps/                    # Step definitions
│   └── security.steps.ts
├── support/                  # Cucumber support files
│   ├── world.ts              # Custom World with Playwright
│   └── hooks.ts              # Before/After hooks
├── cucumber.js               # Cucumber configuration
├── tsconfig.json
└── package.json
```

## How It Works

### 1. Feature File (Gherkin)

```gherkin
@security
Feature: Security Audit with QAstell

  Scenario: Audit the login page
    Given the browser is launched
    When I navigate to "https://example.com/login"
    And I perform a security audit focusing on "forms,sensitive-data"
    Then the security audit should pass
    And the audit results should be attached to the report
```

### 2. Step Definitions

#### New Architecture (Recommended)

QAstell v0.7+ introduces a new **formatters + adapters** architecture:

```typescript
import { When, Then } from '@cucumber/cucumber';
import { SecurityAuditor, ReportConnector, adapters } from 'qastell';

When('I perform a security audit', async function() {
  const auditor = new SecurityAuditor(this.page);
  this.auditResults = await auditor.audit();
});

Then('the audit results should be attached to the report', async function() {
  // Create adapter for Cucumber (uses World context)
  const adapter = adapters.cucumber(this);
  const connector = new ReportConnector(adapter);

  // Attach results with markdown inline
  await connector.attach(this.auditResults, {
    inline: 'markdown',
  });
});
```

#### Legacy Approach (Still Supported)

```typescript
import { When, Then } from '@cucumber/cucumber';
import { SecurityAuditor } from 'qastell';
import { CucumberConnector } from 'qastell/connectors';

const connector = new CucumberConnector();

When('I perform a security audit', async function() {
  const auditor = new SecurityAuditor(this.page);
  this.auditResults = await auditor.audit();
});

Then('the audit results should be attached to the report', async function() {
  await connector.attachSummary(this.auditResults, this);
});
```

### 3. Custom World

The `PlaywrightWorld` class manages browser lifecycle:

```typescript
export class PlaywrightWorld extends World {
  browser!: Browser;
  page!: Page;
  auditResults?: AuditResults;

  async init() {
    this.browser = await chromium.launch();
    this.page = await this.browser.newPage();
  }
}
```

## Reports

After running tests, reports are generated in the `reports/` directory:

- `reports/cucumber-report.html` - HTML report with embedded security results
- `reports/cucumber-report.json` - JSON report for CI integration

## Configuration

### Cucumber Options

Edit `cucumber.js` to customize:

```javascript
module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['steps/**/*.ts', 'support/**/*.ts'],
    paths: ['features/**/*.feature'],
    format: ['progress-bar', 'html:reports/cucumber-report.html'],
  },
};
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
