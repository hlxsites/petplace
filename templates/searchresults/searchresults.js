import ffetch from '../../scripts/ffetch.js';
import { buildBlock } from '../../scripts/lib-franklin.js';
import { decorateResponsiveImages } from '../../scripts/scripts.js';

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
