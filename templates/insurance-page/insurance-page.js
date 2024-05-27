import {
  buildBlock,
  decorateBlock,
  loadBlock,
} from '../../scripts/lib-franklin.js';

async function createTemplateBlock(container, blockName, elems = []) {
  const wrapper = document.createElement('div');
  container.append(wrapper);

  const block = buildBlock(blockName, { elems });
  wrapper.append(block);

  decorateBlock(block);
  await loadBlock(block);
}

export async function loadEager(document) {
  const main = document.querySelector('main');

  // Create side section container
  const sideSection = document.createElement('section');
  sideSection.classList.add('section', 'side-section');

  main.prepend(sideSection);

  // Add side section blocks
  createTemplateBlock(sideSection, 'article-author');
  createTemplateBlock(sideSection, 'social-share');

  // Build side section page links
  createTemplateBlock(sideSection, 'fragment', ['<a href="/fragments/insurance-anchor-links"></a>']);

  // Move subhead to the footer
  const subhead = document.querySelector('.subhead');
  document.querySelector('footer').appendChild(subhead);
}

export async function loadLazy(document) {
  // Adjust structure of article author for styling
  const authorContainer = document.querySelector('.article-author [itemprop="author"]');
  const timePublished = document.querySelector('.article-author [itemprop="datePublished"]');
  authorContainer.appendChild(timePublished);
}
