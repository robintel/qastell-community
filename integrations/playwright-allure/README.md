# QAstell + Playwright + Allure 3 (Beta) Example

This example demonstrates QAstell security auditing with Playwright tests and **Allure 3** (beta) reporting.

> **Note:** This example uses Allure 3, which is currently in beta. For production use, we recommend the [Playwright + Allure 2](../playwright-allure2/) example which uses the stable Allure 2 version.

## Allure 2 vs Allure 3

| Feature | Allure 3 (this example) | Allure 2 (stable) |
|---------|------------------------|-------------------|
| Status | **Beta** | Stable |
| Reporter | `allure-playwright@3.x` | `allure-playwright@2.x` |
| Results Format | JSON | XML |
| Java Required | Yes | Yes |

## Quick Start

```bash
# Install dependencies
npm install

# Run tests
npm test

# Generate and view Allure report
npm run report
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm test` | Run Playwright tests in headless mode |
| `npm run test:headed` | Run tests with browser visible |
| `npm run allure:generate` | Generate Allure report from results |
| `npm run allure:open` | Open the Allure report in browser |
| `npm run report` | Generate and open report (combined) |
| `npm run clean` | Remove all generated files |

## Project Structure

```
playwright-allure/
├── tests/                # Test files
├── allure-results/       # Raw Allure results (generated)
├── allure-report/        # Allure HTML report (generated)
├── qastell-report/       # QAstell HTML reports (generated)
├── playwright.config.ts  # Playwright configuration
└── package.json
```

## Cleanup

To remove all generated files and start fresh:

```bash
npm run clean
```

This removes:
- `allure-results/` - Raw Allure test results
- `allure-report/` - Generated Allure HTML report
- `qastell-report/` - QAstell HTML reports
- `playwright-report/` - Playwright HTML report
- `test-results/` - Playwright test artifacts

## How It Works

1. Playwright runs tests against the target site
2. QAstell audits each page for security vulnerabilities
3. `AllureConnector` attaches results to the Allure report:
   - Summary with severity breakdown
   - Full HTML report as attachment
   - Labels for filtering (epic, feature, severity)
4. Allure generates a rich interactive report

## Allure Report Features

- **Suites view** - Tests organized by describe blocks
- **Graphs** - Pass/fail charts, duration trends
- **Attachments** - QAstell HTML reports viewable inline
- **Labels** - Filter by security severity, category
- **History** - Track results over time

## Configuration

### Playwright Config
```typescript
reporter: [
  ['allure-playwright'],
],
```

### QAstell Allure Connector
```typescript
import { AllureConnector } from 'qastell/connectors';

const connector = new AllureConnector();
await connector.attachSummary(results, allure, {
  attachFullReport: true,  // Include downloadable HTML
});
```

## Prerequisites

- **Java Runtime** - Required for Allure CLI
- Or use **Docker**: `docker run -p 8080:8080 frankescobar/allure-docker-service`

## Common Patterns

### Basic Audit

```typescript
import { SecurityAuditor } from 'qastell';

const auditor = new SecurityAuditor(page);
const results = await auditor.audit();
console.log(`Found ${results.summary.total} issues`);
```

### Fail on High Severity

```typescript
await auditor.assertNoViolations({ minSeverity: 'high' });
```

### Filter by Category

```typescript
// Only check headers and cookies
const results = await auditor.audit({
  include: ['headers', 'cookies']
});

// Check everything except links
const results = await auditor.audit({
  exclude: ['links']
});
```

### Generate HTML Report

```typescript
const results = await auditor.audit();

// Full detailed report
const html = results.toHTML();

// Compact summary report
const summary = results.toSummaryHTML();
```

## License Configuration

QAstell works without a license (Free tier: 10 scans/day, HTML reports).

For higher tiers, set your license key:

```bash
# Environment variable
export QASTELL_LICENSE="your-license-key"

# Or inline
QASTELL_LICENSE="key" npx playwright test
```

Or in code:

```typescript
import { initLicense } from 'qastell';
initLicense(process.env.QASTELL_LICENSE);
```

## Documentation

- [Playwright Guide](https://qastell.eu/docs-playwright.html)
- [Full Documentation](https://qastell.eu/docs.html)
- [API Reference](https://qastell.eu/docs.html#advanced-configuration)

## Troubleshooting

### "allure: command not found"
Install Allure CLI:
```bash
# macOS
brew install allure

# npm (requires Java)
npm install -g allure-commandline

# Or use npx
npx allure generate
```

### Report shows no data
Ensure tests ran and generated `allure-results/`:
```bash
ls allure-results/
```
