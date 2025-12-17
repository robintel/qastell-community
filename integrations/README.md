# QAstell Integration Examples

Real-world examples demonstrating QAstell with popular test frameworks and reporting tools.

All examples test against [The Internet](https://the-internet.herokuapp.com) - a reliable test automation demo site by Selenium with forms, login pages, and various UI patterns.

## Examples

### Playwright + HTML Reporter
The default Playwright reporter with QAstell security summaries attached.

```bash
cd playwright-html
npm install
npm test
npm run report  # Open the HTML report
npm run clean   # Remove generated files
```

### Playwright + Allure Reporter
Rich Allure reports with QAstell security findings, labels, and attachments.

```bash
cd playwright-allure
npm install
npm test
npm run report  # Generate and open Allure report
npm run clean   # Remove generated files
```

### Cypress + Mochawesome Reporter
Cypress E2E tests with QAstell security audits in Mochawesome reports.

```bash
cd cypress-mochawesome
npm install
npm test
npm run report  # Merge and view Mochawesome report
npm run clean   # Remove generated files
```

### Puppeteer + Jest + HTML Reporter
Puppeteer automation with Jest test framework and HTML reporting.

```bash
cd puppeteer-jest
npm install
npm test
# Report generated at test-report/index.html
npm run clean   # Remove generated files
```

### WebDriverIO + Allure Reporter
WebDriverIO browser automation with rich Allure reporting.

```bash
cd webdriverio-allure
npm install
npm test
npm run report  # Generate and open Allure report
npm run clean   # Remove generated files
```

## Cleanup

Each example includes a `clean` script to remove all generated files:

```bash
npm run clean
```

This removes test results, reports, screenshots, videos, and QAstell HTML reports.

To clean all examples at once from the integrations directory:

```bash
for dir in */; do (cd "$dir" && npm run clean 2>/dev/null); done
```

## What's Demonstrated

Each example shows:

1. **Real Security Testing** - Testing a real web application with various UI patterns
2. **Framework Integration** - How QAstell works with each framework's API
3. **Report Connectors** - Using QAstell's report connectors to attach security findings
4. **Multiple Pages** - Auditing different pages (login, forms, inputs, etc.)
5. **Filtering** - Using category/rule filters to focus on specific security areas
6. **Report Sizes** - Comparing full reports (~50KB) vs summaries (~5KB)

## Report Connectors Used

| Example | Connector | Output |
|---------|-----------|--------|
| Playwright + HTML | `PlaywrightConnector` | HTML attachments in trace viewer |
| Playwright + Allure | `AllureConnector` | HTML attachments + labels for filtering |
| Cypress + Mochawesome | `MochawesomeConnector` | JSON data in test context |
| Puppeteer + Jest | Console logs | Captured in jest-html-reporter |
| WebDriverIO + Allure | `@wdio/allure-reporter` | Custom steps + HTML attachments |

## Understanding the Results

The examples audit [The Internet](https://the-internet.herokuapp.com), a test automation demo site. You may see security issues - this demonstrates how QAstell identifies real vulnerabilities.

In your real applications, you would:
- Assert no violations: `await auditor.assertNoViolations()`
- Set severity thresholds: `expect(results.summary.bySeverity.critical).toBe(0)`
- Allow known issues: `await auditor.assertNoViolations({ allowedViolations: ['rule-id'] })`

## Prerequisites

- Node.js 18+
- For Cypress: Chrome/Chromium browser
- For Allure: Java runtime (for `allure` CLI) or use Docker
- Network access to the-internet.herokuapp.com
