/* eslint-disable import/no-extraneous-dependencies */
import { test } from '@playwright/test';

const baseURL = process.env.CI ? `https://${process.env.GITHUB_REF_NAME}--${process.env.GITHUB_REPOSITORY.split('/')[1]}--hlxsites.hlx.live` : 'http://127.0.0.1:3000';

test('Google Tag Manager is properly loaded', async ({ page }) => {
  await page.goto(baseURL);
  await Promise.all([
    page.waitForRequest('https://www.googletagmanager.com/gtm.js?id=GTM-WP2SGNL', { timeout: 60000 }),
    page.waitForRequest('https://www.googletagmanager.com/gtag/js?id=AW-11334653569', { timeout: 60000 }),
    page.waitForRequest('https://securepubads.g.doubleclick.net/tag/js/gpt.js', { timeout: 60000 }),
  ]);
});

test('Events are sent to Google Analytics backend', async ({ page }) => {
  await page.goto(baseURL);
  await page.waitForRequest(/https:\/\/analytics.google.com\/g\/collect\?/, { timeout: 60000 });
});
