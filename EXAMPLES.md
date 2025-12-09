# QAstell Examples

This directory contains example code demonstrating how to use QAstell for security auditing with Playwright, Puppeteer, and Selenium WebDriver.

## Playwright Examples

| Example | Description |
|---------|-------------|
| [quickstart.spec.ts](./playwright/quickstart.spec.ts) | Quick start example with console output |
| [basic-audit.spec.ts](./playwright/basic-audit.spec.ts) | Simple security audit with default settings |
| [custom-thresholds.spec.ts](./playwright/custom-thresholds.spec.ts) | Configure severity thresholds to allow some violations |
| [category-filtering.spec.ts](./playwright/category-filtering.spec.ts) | Include/exclude specific rule categories |
| [html-report.spec.ts](./playwright/html-report.spec.ts) | Generate and save HTML reports |
| [ci-integration.spec.ts](./playwright/ci-integration.spec.ts) | CI/CD pipeline integration patterns |
| [env-config.spec.ts](./playwright/env-config.spec.ts) | Load license key from .env file |
| [advanced-config.spec.ts](./playwright/advanced-config.spec.ts) | Framework detection, custom rules, version info |

**Run Playwright examples:**
```bash
cd playwright
npx playwright test quickstart.spec.ts --reporter=list
```

## Puppeteer Examples

| Example | Description |
|---------|-------------|
| [quickstart.ts](./puppeteer/quickstart.ts) | Quick start example with console output |
| [basic-audit.ts](./puppeteer/basic-audit.ts) | Simple security audit with default settings |
| [custom-thresholds.ts](./puppeteer/custom-thresholds.ts) | Configure severity thresholds to allow some violations |
| [category-filtering.ts](./puppeteer/category-filtering.ts) | Include/exclude specific rule categories |
| [html-report.ts](./puppeteer/html-report.ts) | Generate and save HTML reports |
| [jest-integration.test.ts](./puppeteer/jest-integration.test.ts) | Jest test suite integration |
| [env-config.ts](./puppeteer/env-config.ts) | Load license key from .env file |
| [advanced-config.ts](./puppeteer/advanced-config.ts) | Framework detection, custom rules, version info |

**Run Puppeteer examples:**
```bash
npx ts-node puppeteer/quickstart.ts
```

**Run Jest tests:**
```bash
npx jest puppeteer/jest-integration.test.ts
```

## Selenium WebDriver Examples

| Example | Description |
|---------|-------------|
| [quickstart.ts](./webdriver/quickstart.ts) | Quick start example with console output |
| [basic-audit.ts](./webdriver/basic-audit.ts) | Simple security audit with default settings |
| [custom-thresholds.ts](./webdriver/custom-thresholds.ts) | Configure severity thresholds to allow some violations |
| [category-filtering.ts](./webdriver/category-filtering.ts) | Include/exclude specific rule categories |
| [html-report.ts](./webdriver/html-report.ts) | Generate and save HTML reports |
| [env-config.ts](./webdriver/env-config.ts) | Load license key from .env file |
| [advanced-config.ts](./webdriver/advanced-config.ts) | Framework detection, custom rules, version info |

**Run WebDriver examples:**
```bash
npx ts-node webdriver/quickstart.ts
```

> **Note:** WebDriver requires ChromeDriver (or another browser driver) to be installed and available in PATH. See [selenium-webdriver documentation](https://www.selenium.dev/documentation/webdriver/getting_started/) for setup instructions.

> **Note:** WebDriver cannot access HTTP response headers, so the `headers`, `csp`, and `cors` categories will not detect issues when using WebDriver.

## Getting Started

### Playwright

1. Install QAstell:
   ```bash
   npm install qastell
   ```

2. Copy any example from `playwright/` to your `tests/` directory

3. Run with Playwright:
   ```bash
   npx playwright test
   ```

### Puppeteer

1. Install QAstell and Puppeteer:
   ```bash
   npm install qastell puppeteer
   ```

2. Copy any example from `puppeteer/` to your project

3. Run with ts-node or compile and run:
   ```bash
   npx ts-node your-script.ts
   ```

### Selenium WebDriver

1. Install QAstell and selenium-webdriver:
   ```bash
   npm install qastell selenium-webdriver
   ```

2. Ensure you have a browser driver installed (e.g., ChromeDriver for Chrome)

3. Copy any example from `webdriver/` to your project

4. Run with ts-node or compile and run:
   ```bash
   npx ts-node your-script.ts
   ```

## License Configuration

QAstell works out of the box with the Free tier (no license required). For Enterprise or Corporate tiers, configure your license key using one of these methods:

### Option 1: Environment Variable (Recommended)

**Linux/macOS:**
```bash
export QASTELL_LICENSE="your-license-key"
npx playwright test  # or npx ts-node your-script.ts
```

**Windows (PowerShell):**
```powershell
$env:QASTELL_LICENSE="your-license-key"
npx playwright test
```

**Windows (Command Prompt):**
```cmd
set QASTELL_LICENSE=your-license-key
npx playwright test
```

**Inline (any platform):**
```bash
QASTELL_LICENSE="your-license-key" npx playwright test
```

### Option 2: .env File

Copy the provided [`.env.example`](./.env.example) to `.env` and replace the placeholder:
```bash
cp .env.example .env
# Edit .env and replace 'your-license-key-here' with your actual key
```

Then load it in your config:

**Playwright (playwright.config.ts):**
```typescript
import 'dotenv/config';
```

**Puppeteer:**
```typescript
import 'dotenv/config';
// or
import { config } from 'dotenv';
config();
```

### Option 3: Programmatic Initialization

```typescript
import { initLicense } from 'qastell';

// In playwright.config.ts, global setup, or script entry point
initLicense(process.env.QASTELL_LICENSE);
```

### CI/CD Integration

Most CI/CD platforms support secrets or environment variables:

- **GitHub Actions:** Add `QASTELL_LICENSE` to repository secrets
- **GitLab CI:** Add to CI/CD variables (masked)
- **Jenkins:** Use credentials binding
- **Azure DevOps:** Add to pipeline variables (secret)

## Need Help?

- [Playwright Documentation](https://qastell.eu/docs-playwright.html)
- [Puppeteer Documentation](https://qastell.eu/docs-puppeteer.html)
- [WebDriver Documentation](https://qastell.eu/docs-webdriver.html)
- [Report issues](https://github.com/robintel/qastell-community/issues)
- [View pricing](https://qastell.eu/index.html#pricing)
