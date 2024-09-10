import { decorateIcons } from '../../scripts/lib-franklin.js';
import { getPlaceholder } from '../../scripts/scripts.js';

const socialObj = {
  facebook: (url) => `<a href="https://www.facebook.com/sharer/sharer.php?u=${url}" aria-label="${getPlaceholder('socialShareLabel', { page: 'Facebook' })}"><span class="icon icon-facebook"></span></a>`,
  // twitter: (url) => `<a href="https://www.twitter.com/intent/tweet?url=${url}" aria-label="${getPlaceholder('socialShareLabel', { page: 'Twitter' })}"><span class="icon icon-twitter"></span></a>`,
  pinterest: (url, pageTitle) => `<a href="https://www.pinterest.com/pin/create/button/?url=${url}&media=&description=${pageTitle}" aria-label="${getPlaceholder('socialShareLabel', { page: 'Pinterest' })}"><span class="icon icon-pinterest"></span></a>`,
  instagram: () => `<a href="https://www.instagram.com/petplace/" aria-label="${getPlaceholder('socialLinkLabel', { page: 'Instagram' })}"><span class="icon icon-instagram"></span></a>`,
  tiktok: () => `<a href="https://www.tiktok.com/@petplacefans/" aria-label="${getPlaceholder('socialLinkLabel', { page: 'Tiktok' })}"><span class="icon icon-tiktok"></span></a>`,
  email: (url, pageTitle) => `<a href="mailto:info@petplace.com?&subject=${pageTitle}&body=${url}" aria-label="${getPlaceholder('emailLinkLabel')}"><span class="icon icon-email"></span></a>`,
};

const defaultSocialList = ['facebook', 'pinterest', 'instagram', 'email'];

export default function decorate(block) {
  const pageTitle = document.head.querySelector('title').textContent;
  const url = window.location.href;

  const authoredSocialList = Array(...(block.querySelectorAll(':scope > div > div > div') ?? [])).map((el) => el.textContent);
  const socialList = authoredSocialList.length ? authoredSocialList : defaultSocialList;

  const socialShareDiv = document.querySelector('.social-share-container');
  const title = document.createElement('h2');
  if (!window.location.pathname.includes('best-pet-insurance')) {
    title.innerHTML = 'Share';
    socialShareDiv.prepend(title);
  }

  // TODO: insta link only leads to petplace insta
  const socialListEl = document.createElement('ul');
  socialList.forEach((social) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = socialObj[social](url, pageTitle);
    socialListEl.appendChild(listItem);
  });
  block.innerHTML = socialListEl.outerHTML;
  block.querySelectorAll('a').forEach((a) => {
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
  });
  decorateIcons(block);
}
