import ffetch from '../../scripts/ffetch.js';
import { buildBlock } from '../../scripts/lib-franklin.js';
import { decorateResponsiveImages, meterCalls } from '../../scripts/scripts.js';

async function renderArticles(articles) {
  const block = document.querySelector('.cards');
  block.querySelectorAll('li').forEach((li) => li.remove());
  for (let i = 0; i < 25; i += 1) {
    const div = document.createElement('div');
    div.classList.add('skeleton');
    block.append(div);
  }
  const res = await articles;
  // eslint-disable-next-line no-restricted-syntax
  for await (const article of res) {
    const div = document.createElement('div');
    div.textContent = article.path;
    div.dataset.json = JSON.stringify(article);
    meterCalls(() => block.append(div)).then(() => {
      window.requestAnimationFrame(() => {
        block.querySelectorAll('.skeleton').forEach((sk) => sk.parentElement.remove());
      });
    });
  }
  document.querySelector('.pagination').dataset.total = res.total();
}

async function getArticles() {
  const usp = new URLSearchParams(window.location.search);
  const limit = usp.get('limit') || 16;
  const query = usp.get('query');
  const offset = (Number(usp.get('page') || 1) - 1) * limit;
  const sortorder = usp.get('sort');
  let sheet = 'article';
  if (sortorder === 'titleasc') {
    sheet = 'article-by-title-asc';
  } else if (sortorder === 'titledesc') {
    sheet = 'article-by-title-desc';
  } else if (sortorder === 'dateasc') {
    sheet = 'article-by-date-asc';
  }
  return ffetch('/article/query-index.json')
    .sheet(sheet)
    .withTotal(true)
    .filter((article) => !query || `${article.description} ${article.title}`.toLowerCase().includes(query.toLowerCase()))
    .slice(offset, offset + limit);
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
  select.id = 'orderby';
  select.options[0] = new Option('Sort By', 'sortby');
  select.options[1] = new Option('title A-Z', 'titleasc');
  select.options[2] = new Option('title Z-A', 'titledesc');
  select.options[3] = new Option('date ASC', 'dateasc');
  select.options[4] = new Option('date DSC', 'datedesc');
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
  defaultContentWrapper.outerHTML = hero.outerHTML;
  renderArticles(getArticles());
  // Softnav progressive enhancement for browsers that support it
  if (window.navigation) {
    window.addEventListener('popstate', () => {
      renderArticles(getArticles());
    });
  }
}
