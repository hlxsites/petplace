import {
  buildBlock,
  decorateBlock,
  loadBlock,
  getMetadata,
} from '../../scripts/lib-franklin.js';
import {
  getCategory,
  createBreadCrumbs,
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
 * Loops through an array of paths and fetches metadata.
 * @param paths - Array of paths
 * @returns {Promise<*[]>}
 */
async function getBreadcrumbs(paths) {
  const breadcrumbs = [];
  await Promise.all(paths.map(async (path) => {
    const category = await getCategory(path);
    if (category) {
      breadcrumbs.push({
        color: category.Color,
        url: category.Path,
        path: convertToTitleCase(path),
      });
    }
  }));
  return breadcrumbs;
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
  let { pathname } = window.location;
  // remove none category initial paths.
  pathname = pathname.split('/').slice(3);

  const crumbData = await getBreadcrumbs(pathname);

  const breadcrumbContainer = await createBreadCrumbs(crumbData);
  const breadcrumb = buildBlock('breadcrumb', { elems: [breadcrumbContainer] });
  breadCrumbs.append(breadcrumb);
  decorateBlock(breadcrumb);
  return loadBlock(breadcrumb);
}
