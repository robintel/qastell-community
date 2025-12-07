# QAstell Examples

This directory contains example code demonstrating how to use QAstell for security auditing in your Playwright tests.

## Examples

| Example | Description |
|---------|-------------|
| [basic-audit.spec.ts](./examples/basic-audit.spec.ts) | Simple security audit with default settings |
| [custom-thresholds.spec.ts](./examples/custom-thresholds.spec.ts) | Configure severity thresholds to allow some violations |
| [category-filtering.spec.ts](./examples/category-filtering.spec.ts) | Include/exclude specific rule categories |
| [html-report.spec.ts](./examples/html-report.spec.ts) | Generate and save HTML reports |
| [ci-integration.spec.ts](./examples/ci-integration.spec.ts) | CI/CD pipeline integration patterns |
| [env-config.spec.ts](./examples/env-config.spec.ts) | Load license key from .env file |

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

QAstell works out of the box with the Free tier (no license required). For Enterprise or Corporate tiers, configure your license key using one of these methods:

### Option 1: Environment Variable (Recommended)

**Linux/macOS:**
```bash
export QASTELL_LICENSE="your-license-key"
npx playwright test
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

Then load it in your `playwright.config.ts`:
```typescript
import 'dotenv/config';
```

### Option 3: Programmatic Initialization

```typescript
import { initLicense } from 'qastell';

// In playwright.config.ts or global setup
initLicense(process.env.QASTELL_LICENSE);
```

### CI/CD Integration

Most CI/CD platforms support secrets or environment variables:

- **GitHub Actions:** Add `QASTELL_LICENSE` to repository secrets
- **GitLab CI:** Add to CI/CD variables (masked)
- **Jenkins:** Use credentials binding
- **Azure DevOps:** Add to pipeline variables (secret)

## Need Help?

- [Report issues](https://github.com/robintel/qastell-community/issues)
- [View pricing](https://qastell.eu/index.html#pricing)
