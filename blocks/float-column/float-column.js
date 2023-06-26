import { decorateResponsiveImages } from '../../scripts/scripts.js';

const isPicture = (block) => !!block.querySelector('picture');

export default function decorate(block) {
  // for each block, decorate image and text according to their positions
  const floatItem = block.querySelectorAll('.float-column > div > div');

  floatItem.forEach((item, index) => {
    const itemIsPicture = isPicture(item);
    if (itemIsPicture) {
      const direction = index % 2 === 0 ? 'left' : 'right';
      item.classList.add(`float-column-image-${direction}`);
      decorateResponsiveImages(item, [600, 900]);
    } else {
      item.classList.add('text');
    }

    if (index % 2 === 1 && itemIsPicture) {
      const parentElement = item.parentNode;
      parentElement.insertBefore(floatItem[index], floatItem[index - 1]);
    }
  });
}