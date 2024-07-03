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

const monthNames = [
  getPlaceholder('january'),
  getPlaceholder('february'),
  getPlaceholder('march'),
  getPlaceholder('april'),
  getPlaceholder('may'),
  getPlaceholder('june'),
  getPlaceholder('july'),
  getPlaceholder('august'),
  getPlaceholder('september'),
  getPlaceholder('october'),
  getPlaceholder('november'),
  getPlaceholder('december'),
];

// function createAutoBlockSection(main, blockName, gridName) {
//   const gridNameValue = gridName || blockName;
//   const section = document.createElement('div');
//   section.classList.add(gridNameValue);

//   main.append(section);
//   return section;
// }

// function createTemplateBlock(main, blockName, gridName, elems = []) {
//   const section = createAutoBlockSection(main, blockName, gridName);

//   const block = buildBlock(blockName, { elems });
//   section.append(block);
// }

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
  const articleCategories =
    article.category !== '0'
      ? article.category.split(',').map((c) => c.trim().toLowerCase())
      : article.path.split('/').splice(-2, 1);
  return categories.some(
    (c) =>
      articleCategories.includes(c.Category.toLowerCase()) ||
      articleCategories.map((ac) => toClassName(ac)).includes(c.Slug),
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

  const dateAuthorContainer = document.createElement('div');
  dateAuthorContainer.classList.add('date-author-container');

  const date = new Date(article.date * 1000);
  date.setHours(date.getHours() + date.getTimezoneOffset() / 60);
  const formattedDate = document.createElement('span');
  formattedDate.setAttribute('itemprop', 'datePublished');
  formattedDate.setAttribute('content', date.toISOString().substring(0, 10));
  formattedDate.textContent = `${
    monthNames[date.getMonth()]
  } ${date.getDate()}, ${date.getFullYear()}`;

  const authorText = document.createElement('span');
  authorText.setAttribute('itemprop', 'author');
  authorText.textContent = article.author;

  const authorDiv = document.createElement('div');
  const authorIcon = document.createElement('img');
  authorIcon.src = '/icons/pencil.svg';
  authorDiv.append(authorIcon);
  authorDiv.append(authorText);

  const dateDiv = document.createElement('div');
  const dateIcon = document.createElement('img');
  dateIcon.src = '/icons/calendar.svg';
  dateDiv.append(dateIcon);
  dateDiv.append(formattedDate);

  dateAuthorContainer.append(authorDiv);
  dateAuthorContainer.append(dateDiv);

  const detailsContainer = document.createElement('div');
  detailsContainer.classList.add('related-reading-details');
  detailsContainer.append(titleDiv);
  detailsContainer.append(dateAuthorContainer);

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
    if (index === 4) break;
    if (ifArticleBelongsToCategories(article, parentCategories)) {
      if (parentCategoryArticlesMap.has(article['category slug'])) {
        parentCategoryArticlesMap.get(article['category slug']).push(article);
      }
      // console.log('date', new Date(article.date * 1000));
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
      console.log('article', article);
      createArticleDetails(block, article);
    });
  }

  return true;
}

export default async function decorate(block) {
  const extraDiv = block.querySelector('div > div');
  extraDiv.className = 'extra-div';
  extraDiv.remove();

  // const combinedHeader = document.createElement('div');
  // combinedHeader.classList.add('related-reading-header');
  // combinedHeader.innerText = getPlaceholder('previousNextArticle');
  // block.prepend(combinedHeader);
  const isVisible = await createNavigation(block);

  // createTemplateBlock(block, 'tiles');
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
