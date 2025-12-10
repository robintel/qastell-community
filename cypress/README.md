# QAstell Cypress Examples

Security auditing examples for Cypress browser automation.

## Try It Now (one command)

```bash
mkdir -p qastell-demo/cypress/e2e && cd qastell-demo && npm init -y && npm i qastell cypress && echo 'import{defineConfig}from"cypress";export default defineConfig({e2e:{supportFile:false}})' > cypress.config.ts && echo 'import{SecurityAuditor}from"qastell";it("security",()=>{cy.visit("https://example.com");cy.window().then(async(win)=>{const a=new SecurityAuditor(win),r=await a.audit();cy.log("Issues: "+r.summary.total+" | Critical: "+r.summary.bySeverity.critical+" | High: "+r.summary.bySeverity.high)})})' > cypress/e2e/security.cy.ts && npx cypress run --spec cypress/e2e/security.cy.ts
```

Or add to your existing Cypress project:

```bash
npm install qastell
```

Then create a test file:

```typescript
// cypress/e2e/security.cy.ts
import { SecurityAuditor } from 'qastell';

it('security audit', () => {
  cy.visit('https://example.com');

  cy.window().then(async (win) => {
    const auditor = new SecurityAuditor(win);
    await auditor.assertNoViolations();
  });
});
```

## Quick Start

```bash
npm install qastell cypress
```

```typescript
import { SecurityAuditor } from 'qastell';

describe('Security', () => {
  it('should pass security audit', () => {
    cy.visit('https://example.com');

    cy.window().then(async (win) => {
      const auditor = new SecurityAuditor(win);
      const results = await auditor.audit();

      cy.log(`Found ${results.summary.total} issues`);
      await auditor.assertNoViolations();
    });
  });
});
```

## Key Difference from Other Frameworks

Cypress runs inside the browser, so we access the DOM through `cy.window()`:

```typescript
// Other frameworks: pass page object directly
const auditor = new SecurityAuditor(page);

// Cypress: get window inside .then() callback
cy.window().then(async (win) => {
  const auditor = new SecurityAuditor(win);
  // ...
});
```

## Examples

| File | Description |
|------|-------------|
| [quickstart.cy.ts](./quickstart.cy.ts) | Minimal example with console output |
| [basic-audit.cy.ts](./basic-audit.cy.ts) | Simple audit with default settings |
| [custom-thresholds.cy.ts](./custom-thresholds.cy.ts) | Allow violations below a severity threshold |
| [category-filtering.cy.ts](./category-filtering.cy.ts) | Include or exclude specific rule categories |
| [html-report.cy.ts](./html-report.cy.ts) | Generate HTML reports |
| [advanced-config.cy.ts](./advanced-config.cy.ts) | Framework detection and custom rules |

## Running Examples

```bash
# Run with Cypress
npx cypress run --spec "cypress/e2e/security.cy.ts"

# Run in interactive mode
npx cypress open
```

## Common Patterns

### Basic Audit

```typescript
import { SecurityAuditor } from 'qastell';

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
  const results = await auditor.audit({
    thresholds: {
      critical: 0,
      high: 0,
      medium: 999,
      low: 999,
      info: 999,
    },
  });

  if (!results.passed()) {
    throw new Error('High severity issues found');
  }
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

  const html = results.toHTML();
  cy.writeFile('cypress/reports/security-report.html', html);
});
```

### Force Framework Detection

QAstell auto-detects Cypress, but you can force it if needed:

```typescript
import { SecurityAuditor } from 'qastell';
import { detectFramework } from 'qastell/adapters';

cy.window().then(async (win) => {
  // Check what was detected
  cy.log(detectFramework(win)); // 'cypress'

  // Force framework if needed
  const auditor = new SecurityAuditor(win, { framework: 'cypress' });
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

### Audit After User Interactions

```typescript
it('should be secure after login', () => {
  cy.visit('/login');
  cy.get('#email').type('test@example.com');
  cy.get('#password').type('password123');
  cy.get('button[type="submit"]').click();

  cy.url().should('include', '/dashboard');

  cy.window().then(async (win) => {
    const auditor = new SecurityAuditor(win);
    await auditor.assertNoViolations();
  });
});
```

## Cypress Configuration

Create `cypress.config.ts`:

```typescript
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'https://example.com',
    supportFile: false,
  },
});
```

## Limitations

Due to Cypress's architecture, some features work differently:

- **Response Headers**: Not accessible by default. Use `cy.intercept()` before navigation if you need header checking.
- **Cookies**: Only non-httpOnly cookies are visible via the adapter. For full cookie info, use `cy.getCookies()` separately.

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
import { initLicense } from 'qastell';
initLicense(Cypress.env('QASTELL_LICENSE'));
```

## Documentation

- [Cypress Guide](https://qastell.eu/docs-cypress.html)
- [Full Documentation](https://qastell.eu/docs.html)
- [API Reference](https://qastell.eu/docs.html#advanced-configuration)
