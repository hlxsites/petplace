import ffetch from '../../scripts/ffetch.js';
import {
  decorateIcons,
  getMetadata,
  createOptimizedPicture,
  toClassName,
} from '../../scripts/lib-franklin.js';
import {
  getCategories,
  getCategory,
  getPlaceholder,
  isMobile,
} from '../../scripts/scripts.js';

export async function getCategoriesPath(path) {
  const categories = await getCategories();
  return categories.filter((c) => c.Path === path || c['Parent Path'].startsWith(path));
}

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
    <a href="${article.path}">
      <span class="article-navigation-${key}-title-text">${article.title}</span>
    </a>
  `;

  const sectionContainer = document.createElement('div');
  sectionContainer.classList.add('article-navigation-details', `article-navigation-${key}-details`);
  sectionContainer.append(category);
  sectionContainer.append(title);

  block.append(thumbnail);
  block.append(sectionContainer);
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
  return categories.some((c) => articleCategories.includes(c.Category.toLowerCase())
      || articleCategories.map((ac) => toClassName(ac)).includes(c.Slug));
}

async function createNavigation(block) {
  let category = getMetadata('category').split(',')[0]?.trim();
  if (!category) {
    // fall back on URL of a category hasn't been defined in the page's metadata
    category = await getCategory(window.location.pathname.split('/').slice(-2).shift());
  }
  if (!category) {
    return false;
  }

  // get full category info so we have the path of the category
  const categoryInfo = await getCategory(category);
  if (!categoryInfo) {
    return false;
  }

  const parentCategories = await getAllParentCategories(categoryInfo);
  const categories = [categoryInfo, ...parentCategories];

  // Get all articles in that category
  const articles = ffetch(`${window.hlx.contentBasePath}/article/query-index.json`)
    .sheet('article')
    .chunks(isMobile() ? 500 : 2000)
    .filter((article) => ifArticleBelongsToCategories(article, categories));

  let previousArticle = null;
  let nextArticle = null;
  let firstCurrentCategoryArticle = null;
  let lastCurrentCategoryArticle = null;
  let found = false;
  const parentCategoryArticlesMap = new Map();
  parentCategories.forEach((c) => parentCategoryArticlesMap.set(c.Slug, []));
  // eslint-disable-next-line no-restricted-syntax
  for await (const article of articles) {
    if (ifArticleBelongsToCategories(article, parentCategories)) {
      if (parentCategoryArticlesMap.has(article['category slug'])) {
        parentCategoryArticlesMap.get(article['category slug']).push(article);
      }
    } else {
      if (!firstCurrentCategoryArticle) {
        firstCurrentCategoryArticle = article;
      }
      lastCurrentCategoryArticle = article;
      if (!found) {
        if (article.path === window.location.pathname) {
          found = true;
        } else {
          previousArticle = article;
        }
      } else {
        if (!nextArticle) {
          nextArticle = article;
        }
        if (previousArticle) {
          break;
        }
      }
    }
  }

  let previousArticleCategory = null;
  if (!previousArticle) {
    previousArticle = lastCurrentCategoryArticle;
    // if there is only one or two articles in current category, use parent category's last article
    if (!nextArticle || nextArticle === lastCurrentCategoryArticle) {
      const parentCategory = parentCategories.find((c) => {
        const parentCategoryArticles = parentCategoryArticlesMap.get(c.Slug);
        return parentCategoryArticles.length;
      });
      if (parentCategory) {
        const parentCategoryArticles = parentCategoryArticlesMap.get(parentCategory.Slug);
        previousArticle = parentCategoryArticles[parentCategoryArticles.length - 1];
        previousArticleCategory = parentCategory;
      }
    }
  }
  let nextArticleCategory = null;
  if (!nextArticle) {
    nextArticle = firstCurrentCategoryArticle;
    // if there is only one or two articles in current category, use parent category's first article
    if (previousArticle === firstCurrentCategoryArticle) {
      const parentCategory = parentCategories.find((c) => {
        const parentCategoryArticles = parentCategoryArticlesMap.get(c.Slug);
        return parentCategoryArticles.length;
      });
      if (parentCategory) {
        const parentCategoryArticles = parentCategoryArticlesMap.get(parentCategory.Slug);
        [nextArticle] = parentCategoryArticles;
        nextArticleCategory = parentCategory;
      }
    }
  }

  if (previousArticle || nextArticle) {
    // combined previous/next label for mobile view
    const combinedHeader = document.createElement('div');
    combinedHeader.classList.add('article-navigation-combined-header');
    combinedHeader.innerText = getPlaceholder('previousNextArticle');
    block.append(combinedHeader);
  }

  if (previousArticle) {
    // previous-only label for non-mobile
    const previousHeader = document.createElement('div');
    previousHeader.classList.add('article-navigation-previous-header');
    previousHeader.innerText = getPlaceholder('previousArticle');
    block.append(previousHeader);
  }

  if (nextArticle) {
    // next-only label for non-mobile
    const nextHeader = document.createElement('div');
    nextHeader.classList.add('article-navigation-next-header');
    nextHeader.innerText = getPlaceholder('nextArticle');
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
    createArticleDetails(block, 'previous', previousArticleCategory || categoryInfo, previousArticle);
  }

  if (nextArticle) {
    // next article
    createArticleDetails(block, 'next', nextArticleCategory || categoryInfo, nextArticle);

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
