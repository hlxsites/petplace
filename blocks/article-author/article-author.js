import { createOptimizedPicture, decorateIcons, getMetadata } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const authorTitle = getMetadata('author');
  const authorTitleLowerCase = authorTitle.toLowerCase();
  const author = await fetch('/authors/query-index.json')
    .then((response) => response.json())
    .then((data) => data.data.find(
      (item) => item.title.toLowerCase().includes(authorTitleLowerCase),
    ));
  const path = author?.path;
  const avatar = author?.avatar;
  const date = getMetadata('publication-date');
  const titleWithLinkIfExist = path ? `<a href="${path}">${authorTitle}</a>` : authorTitle;
  const defaultAvatarIcon = document.createElement('span');
  defaultAvatarIcon.classList.add('icon', 'icon-user');
  const avatarIfExist = avatar ? createOptimizedPicture(avatar, authorTitle) : defaultAvatarIcon;
  block.innerHTML = `
    <p>${titleWithLinkIfExist}</p>
    <time datetime="${date}">${date}</time>`;
  block.prepend(avatarIfExist);
  decorateIcons(block);
  setTimeout(() => {
    window.requestAnimationFrame(() => {
      block.querySelector('time').textContent = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(date));
    });
  });
}
