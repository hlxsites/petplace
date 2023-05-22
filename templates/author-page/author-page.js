import {
  buildBlock,
} from '../../scripts/lib-franklin.js';
import { createBreadCrumbs } from '../../scripts/scripts.js';

function createTemplateBlock(main, blockName, gridName, elems = []) {
  const gridNameValue = gridName || blockName;
  const section = document.createElement('div');
  section.classList.add('author-template-autoblock', `author-template-grid-${gridNameValue}`);

  const block = buildBlock(blockName, { elems });
  section.append(block);
  main.append(section);
}

// eslint-disable-next-line import/prefer-default-export
export async function loadEager(main) {
  const heading = main.querySelector('h1');
  main.append(document.createElement('hr'));
  const breadcrumbData = await createBreadCrumbs([{
    url: '/authors',
    path: 'Authors',
    color: 'blue-dark',
  }, {
    url: window.location,
    path: heading.innerText,
    color: 'purple',
  }]);
  createTemplateBlock(main, 'breadcrumb', 'breadcrumb', [breadcrumbData]);
  createTemplateBlock(main, 'social-links');
  createTemplateBlock(main, 'popular-articles');
}
