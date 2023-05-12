import { decorateIcons } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const pageTitle = document.head.querySelector('title').textContent;
  const url = window.location.href;
  block.innerHTML = `
    <ul>
      <li><a href="https://www.facebook.com/petplacefans"><span class="icon icon-facebook"></span></a></li>
      <li><a href="https://twitter.com/PetPlaceFans"><span class="icon icon-twitter"></span></a></li>
      <li><a href="https://www.pinterest.com/petplacefans/"><span class="icon icon-pinterest"></span></a></li>
      <li><a href="https://www.instagram.com/petplace/"><span class="icon icon-instagram"></span></a></li>
      <li><a href="mailto:info@petplace.com?&subject=${pageTitle}&body=${url}"><span class="icon icon-email"></span></a></li>
    </ul>`;
  decorateIcons(block);
}
