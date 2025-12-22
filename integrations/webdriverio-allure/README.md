# QAstell + WebDriverIO 9 + Allure 3 (Beta) Example

This example demonstrates QAstell security auditing with WebDriverIO 9 and **Allure 3** (beta) reporting.

> **Note:** This example uses Allure 3, which is currently in beta. For production use, we recommend the [WebDriverIO + Allure 2](../webdriverio-allure2/) example which uses WebDriverIO 8 with stable Allure 2.

## Allure 2 vs Allure 3

| Feature | Allure 3 (this example) | Allure 2 (stable) |
|---------|------------------------|-------------------|
| Status | **Beta** | Stable |
| WebDriverIO | v9.x | v8.x |
| Reporter | `@wdio/allure-reporter@9.x` | `@wdio/allure-reporter@8.x` |
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

## New Architecture (Recommended)

QAstell v0.7+ introduces a new **formatters + adapters** architecture for maximum flexibility:

```typescript
import { SecurityAuditor, createWebDriverIOAdapter, ReportConnector, adapters } from 'qastell';
import AllureReporter from '@wdio/allure-reporter';

it('should audit the page for security issues', async () => {
  const browserAdapter = createWebDriverIOAdapter(browser);
  await browserAdapter.init();

  const auditor = new SecurityAuditor(browserAdapter as any);
  const results = await auditor.audit();

  // Create adapter for Allure (auto-detects API style)
  const adapter = adapters.allure(AllureReporter);
  const connector = new ReportConnector(adapter);

  // Attach results
  await connector.attach(results, {
    inline: 'markdown',           // Show markdown summary inline
    attachments: ['html'],        // Attach full HTML report
  });

  expect(results.passed()).toBe(true);
});
```

### Benefits of the New Architecture

- **Single `adapters.allure()` function** works with both `allure-js-commons` and `@wdio/allure-reporter`
- **Formatters are tier-gated** - JSON/JUnit require Enterprise+, SARIF requires Corporate
- **More output formats** - HTML, Markdown, JSON, JUnit XML, SARIF
- **Customizable** - Create your own adapter for any reporter

## Legacy Approach (Still Supported)

The examples in this project use the legacy `Allure2Connector` which still works.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm test` | Run WebDriverIO tests in headless mode |
| `npm run test:headed` | Run tests with browser visible |
| `npm run allure:generate` | Generate Allure report from results |
| `npm run allure:open` | Open the Allure report in browser |
| `npm run report` | Generate and open report (combined) |
| `npm run clean` | Remove all generated files |

## Project Structure

```
webdriverio-allure/
├── tests/                    # Test files
├── allure-results/           # Raw Allure results (generated)
├── allure-report/            # Allure HTML report (generated)
├── qastell-report/           # QAstell HTML reports (generated)
├── wdio.conf.ts              # WebDriverIO configuration
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
- `.allure/` - Allure cache

## Prerequisites

- Node.js 18+
- Chrome browser installed
- Allure CLI (optional, for viewing reports): `npm install -g allure-commandline`

## Test Structure

The example includes three test suites:

### Security Audit Demo
- Homepage audit
- Login page audit (form-focused)
- Form authentication page
- Checkboxes, dropdown, and inputs pages
- Dynamic content page

### Report Format Tests
- HTML report generation
- Summary HTML report (smaller size)

### Severity Threshold Tests
- Critical issues detection
- Category breakdown analysis

## Key Code Patterns

### Creating a SecurityAuditor with WebDriverIO

```typescript
import { SecurityAuditor, createWebDriverIOAdapter } from 'qastell';

// WebDriverIO browser object needs to be wrapped
async function createAuditor(): Promise<SecurityAuditor> {
  const adapter = createWebDriverIOAdapter(browser);
  await adapter.init();
  return new SecurityAuditor(adapter as any);
}
```

### Running an Audit

```typescript
const auditor = await createAuditor();
const results = await auditor.audit();

// Check if passed
if (results.passed()) {
  console.log('No security issues found!');
} else {
  console.log(`Found ${results.summary.total} issues`);
}
```

### Filtering by Category

```typescript
const results = await auditor.audit({
  include: ['forms', 'sensitive-data', 'headers'],
});
```

### Attaching Results to Allure

> **Connector Naming:** QAstell provides `Allure2Connector` and `Allure3Connector`. These names refer to the **API style**, not the package version:
> - `Allure2Connector` - For `@wdio/allure-reporter` style API (`addDescription()`, `addAttachment()`) - used by **all** WebDriverIO versions
> - `Allure3Connector` - For `allure-js-commons` style API (`description()`, `attachment()`) - used by Playwright with `allure-playwright`
>
> Even though this example uses WebDriverIO 9 (which some call "Allure 3"), it uses `Allure2Connector` because `@wdio/allure-reporter` uses the `addDescription()`/`addAttachment()` style API.

```typescript
import { Allure2Connector } from 'qastell/connectors';
import AllureReporter from '@wdio/allure-reporter';

const connector = new Allure2Connector();

// In your test:
const results = await auditor.audit();

// Use Allure2Connector to attach summary with inline markdown
await connector.attachSummary(results, AllureReporter);
```

#### Manual attachment (alternative)

```typescript
import AllureReporter from '@wdio/allure-reporter';

// Add labels for filtering
AllureReporter.addLabel('epic', 'Security');
AllureReporter.addFeature('Authentication Security');

// Add severity based on findings
if (results.summary.bySeverity.critical > 0) {
  AllureReporter.addSeverity('critical');
}

// Attach HTML report
AllureReporter.addAttachment(
  'QAstell Security Report',
  fs.readFileSync(reportPath),
  'text/html'
);
```

## Configuration

### wdio.conf.ts

Key configuration options:

- `capabilities`: Chrome with headless mode
- `framework`: Mocha with BDD interface
- `reporters`: Spec (console) + Allure (HTML)
- `timeout`: 60 seconds per test

### Customizing Audit Options

You can customize the audit behavior:

```typescript
const results = await auditor.audit({
  // Only check specific categories
  include: ['headers', 'csp', 'cookies'],

  // Or exclude categories
  exclude: ['links', 'tabnabbing'],

  // Skip specific rules
  skipRules: ['missing-csp'],

  // Set severity thresholds
  thresholds: {
    critical: 0,  // Fail on any critical
    high: 2,      // Allow up to 2 high
    medium: 10,   // Allow up to 10 medium
  },
});
```

## Troubleshooting

### Chrome Not Found

Make sure Chrome is installed and accessible. On Linux:
```bash
which google-chrome || which chromium-browser
```

### TypeScript Errors

The WebDriverIO browser object is dynamically injected at runtime. If you see type errors, ensure you have the globals declared:

```typescript
declare const browser: any;
declare const expect: any;
```

### Allure CLI Not Found

Install globally:
```bash
npm install -g allure-commandline
```

Or use npx:
```bash
npx allure generate allure-results -o allure-report --clean
npx allure open allure-report
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

## Documentation

- [WebDriver Guide](https://qastell.eu/docs-webdriver.html)
- [Full Documentation](https://qastell.eu/docs.html)
- [API Reference](https://qastell.eu/docs.html#advanced-configuration)
