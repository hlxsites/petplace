import {
  buildBlock,
  getMetadata,
  createOptimizedPicture,
} from '../../scripts/lib-franklin.js';

function createTemplateBlock(main, blockName, elems = []) {
  const section = document.createElement('div');

  const block = buildBlock(blockName, { elems });
  section.append(block);
  main.append(section);
}

export function loadEager(main) {
  const avatarUrl = getMetadata('avatar');
  const authorName = getMetadata('author-name');
  const p = document.createElement('p');
  p.innerText = authorName;
  const avatar = createOptimizedPicture(avatarUrl, authorName, false);
  createTemplateBlock(main, 'author-info', [avatar, p]);
  createTemplateBlock(main, 'social-share');
  createTemplateBlock(main, 'popular-tags');
}
