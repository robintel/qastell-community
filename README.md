# QAstell

**Security auditing for Playwright - Shift security left into your test automation.**

## What is QAstell?

QAstell is a security audit library that integrates directly into your Playwright test suite. It scans your web application for common security vulnerabilities and misconfigurations as part of your regular testing workflow.

With 152 security rules across 41 categories, QAstell checks for issues like:
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

**QAstell enables security shift-left** by integrating security checks directly into your existing Playwright tests. This means:

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

## Quick Start

**Start free - no license or registration required.** Just install and run:

```bash
npm install qastell
```

```typescript
import { test } from '@playwright/test';
import { SecurityAuditor } from 'qastell';

test('security audit', async ({ page }) => {
  await page.goto('https://your-app.com');

  const auditor = new SecurityAuditor(page);
  await auditor.assertNoViolations();
});
```

## Examples

See the [examples](./EXAMPLES.md) for detailed usage patterns including:
- Basic audits
- Custom severity thresholds
- Category filtering
- HTML report generation
- CI/CD integration

## Learn More

- [Website](https://qastell.eu)
- [Pricing](https://qastell.eu/index.html#pricing)
- [Report Issues](https://github.com/robintel/qastell-community/issues)

## License

QAstell is available under a tiered licensing model:
- **Free (Non-Commercial)**: 10 scans/day, HTML reports
- **Enterprise**: 100 scans/day, HTML + JSON reports
- **Corporate**: Unlimited scans, all report formats including SARIF

See [pricing](https://qastell.eu/index.html#pricing) for details.

---

Made with ❤️ in the EU — for the environment, the people, and diversity.
