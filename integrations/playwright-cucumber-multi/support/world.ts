/**
 * Cucumber World - Custom context for Playwright + QAstell
 *
 * The World is the context object that is shared across step definitions.
 * It holds the Playwright browser, page, and audit results.
 */

import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';
import { AuditResults } from 'qastell';

export interface CustomWorld extends World {
  browser: Browser;
  context: BrowserContext;
  page: Page;
  auditResults?: AuditResults;
}

export class PlaywrightWorld extends World implements CustomWorld {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  auditResults?: AuditResults;

  constructor(options: IWorldOptions) {
    super(options);
  }

  async init(): Promise<void> {
    this.browser = await chromium.launch({
      headless: true,
    });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
  }

  async cleanup(): Promise<void> {
    if (this.page) {
      await this.page.close();
    }
    if (this.context) {
      await this.context.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }
}

setWorldConstructor(PlaywrightWorld);
