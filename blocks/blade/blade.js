import { createOptimizedPicture, loadBlock, decorateBlock } from '../../scripts/lib-franklin.js';

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
  [...block.querySelectorAll('a[href]')]
    .filter((a) => {
      try {
        return new URL(a.href).pathname === new URL(a.textContent).pathname
      } catch (e) {
        return false;
      }
    })
    .forEach(async (a) => {
      const parent = a.parentElement;
      a.remove();
      const url = `${window.location.protocol}//${window.location.host}${new URL(a.href).pathname}`;
      const res = await fetch(url);
      if (!res.ok) {
        return;
      }
      const text = await res.text();
      const div = document.createElement('div');
      div.innerHTML = text;
      const main = div.querySelector('main');
      if (!main || !main.children.length) {
        return;
      }
      const blockParent = main.children.item(0);
      if (!blockParent.children.length) {
        return;
      }
      const block = blockParent.children.item(0);
      if (!block.classList.length || !block.children.length || !block.children.item(0).children.length) {
        return;
      }
      parent.append(block);
      decorateBlock(block);
      loadBlock(block);
    });
}
