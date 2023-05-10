import {
  buildBlock,
} from '../../scripts/lib-franklin.js';

function createTemplateBlock(main, blockName, gridName) {
  const gridNameValue = gridName || blockName;
  const section = document.createElement('div');
  section.className = `article-template-autoblock article-template-grid-${gridNameValue}`;

  const placeholder = document.createElement('div');
  placeholder.innerText = `${blockName} placeholder`;

  const block = buildBlock(blockName, { elems: [placeholder] });
  section.append(block);
  main.append(section);
}

export function buildTemplateBlock(main) {
  createTemplateBlock(main, 'navigation');
  createTemplateBlock(main, 'article-author');
  createTemplateBlock(main, 'pet-insurance-quote');
  createTemplateBlock(main, 'social-links');
  createTemplateBlock(main, 'pet-insurance-quote', 'pet-insurance-quote-after');
  createTemplateBlock(main, 'paws-up-count');
  createTemplateBlock(main, 'paws-up');
  createTemplateBlock(main, 'social-links', 'social-links-after');
  createTemplateBlock(main, 'popular-articles');
  createTemplateBlock(main, 'article-navigation');
}
