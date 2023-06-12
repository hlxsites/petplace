import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import bulkOperation from './utils.js';

const FRANKLIN_DOMAIN = 'https://main--petplace--hlxsites.hlx.live';

const FETCH_OPTIONS = {
  headers: {
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
  },
};

function textNodesUnder(window, el) {
  const a = [];
  const walk = window.document.createTreeWalker(el, window.NodeFilter.SHOW_TEXT, null, false);
  let n;
  // eslint-disable-next-line no-cond-assign
  while (n = walk.nextNode()) {
    a.push(n);
  }
  return a;
}

function sanitizeOriginalPage(container) {
  container.querySelectorAll(':scope > :is(header, footer), .is-hidden-desktop, .single-post-sidebar, .breadcrumbs, .counter-wrapper, .similar-post-section, .next-prev-post-section, .share-icons-horizontal, .gift-pet-insurance-cta, .petpartners-disclosure').forEach((el) => el.remove());
  container.querySelectorAll('blockquote, iframe').forEach((el) => el.remove());
  const toc = [...container.querySelectorAll('h2')].find((el) => el.textContent.toLowerCase().startsWith('table of contents'));
  if (toc) {
    toc.nextElementSibling.remove();
    toc.remove();
  }
  return container;
}

function sanitizeFranklinPage(container) {
  container.querySelectorAll('.embed').forEach((el) => el.remove());
  return container;
}

function getSanitizedTextContent(window, el) {
  return textNodesUnder(window, el)
    .map((n) => n.textContent.trim())
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const results = await bulkOperation(process.argv[2], async (url) => {
  const { pathname } = new URL(url);

  let response = await fetch(url, FETCH_OPTIONS);
  const original = new JSDOM((await response.text()).replace(/<style(\s|>).*?<\/style>/gi, ''));
  const originalContent = sanitizeOriginalPage(original.window.document.querySelector('#gatsby-focus-wrapper'));
  const originalText = getSanitizedTextContent(original.window, originalContent);

  response = await fetch(`${FRANKLIN_DOMAIN}${pathname.replace(/\/$/, '')}`, FETCH_OPTIONS);
  const franklin = new JSDOM(await response.text());
  const franklinContent = sanitizeFranklinPage(franklin.window.document.querySelector('main'));
  const franklinText = getSanitizedTextContent(franklin.window, franklinContent);

  if (originalText !== franklinText) {
    console.log();
    console.log(url.href);
    console.log('---');
    console.log(originalText);
    console.log('---');
    console.log(franklinText);
  }
  return originalText === franklinText;
}, { logProgress: true });

console.table(results);
