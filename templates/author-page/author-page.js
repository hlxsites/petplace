import {
  buildBlock,
  buildBreadCrumbs,
} from '../../scripts/lib-franklin.js';

function createTemplateBlock(main, blockName, gridName) {
  const gridNameValue = gridName || blockName;
  const section = document.createElement('div');
  section.classList.add('author-template-autoblock', `author-template-grid-${gridNameValue}`);

  const block = buildBlock(blockName, { elems: [] });
  section.append(block);
  main.append(section);
}

// eslint-disable-next-line import/prefer-default-export
export function loadEager(main) {
  main.append(document.createElement('hr'));
  createTemplateBlock(main, 'social-links');
  createTemplateBlock(main, 'popular-articles');
}


export async function loadLazy(main) {
  const heading = main.querySelector('h1');
  const breadCrumbs = main.querySelector('.author-template-breadcrumb');

  buildBreadCrumbs(breadCrumbs, [{
    url: '/authors',
    path: 'Authors',
    color: 'blue-dark',
  }, {
    url: window.location,
    path: heading.innerText,
    color: 'purple',
  }]);
}
