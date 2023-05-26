import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

function createCard(row) {
  const li = document.createElement('li');
  li.innerHTML = row.innerHTML;
  [...li.children].forEach((div) => {
    if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
    else div.className = 'cards-card-body';
  });
  return li;
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    ul.append(createCard(row));
  });
  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);

  const observer = new MutationObserver((entries) => {
    entries.forEach((entry) => {
      entry.addedNodes.forEach((div) => {
        ul.append(createCard(div));
        div.remove();
      });
    });
  });
  observer.observe(block, { childList: true });
}
