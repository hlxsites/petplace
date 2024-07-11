import {
  createOptimizedPicture,
  decorateIcons,
  getMetadata,
} from '../../scripts/lib-franklin.js';
import { getPlaceholder } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const authorTitle = getMetadata('author');
  const authorTitleLowerCase = authorTitle.toLowerCase();
  const author = await fetch(`${window.hlx.contentBasePath}/authors/query-index.json`)
    .then((response) => response.json())
    .then((data) => data.data.find(
      (item) => item.title.toLowerCase().includes(authorTitleLowerCase),
    ));
  const path = author?.path;
  const avatar = author?.avatar;
  const date = new Date(getMetadata('publication-date'));
  date.setHours(date.getHours() + (date.getTimezoneOffset() / 60));
  const titleWithLinkIfExist = path ? `<a href="${path}">${authorTitle}</a>` : authorTitle;
  const defaultAvatarIcon = document.createElement('span');
  defaultAvatarIcon.classList.add('icon', 'icon-user');
  const avatarIfExist = avatar ? createOptimizedPicture(avatar, authorTitle) : defaultAvatarIcon;
  avatarIfExist.querySelector('img')?.setAttribute('itemprop', 'image');
  block.innerHTML = `
    <div itemprop="author" itemscope itemtype="https://schema.org/Person">
      <p itemprop="name">${titleWithLinkIfExist}</p>
      <time itemprop="datePublished" datetime="${date.toISOString().substring(0, 10)}">${date}</time>
    </div>
    <div itemprop="publisher" itemscope itemtype="https://schema.org/Organization">
      <meta itemprop="name" content="${getPlaceholder('websiteName')}"/>
      <meta itemprop="logo" content="${window.location.origin}/icons/logo.svg"/>
    </div>`;

  if (avatar) block.prepend(avatarIfExist);

  decorateIcons(block);
  setTimeout(() => {
    window.requestAnimationFrame(() => {
      block.querySelector('time').textContent = new Intl.DateTimeFormat(document.documentElement.lang, { dateStyle: 'long' }).format(new Date(date));
    });
  });
}
