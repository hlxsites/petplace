import { decorateIcons } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const pageTitle = document.head.querySelector('title').textContent;
  const url = window.location.href;
  block.innerHTML = `
    <ul>
      <li><a href="https://www.facebook.com/petplacefans" aria-label="Go to our Facebook page"><span class="icon icon-facebook"></span></a></li>
      <li><a href="https://twitter.com/PetPlaceFans" aria-label="Go to our Twitter page"><span class="icon icon-twitter"></span></a></li>
      <li><a href="https://www.pinterest.com/petplacefans/" aria-label="Go to our Pinterest page"><span class="icon icon-pinterest"></span></a></li>
      <li><a href="https://www.instagram.com/petplace/" aria-label="Go to our Instagram page"><span class="icon icon-instagram"></span></a></li>
      <li><a href="mailto:info@petplace.com?&subject=${pageTitle}&body=${url}" aria-label="Send us an email about this page"><span class="icon icon-email"></span></a></li>
    </ul>`;
  block.querySelectorAll('a').forEach((a) => {
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
  });
  decorateIcons(block);
}
