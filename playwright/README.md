# QAstell Playwright Examples

Security auditing examples for Playwright test framework.

## Try It Now - One Command

Copy, paste, run:

```bash
npx -y create-playwright@latest qastell-demo --quiet && cd qastell-demo && npm i qastell && echo 'import{test}from"@playwright/test";import{SecurityAuditor}from"qastell";test("security",async({page})=>{await page.goto("https://example.com");const a=new SecurityAuditor(page);const r=await a.audit();console.log("Issues:",r.summary.total,"| Critical:",r.summary.bySeverity.critical,"| High:",r.summary.bySeverity.high);});' > tests/security.spec.ts && npx playwright test security --reporter=list
```

> **Security tip:** Always review commands before running them. This installs packages from npm and executes code.

> **Note:** First-time Playwright users may need to run `sudo npx playwright install-deps` to install system dependencies.

## Quick Start

```bash
npm install qastell @playwright/test
npx playwright install chromium
```

```typescript
import { test } from '@playwright/test';
import { SecurityAuditor } from 'qastell';

test('security audit', async ({ page }) => {
  await page.goto('https://example.com');
  const auditor = new SecurityAuditor(page);
  await auditor.assertNoViolations();
});
```

## Examples

| File | Description |
|------|-------------|
| [quickstart.spec.ts](./quickstart.spec.ts) | Minimal example with console output |
| [basic-audit.spec.ts](./basic-audit.spec.ts) | Simple audit with default settings |
| [custom-thresholds.spec.ts](./custom-thresholds.spec.ts) | Allow violations below a severity threshold |
| [category-filtering.spec.ts](./category-filtering.spec.ts) | Include or exclude specific rule categories |
| [html-report.spec.ts](./html-report.spec.ts) | Generate HTML reports |
| [ci-integration.spec.ts](./ci-integration.spec.ts) | CI/CD pipeline patterns |
| [env-config.spec.ts](./env-config.spec.ts) | Load license from environment |
| [advanced-config.spec.ts](./advanced-config.spec.ts) | Framework detection and custom rules |

## Running Examples

From the examples directory:

```bash
# Run a specific example
npx playwright test quickstart.spec.ts --reporter=list

# Run all examples
npx playwright test --reporter=list
```

## Common Patterns

### Basic Audit

```typescript
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
import { HtmlReporter } from 'qastell';

const results = await auditor.audit();
const reporter = new HtmlReporter();
const html = reporter.generate(results.raw);
await fs.writeFile('security-report.html', html);
```

### Force Framework Detection

If QAstell doesn't auto-detect Playwright correctly (rare edge cases):

```typescript
import { SecurityAuditor, detectFramework } from 'qastell';

// Check what was detected
console.log(detectFramework(page)); // 'playwright', 'puppeteer', or 'unknown'

// Force framework if needed
const auditor = new SecurityAuditor(page, { framework: 'playwright' });
```

### Custom Rules

```typescript
import { SecurityAuditor, allRules } from 'qastell';

// Use only specific rules
const headerRules = allRules.filter(r => r.category === 'headers');
const auditor = new SecurityAuditor(page, { rules: headerRules });
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
