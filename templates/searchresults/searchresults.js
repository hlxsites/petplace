import { buildBlock, sampleRUM } from '../../scripts/lib-franklin.js';
import { decorateResponsiveImages, getPlaceholder } from '../../scripts/scripts.js';

const isTrueSearch = window.location.pathname === `${window.hlx.contentBasePath}/search`;

let searchWorker;
// 2G connections are too slow to realistically load the elasticlunr search index
// instead we'll do a poor man's search on the last 5K articles
if (!('connection' in window.navigator) || !['slow-2g', '2g'].includes(window.navigator.connection.effectiveType)) {
  searchWorker = new Worker(`/scripts/worker/search.js?locale=${document.documentElement.lang}`);
}

function createArticleDiv(article) {
  const div = document.createElement('div');
  div.textContent = article.path;
  div.dataset.json = JSON.stringify(article);
  return div;
}

function removeSkeletons(block) {
  block.querySelectorAll(':scope > .skeleton').forEach((sk) => sk.remove());
  block.querySelectorAll('ul .skeleton').forEach((sk) => sk.parentElement.remove());
}

function noResultsHidePagination() {
  if (isTrueSearch) {
    document.querySelector('.pagination').style.display = 'none';
  }
  const searchResultText = document.querySelector('h2');
  searchResultText.innerHTML = getPlaceholder('noResults');
}

async function getArticles() {
  const usp = new URLSearchParams(window.location.search);
  let query;
  if (isTrueSearch) {
    query = (usp.get('query') || '').trim();
  } else {
    const [, page] = window.location.pathname.match(/([^/]*)(\/page)?(\/(\d+))?\/?$/) || [];
    query = page.replace(/-/g, ' ');
  }

  // Show the recent articles if we don't have a search query
  if (!query) {
    const resp = await fetch(`${window.hlx.contentBasePath}/article/query-index.json?sheet=article`);
    const json = await resp.json();
    return json.data.slice(0, 16);
  }

  let results;
  if (searchWorker) {
    searchWorker.postMessage({ query, operator: 'OR' });
    results = await new Promise((resolve) => {
      searchWorker.onmessage = (e) => {
        resolve(e.data);
      };
    });
    if (!isTrueSearch) {
      results = results.slice(0, 8);
    }
  } else {
    // Poor-man's fallback search for slow connections,
    // only looks at the last 5K articles and does basic keyword matching
    // eslint-disable-next-line import/no-unresolved, import/no-absolute-path
    const queryTokens = query.split(' ');
    const resp = await fetch(`${window.hlx.contentBasePath}/article/query-index.json?sheet=article&limit=-5000`);
    const json = await resp.json();

    results = json.data.filter((article) => queryTokens.every((t) => article.title.includes(t)
      || article.description.includes(t)));
  }

  const sortorder = usp.get('sort');
  switch (sortorder) {
    case 'titleasc':
      results = results.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'titledesc':
      results = results.sort((a, b) => a.title.localeCompare(b.title)).reverse();
      break;
    case 'dateasc':
      results = results.sort((a, b) => a.date.localeCompare(b.date));
      break;
    case 'datedesc':
      results = results.sort((a, b) => a.date.localeCompare(b.date)).reverse();
      break;
    default:
  }
  return results;
}

async function renderArticles() {
  const block = document.querySelector('.cards');

  // Prepare cards block with skeletons
  block.querySelectorAll('li').forEach((li) => li.remove());
  for (let i = 0; i < 25; i += 1) {
    const div = document.createElement('div');
    div.classList.add('skeleton');
    block.append(div);
  }
  const pagination = document.querySelector('.pagination');
  if (pagination) {
    pagination.dataset.total = '…';
  }

  const articles = await getArticles();

  const usp = new URLSearchParams(window.location.search);
  if (!articles.length) {
    removeSkeletons(block);
    const query = usp.get('query');
    sampleRUM('nullsearch', { source: '.search-input', target: query });
    noResultsHidePagination();
    return;
  }

  const limit = usp.get('limit') || 16;
  const offset = (Number(usp.get('page') || 1) - 1) * limit;
  const paginatedArticles = articles.slice(offset, offset + limit);

  // eslint-disable-next-line no-restricted-syntax
  paginatedArticles.forEach((article) => {
    const div = createArticleDiv(article);
    block.append(div);
  });

  removeSkeletons(block);
  if (pagination) {
    pagination.dataset.total = articles.length;
  }

  if (!isTrueSearch) {
    document.querySelector('.cards').addEventListener('click', (ev) => {
      if (ev.target.closest('a')) {
        sampleRUM('saved-404', { source: window.location.href, target: ev.target.href });
      }
    });
  }
}

function sortselection() {
  const sortParams = new URLSearchParams(window.location.search);
  if (document.getElementById('orderby').value === 'sortby') {
    sortParams.delete('sort');
    sortParams.set('page', 1);
    window.location.search = sortParams.toString();
  } else {
    sortParams.set('sort', document.getElementById('orderby').value);
    sortParams.set('page', 1);
    window.location.search = sortParams.toString();
  }
}

function buildSortBtn() {
  const div = document.createElement('div');
  div.classList.add('sortbtn');
  const h2 = document.createElement('h2');
  h2.innerText = getPlaceholder('searchResults');
  div.append(h2);
  const select = document.createElement('select');
  select.classList.add('search-select');
  select.setAttribute('aria-label', getPlaceholder('sortResults'));
  select.id = 'orderby';
  select.options.add(new Option(getPlaceholder('sortBy'), 'sortby'));
  select.options.add(new Option(getPlaceholder('sortByRelevance'), 'relevance', false, true));
  select.options.add(new Option(getPlaceholder('sortByTitleAsc'), 'titleasc'));
  select.options.add(new Option(getPlaceholder('sortByTitleDesc'), 'titledesc'));
  select.options.add(new Option(getPlaceholder('sortByDateAsc'), 'dateasc'));
  select.options.add(new Option(getPlaceholder('sortByDateDesc'), 'datedesc'));
  select.options[0].disabled = true;
  const usp = new URLSearchParams(window.location.search);
  if (usp.get('sort') !== null) {
    select.value = usp.get('sort');
  }
  select.addEventListener(
    'change',
    sortselection,
    false,
  );
  div.append(select);
  return div;
}

function createTemplateBlock(main, blockName) {
  const section = document.createElement('div');

  const block = buildBlock(blockName, { elems: [] });
  block.dataset.limit = 16;
  section.append(block);
  main.append(section);
}

export async function loadEager(document) {
  const main = document.querySelector('main');
  if (isTrueSearch) {
    createTemplateBlock(main, 'pagination');
    main.insertBefore(buildSortBtn(), main.querySelector(':scope > div:nth-of-type(2)'));
  } else {
    const response = await fetch(`${window.hlx.contentBasePath}/fragments/404.plain.html`);
    main.innerHTML = await response.text();

    // Update 404 page metadata
    document.head.querySelector('title').textContent = `${getPlaceholder('pageNotFound')} | ${getPlaceholder('websiteName')}`;
    document.head.querySelector('meta[property="og:title"]').content = document.head.title;
    if (document.body.querySelector('.error-message')) {
      document.body.querySelector('.error-message').textContent = document.head.title;
    }
    if (document.body.querySelector('.error-button-home')) {
      document.body.querySelector('.error-button-home').textContent = getPlaceholder('goHome');
    }
  }
}

export async function loadLazy(document) {
  const main = document.querySelector('main');
  const hero = document.createElement('div');
  const imgDiv = document.createElement('div');
  const contentDiv = document.createElement('div');
  const defaultContentWrapper = main.querySelector('.default-content-wrapper');

  defaultContentWrapper.parentElement.classList.add('hero-container');
  hero.className = 'hero-wrapper';
  imgDiv.className = 'img-div';
  contentDiv.classList = 'text-div';

  [...defaultContentWrapper.querySelectorAll('picture')].forEach((el) => {
    imgDiv.append(el);
  });
  hero.append(imgDiv);
  contentDiv.append(document.querySelector('h1'));

  [...defaultContentWrapper.querySelectorAll('p')].forEach((el) => {
    if (el.innerText.trim() !== '') {
      contentDiv.append(el);
    }
  });
  if (isTrueSearch) {
    contentDiv.append(document.querySelector('.search-wrapper'));
  }
  hero.append(contentDiv);
  decorateResponsiveImages(imgDiv, ['461']);
  defaultContentWrapper.replaceWith(hero);
  renderArticles();
  // Softnav progressive enhancement for browsers that support it
  if (window.navigation) {
    window.addEventListener('popstate', async () => {
      renderArticles();
    });
  }
}
