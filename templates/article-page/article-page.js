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
import { adsDefineSlot, adsDivCreator } from '../../scripts/adsense.js';
import { pushToDataLayer } from '../../scripts/utils/helpers.js';

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

    if (categoryData['Parent Path'] !== `${window.hlx.contentBasePath}/article/category/` && categoryData['Parent Path']) {
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
export async function loadEager(document) {
  const main = document.querySelector('main');
  createTemplateBlock(main, 'article-author');
  createAutoBlockSection(main, 'ad', 'ad');
  createTemplateBlock(main, 'social-share');
  createTemplateBlock(main, 'popular-articles');
  createTemplateBlock(main, 'article-navigation');
  createTableOfContents(main);

  const categorySlug = toClassName(getMetadata('category').split(',')[0]?.trim());
  const ad = main.querySelector('.article-template-grid-ad');
  const adId = document.createElement('div');
  adId.innerText = await getCategoryAd(categorySlug);
  const adBlock = buildBlock('ad', { elems: [adId] });
  ad.append(adBlock);

  main.setAttribute('itemscope', '');
  const articleType = toClassName(getMetadata('type'));
  if (articleType === 'faq') {
    main.setAttribute('itemtype', 'https://schema.org/FAQPage');
    [...main.querySelectorAll(':scope > div > :is(h1,h2,h3)')]
      .filter((h) => h.textContent.endsWith('?') || h.textContent.match(/#\d+/))
      .forEach((h) => {
        if (h.nodeName === 'H1') {
          const meta = document.createElement('meta');
          meta.setAttribute('itemprop', 'name');
          meta.setAttribute('content', h.textContent);
          h.after(meta);
        } else {
          h.setAttribute('itemprop', 'name');
        }
        const question = document.createElement('div');
        question.setAttribute('itemscope', '');
        question.setAttribute('itemprop', 'mainEntity');
        question.setAttribute('itemtype', 'https://schema.org/Question');
        if (h.nodeName === 'H1') {
          h.after(question);
          question.append(question.nextElementSibling);
        } else {
          h.replaceWith(question);
          question.append(h);
        }
        const answer = document.createElement('div');
        answer.setAttribute('itemscope', '');
        answer.setAttribute('itemprop', 'acceptedAnswer');
        answer.setAttribute('itemtype', 'https://schema.org/Answer');
        question.append(answer);
        const div = document.createElement('div');
        div.setAttribute('itemprop', 'text');
        answer.append(div);
        while (question.nextElementSibling && question.nextElementSibling.tagName !== h.nodeName) {
          div.append(question.nextElementSibling);
        }
      });
  } else {
    main.setAttribute('itemtype', 'https://schema.org/BlogPosting');
  }
}

export async function loadLazy(document) {
  const main = document.querySelector('main');
  const hero = main.querySelector('.hero');
  hero.querySelector('h1').setAttribute('itemprop', 'headline');
  const meta = document.createElement('meta');
  meta.setAttribute('itemprop', 'description');
  meta.setAttribute('content', document.head.querySelector('meta[name="description"]').content);
  hero.append(meta);
  hero.querySelector('img').setAttribute('itemprop', 'image');
  const articleType = toClassName(getMetadata('type'));
  if (articleType !== 'faq') {
    main.querySelector('.section:nth-of-type(2)').setAttribute('itemprop', 'articleBody');
  }

  const breadCrumbs = hero.querySelector(':scope > div > div');
  const categorySlugs = getMetadata('category').split(',').map((slug) => toClassName(slug.trim()));
  const crumbData = await getBreadcrumbs(categorySlugs[0]);

  const breadcrumbContainer = await createBreadCrumbs(crumbData);
  const breadcrumb = buildBlock('breadcrumb', { elems: [breadcrumbContainer] });
  breadcrumb.style.visibility = 'hidden';
  breadCrumbs.append(breadcrumb);
  decorateBlock(breadcrumb);
  await loadBlock(breadcrumb);
  breadcrumb.style.visibility = '';

  adsDivCreator('article_top');
  adsDivCreator('article_middle');
  adsDivCreator('article_bottom');
}

// (side later with refactor)
export async function loadDelayed() {
  const articleCat = toClassName(getMetadata('category').split(',')[0]?.trim());
  await pushToDataLayer({
    event: 'adsense',
    type: 'article',
    category: articleCat,
  });

  adsDefineSlot(
    [
      'article_top',
      'article_middle',
      'article_bottom',
      'article_anchor',
    ],
    articleCat,
  );
}
