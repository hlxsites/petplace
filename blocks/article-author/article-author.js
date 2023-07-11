import { decorateIcons, getMetadata } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const author = getMetadata('author');
  const path = await fetch('/authors/author-index.json')
    .then((response) => response.json())
    .then((table) => table.data.find((row) => row.Name.toLowerCase() === author.toLowerCase()))
    .then((row) => row?.Path);
  const date = getMetadata('publication-date');
  const titleWithLinkIfExist = path ? `<a href="${path}">${author}</a>` : author;
  block.innerHTML = `
    <span class='icon icon-user'></span>
    <p>${titleWithLinkIfExist}</p>
    <time datetime="${date}">${date}</time>`;
  decorateIcons(block);
  setTimeout(() => {
    window.requestAnimationFrame(() => {
      block.querySelector('time').textContent = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(date));
    });
  });
}
