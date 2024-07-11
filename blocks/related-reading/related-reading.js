import ffetch from '../../scripts/ffetch.js';
import {
  getMetadata,
  createOptimizedPicture,
  toClassName,
} from '../../scripts/lib-franklin.js';
import {
  getCategories,
  getCategory,
  getPlaceholder,
} from '../../scripts/scripts.js';

export async function getCategoriesPath(path) {
  const categories = await getCategories();
  return categories.filter(
    (c) => c.Path === path || c['Parent Path'].startsWith(path),
  );
}

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

function ifArticleBelongsToCategories(article, categories) {
  const articleCategories = article.category !== '0'
    ? article.category.split(',').map((c) => c.trim().toLowerCase())
    : article.path.split('/').splice(-2, 1);
  return categories.some(
    (c) => articleCategories.includes(c.Category.toLowerCase())
      || articleCategories.map((ac) => toClassName(ac)).includes(c.Slug),
  );
}

function createArticleDetails(block, article) {
  // the article's thumbnail, which will link to the article's page
  const thumbnail = document.createElement('div');
  thumbnail.classList.add('related-reading-thumbnail');
  // a.href = article.path;
  thumbnail.append(
    createOptimizedPicture(article.image, article.title, false, [
      { media: '(min-width: 1024px)', width: 250 },
      { width: 180 },
    ]),
  );

  // title of the article, which will link to the article's page
  const titleDiv = document.createElement('div');
  const tileTitle = article.title.replace(/[-|] Petplace(\.com)?$/i, '');
  titleDiv.classList.add('related-reading-title');
  titleDiv.innerHTML = `
    <a href="${article.path}">
      <span class="related-reading-title-text">${tileTitle}</span>
    </a>
  `;

  const detailsContainer = document.createElement('div');
  detailsContainer.classList.add('related-reading-details');
  detailsContainer.append(titleDiv);

  const articleDiv = document.createElement('div');
  articleDiv.classList.add('tile');
  articleDiv.append(thumbnail);
  articleDiv.append(detailsContainer);
  block.append(articleDiv);
}

async function createNavigation(block) {
  let category = getMetadata('category').split(',')[0]?.trim();
  if (!category) {
    // fall back on URL of a category hasn't been defined in the page's metadata
    category = await getCategory(
      window.location.pathname.split('/').slice(-2).shift(),
    );
  }
  if (!category) return false;

  // get full category info so we have the path of the category
  const categoryInfo = await getCategory(category);
  if (!categoryInfo) return false;

  const parentCategories = await getAllParentCategories(categoryInfo);
  const categories = [categoryInfo, ...parentCategories];

  // Get all articles in that category
  const articles = await ffetch(
    `${window.hlx.contentBasePath}/article/query-index.json`,
  )
    .sheet('article')
    .chunks(500)
    .filter((article) => ifArticleBelongsToCategories(article, categories))
    .all();

  const parentCategoryArticlesMap = new Map();
  parentCategories.forEach((c) => parentCategoryArticlesMap.set(c.Slug, []));

  // eslint-disable-next-line no-restricted-syntax
  for await (const [index, article] of articles.entries()) {
    if (index === 3) break;
    if (ifArticleBelongsToCategories(article, parentCategories)) {
      if (parentCategoryArticlesMap.has(article['category slug'])) {
        parentCategoryArticlesMap.get(article['category slug']).push(article);
      }
    }
  }

  const parentCategory = parentCategories.find((c) => {
    const parentCategoryArticles = parentCategoryArticlesMap.get(c.Slug);
    return parentCategoryArticles.length;
  });
  if (parentCategory) {
    const parentCategoryArticles = parentCategoryArticlesMap.get(
      parentCategory.Slug,
    );
    parentCategoryArticles.forEach((article) => {
      createArticleDetails(block, article);
    });
  }

  return true;
}

export default async function decorate(block) {
  const extraDiv = block.querySelector('div > div');
  extraDiv.className = 'extra-div';
  extraDiv.remove();

  const header = document.createElement('div');
  const relatedReadingDiv = document.querySelector('.related-reading-wrapper');
  header.classList.add('related-reading-header');
  header.innerText = getPlaceholder('relatedReading');
  relatedReadingDiv.prepend(header);

  const isVisible = await createNavigation(block);

  if (!isVisible) {
    // ensure the extra spacing for the block isn't present if
    // nothing was rendered
    const container = document.querySelector('.related-reading-container');
    if (!container) {
      return;
    }
    container.classList.add('related-reading-hidden');
  }
}
