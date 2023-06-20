import { decorateIcons, getMetadata } from '../../scripts/lib-franklin.js';

function renderContent(block) {
  const template = getMetadata('template');
  let maxcontent = 25;
  if ('searchresults' === template)
    maxcontent = 16;
  const usp = new URLSearchParams(window.location.search);
  const limit = Number(usp.get('limit') || block.dataset.limit || maxcontent);
  const page = Number(usp.get('page') || 1);
  const cards = document.querySelector('.cards ul');

  usp.set('page', page - 1);
  const prevParams = usp.toString();
  usp.set('page', page + 1);
  const nextParams = usp.toString();

  const total = Math.ceil(Number(block.getAttribute('data-total')) / limit);
  block.innerHTML = `
    <nav aria-label="pagination">
      <ul>
        ${page > 1 ? `<li><a href="${window.location.pathname}?${prevParams}" aria-label="Previous page"><span class="icon icon-chevron-wide"></span></a></li>` : ''}
        <li><a href="#" aria-current="page" tabindex="-1">Page: ${page}${total ? ` of ${total}` : ''}</a></li>
        ${cards?.childElementCount === limit ? `<li><a href="${window.location.pathname}?${nextParams}" aria-label="Next page"><span class="icon icon-chevron-wide"></span></a></li>` : ''}
      </ul>
    </nav>`;
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
  observer.observe(document.querySelector('.cards ul'), { childList: true });
}
