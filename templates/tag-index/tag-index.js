import ffetch from '../../scripts/ffetch.js';
import {
  buildBlock,
  toClassName,
} from '../../scripts/lib-franklin.js';
import {
  fetchAndCacheJson,
  getId,
  getPlaceholder,
  isTablet,
  meterCalls,
} from '../../scripts/scripts.js';
import { pushToDataLayer } from '../../scripts/utils/helpers.js';

const PAGINATE_ON = 12;

async function getTagForUrl() {
  const tags = await fetchAndCacheJson(`${window.hlx.contentBasePath}/tags/tags.json`);
  const { pathname } = window.location;
  return tags.find((tag) => tag.Path === pathname);
}

async function getArticles() {
  const usp = new URLSearchParams(window.location.search);
  const limit = usp.get('limit') || PAGINATE_ON;
  const offset = (Number(usp.get('page') || 1) - 1) * limit;
  const tag = await getTagForUrl();
  const tagName = toClassName(tag.Name);
  return ffetch(`${window.hlx.contentBasePath}/article/tags-query-index.json`)
    .sheet(tagName.substring(0, 25))
    .withTotal(true)
    .filter((article) => JSON.parse(article.tags).map((t) => toClassName(t)).includes(tagName))
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
    block.querySelectorAll('.skeleton').forEach((sk) => sk.closest('li').remove());
    block.querySelectorAll('ul > li:empty').forEach((el) => el.remove());
  });
}

function createTemplateBlock(main, blockName, elems = []) {
  const section = document.createElement('div');

  const block = buildBlock(blockName, { elems });
  section.append(block);
  main.append(section);
  return block;
}

async function updateMetadata() {
  const tag = await getTagForUrl();
  if (!tag) {
    window.location.replace(`/invalid-tag/${window.location.pathname.split('/').pop()}`);
    return;
  }
  const { Name } = tag;
  document.title = `${Name} | ${document.title}`;
  document.head.querySelector('meta[property="og:title"]').content = document.title;
  document.head.querySelector('meta[name="twitter:title"]').content = document.title;
  const h1 = document.querySelector('h1');
  h1.textContent = Name;
  h1.id = toClassName(Name);
}

function buildSidebar() {
  const section = document.createElement('div');
  section.classList.add('sidebar');
  section.setAttribute('role', 'complementary');

  const id1 = getId();
  const id2 = getId();
  const filterToggle = document.createElement('button');
  filterToggle.disabled = !isTablet();
  filterToggle.setAttribute('aria-controls', `${id1} ${id2}`);
  filterToggle.textContent = getPlaceholder('filters');
  section.append(filterToggle);

  const subCategories = buildBlock('sub-categories', { elems: [] });
  subCategories.id = id1;
  subCategories.setAttribute('aria-hidden', isTablet());
  section.append(subCategories);

  const popularTags = buildBlock('popular-tags', { elems: [] });
  popularTags.id = id2;
  popularTags.setAttribute('aria-hidden', isTablet());
  section.append(popularTags);

  filterToggle.addEventListener('click', () => {
    const isVisible = subCategories.getAttribute('aria-hidden') === 'false';
    if (!isVisible) {
      filterToggle.dataset.mobileVisible = true;
    }
    subCategories.setAttribute('aria-hidden', isVisible);
    popularTags.setAttribute('aria-hidden', isVisible);
  });

  window.addEventListener('resize', () => {
    const isVisible = subCategories.getAttribute('aria-hidden') === 'false';
    if (!isVisible && !isTablet()) {
      filterToggle.disabled = true;
      subCategories.setAttribute('aria-hidden', false);
      popularTags.setAttribute('aria-hidden', false);
    } else if (isVisible && isTablet() && !filterToggle.dataset.mobileVisible) {
      filterToggle.disabled = false;
      subCategories.setAttribute('aria-hidden', true);
      popularTags.setAttribute('aria-hidden', true);
    }
  }, { passive: true });

  return section;
}

// eslint-disable-next-line import/prefer-default-export
export async function loadEager(document) {
  const main = document.querySelector('main');
  await updateMetadata();
  const h2 = document.createElement('h2');
  h2.classList.add('sr-only');
  h2.textContent = getPlaceholder('articles');
  const h1 = main.querySelector('h1');
  h1.after(h2);
  main.insertBefore(buildSidebar(), main.querySelector(':scope > div:nth-of-type(1)'));
  createTemplateBlock(main, 'pagination');
}

export async function loadLazy() {
  renderArticles(getArticles());

  const { adsenseFunc } = await import('../../scripts/adsense.js');
  adsenseFunc('tag', 'create');
}

export async function loadDelayed() {
  const pageTag = await getTagForUrl();
  await pushToDataLayer({
    event: 'adsense',
    type: 'tags',
    category: pageTag.Slug,
  });

  const { adsenseFunc } = await import('../../scripts/adsense.js');
  adsenseFunc('tag', pageTag.Slug);
}
