import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import bulkOperation from './utils.js';

const type = process.argv[2];
const csv = process.argv[3];
const results = await bulkOperation(csv, async (url) => {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'AEM Franklin QA / 0.1',
    },
  });

  const html = await response.text();
  const jsdom = new JSDOM(html.replace(/<style(\s|>).*?<\/style>/gi, ''));
  if (type === 'embeds' && jsdom.window.document.querySelectorAll('blockquote,iframe:is([src*="youtube"])').length) {
    return url.href;
  }
  if (type === 'uat' && jsdom.window.document.querySelectorAll('[href*="https://petplace.uat.petpartners.com/"],[src*="https://petplace.uat.petpartners.com/"]').length) {
    return url.href;
  }
  return null;
}, { logProgress: true });

results.forEach((res) => console.log(res));
