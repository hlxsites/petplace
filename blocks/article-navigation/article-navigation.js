import ffetch from '../../scripts/ffetch.js';
import {
  decorateIcons,
  getMetadata,
  createOptimizedPicture,
  toClassName,
} from '../../scripts/lib-franklin.js';
import {
  getCategoriesPath,
  getCategory,
  getCategoryByName,
} from '../../scripts/scripts.js';

function createArticleDetails(block, key, categoryInfo, article) {
  // the article's thumbnail, which will link to the article's page
  const thumbnail = document.createElement('div');
  thumbnail.classList.add('article-navigation-thumbnail', `article-navigation-${key}-thumbnail`);
  const a = document.createElement('a');
  a.href = article.path;
  a.append(createOptimizedPicture(article.image, article.title, false, [
    { media: '(min-width: 1024px)', width: 250 },
    { width: 180 },
  ]));
  thumbnail.append(a);

  // category name of the article, which will link to that category's page
  const categoryHref = categoryInfo ? categoryInfo.Path : '#';
  const category = document.createElement('div');
  category.classList.add('article-navigation-category');
  category.innerHTML = `<a href="${categoryHref}">${categoryInfo.Category}</a>`;

  // title of the article, which will link to the article's page
  const title = document.createElement('div');
  title.classList.add('article-navigation-title');
  title.innerHTML = `
    <a href="${article.path}"><div class="article-navigation-${key}-title-text">${article.title}</div></a>
  `;

  const sectionContainer = document.createElement('div');
  sectionContainer.classList.add('article-navigation-details', `article-navigation-${key}-details`);
  sectionContainer.append(category);
  sectionContainer.append(title);

  block.append(thumbnail);
  block.append(sectionContainer);
}

async function createNavigation(block) {
  let category = getMetadata('category');
  if (!category) {
    // fall back on URL of a category hasn't been defined in the page's metadata
    category = await getCategory(window.location.pathname.split('/').slice(-2).shift());
  }
  if (!category) {
    return false;
  }

  // get full category info so we have the path of the category
  const categoryInfo = await getCategoryByName(category);
  if (!categoryInfo) {
    return false;
  }
  const categories = await getCategoriesPath(categoryInfo.Path);

  // Get all articles in that category
  const articles = ffetch('/article/query-index.json')
    .sheet('article')
    .filter((article) => {
      const articleCategories = article.category !== '0'
        ? article.category.split(',').map((c) => c.trim().toLowerCase())
        : article.path.split('/').splice(-2, 1);
      return categories.some((c) => articleCategories.includes(c.Category.toLowerCase())
        || articleCategories.map((ac) => toClassName(ac)).includes(c.Slug));
    });

  let previousArticle = null;
  let nextArticle = null;
  let found = false;
  // eslint-disable-next-line no-restricted-syntax
  for await (const article of articles) {
    if (found) {
      nextArticle = article;
      break;
    }
    if (article.path === window.location.pathname) {
      found = true;
    } else {
      previousArticle = article;
    }
  }

  if (previousArticle || nextArticle) {
    // combined previous/next label for mobile view
    const combinedHeader = document.createElement('div');
    combinedHeader.classList.add('article-navigation-combined-header');
    combinedHeader.innerText = 'Previous / Next Article';
    block.append(combinedHeader);
  }

  if (previousArticle) {
    // previous-only label for non-mobile
    const previousHeader = document.createElement('div');
    previousHeader.classList.add('article-navigation-previous-header');
    previousHeader.innerText = 'Previous Article';
    block.append(previousHeader);
  }

  if (nextArticle) {
    // next-only label for non-mobile
    const nextHeader = document.createElement('div');
    nextHeader.classList.add('article-navigation-next-header');
    nextHeader.innerText = 'Next Article';
    block.append(nextHeader);
  }

  if (previousArticle) {
    // left arrow
    const leftNav = document.createElement('div');
    leftNav.classList.add('article-navigation-previous');
    leftNav.innerHTML = `
      <a href="${previousArticle.path}" aria-label="${previousArticle.title}">
        <span class="icon icon-less-than"></span>
      </a>
    `;
    block.append(leftNav);

    // previous article
    createArticleDetails(block, 'previous', categoryInfo, previousArticle);
  }

  if (nextArticle) {
    // next article
    createArticleDetails(block, 'next', categoryInfo, nextArticle);

    // right arrow
    const rightNav = document.createElement('div');
    rightNav.classList.add('article-navigation-next');
    rightNav.innerHTML = `
      <a href="${nextArticle.path}" aria-label="${nextArticle.title}">
        <span class="icon icon-greater-than"></span>
      </a>
    `;
    block.append(rightNav);
  }

  await decorateIcons(block);
  return true;
}

export default async function decorate(block) {
  const isVisible = await createNavigation(block);
  if (!isVisible) {
    // ensure the extra spacing for the block isn't present if
    // nothing was rendered
    const container = document.querySelector('.article-navigation-container');
    if (!container) {
      return;
    }
    container.classList.add('article-navigation-hidden');
  }
}
