import { getCategory } from '../../scripts/scripts.js';

// eslint-disable-next-line import/prefer-default-export
export async function loadLazy() {
  const heroColorDiv = document.querySelector('.category-index .hero > div');
  const path = window.location.pathname;
  const pathSplit = path.split('/').filter((val) => val !== '');
  const category = pathSplit[pathSplit.length - 1];
  const { Color } = await getCategory(category);
  heroColorDiv.style.setProperty('--bg-color', `var(--color-${Color}-transparent)`);
}
