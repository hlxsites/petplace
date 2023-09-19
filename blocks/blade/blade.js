import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

const IMAGE_WIDTH = 450;
export default function decorate(block) {
  [...block.children].forEach((row) => {
    [...row.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'blade-image';
        const img = div.querySelector('img');
        const { width, height } = img;
        img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: IMAGE_WIDTH }]));
        const optimizedImg = div.querySelector('img');
        optimizedImg.setAttribute('width', IMAGE_WIDTH);
        optimizedImg.setAttribute('height', Math.round((IMAGE_WIDTH / width) * height));
      } else if (row.children.length > 1) { // support blades with only one cell of content
        div.className = 'blade-body';
      }
    });
  });
}
