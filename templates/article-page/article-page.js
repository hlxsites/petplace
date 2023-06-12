import {
  buildBlock,
  decorateBlock,
  loadBlock,
  getMetadata, toClassName,
} from '../../scripts/lib-franklin.js';
import {
  createBreadCrumbs, getCategoryByKey,
} from '../../scripts/scripts.js';

function createTemplateBlock(main, blockName, gridName) {
  const gridNameValue = gridName || blockName;
  const section = document.createElement('div');
  section.classList.add('article-template-autoblock', `article-template-grid-${gridNameValue}`);

  const block = buildBlock(blockName, { elems: [] });
  section.append(block);
  main.append(section);
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
  const allH2s = main ? main.getElementsByTagName('h2') : [];
  const tocHeader = document.createElement('h2');
  const tocList = document.createElement('ol');
  tocHeader.innerText = 'Table of Contents';
  tocDiv.appendChild(tocHeader);
  if (allH2s.length > 1) {
    for (let index = 0; index < allH2s.length; index += 1) {
      const tagname = 'h'.concat(index);
      allH2s[index].id = tagname;
      const tocListItem = document.createElement('li');
      const tocEntry = document.createElement('a');
      tocEntry.setAttribute('href', '#'.concat(tagname));
      tocEntry.innerText = allH2s[index].innerText;
      tocListItem.appendChild(tocEntry);
      tocList.appendChild(tocListItem);
    }
    tocDiv.appendChild(tocList);
    main.querySelector('h1').after(tocDiv);
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
  createTemplateBlock(main, 'article-author');
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
  breadCrumbs.append(breadcrumb);
  decorateBlock(breadcrumb);
  return loadBlock(breadcrumb);
}
