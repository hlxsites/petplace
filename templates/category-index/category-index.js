import {
  buildBlock,
  decorateBlock,
  loadBlock,
  toClassName,
} from '../../scripts/lib-franklin.js';
import {
  createBreadCrumbs,
  fetchAndCacheJson,
  getCategories,
  getCategory,
  getPlaceholder,
  meterCalls,
} from '../../scripts/scripts.js';
// import { render as renderCategories } from '../../blocks/sub-categories/sub-categories.js';

await getCategories();

async function getAllParentCategories(category) {
  const parentCategories = [];
  let currentCategory = category;
  while (currentCategory.Parent) {
    // eslint-disable-next-line no-await-in-loop
    currentCategory = await getCategory(toClassName(currentCategory.Parent));
    parentCategories.push(currentCategory);
  }
  return parentCategories;
}

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

export async function getCategoryOrTagForUrl() {
  const { pathname } = window.location;
  const hasLegacyPagination = pathname.split('/').includes('page');
  const offset = (hasLegacyPagination && pathname.endsWith('/') && -4)
    || (hasLegacyPagination && pathname.endsWith('/') && -3)
    || (pathname.endsWith('/') && -2)
    || -1;
  const [category] = pathname.split('/').splice(offset, 1);
  const catResult = await getCategory(category);
  if (catResult) {
    return catResult;
  }

  const tags = await fetchAndCacheJson(`${window.hlx.contentBasePath}/tags/tags.json`);
  const tagResult = tags.find((tag) => tag.Path === pathname);
  return tagResult;
}

const pageCategory = await getCategoryOrTagForUrl();

let articleLoadingPromise;
async function renderArticles(articles) {
  const block = document.querySelector('.cards');
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
    if (!container.querySelector('h2')) {
      noResults = document.createElement('h2');
      container.prepend(noResults);
    }
    noResults.innerText = getPlaceholder('noArticles');
    if (pagination) {
      pagination.style.display = 'none';
    }
  }
  document.querySelector('.article-pagination').dataset.total = articleLoadingPromise.total();
  window.requestAnimationFrame(() => {
    block.querySelectorAll('.skeleton').forEach((sk) => (sk.closest('li') ? sk.closest('li').remove() : sk.remove()));
  });
}

async function getArticles(category) {
  const { default: ffetch } = await import('../../scripts/ffetch.js');

  const usp = new URLSearchParams(window.location.search);
  const limit = usp.get('limit') || 25;
  const offset = (Number(usp.get('page') || 1) - 1) * limit;
  if (window.location.pathname.startsWith('/tags/')) {
    return ffetch(`${window.hlx.contentBasePath}/article/tags-query-index.json`)
      .sheet(category.Slug.substring(0, 25)) // sharepoint limits sheet name length
      .withTotal(true)
      .slice(offset, offset + limit);
  }

  const parentCategories = await getAllParentCategories(pageCategory);
  const allCategories = [pageCategory, ...parentCategories];
  const topCategory = allCategories[allCategories.length - 1];
  return ffetch(`${window.hlx.contentBasePath}/article/categories-query-index.json`)
    .sheet(topCategory.Slug.substring(0, 25)) // sharepoint limits sheet name length
    .filter((article) => article.path.includes(`/${pageCategory.Slug}/`))
    .withTotal(true)
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
  // We're skipping validation for default template pages
  // to allow publishing new template updates
  const defaultPages = ['/article/category/default', '/tags/default'];
  if (defaultPages.find((path) => path === window.location.pathname)) {
    return;
  }
  const result = pageCategory;
  if (!result) {
    window.location.replace(`/invalid-category/${window.location.pathname.split('/').pop()}`);
    return;
  }
  const { Name, Category, Path } = result;
  document.title = Name || Category;
  document.head.querySelector('link[rel="canonical"]').href = `${window.location.origin}${Path}`;
  document.head.querySelector('meta[property="og:title"]').content = document.title;
  document.head.querySelector('meta[name="twitter:title"]').content = document.title;
  const h1 = document.querySelector('h1');
  h1.textContent = Name || Category;
  h1.id = toClassName(Name || Category);
}

const articles = getArticles(pageCategory);

export async function loadEager(document) {
  // List of max popular tags to display per viewport
  const maxTagsObj = {
    desktop: 5,
    tablet: 3,
    mobile: 0,
  };

  const cards = document.querySelector('.cards');
  for (let i = 0; i < 24; i += 1) {
    const div = document.createElement('div');
    div.classList.add('skeleton');
    cards.append(div);
  }

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

  renderArticles(articles);
  return null;
}

export async function loadLazy() {
  const main = document.querySelector('main');

  // Create breadcrumbs
  const breadcrumbContainer = document.createElement('div');
  main.prepend(breadcrumbContainer);

  const breadcrumbData = await createBreadCrumbs([{
    url: window.hlx.contentBasePath + pageCategory.Path,
    path: pageCategory.Path,
    color: 'black',
    label: pageCategory.Name || pageCategory.Category,
  }], { chevronAll: true, chevronIcon: 'chevron-large', useHomeLabel: true });
  createTemplateBlock(breadcrumbContainer, 'breadcrumb', [breadcrumbData]);

  const { adsenseFunc } = await import('../../scripts/adsense.js');
  adsenseFunc('category', 'create');
}

export async function loadDelayed() {
  const { pushToDataLayer } = await import('../../scripts/utils/helpers.js');
  await pushToDataLayer({
    event: 'adsense',
    type: 'category',
    category: pageCategory.Name || pageCategory.Category,
  });

  const { adsenseFunc } = await import('../../scripts/adsense.js');
  adsenseFunc('category', pageCategory.Name || pageCategory.Category);
}
