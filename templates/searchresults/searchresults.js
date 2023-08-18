import { buildBlock, sampleRUM } from '../../scripts/lib-franklin.js';
import { decorateResponsiveImages, loadScript } from '../../scripts/scripts.js';

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
  document.querySelector('.pagination').style.display = 'none';
  const searchResultText = document.querySelector('h2');
  searchResultText.innerHTML = 'No results found';
}

async function getArticles() {
  const usp = new URLSearchParams(window.location.search);
  const limit = usp.get('limit') || 16;
  const offset = (Number(usp.get('page') || 1) - 1) * limit;
  const query = usp.get('query');
  const sortorder = usp.get('sort');

  // Show the recent articles if we don't have a search query
  if (!query) {
    const resp = await fetch('/article/query-index.json?sheet=article');
    const json = await resp.json();
    return json.data.slice(0, 16);
  }

  let results;
  try {
    const resp = await fetch('/search-index.json');
    if (!resp.ok) {
      // eslint-disable-next-line no-console
      console.error('Failed to load search index', resp.status);
    }
    const json = await resp.json();
    const index = window.elasticlunr.Index.load(json);
    results = index.search(query, { bool: 'AND' }).map((result) => result.doc);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to load search index', err);
    results = [];
  }

  let res = results;
  switch (sortorder) {
    case 'titleasc':
      res = res.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'titledesc':
      res = res.sort((a, b) => a.title.localeCompare(b.title)).reverse();
      break;
    case 'dateasc':
      res = res.sort((a, b) => a.date.localeCompare(b.date));
      break;
    case 'datedesc':
      res = res.sort((a, b) => a.date.localeCompare(b.date)).reverse();
      break;
    default:
  }
  return res.slice(offset, offset + limit);
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
  document.querySelector('.pagination').dataset.total = '…';

  const articles = await getArticles();

  if (!articles.length) {
    removeSkeletons(block);
    const usp = new URLSearchParams(window.location.search);
    const query = usp.get('query');
    sampleRUM('nullsearch', { source: '.search-input', target: query });
    noResultsHidePagination();
    return;
  }

  // eslint-disable-next-line no-restricted-syntax
  articles.forEach((article) => {
    const div = createArticleDiv(article);
    block.append(div);
  });

  removeSkeletons(block);
  document.querySelector('.pagination').dataset.total = articles.length;
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
  h2.innerText = 'Search Results';
  div.append(h2);
  const select = document.createElement('select');
  select.classList.add('search-select');
  select.setAttribute('aria-label', 'Sort results');
  select.id = 'orderby';
  select.options.add(new Option('Sort By', 'sortby'));
  select.options.add(new Option('Relevance', 'relevance', false, true));
  select.options.add(new Option('Title A-Z', 'titleasc'));
  select.options.add(new Option('Title Z-A', 'titledesc'));
  select.options.add(new Option('Date ASC', 'dateasc'));
  select.options.add(new Option('Date DSC', 'datedesc'));
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

export async function loadEager(main) {
  loadScript('/scripts/elasticlunr.js');
  createTemplateBlock(main, 'pagination');
  main.insertBefore(buildSortBtn(), main.querySelector(':scope > div:nth-of-type(2)'));
}

export async function loadLazy(main) {
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
  contentDiv.append(document.querySelector('.search-wrapper'));
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
