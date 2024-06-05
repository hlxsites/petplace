import ffetch from '../../scripts/ffetch.js';
import {
  buildBlock,
  createOptimizedPicture,
  getMetadata,
  toClassName,
} from '../../scripts/lib-franklin.js';
import { createBreadCrumbs, getPlaceholder, meterCalls } from '../../scripts/scripts.js';

const PAGINATE_ON = 12;

async function getArticles() {
  const usp = new URLSearchParams(window.location.search);
  const limit = usp.get('limit') || PAGINATE_ON;
  const offset = (Number(usp.get('page') || 1) - 1) * limit;
  const author = window.location.pathname.split('/').pop();
  return ffetch(`${window.hlx.contentBasePath}/article/query-index.json`)
    .sheet('article')
    .withTotal(true)
    .filter((article) => toClassName(article.author) === author)
    .slice(offset, offset + limit);
}

let articleLoadingPromise;
async function renderArticles(articles) {
  const block = document.querySelector('.cards');
  block.querySelectorAll('li').forEach((li) => li.remove());
  for (let i = 0; i < PAGINATE_ON; i += 1) {
    const div = document.createElement('div');
    div.classList.add('skeleton');
    block.append(div);
  }
  document.querySelector('.pagination').dataset.total = '…';
  articleLoadingPromise = await articles;
  let articleCount = 0;
  const pagination = document.querySelector('.pagination.block');
  // eslint-disable-next-line no-restricted-syntax
  for await (const article of articleLoadingPromise) {
    const div = document.createElement('div');
    div.dataset.json = JSON.stringify(article);
    articleCount += 1;
    await meterCalls(() => block.append(div));
    pagination.style.display = '';
  }
  if (articleCount === 0) {
    const container = document.querySelector('.cards-container');
    let noResults = container.querySelector('h2');
    if (!document.querySelector('h2')) {
      noResults = document.createElement('h2');
      container.append(noResults);
    }
    noResults.innerText = getPlaceholder('noArticles');
    if (pagination) {
      pagination.style.display = 'none';
    }
  }
  document.querySelector('.pagination').dataset.total = articleLoadingPromise.total();
  window.requestAnimationFrame(() => {
    block.querySelectorAll('.skeleton').forEach((sk) => sk.parentElement.remove());
  });
}

function createTemplateBlock(main, blockName, gridName, elems = []) {
  const gridNameValue = gridName || blockName;
  const section = document.createElement('div');
  section.classList.add('author-template-autoblock', `author-template-grid-${gridNameValue}`);

  const block = buildBlock(blockName, { elems });
  section.append(block);
  main.append(section);
  return block;
}

// eslint-disable-next-line import/prefer-default-export
export async function loadEager(document) {
  const main = document.querySelector('main');
  const heading = main.querySelector('h1');
  const breadcrumbData = await createBreadCrumbs([{
    url: `${window.hlx.contentBasePath}/authors/`,
    path: 'Authors',
    color: 'blue-dark',
    label: getPlaceholder('authors'),
  }, {
    url: window.location,
    path: heading.innerText,
    color: 'purple',
    label: heading.innerText,
  }], { chevronAll: true });
  createTemplateBlock(main, 'breadcrumb', 'breadcrumb', [breadcrumbData]);
  createTemplateBlock(main, 'social-links');
  createTemplateBlock(main, 'cards');
  const pagination = createTemplateBlock(main, 'pagination');
  pagination.dataset.limit = PAGINATE_ON;
  createTemplateBlock(main, 'popular-articles', undefined, ['<h1 class="author-popular-posts"></h1>']);
}

export async function loadLazy(document) {
  const hero = document.querySelector('.hero > div > div');
  const avatar = getMetadata('avatar');
  const optimizedAvatar = createOptimizedPicture(avatar, getMetadata('title'), true, [
    { width: 200 },
  ]);
  optimizedAvatar.classList.add('author-page-avatar');
  hero.append(optimizedAvatar);

  renderArticles(getArticles());
}
