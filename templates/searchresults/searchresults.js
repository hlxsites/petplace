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
  return ffetch('/article/query-index.json')
    .sheet('article')
    .withTotal(true)
    .filter((article) => `${article.description} ${article.title}`.toLowerCase().includes(query.toLowerCase()))
    .slice(offset, offset + limit);
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
