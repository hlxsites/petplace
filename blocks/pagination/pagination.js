import { decorateIcons, fetchPlaceholders } from '../../scripts/lib-franklin.js';

function createRelLink(rel, param) {
  const link = document.createElement('link');
  link.setAttribute('rel', rel);
  link.setAttribute('href', `${window.location.pathname}?${param}`);
  return link;
}

function renderContent(block, placeholders) {
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
        ${page > 1 ? `<li><a href="${window.location.pathname}?${prevParams}" aria-label="${placeholders.previousPage}"><span class="icon icon-chevron-wide"></span></a></li>` : ''}
        <li><a href="#" aria-current="page" tabindex="-1">${placeholders.pageIndex.replace('{{page}}', page).replace('{{total}}', total || '…')}</a></li>
        ${cards?.childElementCount >= limit ? `<li><a href="${window.location.pathname}?${nextParams}" aria-label="${placeholders.nextPage}"><span class="icon icon-chevron-wide"></span></a></li>` : ''}
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
  const placeholders = await fetchPlaceholders();
  renderContent(block, placeholders);
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
        renderContent(block, placeholders);
      }
    });
  });
  observer.observe(block, { attributes: true });

  observer = new MutationObserver(() => {
    renderContent(block, placeholders);
  });
  if (document.querySelector('.cards ul')) {
    observer.observe(document.querySelector('.cards ul'), { childList: true });
  } else {
    setTimeout(() => {
      observer.observe(document.querySelector('.cards ul'), { childList: true });
    });
  }
}
