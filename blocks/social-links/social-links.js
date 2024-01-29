import { decorateIcons } from '../../scripts/lib-franklin.js';
import { getPlaceholder } from '../../scripts/scripts.js';

export default function decorate(block) {
  const pageTitle = document.head.querySelector('title').textContent;
  const url = window.location.href;
  block.innerHTML = `
    <ul>
      <li><a href="https://www.facebook.com/petplacefans" aria-label="${getPlaceholder('socialLinkLabel', { page: 'Facebook' })}"><span class="icon icon-facebook"></span></a></li>
      <li><a href="https://www.twitter.com/PetPlaceFans" aria-label="${getPlaceholder('socialLinkLabel', { page: 'Twitter' })}"><span class="icon icon-twitter"></span></a></li>
      <li><a href="https://www.pinterest.com/petplacefans/" aria-label="${getPlaceholder('socialLinkLabel', { page: 'Pinterest' })}"><span class="icon icon-pinterest"></span></a></li>
      <li><a href="https://www.instagram.com/petplace/" aria-label="${getPlaceholder('socialLinkLabel', { page: 'Instagram' })}"><span class="icon icon-instagram"></span></a></li>
      <li><a href="mailto:info@petplace.com?&subject=${pageTitle}&body=${url}" aria-label="${getPlaceholder('emailLinkLabel')}"><span class="icon icon-email"></span></a></li>
    </ul>`;
  block.querySelectorAll('a').forEach((a) => {
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
  });
  decorateIcons(block);
}
