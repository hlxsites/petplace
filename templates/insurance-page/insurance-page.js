import {
  buildBlock,
  decorateBlock,
  loadBlock,
} from '../../scripts/lib-franklin.js';
import { createBreadCrumbs } from '../../scripts/scripts.js';

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
  const divAuthorShare = document.createElement('div');
  divAuthorShare.classList.add('side-section');

  main.prepend(divAuthorShare);

  // Add side section blocks
  const wrapperDiv = document.createElement('div');
  wrapperDiv.classList.add('side-section');
  createTemplateBlock(wrapperDiv, 'article-author');
  createTemplateBlock(wrapperDiv, 'social-share', ['<div>facebook</div>', '<div>instagram</div>', '<div>tiktok</div>']);
  divAuthorShare.append(wrapperDiv);

  // Build side section page links
  // createTemplateBlock(divAuthorShare, 'fragment', ['<a href="/fragments/insurance-anchor-links"></a>']);

  // Move subhead to the footer
  const subhead = document.querySelector('.subhead');
  document.querySelector('footer').appendChild(subhead);
}

export async function loadLazy(document) {
  // Create breadcrumbs
  const main = document.querySelector('main');
  const body = main.parentNode;
  const breadcrumbContainer = document.createElement('div');
  body.insertBefore(breadcrumbContainer, main);

  const heading = main.querySelector('h1');
  const breadcrumbData = await createBreadCrumbs([{
    url: `${window.hlx.contentBasePath}/pet-insurance`,
    path: 'Pet Insurance',
    color: 'black',
    label: 'Pet Insurance',
  }, {
    url: window.location,
    path: heading.innerText,
    color: 'black',
    label: heading.innerText,
  }], { chevronAll: true, chevronIcon: 'chevron-large', useHomeLabel: true });
  createTemplateBlock(breadcrumbContainer, 'breadcrumb', [breadcrumbData]);

  // Adjust structure of article author for styling
  const authorContainer = document.querySelector('.article-author [itemprop="author"]');
  const timePublished = document.querySelector('.article-author [itemprop="datePublished"]');
  authorContainer.appendChild(timePublished);
}
