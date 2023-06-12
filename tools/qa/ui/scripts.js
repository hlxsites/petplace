const FRANKLIN_DOMAIN = 'https://main--petplace--hlxsites.hlx.live';
function bulkOperation(urls, fn, options = {}) {
  const overview = document.querySelector('.results-overview ul');
  overview.innerHTML = '';
  urls.forEach(() => {
    const li = document.createElement('li');
    overview.append(li);
  });
  const details = document.querySelector('.results-details');
  details.innerHTML = '';
  return urls.reduce(async (promise, urlString, i) => {
    const results = await promise;
    const det = document.createElement('details');
    const summary = document.createElement('summary');
    const div = document.createElement('div');
    summary.textContent = urlString;
    det.prepend(summary);
    det.append(div);
    try {
      const url = new URL(urlString);
      const result = await fn(url);
      results.push({ url: url.href, result });
      div.append(JSON.stringify(result));

      overview.children[i].classList.add(result ? 'success' : 'failure');
      det.classList.add(result ? 'success' : 'failure');
    } catch (err) {
      overview.children[i].classList.add('error');
      det.classList.add('error');
      console.error(err);
      div.append(JSON.stringify(err));
    } finally {
      details.append(det);
    }

    // Sleep for 1s before continuing
    await new Promise((resolve) => { setTimeout(resolve, options.sleep || 500); });
    return results;
  }, Promise.resolve([]));
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

async function diff(url) {
  const { pathname } = new URL(url);
  const parseHtml = (html) => new window.DOMParser().parseFromString(html, 'text/html');

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

async function run() {
  const urls = document.querySelector('#urls').value.split('\n');
  const action = document.querySelector('#action').value;
  window.localStorage.setItem('franklin-qa-urls', JSON.stringify(urls));
  await bulkOperation(urls, window[action]);
}

document.querySelector('button').addEventListener('click', () => {
  run();
});

const urls = window.localStorage.getItem('franklin-qa-urls');
if (urls) {
  document.querySelector('#urls').value = JSON.parse(urls).join('\n');
}
