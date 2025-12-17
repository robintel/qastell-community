# QAstell + Playwright + Allure 2 (Stable) Example

This example demonstrates QAstell security auditing with Playwright and **Allure 2** (stable version) reporting.

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

## Allure 2 vs Allure 3

| Feature | Allure 2 (this example) | Allure 3 (beta) |
|---------|------------------------|-----------------|
| Status | **Stable** | Beta |
| Package | `allure-playwright@2.x` | `allure-playwright@3.x` |
| CLI | `allure-commandline@2.x` | `allure-commandline@3.x` |
| Java Required | Yes | Yes |

This example uses Allure 2 for maximum stability. See `playwright-allure` for the Allure 3 beta example.

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
playwright-allure2/
├── tests/                    # Test files
├── allure-results/           # Raw Allure results (generated)
├── allure-report/            # Allure HTML report (generated)
├── playwright.config.ts      # Playwright configuration
└── package.json
```

## Key Code Patterns

### Using Allure 2 API

Allure 2 uses the `allure` object from `allure-playwright` (different from Allure 3):

```typescript
import { test, expect } from '@playwright/test';
import { SecurityAuditor } from 'qastell';
import { allure } from 'allure-playwright';

test('security audit', async ({ page }) => {
  // Add Allure metadata
  await allure.epic('Security');
  await allure.feature('Homepage Security');
  await allure.story('Landing Page Audit');

  await page.goto('https://example.com');

  const auditor = new SecurityAuditor(page);
  const results = await auditor.audit();

  // Set severity based on findings
  if (results.summary.bySeverity.critical > 0) {
    await allure.severity('critical');
  }

  // Attach HTML report
  await allure.attachment('Security Report', results.toHTML(), 'text/html');

  // Add steps for visibility
  await allure.step(`Found ${results.summary.total} issues`, async () => {
    await allure.logStep(`Critical: ${results.summary.bySeverity.critical}`);
    await allure.logStep(`High: ${results.summary.bySeverity.high}`);
  });

  expect(results.passed()).toBe(true);
});
```

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

# Windows
# Download from https://adoptium.net/
```

### Tests Pass But Report Fails

If tests pass but `npm run report` fails, check:
1. Java is installed and in PATH
2. `allure-results/` directory exists and has `.json` files

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

## Cleanup

```bash
npm run clean
```

This removes:
- `allure-results/` - Raw Allure test results
- `allure-report/` - Generated Allure HTML report
- `playwright-report/` - Playwright's default report
- `test-results/` - Playwright test artifacts
