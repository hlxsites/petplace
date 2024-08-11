import { decorateIcons } from '../../scripts/lib-franklin.js';
import { getPlaceholder } from '../../scripts/scripts.js';

function createRelLink(rel, param) {
  const link = document.createElement('link');
  link.setAttribute('rel', rel);
  link.setAttribute('href', `${window.location.pathname}?${param}`);
  return link;
}

function renderContent(block) {
  const usp = new URLSearchParams(window.location.search);
  const limit = Number(usp.get('limit') || block.dataset.limit || 25);
  const page = Number(usp.get('page') || 1);
  const cards = document.querySelector('.cards ul');

  usp.set('page', page - 1);
  const prevParams = usp.toString();
  usp.set('page', page + 1);
  const nextParams = usp.toString();

  const total = Number.isNaN(Number(block.getAttribute('data-total')))
    ? block.getAttribute('data-total')
    : Math.ceil(Number(block.getAttribute('data-total')) / limit);

  block.innerHTML = `
    <nav aria-label="pagination">
      <ul>
        ${page > 1 ? `<li><a href="${window.location.pathname}?${prevParams}" aria-label="${getPlaceholder('previousPage')}"><span class="icon icon-chevron-wide"></span></a></li>` : ''}
        <li><a href="#" aria-current="page" tabindex="-1">${getPlaceholder('pageIndex', { page, total: total || '…' })}</a></li>
        ${cards?.childElementCount >= limit && page < total ? `<li><a href="${window.location.pathname}?${nextParams}" aria-label="${getPlaceholder('nextPage')}"><span class="icon icon-chevron-wide"></span></a></li>` : ''}
      </ul>
    </nav>`;
  if (page > 1 && !document.head.querySelector('link[rel="prev"]')) {
    document.head.append(createRelLink('prev', prevParams));
  }
  if (cards?.childElementCount >= limit && !document.head.querySelector('link[rel="next"]')) {
    document.head.append(createRelLink('next', nextParams));
  }
  decorateIcons(block);
}

export default async function decorate(block) {
  renderContent(block);
  block.addEventListener('click', (ev) => {
    const a = ev.target.closest('a');
    if (!a) {
      return;
    }
    ev.preventDefault();
    if (a.getAttribute('aria-current') === 'page') {
      return;
    }
    window.location.assign(a.href);
  });

  let observer = new MutationObserver((entries) => {
    entries.forEach((e) => {
      if (e.attributeName === 'data-total') {
        renderContent(block);
      }
    });
  });
  observer.observe(block, { attributes: true });

  observer = new MutationObserver(() => {
    renderContent(block);
  });
  if (document.querySelector('.cards ul')) {
    observer.observe(document.querySelector('.cards ul'), { childList: true });
  } else {
    setTimeout(() => {
      observer.observe(document.querySelector('.cards ul'), { childList: true });
    });
  }
}
