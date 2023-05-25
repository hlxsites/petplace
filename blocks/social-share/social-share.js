import { decorateIcons } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const pageTitle = document.head.querySelector('title').textContent;
  const url = window.location.href;
  block.innerHTML = `
    <ul>
      <li><a href="https://www.facebook.com/sharer/sharer.php?u=${url}"><span class="icon icon-facebook"></span></a></li>
      <li><a href="https://twitter.com/intent/tweet?url=${url}"><span class="icon icon-twitter"></span></a></li>
      <li><a href="https://pinterest.com/pin/create/button/?url=${url}&media=&description=${pageTitle}"><span class="icon icon-pinterest"></span></a></li>
      <li><a href="https://www.instagram.com/petplace/"><span class="icon icon-instagram"></span></a></li>
      <li><a href="mailto:info@petplace.com?&subject=${pageTitle}&body=${url}"><span class="icon icon-email"></span></a></li>
    </ul>`;
  block.querySelectorAll('a').forEach((a) => {
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
  });
  decorateIcons(block);
}
