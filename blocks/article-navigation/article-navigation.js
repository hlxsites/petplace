import {
  decorateIcons,
  getMetadata,
  createOptimizedPicture,
} from '../../scripts/lib-franklin.js';
import {
  getCategoryByName,
} from '../../scripts/scripts.js';

let articles;
function createArticleDetails(block, key, categoryInfo, article) {
  // the article's thumbnail, which will link to the article's page
  const thumbnail = document.createElement('div');
  thumbnail.classList.add('article-navigation-thumbnail', `article-navigation-${key}-thumbnail`);
  const a = document.createElement('a');
  a.href = article.path;
  a.append(createOptimizedPicture(article.image, article.title, false, [
    { media: '(min-width: 1024px)', width: 250 },
    { width: 180 }
  ]));
  thumbnail.append(a);

  // category name of the article, which will link to that category's page
  const { category: categoryName } = article;
  const categoryHref = categoryInfo ? categoryInfo.Path : '#';
  const category = document.createElement('div');
  category.classList.add('article-navigation-category');
  category.innerHTML = `<a href="${categoryHref}">${categoryName}</a>`;

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

export default async function decorate(block) {
  const category = getMetadata('category');
  if (!category) {
    return;
  }

  // get full category info so we have the path of the category
  const categoryInfo = await getCategoryByName(category);
  if (!categoryInfo) {
    return;
  }

  // get the current page's category
  const url = new URL(window.location.href);
  if (!articles) {
    const res = await fetch('/article/query-index.json?sheet=article');
    const queryData = await res.json();
    articles = queryData?.data;
  }

  // find articles in the same category, sorting by creation date ascending
  const similarArticles = articles
    .filter((article) => article.category === category)
    .sort((a, b) => {
      const date1 = parseInt(a.date, 10);
      const date2 = parseInt(b.date, 10);
      if (date1 === date2) {
        // fall back on name if dates are the same
        return a.title < b.title ? -1 : 1;
      }
      return date1 < date2 ? -1 : 1
    });

  // need at least 3 articles: current article, previous, and next
  if (similarArticles.length < 2) {
    return;
  }

  const currentIndex = similarArticles.findIndex((article) => article.path === url.pathname);
  if (currentIndex < 0) {
    // current article not found
    return;
  }

  // get the previous/next articles, wrapping around the list if needed
  const prevIndex = currentIndex === 0 ? similarArticles.length - 1 : currentIndex - 1;
  const nextIndex = currentIndex === similarArticles.length - 1 ? 0 : currentIndex + 1;

  // combined previous/next label for mobile view
  const combinedHeader = document.createElement('div');
  combinedHeader.classList.add('article-navigation-combined-header');
  combinedHeader.innerText = 'Previous / Next Article';
  block.append(combinedHeader);

  // previous-only label for non-mobile
  const previousHeader = document.createElement('div');
  previousHeader.classList.add('article-navigation-previous-header');
  previousHeader.innerText = 'Previous Article';
  block.append(previousHeader);

  // next-only label for non-mobile
  const nextHeader = document.createElement('div');
  nextHeader.classList.add('article-navigation-next-header');
  nextHeader.innerText = 'Next Article';
  block.append(nextHeader);

  const nextArticle = similarArticles[nextIndex];
  const previousArticle = similarArticles[prevIndex];

  // left arrow
  const leftNav = document.createElement('div');
  leftNav.classList.add('article-navigation-previous');
  leftNav.innerHTML = `
    <a href="${previousArticle.path}">
      <span class="icon icon-less-than"></span>
    </a>
  `;
  block.append(leftNav);

  // previous article
  createArticleDetails(block, 'previous', categoryInfo, previousArticle);
  // next article
  createArticleDetails(block, 'next', categoryInfo, nextArticle);

  // right arrow
  const rightNav = document.createElement('div');
  rightNav.classList.add('article-navigation-next');
  rightNav.innerHTML = `
    <a href="${nextArticle.path}">
      <span class="icon icon-greater-than"></span>
    </a>
  `;
  block.append(rightNav);

  return decorateIcons(block);
}
