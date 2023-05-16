import {
  buildBlock, decorateIcons,
} from '../../scripts/lib-franklin.js';
import { getCategory } from '../../scripts/scripts.js';

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
    allH2s[0].parentElement.insertBefore(tocDiv, allH2s[0]);
  }
}

/**
 * Adds a footer to the article div.
 * @param {Element} main Element to which footer will be added.
 */
function createArticleFooter(main) {
  if (main.children.length) {
    const article = main.children[main.children.length - 1];

    const footerDiv = document.createElement('div');
    footerDiv.classList.add('article-footer');
    footerDiv.innerText = '[Article Footer (Insurance Ad, Paw Count) placeholder]';
    article.appendChild(footerDiv);
  }
}

/**
 * Loops through an array of paths and fetches metadata.
 * @param paths - Array of paths
 * @returns {Promise<*[]>}
 */
async function getBreadcrumbs(paths) {
  const breadcrumbs = [];
  for (const path of paths) {
    const category = await getCategory(path);
    if (category) {
      breadcrumbs.push({
        color: category.Color,
        url: category.Path,
        path,
      });
    }
  }
  return breadcrumbs;
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
 * Adds all blocks specific to the template to a page.
 * @param {Element} main Element to which template blocks will be added.
 */
// eslint-disable-next-line import/prefer-default-export
export function loadEager(main) {
  createTemplateBlock(main, 'article-author');
  createTemplateBlock(main, 'pet-insurance-quote');
  createTemplateBlock(main, 'social-links');
  createTemplateBlock(main, 'article-footer');
  createTemplateBlock(main, 'paws-up');
  createTemplateBlock(main, 'popular-articles');
  createTemplateBlock(main, 'article-navigation');
  createTableOfContents(main);
  createArticleFooter(main);
}

export async function loadLazy(main) {
  const breadCrumbs = main.querySelector('.article-template-breadcrumb');
  let { pathname } = window.location;
  // remove none category initial paths.
  pathname = pathname.split('/').slice(3);

  const crumbData = await getBreadcrumbs(pathname);
  // Use the last item in the list's color
  const { color } = crumbData[crumbData.length - 1];

  const homeLink = document.createElement('a');
  homeLink.classList.add('home');
  homeLink.href = '/';
  homeLink.innerHTML = '<span class="icon icon-home"></span>';
  breadCrumbs.append(homeLink);

  crumbData.forEach((crumb, i) => {
    if (i > 0) {
      const chevron = document.createElement('span');
      chevron.innerHTML = '<span class="icon icon-chevron"></span>';
      breadCrumbs.append(chevron);
    }
    const linkButton = document.createElement('a');
    linkButton.href = crumb.url;
    linkButton.innerText = convertToTitleCase(crumb.path);
    linkButton.classList.add('category-link-btn');
    if (i === crumbData.length - 1) {
      linkButton.classList.add(`${color}`);
    } else {
      linkButton.classList.add(`${color}-border`, `${color}-color`);
    }

    breadCrumbs.append(linkButton);
  });

  decorateIcons(breadCrumbs);
}
