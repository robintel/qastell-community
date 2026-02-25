# QAstell

![QAstell - Security Auditing for Playwright, Puppeteer, Cypress & Selenium WebDriver](og-image.png)

**QA + Castell** - Security auditing for Playwright, Puppeteer, Cypress & Selenium WebDriver - Fortify your defenses.

> **The Name:** Defense is universal. *Castle* in English, *Kastell* in German, *Castell* in Welsh, *Castel* in Romanian – all from Latin *castellum*, the fortress that protects what matters. QAstell brings that same principle to test automation: **a fortress built into your CI/CD pipeline.**

## What is QAstell?

QAstell is a security audit library that integrates directly into your Playwright tests, Puppeteer scripts, Cypress tests, or Selenium WebDriver automation. It scans your web application for common security vulnerabilities and misconfigurations as part of your regular testing workflow.

With 250+ security rules across 48 categories, QAstell checks for issues like:
- Missing or misconfigured security headers (CSP, X-Frame-Options, etc.)
- Unsafe form configurations (autocomplete on passwords, missing CSRF tokens)
- Insecure external links (missing `rel="noopener"`)
- Mixed content warnings
- Inline event handlers (XSS vectors)
- Sensitive data exposure in HTML comments
- And many more...

## Why QAstell?

### Security Shift-Left

Traditional security testing happens late in the development cycle - often just before release or during dedicated security audits. By this point, vulnerabilities are expensive to fix and may delay releases.

**QAstell enables security shift-left** by integrating security checks directly into your existing tests. This means:

- **SDETs and QA engineers** can identify potential security issues during regular test runs
- **Developers** get immediate feedback when they introduce security regressions
- **Security teams** can focus on complex, application-specific vulnerabilities instead of chasing common misconfigurations

### Complementary, Not Replacement

> **Important:** QAstell is designed to **complement**, not replace, your existing security tools and practices.

QAstell does **not** replace:
- **SAST tools** (SonarQube, Checkmarx, etc.) - which analyze source code
- **DAST tools** (OWASP ZAP, Burp Suite, etc.) - which perform deep dynamic analysis
- **Penetration testing** - which requires human expertise and creativity
- **Security code reviews** - which catch logic flaws and business-specific issues

Instead, QAstell fills a gap: **continuous, automated detection of common client-side security issues during functional testing**. Think of it as an additional safety net that catches low-hanging fruit early, freeing your security specialists to focus on the harder problems.

### Who Should Use QAstell?

- **SDETs** who want to add security value to their test suites
- **QA teams** looking to catch security regressions before they reach staging
- **Development teams** practicing DevSecOps
- **Small teams** without dedicated security resources who want basic coverage
- **Anyone** who believes security is everyone's responsibility

## Try It Now - 30 Seconds

**No setup needed. Copy, paste, run.**

### Playwright (one command)

```bash
npx -y create-playwright@latest qastell-demo --quiet && cd qastell-demo && npm i qastell && echo 'import{test}from"@playwright/test";import{SecurityAuditor}from"qastell";test("security",async({page})=>{await page.goto("https://example.com");const a=new SecurityAuditor(page);const r=await a.audit();console.log("Issues:",r.summary.total,"| Critical:",r.summary.bySeverity.critical,"| High:",r.summary.bySeverity.high);});' > tests/security.spec.ts && npx playwright test security --reporter=list
```

### Puppeteer (one command)

```bash
mkdir -p qastell-demo && cd qastell-demo && npm init -y && npm i qastell puppeteer && node -e 'const p=require("puppeteer"),{SecurityAuditor}=require("qastell");(async()=>{const b=await p.launch(),pg=await b.newPage();await pg.goto("https://example.com");const a=new SecurityAuditor(pg),r=await a.audit();console.log("Issues:",r.summary.total,"| Critical:",r.summary.bySeverity.critical,"| High:",r.summary.bySeverity.high);await b.close()})();'
```

### Selenium WebDriver (one command)

```bash
mkdir -p qastell-demo && cd qastell-demo && npm init -y && npm i qastell selenium-webdriver && node -e 'const{Builder}=require("selenium-webdriver"),chrome=require("selenium-webdriver/chrome"),{SecurityAuditor}=require("qastell");(async()=>{const o=new chrome.Options();o.addArguments("--headless","--no-sandbox");const d=await new Builder().forBrowser("chrome").setChromeOptions(o).build();await d.get("https://example.com");const a=new SecurityAuditor(d),r=await a.audit();console.log("Issues:",r.summary.total,"| Critical:",r.summary.bySeverity.critical,"| High:",r.summary.bySeverity.high);await d.quit()})();'
```

### Cypress (one command)

```bash
mkdir -p qastell-demo/cypress/e2e && cd qastell-demo && npm init -y && npm i qastell cypress && echo 'const{defineConfig}=require("cypress");module.exports=defineConfig({e2e:{supportFile:false}})' > cypress.config.js && echo 'const{SecurityAuditor}=require("qastell");it("security",()=>{cy.visit("https://example.com");cy.window().then(async(win)=>{const a=new SecurityAuditor(win),r=await a.audit();cy.log("Issues: "+r.summary.total+" | Critical: "+r.summary.bySeverity.critical+" | High: "+r.summary.bySeverity.high)})})' > cypress/e2e/security.cy.js && npx cypress run --spec cypress/e2e/security.cy.js
```

> **Note:** This one-liner uses JavaScript for simplicity. See the [cypress-mochawesome](./integrations/cypress-mochawesome/) example for a Cypress + TypeScript setup.

> **Security tip:** Always review commands before running them. These one-liners install packages from npm and execute code - read them first to understand what they do.

> **Note:** First-time Playwright users may need to run `sudo npx playwright install-deps` to install system dependencies.

---

## Quick Start

**Start free - no license or registration required.**

### Playwright

```bash
npm install qastell
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

### Puppeteer

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

### Selenium WebDriver

```bash
npm install qastell selenium-webdriver
```

```typescript
import { Builder } from 'selenium-webdriver';
import { SecurityAuditor } from 'qastell';

const driver = await new Builder().forBrowser('chrome').build();
await driver.get('https://example.com');

const auditor = new SecurityAuditor(driver);
await auditor.assertNoViolations();

await driver.quit();
```

### Cypress

```bash
npm install qastell
```

```typescript
import { SecurityAuditor } from 'qastell';

it('security audit', () => {
  cy.visit('https://example.com');

  cy.window().then(async (win) => {
    const auditor = new SecurityAuditor(win);
    await auditor.assertNoViolations();
  });
});
```

### Extended Examples (multi-line)

<details>
<summary><strong>Playwright - Full Example</strong></summary>

```bash
mkdir qastell-demo && cd qastell-demo
npm init -y
npm install qastell @playwright/test
npx playwright install chromium
cat > quickstart.spec.ts << 'EOF'
import { test } from '@playwright/test';
import { SecurityAuditor } from 'qastell';
test('security audit', async ({ page }) => {
  await page.goto('https://qastell.eu');
  const auditor = new SecurityAuditor(page);
  const results = await auditor.audit();
  console.log(`Found ${results.summary.total} issues`);
});
EOF
npx playwright test quickstart.spec.ts --reporter=list
```

</details>

<details>
<summary><strong>Puppeteer - Full Example</strong></summary>

```bash
mkdir qastell-demo && cd qastell-demo
npm init -y
npm install qastell puppeteer typescript ts-node @types/node
cat > quickstart.ts << 'EOF'
import puppeteer from 'puppeteer';
import { SecurityAuditor } from 'qastell';
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://qastell.eu');
  const auditor = new SecurityAuditor(page);
  const results = await auditor.audit();
  console.log(`Found ${results.summary.total} issues`);
  await browser.close();
})();
EOF
npx ts-node quickstart.ts
```

</details>

<details>
<summary><strong>Selenium WebDriver - Full Example</strong></summary>

```bash
mkdir qastell-demo && cd qastell-demo
npm init -y
npm install qastell selenium-webdriver typescript ts-node @types/node
cat > quickstart.ts << 'EOF'
import { Builder } from 'selenium-webdriver';
import { SecurityAuditor } from 'qastell';
(async () => {
  const driver = await new Builder().forBrowser('chrome').build();
  await driver.get('https://qastell.eu');
  const auditor = new SecurityAuditor(driver);
  const results = await auditor.audit();
  console.log(`Found ${results.summary.total} issues`);
  await driver.quit();
})();
EOF
npx ts-node quickstart.ts
```

</details>

## GitHub Actions Integration

This repository includes a [GitHub Actions workflow](./.github/workflows/qastell-demo.yml) that demonstrates QAstell running as a CI/CD security gate. You can [view past runs](https://github.com/robintel/qastell-community/actions/workflows/qastell-demo.yml) to see it in action.

### What the workflow does

The workflow scaffolds projects from scratch (no pre-built code), installs QAstell, and runs security audits against [the-internet.herokuapp.com](https://the-internet.herokuapp.com) &mdash; a public test automation demo site with forms, login pages, and various UI patterns.

It runs two parallel jobs to demonstrate multi-framework support:

| Job | Framework | Pages scanned |
|-----|-----------|---------------|
| **Playwright** | Playwright + Chromium | Homepage, Login, Inputs, Dropdown, Checkboxes |
| **Puppeteer** | Puppeteer (bundled Chrome) | Homepage, Login |

Each job:

1. **Installs** QAstell and the test framework from npm
2. **Runs** security audits against multiple pages
3. **Generates reports** in all Corporate-tier formats (HTML, JSON, SARIF, JUnit)
4. **Fails the build** when violations are found (`assertNoViolations()`)
5. **Uploads a Markdown summary** to the GitHub Actions job summary
6. **Uploads SARIF** to [GitHub Code Scanning](https://github.com/robintel/qastell-community/security/code-scanning) so findings appear in the Security tab
7. **Uploads all reports** as downloadable artifacts

### How to set this up in your own project

#### 1. Create the workflow

Add a workflow file at `.github/workflows/security-audit.yml`:

```yaml
name: Security Audit

on:
  push:
    branches: [main]
  pull_request:

permissions:
  security-events: write

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - run: npm ci
      - run: npx playwright install --with-deps chromium

      - name: Run security audits
        env:
          QASTELL_LICENSE: ${{ secrets.QASTELL_LICENSE }}
        run: npx playwright test --project=security

      - name: Upload SARIF to GitHub Security
        if: always()
        uses: github/codeql-action/upload-sarif@v4
        with:
          sarif_file: reports/security.sarif
          category: qastell
        continue-on-error: true

      - name: Upload reports
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: security-reports
          path: reports/
```

#### 2. Write a test that generates reports

```typescript
import { test } from '@playwright/test';
import { SecurityAuditor } from 'qastell';
import * as fs from 'fs';

test('security audit', async ({ page }) => {
  await page.goto('https://your-app.com');

  const auditor = new SecurityAuditor(page);
  const results = await auditor.audit();

  // Generate reports before asserting (so they're available even on failure)
  fs.mkdirSync('reports', { recursive: true });
  fs.writeFileSync('reports/security.html', results.toHTML());
  fs.writeFileSync('reports/security.sarif', results.toSARIF());

  // Fail the build if violations are found
  await auditor.assertNoViolations();
});
```

#### 3. Store your license key

Go to **Settings > Secrets and variables > Actions** and add `QASTELL_LICENSE` with your license key. Secrets are never exposed in logs, even in public repositories.

> **Free tier works too** &mdash; you don't need a paid license to use QAstell in CI. The free tier gives you 10 scans/day with HTML and Markdown reports. SARIF upload requires the Corporate tier.

#### 4. Enable Code Scanning (for SARIF)

To see QAstell findings in your repository's **Security > Code scanning alerts** tab:

1. Go to **Settings > Code security and analysis**
2. Click **Set up** next to **Code scanning**
3. Choose **Default** (this enables the infrastructure for third-party SARIF uploads)

### Where to find results

| What | Where |
|------|-------|
| Markdown summary | Actions run page (job summary section) |
| Code scanning alerts | [Security > Code scanning](https://github.com/robintel/qastell-community/security/code-scanning) |
| HTML/JSON/SARIF/JUnit reports | Actions run page > Artifacts (download as zip) |

---

## Examples

See the [examples](./EXAMPLES.md) for detailed usage patterns including:
- Basic audits
- Custom severity thresholds
- Category filtering
- HTML report generation
- CI/CD integration
- Jest integration (Puppeteer)

## Learn More

- [Website](https://qastell.eu)
- [Documentation](https://qastell.eu/docs.html)
- [Playwright Guide](https://qastell.eu/docs-playwright.html)
- [Puppeteer Guide](https://qastell.eu/docs-puppeteer.html)
- [WebDriver Guide](https://qastell.eu/docs-webdriver.html)
- [Pricing](https://qastell.eu/index.html#pricing)
- [Report Issues](https://github.com/robintel/qastell-community/issues)

## License

QAstell is available under a tiered licensing model:
- **Free (Non-Commercial)**: 10 scans/day, HTML reports
- **Enterprise**: 100 scans/day, HTML + JSON reports
- **Corporate**: Unlimited scans, all report formats including SARIF

See [pricing](https://qastell.eu/index.html#pricing) for details.

---

Made in the 🇪🇺 with ❤️ for people, environment, and [diversity](https://x.com/eeldenden/status/1950639923632971784).
