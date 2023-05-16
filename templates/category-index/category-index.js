import { getCategory, hexToRgb } from '../../scripts/scripts.js';

export async function loadLazy(main) {
  const heroColorDiv = document.querySelector('.category-index .hero > div');
  const path = window.location.pathname;
  const pathSplit = path.split('/').filter((val) => val !== '');
  const category = pathSplit[pathSplit.length - 1];
  const { Color } = await getCategory(category);
  heroColorDiv.classList.add(`${Color}-transparent`);
}
