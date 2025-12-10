# QAstell Puppeteer Examples

Security auditing examples for Puppeteer browser automation.

## Try It Now - One Command

Copy, paste, run:

```bash
mkdir -p qastell-demo && cd qastell-demo && npm init -y && npm i qastell puppeteer && node -e 'const p=require("puppeteer"),{SecurityAuditor}=require("qastell");(async()=>{const b=await p.launch(),pg=await b.newPage();await pg.goto("https://example.com");const a=new SecurityAuditor(pg),r=await a.audit();console.log("Issues:",r.summary.total,"| Critical:",r.summary.bySeverity.critical,"| High:",r.summary.bySeverity.high);await b.close()})();'
```

> **Security tip:** Always review commands before running them. This installs packages from npm and executes code.

## Quick Start

```bash
npm install qastell puppeteer
```

```typescript
import puppeteer from 'puppeteer';
import { SecurityAuditor } from 'qastell';

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto('https://example.com');

const auditor = new SecurityAuditor(page);
await auditor.assertNoViolations();

await browser.close();
```

## Examples

| File | Description |
|------|-------------|
| [quickstart.ts](./quickstart.ts) | Minimal example with console output |
| [basic-audit.ts](./basic-audit.ts) | Simple audit with default settings |
| [custom-thresholds.ts](./custom-thresholds.ts) | Allow violations below a severity threshold |
| [category-filtering.ts](./category-filtering.ts) | Include or exclude specific rule categories |
| [html-report.ts](./html-report.ts) | Generate HTML reports |
| [jest-integration.test.ts](./jest-integration.test.ts) | Jest test suite integration |
| [env-config.ts](./env-config.ts) | Load license from environment |
| [advanced-config.ts](./advanced-config.ts) | Framework detection and custom rules |

## Running Examples

```bash
# Run with ts-node
npx ts-node puppeteer/quickstart.ts

# Run Jest tests
npx jest puppeteer/jest-integration.test.ts
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
import { HtmlReporter } from 'qastell';
import * as fs from 'fs/promises';

const results = await auditor.audit();
const reporter = new HtmlReporter();
const html = reporter.generate(results.raw);
await fs.writeFile('security-report.html', html);
```

### Force Framework Detection

QAstell auto-detects Puppeteer, but you can force it if needed:

```typescript
import { SecurityAuditor, detectFramework } from 'qastell';

// Check what was detected
console.log(detectFramework(page)); // 'playwright', 'puppeteer', or 'unknown'

// Force framework if needed
const auditor = new SecurityAuditor(page, { framework: 'puppeteer' });
```

### Custom Rules

```typescript
import { SecurityAuditor, allRules } from 'qastell';

// Use only specific rules
const headerRules = allRules.filter(r => r.category === 'headers');
const auditor = new SecurityAuditor(page, { rules: headerRules });
```

## Jest Integration

```typescript
import puppeteer, { Browser, Page } from 'puppeteer';
import { SecurityAuditor } from 'qastell';

describe('Security Tests', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
  });

  beforeEach(async () => {
    page = await browser.newPage();
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should pass security audit', async () => {
    await page.goto('https://example.com');
    const auditor = new SecurityAuditor(page);
    await auditor.assertNoViolations();
  });
});
```

## License Configuration

QAstell works without a license (Free tier: 10 scans/day, HTML reports).

For higher tiers, set your license key:

```bash
# Environment variable
export QASTELL_LICENSE="your-license-key"

# Or inline
QASTELL_LICENSE="key" npx ts-node your-script.ts
```

Or in code:

```typescript
import { initLicense } from 'qastell';
initLicense(process.env.QASTELL_LICENSE);
```

## Documentation

- [Puppeteer Guide](https://qastell.eu/docs-puppeteer.html)
- [Full Documentation](https://qastell.eu/docs.html)
- [API Reference](https://qastell.eu/docs.html#advanced-configuration)
