import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  [...block.children].forEach((row) => {
    [...row.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'blade-image';
        const img = div.querySelector('img');
        const { width, height } = img;
        img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
        const optimizedImg = div.querySelector('img');
        optimizedImg.setAttribute('width', 750);
        optimizedImg.setAttribute('height', Math.round((750 / width) * height));
      } else {
        div.className = 'blade-body';
      }
    });
  });
}
