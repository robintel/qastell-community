# QAstell + Puppeteer + Jest Example

This example demonstrates QAstell security auditing with Puppeteer browser automation and Jest test framework.

## Quick Start

```bash
# Install dependencies
npm install

# Run tests
npm test

# View the report at test-report/index.html
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm test` | Run Jest tests |
| `npm run test:verbose` | Run tests with detailed output |
| `npm run clean` | Remove all generated files |

## Project Structure

```
puppeteer-jest/
├── tests/                # Test files
├── test-report/          # Jest HTML report (generated)
├── coverage/             # Code coverage (if enabled)
├── qastell-report/       # QAstell HTML reports (generated)
├── jest.config.js        # Jest configuration
└── package.json
```

## Cleanup

To remove all generated files and start fresh:

```bash
npm run clean
```

This removes:
- `test-report/` - Jest HTML report
- `coverage/` - Jest coverage reports
- `qastell-report/` - QAstell HTML reports

## How It Works

1. Jest runs tests using Puppeteer for browser automation
2. Each test launches a browser and navigates to pages
3. QAstell audits each page for security vulnerabilities
4. Results are logged and saved as HTML reports
5. `jest-html-reporter` generates an HTML test report

## Example Test

```typescript
import puppeteer from 'puppeteer';
import { SecurityAuditor } from 'qastell';

describe('Security Audit', () => {
  it('should pass security audit', async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://example.com');

    const auditor = new SecurityAuditor(page);
    const results = await auditor.audit();

    // Save report
    const html = results.toHTML();
    fs.writeFileSync('qastell-report/report.html', html);

    // Assert no violations
    expect(results.passed()).toBe(true);

    await browser.close();
  });
});
```

## Configuration

### Jest Config (`jest.config.js`)
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  reporters: [
    'default',
    ['jest-html-reporter', {
      pageTitle: 'Security Test Report',
      outputPath: 'test-report/index.html',
    }],
  ],
};
```

### Puppeteer Launch Options
```typescript
const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
```

## Common Patterns

### Basic Audit

```typescript
import puppeteer from 'puppeteer';
import { SecurityAuditor } from 'qastell';

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto('https://example.com');

const auditor = new SecurityAuditor(page);
const results = await auditor.audit();

console.log(`Found ${results.summary.total} issues`);
await browser.close();
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

// Save to file
await fs.writeFile('security-report.html', html);
```

## License Configuration

QAstell works without a license (Free tier: 10 scans/day, HTML reports).

For higher tiers, set your license key:

```bash
# Environment variable
export QASTELL_LICENSE="your-license-key"

# Or inline
QASTELL_LICENSE="key" npm test
```

Or in code:

```typescript
import { initLicense } from 'qastell';
initLicense(process.env.QASTELL_LICENSE);
```

## Architecture

This example uses QAstell's direct API without report connectors. For Puppeteer, results are saved to files using the built-in `toHTML()` and `toSummaryHTML()` methods.

For integration with reporters (Allure, Cucumber, etc.), see the **formatters + adapters** pattern in [ARCHITECTURE.md](../../../ARCHITECTURE.md).

```typescript
// Direct API (used in this example)
const html = results.toHTML();
fs.writeFileSync('report.html', html);

// Or with file adapter (alternative)
import { ReportConnector, adapters } from 'qastell';
const connector = new ReportConnector(adapters.file('./reports'));
await connector.attach(results, { attachments: ['html'] });
```

## Documentation

- [Puppeteer Guide](https://qastell.eu/docs-puppeteer.html)
- [Full Documentation](https://qastell.eu/docs.html)
- [API Reference](https://qastell.eu/docs.html#advanced-configuration)

## Troubleshooting

### Chrome crashes in CI
Add sandbox flags:
```typescript
args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
```

### Tests timeout
Increase Jest timeout:
```typescript
jest.setTimeout(30000);
```

### Browser not found
Install Chrome for Puppeteer:
```bash
npx puppeteer browsers install chrome
```
