import {
  getMetadata,
  decorateIcons, createOptimizedPicture,
} from '../../scripts/lib-franklin.js';

// eslint-disable-next-line import/prefer-default-export
export async function loadEager(main) {
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

export function loadLazy(main) {
  const catFooter = document.createElement('div');
  catFooter.classList.add('cat-footer');

  const picture = createOptimizedPicture('/images/cat_footer.png');

  catFooter.append(picture);
  document.querySelector('main').append(catFooter);
}
