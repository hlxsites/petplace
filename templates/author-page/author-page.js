import {
  buildBlock,
  getMetadata,
  createOptimizedPicture,
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
  const breadcrumbData = await createBreadCrumbs([{
    url: '/authors',
    path: 'Authors',
    color: 'blue-dark',
    label: 'Authors',
  }, {
    url: window.location,
    path: heading.innerText,
    color: 'purple',
    label: heading.innerText,
  }]);
  createTemplateBlock(main, 'breadcrumb', 'breadcrumb', [breadcrumbData]);
  createTemplateBlock(main, 'social-links');
  createTemplateBlock(main, 'popular-articles', undefined, ['<h1 class="author-popular-posts"></h1>']);
}

export async function loadLazy(page) {
  const hero = page.querySelector('.hero > div > div');
  const avatar = getMetadata('avatar');
  const optimizedAvatar = createOptimizedPicture(avatar, getMetadata('title'), true, [
    { width: 200 },
  ]);
  optimizedAvatar.classList.add('author-page-avatar');
  hero.append(optimizedAvatar);
}
