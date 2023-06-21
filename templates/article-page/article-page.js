import {
  buildBlock,
  decorateBlock,
  loadBlock,
  getMetadata,
  toClassName,
} from '../../scripts/lib-franklin.js';
import {
  createBreadCrumbs,
  getCategoryByKey,
  getCategoryAd,
} from '../../scripts/scripts.js';

function createAutoBlockSection(main, blockName, gridName) {
  const gridNameValue = gridName || blockName;
  const section = document.createElement('div');
  section.classList.add('article-template-autoblock', `article-template-grid-${gridNameValue}`);

  main.append(section);
  return section;
}

function createTemplateBlock(main, blockName, gridName, elems = []) {
  const section = createAutoBlockSection(main, blockName, gridName);

  const block = buildBlock(blockName, { elems });
  section.append(block);
}

/**
 * Creates the table of contents for an article.
 * @param {Element} main Element to which table of contents will be added.
 */
function createTableOfContents(main) {
  const hasToc = getMetadata('has-toc');
  if (!hasToc) {
    return;
  }
  const tocDiv = document.createElement('div');
  tocDiv.classList.add('toc');
  main.querySelector('h1').after(tocDiv);
}

/**
 * Convert snake case to title case
 * @param str
 * @returns {*}
 */
function convertToTitleCase(str) {
  const words = str.split('-');
  const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  return capitalizedWords.join(' ');
}

/**
 * Fetches page category.  If parent path exists, recursively fetches parent data and so on.
 * @returns {Promise<*[]>}
 * @param categorySlug snake case value of category
 */
async function getBreadcrumbs(categorySlug) {
  const breadcrumbs = [];

  async function fetchSegmentData(slug) {
    const categoryData = await getCategoryByKey('Slug', slug);
    breadcrumbs.push({
      color: categoryData.Color,
      url: categoryData.Path,
      label: convertToTitleCase(categoryData.Slug),
    });

    if (categoryData['Parent Path'] !== '/article/category/') {
      const { Slug } = await getCategoryByKey('Path', categoryData['Parent Path']);
      await fetchSegmentData(Slug);
    }
  }

  await fetchSegmentData(categorySlug);

  return breadcrumbs.reverse();
}

/**
 * Adds all blocks specific to the template to a page.
 * @param {Element} main Element to which template blocks will be added.
 */
// eslint-disable-next-line import/prefer-default-export
export function loadEager(main) {
  const ad = document.createElement('div');
  createTemplateBlock(main, 'article-author');
  createAutoBlockSection(main, 'ad', 'ad');
  createTemplateBlock(main, 'social-share');
  createTemplateBlock(main, 'popular-articles');
  createTemplateBlock(main, 'article-navigation');
  createTableOfContents(main);
}

export async function loadLazy(main) {
  const breadCrumbs = main.querySelector('.hero > div > div');
  const categorySlug = toClassName(getMetadata('category'));
  const crumbData = await getBreadcrumbs(categorySlug);

  const breadcrumbContainer = await createBreadCrumbs(crumbData);
  const breadcrumb = buildBlock('breadcrumb', { elems: [breadcrumbContainer] });
  breadCrumbs.style.visibility = 'hidden';
  breadCrumbs.append(breadcrumb);
  decorateBlock(breadcrumb);
  await loadBlock(breadcrumb);
  breadCrumbs.style.visibility = '';

  const ad = main.querySelector('.article-template-grid-ad');
  const adId = document.createElement('div');
  adId.innerText = await getCategoryAd(categorySlug);
  const adBlock = buildBlock('ad', { elems: [adId] });
  ad.append(adBlock);
  decorateBlock(adBlock);
  loadBlock(adBlock);
}
