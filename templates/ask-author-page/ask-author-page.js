import ffetch from '../../scripts/ffetch.js';
import {
  buildBlock,
  createOptimizedPicture,
  decorateIcons,
  getMetadata,
  toClassName,
} from '../../scripts/lib-franklin.js';
import { getPlaceholder, meterCalls } from '../../scripts/scripts.js';

const PAGINATE_ON = 12;

async function getArticles() {
  const usp = new URLSearchParams(window.location.search);
  const limit = usp.get('limit') || PAGINATE_ON;
  const offset = (Number(usp.get('page') || 1) - 1) * limit;
  return ffetch(`${window.hlx.contentBasePath}/article/categories-query-index.json`)
    .sheet('vet-qa-parent')
    .withTotal(true)
    .filter((article) => article.path.includes('/vet-qa/')
      && toClassName(article.author) === toClassName('Dr. Debra Primovic - DVM'))
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

function createTemplateBlock(main, blockName, elems = []) {
  const section = document.createElement('div');

  const block = buildBlock(blockName, { elems });
  section.append(block);
  main.append(section);
  return block;
}

// eslint-disable-next-line import/prefer-default-export
export function loadEager(document) {
  const main = document.querySelector('main');
  const avatarUrl = getMetadata('avatar');
  const authorName = getMetadata('author-name');
  const p = document.createElement('p');
  p.innerText = authorName;
  const avatar = createOptimizedPicture(avatarUrl, authorName, false, [{ width: 200 }]);

  createTemplateBlock(main, 'author-info', [avatar, p]);
  createTemplateBlock(main, 'cards');
  const pagination = createTemplateBlock(main, 'pagination');
  pagination.dataset.limit = PAGINATE_ON;
}

export function loadLazy(document) {
  const main = document.querySelector('main');
  const hero = main.querySelector('.hero > div > div');
  const h3 = main.querySelector('h3');
  if (h3) {
    hero.append(h3);
  }

  const arrow = document.createElement('span');
  arrow.classList.add('icon', 'icon-arrow');

  const text = document.createElement('span');
  text.innerText = 'Ask Now';

  const autoBlockDiv = document.createElement('div');
  autoBlockDiv.classList.add('ask-author-page-hero-auto-block');
  const askNow = document.createElement('a');
  askNow.append(arrow);
  askNow.append(text);
  askNow.href = `mailto:${getPlaceholder('websiteEmail')}`;
  autoBlockDiv.append(askNow);
  decorateIcons(askNow);

  const firstName = getMetadata('author-first-name');
  const finePrint1 = document.createElement('p');
  const finePrint2 = document.createElement('p');
  finePrint1.innerText = `* Due to the high volume of responses, ${firstName} will be unable to answer all questions received and publication of accepted questions will take a minimum of two weeks.`;
  finePrint2.innerText = `${firstName}'s guidance should not be considered veterinary advice like that provided by your veterinarian, since she is unable to personally examine your pet. If you have an immediate concern or emergency, contact a veterinarian or local veterinary hospital about your specific situation.`;
  autoBlockDiv.append(finePrint1);
  autoBlockDiv.append(finePrint2);
  hero.append(autoBlockDiv);

  renderArticles(getArticles());
}
