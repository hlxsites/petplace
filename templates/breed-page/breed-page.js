import { adsenseFunc } from '../../scripts/adsense.js';
import { getMetadata, decorateIcons } from '../../scripts/lib-franklin.js';

// eslint-disable-next-line import/prefer-default-export
export async function loadEager(document) {
  const main = document.querySelector('main');
  const author = getMetadata('author');
  const h1 = main.querySelector('h1');

  const icon = document.createElement('span');
  icon.classList.add('icon', 'icon-user');

  const p = document.createElement('p');
  p.classList.add('author-wrapper');

  p.innerText = author;
  p.prepend(icon);
  await decorateIcons(p);
  h1.insertAdjacentElement('afterend', p);
}

export function loadLazy() {
  adsenseFunc('breeds', 'create');
}

export function loadDelayed() {
  adsenseFunc('breeds');
}
