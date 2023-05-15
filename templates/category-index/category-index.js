import { getCategory, hexToRgb } from '../../scripts/scripts.js';

export async function loadLazy(main) {
  const heroColorDiv = document.querySelector('.category-index .hero > div');
  let { Color } = await getCategory('cat-care');
  Color = hexToRgb(Color);
  heroColorDiv.setAttribute('style', `background: rgb(${Color} / 60%)`);
}
