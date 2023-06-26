const FRANKLIN_DOMAIN = 'https://main--petplace--hlxsites.hlx.live';
const FRANKLIN_ADMIN_API = 'https://admin.hlx.page';

const parseHtml = (html) => new window.DOMParser().parseFromString(html, 'text/html');

async function* bulkOperation(urls, fn, options = {}) {
  // eslint-disable-next-line no-restricted-syntax
  for (const url of urls) {
    try {
      // eslint-disable-next-line no-await-in-loop
      yield await fn(new URL(url));
    } catch (err) {
      yield err;
    }
    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => { setTimeout(resolve, options.sleep || 500); });
  }
}

function textNodesUnder(el) {
  const a = [];
  const walk = document.createTreeWalker(el, window.NodeFilter.SHOW_TEXT, null, false);
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

function getSanitizedTextContent(el) {
  return textNodesUnder(el)
    .map((n) => n.textContent.trim())
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function adminOperation(url, op) {
  const [ref, repo, org] = new URL(FRANKLIN_DOMAIN).hostname.split('.')[0].split('--');
  const orgRepoRef = `/${org}/${repo}/${ref}`;

  const { pathname } = new URL(url.href);
  const response = await fetch(
    `${FRANKLIN_ADMIN_API}/${op}${orgRepoRef}${pathname.replace(/\/$/, '')}`,
    { method: 'POST' },
  );
  return response.ok && response.text();
}

async function querySourceDocument(url, selector) {
  const response = await fetch(url);
  const document = parseHtml((await response.text()).replace(/<style(\s|>).*?<\/style>/gi, ''));
  const result = document.querySelectorAll(selector);
  return result.length ? result : false;
}

async function diff(url) {
  const { pathname } = new URL(url);

  let response = await fetch(url);
  const original = parseHtml((await response.text()).replace(/<style(\s|>).*?<\/style>/gi, ''));
  const originalContent = sanitizeOriginalPage(original.querySelector('#gatsby-focus-wrapper'));
  const originalText = getSanitizedTextContent(originalContent);

  response = await fetch(`${FRANKLIN_DOMAIN}${pathname.replace(/\/$/, '')}`);
  const franklin = parseHtml(await response.text());
  const franklinContent = sanitizeFranklinPage(franklin.querySelector('main'));
  const franklinText = getSanitizedTextContent(franklinContent);
  return originalText === franklinText;
}

async function embeds(url) {
  return querySourceDocument(url, 'blockquote,iframe:is([src*="youtu"])');
}

async function uat(url) {
  return querySourceDocument(url, '[href*="https://petplace.uat.petpartners.com/"],[src*="https://petplace.uat.petpartners.com/"]');
}

async function azure(url) {
  return querySourceDocument(url, 'img[src*="web.core.windows.net"]');
}

async function preview(url) {
  return adminOperation(url, 'preview');
}

async function publish(url) {
  return adminOperation(url, 'live');
}

function reportProgress(index, url, result) {
  const overview = document.querySelector('.results-overview ul');
  const details = document.querySelector('.results-details');
  const disclosure = document.createElement('details');
  const summary = document.createElement('summary');
  const div = document.createElement('div');
  summary.textContent = url;
  disclosure.prepend(summary);
  disclosure.append(div);
  details.append(disclosure);
  if (result instanceof Error) {
    overview.children[index].classList.add('error');
    details.children[index].classList.add('error');
    details.children[index].children[1].append(result.stack);
  } else {
    overview.children[index].classList.add(result ? 'success' : 'failure');
    details.children[index].classList.add(result ? 'success' : 'failure');
  }
  details.children[index].children[1].append(JSON.stringify(result));
}

async function run() {
  const urls = document.querySelector('#urls').value.split('\n');
  const action = document.querySelector('#action').value;
  window.localStorage.setItem('franklin-qa-urls', JSON.stringify(urls));

  const overview = document.querySelector('.results-overview ul');
  overview.innerHTML = '';
  urls.forEach(() => {
    const li = document.createElement('li');
    overview.append(li);
  });

  let index = 0;
  // eslint-disable-next-line no-restricted-syntax
  for await (const result of bulkOperation(urls, window[action])) {
    reportProgress(index, urls[index], result);
    index += 1;
  }
}

document.querySelector('button').addEventListener('click', () => {
  run();
});

const urls = window.localStorage.getItem('franklin-qa-urls');
if (urls) {
  document.querySelector('#urls').value = JSON.parse(urls).join('\n');
}
