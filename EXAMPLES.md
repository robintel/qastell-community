# QAstell Examples

This directory contains working examples demonstrating how to use QAstell for security auditing with popular test frameworks and reporting tools.

## Integration Examples

See the [integrations/](./integrations/) directory for complete, runnable examples:

| Example | Description | Quick Start |
|---------|-------------|-------------|
| [Playwright + HTML](./integrations/playwright-html/) | Default Playwright reporter with QAstell | `npm test && npm run report` |
| [Playwright + Allure 3](./integrations/playwright-allure/) | Allure 3 (beta) reports with security labels | `npm test && npm run report` |
| [Playwright + Allure 2](./integrations/playwright-allure2/) | Allure 2 (stable) reports - recommended | `npm test && npm run report` |
| [Cypress + Mochawesome](./integrations/cypress-mochawesome/) | Cypress E2E with Mochawesome reports | `npm test && npm run report` |
| [Puppeteer + Jest](./integrations/puppeteer-jest/) | Puppeteer with Jest HTML reporter | `npm test` |
| [WebDriverIO + Allure 3](./integrations/webdriverio-allure/) | WebDriverIO 9 with Allure 3 (beta) | `npm test && npm run report` |
| [WebDriverIO + Allure 2](./integrations/webdriverio-allure2/) | WebDriverIO 8 with Allure 2 (stable) | `npm test && npm run report` |

> **Note:** Allure examples require Java 8+ installed to generate reports. The Allure 2 examples are recommended for production use.

Each example includes:
- Complete `package.json` with all dependencies
- Working test files
- Reporter configuration
- README with detailed instructions
- Cleanup script (`npm run clean`)

## Running an Example

```bash
cd integrations/playwright-html  # or any example
npm install
npm test
npm run report  # Opens the report (where applicable)
```

## What's Demonstrated

Each integration shows:

1. **Real Security Testing** - Testing [The Internet](https://the-internet.herokuapp.com) demo site
2. **Framework Integration** - How QAstell works with each framework's API
3. **Report Connectors** - Attaching security findings to test reports
4. **Multiple Pages** - Auditing different pages (login, forms, inputs, etc.)
5. **Filtering** - Using category/rule filters to focus on specific areas
6. **Security Gates** - Failing tests when security issues are found

## License Configuration

QAstell works out of the box with the Free tier (no license required). For Enterprise or Corporate tiers, configure your license key:

### Environment Variable (Recommended)

```bash
export QASTELL_LICENSE="your-license-key"
npm test
```

### .env File

Copy [`.env.example`](./.env.example) to `.env`:

```bash
cp .env.example .env
# Edit .env with your license key
```

### CI/CD Integration

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
