import { decorateIcons, getMetadata } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const author = getMetadata('author');
  const date = getMetadata('publication-date');
  block.innerHTML = `
    <span class='icon icon-user'></span>
    <p>${author}</p>
    <time datetime="${date}">${date}</time>`;
  decorateIcons(block);
  setTimeout(() => {
    window.requestAnimationFrame(() => {
      block.querySelector('time').textContent = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(Date.now());
    });
  });
}
