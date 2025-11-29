# QAstell Examples

This directory contains example code demonstrating how to use QAstell for security auditing in your Playwright tests.

## Examples

| Example | Description |
|---------|-------------|
| [basic-audit.spec.ts](./basic-audit.spec.ts) | Simple security audit with default settings |
| [custom-thresholds.spec.ts](./custom-thresholds.spec.ts) | Configure severity thresholds to allow some violations |
| [category-filtering.spec.ts](./category-filtering.spec.ts) | Include/exclude specific rule categories |
| [html-report.spec.ts](./html-report.spec.ts) | Generate and save HTML reports |
| [ci-integration.spec.ts](./ci-integration.spec.ts) | CI/CD pipeline integration patterns |

## Getting Started

1. Install QAstell:
   ```bash
   npm install qastell
   ```

2. Copy any example to your `tests/` directory

3. Run with Playwright:
   ```bash
   npx playwright test
   ```

## License Configuration

Set your license key via environment variable:
```bash
QASTELL_LICENSE="your-key" npx playwright test
```

Or initialize in your test setup:
```typescript
import { initLicense } from 'qastell';

// In playwright.config.ts or global setup
initLicense(process.env.QASTELL_LICENSE);
```

## Need Help?

- [Report issues](https://github.com/robintel/QAstell-community/issues)
- [View pricing](https://qastell.eu/pricing)
