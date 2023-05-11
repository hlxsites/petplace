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
 * Adds all blocks specific to the template to a page.
 * @param {Element} main Element to which template blocks will be added.
 */
// eslint-disable-next-line import/prefer-default-export
export function buildTemplateBlock(main) {
  createTemplateBlock(main, 'breadcrumb');
  createTemplateBlock(main, 'article-author');
  createTemplateBlock(main, 'pet-insurance-quote');
  createTemplateBlock(main, 'social-links');
  createTemplateBlock(main, 'table-of-contents');
  createTemplateBlock(main, 'article-footer');
  createTemplateBlock(main, 'pet-insurance-quote', 'pet-insurance-quote-after');
  createTemplateBlock(main, 'paws-up');
  createTemplateBlock(main, 'social-links', 'social-links-after');
  createTemplateBlock(main, 'popular-articles');
  createTemplateBlock(main, 'article-navigation');
}
