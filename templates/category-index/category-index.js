import ffetch from '../../scripts/ffetch.js';
import {
  buildBlock,
  decorateBlock,
  loadBlock,
  toClassName,
} from '../../scripts/lib-franklin.js';
import {
  createBreadCrumbs,
  getCategories,
  getCategory,
  getPlaceholder,
  meterCalls,
} from '../../scripts/scripts.js';
import { pushToDataLayer } from '../../scripts/utils/helpers.js';
// import { render as renderCategories } from '../../blocks/sub-categories/sub-categories.js';

/**
 * Queries the colum and finds the matching image else uses default image.
 * @param path
 * @returns {Promise<HTMLPictureElement || undefined>}
 */
export async function getCategoryImage(path) {
  const res = await fetch(`${window.hlx.contentBasePath}/article/category/category-images.plain.html`);
  const htmlText = await res.text();
  const div = document.createElement('div');
  div.innerHTML = htmlText;

  const column = div.querySelector('.columns');
  // eslint-disable-next-line max-len
  return [...column.children].find((el) => el.children[0].textContent.trim() === path)?.children[1].children[0];
}

export async function getCategoryForUrl() {
  const { pathname } = window.location;
  const [category] = pathname.split('/').splice(pathname.endsWith('/') ? -2 : -1, 1);
  return getCategory(category);
}

let articleLoadingPromise;
async function renderArticles(articles) {
  const block = document.querySelector('.cards');
  block.querySelectorAll('li').forEach((li) => li.remove());
  for (let i = 0; i < 25; i += 1) {
    const div = document.createElement('div');
    div.classList.add('skeleton');
    block.append(div);
  }
  document.querySelector('.article-pagination').dataset.total = '…';
  articleLoadingPromise = await articles;
  let articleCount = 0;
  const pagination = document.querySelector('.article-pagination.block');
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
  document.querySelector('.article-pagination').dataset.total = articleLoadingPromise.total();
  window.requestAnimationFrame(() => {
    block.querySelectorAll('.skeleton').forEach((sk) => sk.parentElement.remove());
  });
}

async function getArticles() {
  const categories = await getCategories();
  const categoryPath = new URL(document.head.querySelector('link[rel="canonical"]').href).pathname;
  const applicableCategories = categories
    .filter((c) => c.Path === categoryPath
      || c['Parent Path'].startsWith(categoryPath))
    .map((c) => ({ id: c.Slug, name: toClassName(c.Category) }));
  const usp = new URLSearchParams(window.location.search);
  const limit = usp.get('limit') || 25;
  const offset = (Number(usp.get('page') || 1) - 1) * limit;
  return ffetch(`${window.hlx.contentBasePath}/article/query-index.json`)
    .sheet('article')
    .withTotal(true)
    .filter((article) => {
      const articleCategories = article.category !== '0'
        ? article.category.split(',').map((c) => toClassName(c))
        : article.path.split('/').splice(-2, 1);
      return applicableCategories.some((c) => articleCategories.includes(c.name)
        || articleCategories.includes(c.id));
    })
    .slice(offset, offset + limit);
}

function createTemplateBlock(main, blockName, elems = []) {
  const section = document.createElement('div');

  const block = buildBlock(blockName, { elems });
  section.append(block);
  main.append(section);

  decorateBlock(block);
  loadBlock(block);
}

async function updateMetadata() {
  const category = await getCategoryForUrl();
  if (!category) {
    throw new Error(404);
  }
  const {
    Category, Path,
  } = category;
  document.title = Category;
  document.head.querySelector('link[rel="canonical"]').href = `${window.location.origin}${Path}`;
  document.head.querySelector('meta[property="og:title"]').content = document.title;
  document.head.querySelector('meta[name="twitter:title"]').content = document.title;
  const h1 = document.querySelector('h1');
  h1.textContent = Category;
  h1.id = toClassName(Category);
}

export async function loadEager(document) {
  // List of max popular tags to display per viewport
  const maxTagsObj = {
    desktop: 5,
    tablet: 3,
    mobile: 0,
  };

  const main = document.querySelector('main');
  const h1 = document.createElement('h1');
  main.prepend(h1);
  await updateMetadata();
  const h2 = document.createElement('h2');
  h2.classList.add('sr-only');
  h2.textContent = getPlaceholder('articles');
  h1.after(h2);
  const popularTagsContainer = document.createElement('div');
  h2.after(popularTagsContainer);
  const popularTags = buildBlock('popular-tags', { elems: [] });
  Object.entries(maxTagsObj).forEach(([viewport, maxTags]) => {
    popularTags.setAttribute(`data-max-tags-${viewport}`, maxTags);
  });
  popularTagsContainer.append(popularTags);
  createTemplateBlock(main, 'article-pagination');
}

export async function loadLazy() {
  const category = await getCategoryForUrl();
  if (!category) {
    return;
  }

  const { Category, Path } = category;

  renderArticles(getArticles());

  // Create breadcrumbs
  const main = document.querySelector('main');
  const body = main.parentNode;
  const breadcrumbContainer = document.createElement('div');
  body.insertBefore(breadcrumbContainer, main);

  const breadcrumbData = await createBreadCrumbs([{
    url: window.hlx.contentBasePath + Path,
    path: Category,
    color: 'black',
    label: Category,
  }], { chevronAll: true, chevronIcon: 'chevron-large', useHomeLabel: true });
  createTemplateBlock(breadcrumbContainer, 'breadcrumb', [breadcrumbData]);

  const { adsenseFunc } = await import('../../scripts/adsense.js');
  adsenseFunc('category', 'create');
}

export async function loadDelayed() {
  const pageCat = await getCategoryForUrl();
  await pushToDataLayer({
    event: 'adsense',
    type: 'category',
    category: pageCat.Slug,
  });

  const { adsenseFunc } = await import('../../scripts/adsense.js');
  adsenseFunc('category', pageCat.Slug);
}
