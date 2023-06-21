import ffetch from '../../scripts/ffetch.js';
import { buildBlock } from '../../scripts/lib-franklin.js';

async function renderArticles(articles) {
  const block = document.querySelector('.cards');
  block.querySelectorAll('li').forEach((li) => li.remove());
  const res = await articles;
  // eslint-disable-next-line no-restricted-syntax
  for await (const article of res) {
    const div = document.createElement('div');
    div.textContent = article.path;
    div.dataset.json = JSON.stringify(article);
    block.append(div);
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
    .filter((article) => `${article.description} ${article.title}`.toLowerCase().includes(query.toLowerCase()))
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
  main.insertBefore(buildSortBtn(), main.querySelector(':scope > div:nth-of-type(1)'));
  createTemplateBlock(main, 'pagination');
}

export async function loadLazy() {
  renderArticles(getArticles());
  // Softnav progressive enhancement for browsers that support it
  if (window.navigation) {
    window.addEventListener('popstate', () => {
      renderArticles(getArticles());
    });
  }
}
