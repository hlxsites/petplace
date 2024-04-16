const FRANKLIN_DOMAIN = 'https://main--petplace--hlxsites.hlx.live';
const FRANKLIN_ADMIN_API = 'https://admin.hlx.page';

const parseHtml = (html) => new window.DOMParser().parseFromString(html, 'text/html');

const toHtmlTable = (obj) => {
  const objects = Array.isArray(obj) ? obj : [obj];
  const headers = objects.reduce((set, o) => {
    Object.keys(o).forEach((key) => set.add(key));
    return set;
  }, new Set());

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  let tr = document.createElement('tr');
  headers.forEach((h) => {
    const th = document.createElement('th');
    th.textContent = h;
    tr.append(th);
  });
  thead.append(tr);
  table.append(thead);

  const tbody = document.createElement('tbody');
  objects.forEach((o) => {
    tr = document.createElement('tr');
    headers.forEach((h) => {
      const td = document.createElement('td');
      td.textContent = o[h] || '';
      tr.append(td);
    });
    tbody.append(tr);
  });
  table.append(tbody);

  return table;
};

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

async function adminOperation(url, op, method = 'POST') {
  const [ref, repo, org] = new URL(FRANKLIN_DOMAIN).hostname.split('.')[0].split('--');
  const orgRepoRef = `/${org}/${repo}/${ref}`;

  const { pathname } = new URL(url.href);
  const response = await fetch(
    `${FRANKLIN_ADMIN_API}/${op}${orgRepoRef}${pathname.replace(/\/$/, '')}`,
    { method },
  );
  return response.ok;
}

async function querySourceDocument(url, selector) {
  const response = await fetch(url);
  const document = parseHtml((await response.text()).replace(/<style(\s|>).*?<\/style>/gi, ''));
  const result = document.querySelectorAll(selector);
  return result.length ? [...result] : false;
}

// eslint-disable-next-line no-unused-vars
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

// eslint-disable-next-line no-unused-vars
async function links(url) {
  const { pathname } = url;
  const response = await fetch(`${FRANKLIN_DOMAIN}${pathname.replace(/\/$/, '')}`);
  const document = parseHtml(await response.text());

  const array404 = await Promise.all([...document.querySelectorAll('main a[href]')].map(async (a) => {
    if (!a.href.startsWith('http://') && !a.href.startsWith('https://') && !a.href.startsWith('file://')) {
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

    let link = a.href;
    if (a.href.startsWith('/')) {
      link = `${FRANKLIN_DOMAIN}${link}`;
    } else if (a.href.startsWith('file://')) {
      link = link.replace('file://', FRANKLIN_DOMAIN);
    }
    try {
      const resp = await fetch(link, { method: 'HEAD', signal: controller.signal });
      return resp.status >= 400 ? { url: link, error: resp.status } : null;
    } catch (err) {
      return { url: link, error: err.message.substring(0, 100) };
    } finally {
      clearTimeout(timeoutId);
    }
  }));
  const urlsToCheck = array404.filter((res) => !!res);
  return urlsToCheck.length ? urlsToCheck : null;
}

// eslint-disable-next-line no-unused-vars
async function embeds(url) {
  return querySourceDocument(url, 'blockquote,iframe:is([src*="youtu"])');
}

// eslint-disable-next-line no-unused-vars
async function uat(url) {
  return querySourceDocument(url, '[href*="https://petplace.uat.petpartners.com/"],[src*="https://petplace.uat.petpartners.com/"]');
}

// eslint-disable-next-line no-unused-vars
async function azure(url) {
  return querySourceDocument(url, 'img[src*="web.core.windows.net"]');
}

// eslint-disable-next-line no-unused-vars
async function preview(url) {
  return adminOperation(url, 'preview');
}

// eslint-disable-next-line no-unused-vars
async function unpreview(url) {
  return adminOperation(url, 'preview', 'DELETE');
}

// eslint-disable-next-line no-unused-vars
async function publish(url) {
  return adminOperation(url, 'live');
}

// eslint-disable-next-line no-unused-vars
async function unpublish(url) {
  return adminOperation(url, 'live', 'DELETE');
}

// eslint-disable-next-line no-unused-vars
async function cache(url) {
  return adminOperation(url, 'cache');
}

const times = [];
function reportProgress(index, urls, result, time) {
  const position = document.querySelector('.position');
  position.textContent = index + 1;

  times.push(time);
  const recent = times.slice(-100);
  const average = recent.reduce((total, i) => total + i, 0) / recent.length;
  const eta = Math.ceil(((urls.length - index) * average) / 1000);
  const remaining = document.querySelector('.time');
  remaining.textContent = `${new Date(eta * 1000).toISOString().substring(11, 16)}m`;

  const url = urls[index];
  const [showSuccess, showFailure, showError] = [...document.querySelectorAll('input[name="filter"]')]
    .map((el) => el.checked);
  const overview = document.querySelector('.results-overview ul');
  const details = document.querySelector('.results-details');
  const disclosure = document.createElement('details');
  const summary = document.createElement('summary');
  const div = document.createElement('div');
  summary.innerHTML = `<a href="${url}" target="_blank">${url}</a>`;
  disclosure.prepend(summary);
  disclosure.append(div);
  details.append(disclosure);
  if (result instanceof Error) {
    overview.children[index].classList.add('error');
    disclosure.classList.add('error');
    disclosure.children[1].append(result.stack);
    disclosure.style.display = showError ? 'block' : 'none';
  } else {
    overview.children[index].classList.add(result ? 'success' : 'failure');
    disclosure.classList.add(result ? 'success' : 'failure');
    if (result) {
      disclosure.style.display = showSuccess ? 'block' : 'none';
    } else {
      disclosure.style.display = showFailure ? 'block' : 'none';
    }
  }
  disclosure.children[1].append(result ? toHtmlTable(result) : '');
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

  const details = document.querySelector('.results-details');
  details.innerHTML = '';

  const total = document.querySelector('.total');
  total.textContent = urls.length;

  let index = 0;
  let t0 = window.performance.now();
  // eslint-disable-next-line no-restricted-syntax
  for await (const result of bulkOperation(urls, window[action])) {
    const t1 = window.performance.now();
    reportProgress(index, urls, result, t1 - t0 + 500);
    index += 1;
    t0 = t1;
  }
}

document.querySelector('button').addEventListener('click', () => {
  run();
});

document.querySelectorAll('input[name="filter"]').forEach((input) => {
  input.addEventListener('click', (ev) => {
    if (ev.target.nodeName === 'INPUT') {
      const status = ev.target.value;
      const isChecked = ev.target.checked;
      document.querySelectorAll(`.results-details .${status}`).forEach((el) => {
        el.style.display = isChecked ? 'block' : 'none';
      });
    }
  });
});

const urls = window.localStorage.getItem('franklin-qa-urls');
if (urls) {
  document.querySelector('#urls').value = JSON.parse(urls).join('\n');
}
