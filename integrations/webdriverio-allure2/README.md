# QAstell + WebDriverIO 8 + Allure 2 (Stable) Example

This example demonstrates QAstell security auditing with WebDriverIO 8 and **Allure 2** (stable version) reporting.

> **Note:** Allure requires Java 8+ to generate reports. If you don't have Java installed, see [Troubleshooting](#java-not-found).

## Quick Start

```bash
# Install dependencies
npm install

# Run tests
npm test

# Generate and view Allure report (requires Java)
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

## Allure 2 vs Allure 3

| Feature | Allure 2 (this example) | Allure 3 (beta) |
|---------|------------------------|-----------------|
| Status | **Stable** | Beta |
| WebDriverIO | v8.x | v9.x |
| Reporter | `@wdio/allure-reporter@8.x` | `@wdio/allure-reporter@9.x` |
| Results Format | XML | JSON |
| Java Required | Yes | Yes |

This example uses WebDriverIO 8 with Allure 2 for maximum stability. See `webdriverio-allure` for the Allure 3 beta example with WebDriverIO 9.

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
webdriverio-allure2/
├── tests/                    # Test files
├── allure-results/           # Raw Allure results (generated)
├── allure-report/            # Allure HTML report (generated)
├── qastell-report/           # QAstell HTML reports (generated)
├── wdio.conf.ts              # WebDriverIO configuration
└── package.json
```

## Key Code Patterns

### Creating a SecurityAuditor with WebDriverIO

```typescript
import { SecurityAuditor, createWebDriverIOAdapter } from 'qastell';

async function createAuditor(): Promise<SecurityAuditor> {
  const adapter = createWebDriverIOAdapter(browser);
  await adapter.init();
  return new SecurityAuditor(adapter as any);
}
```

### Attaching Results to Allure

> **Connector Naming:** QAstell provides `Allure2Connector` and `Allure3Connector`. These names refer to the **API style**, not the package version:
> - `Allure2Connector` - For `@wdio/allure-reporter` style API (`addDescription()`, `addAttachment()`) - used by **all** WebDriverIO versions (both v8 and v9)
> - `Allure3Connector` - For `allure-js-commons` style API (`description()`, `attachment()`) - used by Playwright with `allure-playwright`

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

## Troubleshooting

### Java Not Found

Allure requires Java 8+ to generate reports:

```bash
# Check if Java is installed
java -version

# Ubuntu/Debian
sudo apt install default-jre

# macOS (with Homebrew)
brew install openjdk
```

### Chrome Not Found

Make sure Chrome is installed:

```bash
which google-chrome || which chromium-browser
```

## Common Patterns

### Basic Audit

```typescript
const auditor = await createAuditor();
const results = await auditor.audit();

if (results.passed()) {
  console.log('No security issues found!');
} else {
  console.log(`Found ${results.summary.total} issues`);
}
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
fs.writeFileSync('security-report.html', html);
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

## Cleanup

```bash
npm run clean
```

This removes:
- `allure-results/` - Raw Allure test results
- `allure-report/` - Generated Allure HTML report
- `qastell-report/` - QAstell HTML reports
