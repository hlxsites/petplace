import ffetch from '../../scripts/ffetch.js';
import { decorateIcons, getMetadata } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const author = getMetadata('author');
  const authorIndex = await ffetch('/authors/author-index.json').filter((item) => item.Name === author).first();
  const path = authorIndex?.Path;
  const date = getMetadata('publication-date');
  const titleithLinkIfExist = path ? `<a href="${path}">${author}</a>` : author;
  block.innerHTML = `
    <span class='icon icon-user'></span>
    <p>${titleithLinkIfExist}</p>
    <time datetime="${date}">${date}</time>`;
  decorateIcons(block);
  setTimeout(() => {
    window.requestAnimationFrame(() => {
      block.querySelector('time').textContent = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(date));
    });
  });
}
