/* eslint-disable import/no-extraneous-dependencies */
import { test } from '@playwright/test';

test('Google Tag Manager is properly loaded', async ({ page }) => {
  await page.goto('https://main--petplace--hlxsites.hlx.live/');
  await Promise.all([
    page.waitForRequest('https://www.googletagmanager.com/gtm.js?id=GTM-WP2SGNL', { timeout: 10000 }),
    page.waitForRequest('https://www.googletagmanager.com/gtag/js?id=AW-11334653569', { timeout: 10000 }),
    page.waitForRequest('https://securepubads.g.doubleclick.net/tag/js/gpt.js', { timeout: 10000 }),
  ]);
});

test('Events are sent to Google Analytics backend', async ({ page }) => {
  await page.goto('https://main--petplace--hlxsites.hlx.live/');
  await page.waitForRequest(/https:\/\/analytics.google.com\/g\/collect\?/, { timeout: 10000 });
});
