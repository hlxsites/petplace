import { decorateIcons, fetchPlaceholders } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const placeholders = await fetchPlaceholders();
  const pageTitle = document.head.querySelector('title').textContent;
  const url = window.location.href;
  // TODO: insta link only leads to petplace insta
  block.innerHTML = `
    <ul>
      <li><a href="https://www.facebook.com/sharer/sharer.php?u=${url}" aria-label="${placeholders.socialShareLabel.replace('{{page}}', 'Facebook')}"><span class="icon icon-facebook"></span></a></li>
      <li><a href="https://www.twitter.com/intent/tweet?url=${url}" aria-label="${placeholders.socialShareLabel.replace('{{page}}', 'Twitter')}"><span class="icon icon-twitter"></span></a></li>
      <li><a href="https://www.pinterest.com/pin/create/button/?url=${url}&media=&description=${pageTitle}" aria-label="${placeholders.socialShareLabel.replace('{{page}}', 'Pinterest')}"><span class="icon icon-pinterest"></span></a></li>
      <li><a href="https://www.instagram.com/petplace/" aria-label="${placeholders.socialLinkLabel.replace('{{page}}', 'Instagram')}"><span class="icon icon-instagram"></span></a></li>
      <li><a href="mailto:info@petplace.com?&subject=${pageTitle}&body=${url}" aria-label="${placeholders.emailLinkLabel}"><span class="icon icon-email"></span></a></li>
    </ul>
  `;
  block.querySelectorAll('a').forEach((a) => {
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
  });
  decorateIcons(block);
}
