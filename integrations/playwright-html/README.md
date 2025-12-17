# QAstell + Playwright + HTML Reporter Example

This example demonstrates QAstell security auditing with Playwright's built-in HTML reporter.

## Quick Start

```bash
# Install dependencies
npm install

# Run tests
npm test

# View the HTML report
npm run report
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm test` | Run Playwright tests in headless mode |
| `npm run test:headed` | Run tests with browser visible |
| `npm run report` | Open Playwright HTML report |
| `npm run clean` | Remove all generated files |

## Project Structure

```
playwright-html/
├── tests/                # Test files
├── playwright-report/    # Playwright HTML report (generated)
├── test-results/         # Test artifacts (generated)
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
- `playwright-report/` - Playwright HTML report
- `test-results/` - Playwright test artifacts (traces, screenshots)
- `qastell-report/` - QAstell HTML reports

## How It Works

1. Playwright runs tests against the target site
2. QAstell audits each page for security vulnerabilities
3. `PlaywrightConnector` attaches results to test info:
   - Summary attachment visible in trace viewer
   - Full HTML report as downloadable attachment
4. Playwright generates an HTML report with all attachments

## Viewing Security Results

1. Run tests: `npm test`
2. Open report: `npm run report`
3. Click on a test
4. View attachments in the "Attachments" section
5. Click "QAstell Security Report" to view findings

## Configuration

### Playwright Config
```typescript
reporter: 'html',
```

### QAstell Playwright Connector
```typescript
import { PlaywrightConnector } from 'qastell/connectors';

const connector = new PlaywrightConnector();
await connector.attachSummary(results, testInfo, {
  attachFullReport: true,  // Include downloadable HTML
  summaryName: 'Security Summary',
});
```

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

### Report doesn't open
Manually open:
```bash
npx playwright show-report
# Or open playwright-report/index.html in browser
```

### No attachments visible
Ensure tests ran successfully and look in:
- Test details > Attachments tab
- Or expand test steps to see inline attachments
