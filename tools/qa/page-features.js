import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import bulkOperation from './utils.js';

const FRANKLIN_DOMAIN = 'https://main--petplace--hlxsites.hlx.live';

const csv = process.argv[2];
const results = await bulkOperation(csv, async ({ pathname }) => {
  const response = await fetch(`${FRANKLIN_DOMAIN}${pathname.replace(/\/$/, '')}`, {
    headers: {
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    },
  });

  const franklin = new JSDOM(await response.text());
  const array404 = await Promise.all([...franklin.window.document.querySelectorAll('main a[href]')].map(async (a) => {
    if (!a.href.startsWith('http://') && !a.href.startsWith('https://')) {
      return null;
    }

    // Timeout the requests after 3s
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      try {
        controller.abort();
      } catch (err) {
        // nothing to do
      }
    }, 5000);

    try {
      const resp = await fetch(`${a.href.startsWith('/') ? `${FRANKLIN_DOMAIN}${a.href}` : a.href}`, { method: 'HEAD', signal: controller.signal });
      return resp.status >= 404 ? `${a.href} (status: ${resp.status})` : null;
    } catch (err) {
      return `${a.href} (${err.message.substring(0, 100)})`;
    } finally {
      clearTimeout(timeoutId);
    }
  }));

  const result = {
    url: pathname.replace(/\/$/, ''),
    hasAzureImages: !!franklin.window.document.querySelectorAll('img[src*="web.core.windows.net"]').length,
    hasEmbeds: !!franklin.window.document.querySelectorAll('blockquote,iframe').length,
    hasUAT: !!franklin.window.document.querySelectorAll('[href*="https://petplace.uat.petpartners.com/"],[src*="https://petplace.uat.petpartners.com/"]').length,
    has404: array404.some((res) => !!res),
    list404: array404.filter((res) => !!res),
    status: response.ok,
  };

  process.stdout.write('.');
  if (result.hasAzureImages
    || result.has404
    || result.hasEmbeds
    || result.hasUAT
    || !result.status) {
    console.log('');
    console.log(
      result.url,
      `AzImg: ${result.hasAzureImages ? '❌' : '✓'}`,
      `Embeds: ${result.hasEmbeds ? '❌' : '✓'}`,
      `UAT: ${result.hasUAT ? '❌' : '✓'}`,
      `status: ${result.status ? '❌' : '✓'}`,
      result.list404,
    );
  }

  return result;
});

console.table(results);
