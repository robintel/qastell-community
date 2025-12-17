# QAstell + Cypress + Mochawesome Example

This example demonstrates QAstell security auditing with Cypress E2E tests and Mochawesome reporting.

## Quick Start

```bash
# Install dependencies
npm install

# Run tests
npm test

# Generate and view report
npm run report
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm test` | Run Cypress tests in headless mode |
| `npm run test:headed` | Run tests with browser visible |
| `npm run report` | Merge results and open Mochawesome report |
| `npm run clean` | Remove all generated files (reports, results, screenshots) |

## Project Structure

```
cypress-mochawesome/
├── cypress/
│   ├── e2e/              # Test files
│   ├── support/          # Cypress support files
│   ├── results/          # Mochawesome HTML report + QAstell reports (generated)
│   └── screenshots/      # Failure screenshots (generated)
├── cypress.config.ts     # Cypress configuration
└── package.json
```

## Cleanup

To remove all generated files and start fresh:

```bash
npm run clean
```

This removes:
- `cypress/results/` - Mochawesome HTML reports and QAstell reports
- `cypress/reports/` - Merged Mochawesome reports (created by `npm run report`)
- `cypress/screenshots/` - Failure screenshots

## How It Works

1. Cypress runs E2E tests against the target site
2. QAstell audits each page for security vulnerabilities
3. Results are attached to the test context
4. Mochawesome generates an HTML report with all findings

## Configuration

### Cypress Config (`cypress.config.ts`)
- `reporter: 'cypress-mochawesome-reporter'` - Use Mochawesome
- `reporterOptions.charts: true` - Include charts in report

### QAstell Options
Tests can configure audits with:
```typescript
const results = await auditor.audit({
  include: ['forms', 'headers'],  // Only these categories
  exclude: ['links'],              // Skip these categories
  skipRules: ['rule-id'],          // Skip specific rules
});
```

## Common Patterns

### Basic Audit

Cypress runs inside the browser, so we access the DOM through `cy.window()`:

```typescript
import { SecurityAuditor } from 'qastell/cypress';

it('security check', () => {
  cy.visit('https://example.com');

  cy.window().then(async (win) => {
    const auditor = new SecurityAuditor(win);
    const results = await auditor.audit();
    cy.log(`Found ${results.summary.total} issues`);
  });
});
```

### Fail on High Severity

```typescript
cy.window().then(async (win) => {
  const auditor = new SecurityAuditor(win);
  await auditor.assertNoViolations({ minSeverity: 'high' });
});
```

### Filter by Category

```typescript
cy.window().then(async (win) => {
  const auditor = new SecurityAuditor(win);

  // Only check headers and cookies
  const results = await auditor.audit({
    include: ['headers', 'cookies'],
  });

  // Or check everything except links
  const results2 = await auditor.audit({
    exclude: ['links'],
  });
});
```

### Generate HTML Report

```typescript
cy.window().then(async (win) => {
  const auditor = new SecurityAuditor(win);
  const results = await auditor.audit();

  // Full detailed report
  const html = results.toHTML();

  // Compact summary report
  const summary = results.toSummaryHTML();

  cy.writeFile('cypress/reports/security-report.html', html);
});
```

### Audit Multiple Pages

```typescript
const pages = ['/', '/login', '/dashboard'];

pages.forEach((path) => {
  it(`should pass security audit on ${path}`, () => {
    cy.visit(`https://example.com${path}`);

    cy.window().then(async (win) => {
      const auditor = new SecurityAuditor(win);
      await auditor.assertNoViolations();
    });
  });
});
```

## License Configuration

QAstell works without a license (Free tier: 10 scans/day, HTML reports).

For higher tiers, set your license key:

```bash
# Environment variable
export QASTELL_LICENSE="your-license-key"

# Or in cypress.config.ts
env: {
  QASTELL_LICENSE: 'your-license-key'
}
```

Or in code:

```typescript
import { initLicense } from 'qastell/cypress';
initLicense(Cypress.env('QASTELL_LICENSE'));
```

## Limitations

Due to Cypress's architecture, some features work differently:

- **Response Headers**: Not accessible by default. Use `cy.intercept()` before navigation if you need header checking.
- **Cookies**: Only non-httpOnly cookies are visible via the adapter. For full cookie info, use `cy.getCookies()` separately.

## Documentation

- [Cypress Guide](https://qastell.eu/docs-cypress.html)
- [Full Documentation](https://qastell.eu/docs.html)
- [API Reference](https://qastell.eu/docs.html#advanced-configuration)

## Troubleshooting

### Tests timeout
Increase the default timeout in `cypress.config.ts`:
```typescript
defaultCommandTimeout: 10000,
```

### Chrome not found
Install Chrome or set the browser path:
```bash
npm run test -- --browser chromium
```
