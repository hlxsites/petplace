import {
  buildBlock,
  decorateBlock,
  loadBlock,
  getMetadata,
  toClassName,
} from '../../scripts/lib-franklin.js';
import {
  createBreadCrumbs,
  getCategories,
  getCategory,
} from '../../scripts/scripts.js';

export async function getCategoryByKey(key, value) {
  const categories = await getCategories();
  return categories.find((c) => c[key].toLowerCase() === value.toLowerCase());
}

async function getRawCategoryAd(category) {
  if (!category) {
    return null;
  }
  if (category.Ad) {
    return category.Ad;
  }
  if (!category['Parent Path']) {
    return null;
  }
  const parent = await getCategoryByKey('Path', category['Parent Path']);
  return getRawCategoryAd(parent);
}

/**
 * Retrieves the ID of the ad to show for a category. This will be determined
 * by the "Ad" column in the categories spreadsheet. The method will check
 * the ad column for the given category, and for all of that category's parents.
 *
 * If no ad is specified, the method will return a default ad.
 * @param {string} categorySlug Slug of the category whose ad should be
 *  retrieved.
 * @returns {Promise<string>} ID of an ad from the ads spreadsheet.
 */
export async function getCategoryAd(categorySlug) {
  const category = await getCategory(categorySlug);
  const categoryAd = await getRawCategoryAd(category);
  return categoryAd || 'article-default-rail';
}

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

  // if there is a disclosure, add the toc after it, otherwise add it after the h1
  const title = main.querySelector('h1');
  const disclosure = main.querySelector('.disclosure');
  if (title.nextElementSibling === disclosure) {
    disclosure.after(tocDiv);
  } else {
    title.after(tocDiv);
  }
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

    if (categoryData['Parent Path'] !== '/article/category/' && categoryData['Parent Path']) {
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
export async function loadEager(main) {
  createTemplateBlock(main, 'article-author');
  createAutoBlockSection(main, 'ad', 'ad');
  createTemplateBlock(main, 'social-share');
  createTemplateBlock(main, 'popular-articles');
  createTemplateBlock(main, 'article-navigation');
  createTableOfContents(main);

  const categorySlug = toClassName(getMetadata('category'));
  const ad = main.querySelector('.article-template-grid-ad');
  const adId = document.createElement('div');
  adId.innerText = await getCategoryAd(categorySlug);
  const adBlock = buildBlock('ad', { elems: [adId] });
  ad.append(adBlock);
}

export async function loadLazy(main) {
  const breadCrumbs = main.querySelector('.hero > div > div');
  const categorySlugs = getMetadata('category').split(',').map((slug) => toClassName(slug.trim()));
  const crumbData = await getBreadcrumbs(categorySlugs[0]);

  const breadcrumbContainer = await createBreadCrumbs(crumbData);
  const breadcrumb = buildBlock('breadcrumb', { elems: [breadcrumbContainer] });
  breadCrumbs.style.visibility = 'hidden';
  breadCrumbs.append(breadcrumb);
  decorateBlock(breadcrumb);
  await loadBlock(breadcrumb);
  breadCrumbs.style.visibility = '';
}
