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
  const allCategories = [categoryInfo, ...parentCategories];
  const mainCategory = allCategories[allCategories.length - 1];

  // Get all articles in that category
  const articles = await ffetch(`${window.hlx.contentBasePath}/article/categories-query-index.json`)
    .sheet(mainCategory.Slug.substring(0, 25)) // sharepoint limits sheet name length
    .chunks(500)
    .all();

  let tmpCategory;
  const categoriesMap = new Map();
  // eslint-disable-next-line no-restricted-syntax
  for await (const article of articles.values()) {
    [tmpCategory] = article.path.split('/').slice(2, -1).reverse();
    if (!categoriesMap[tmpCategory]) {
      categoriesMap[tmpCategory] = [];
    }
    categoriesMap[tmpCategory].push(article);
  }

  const orderedArticles = allCategories.reduce((list, c) => {
    list.push(...(categoriesMap[c.Slug] || []));
    return list;
  }, []);

  if (!orderedArticles.length) {
    return false;
  }

  orderedArticles.slice(0, 3).forEach((article) => {
    createArticleDetails(block, article);
  });

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
