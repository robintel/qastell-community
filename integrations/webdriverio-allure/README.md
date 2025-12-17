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
