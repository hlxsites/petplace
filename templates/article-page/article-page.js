import {
  buildBlock,
} from '../../scripts/lib-franklin.js';

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
 * Adds all blocks specific to the template to a page.
 * @param {Element} main Element to which template blocks will be added.
 */
// eslint-disable-next-line import/prefer-default-export
export function buildTemplateBlock(main) {
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
