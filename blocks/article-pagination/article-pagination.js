import { decorateIcons } from '../../scripts/lib-franklin.js';
import { getPlaceholder } from '../../scripts/scripts.js';

function calculatePagination(currentPage, totalPages) {
  const MAX_PAGES_SHOWN = 2; // Adjust as needed

  const result = [];

  for (let i = 1; i <= totalPages; i += 1) {
    if (
      i === 1
      || i === totalPages
      || (i >= currentPage - Math.floor(MAX_PAGES_SHOWN / 2)
        && i <= currentPage + Math.floor(MAX_PAGES_SHOWN / 2))
    ) {
      const pageNumber = Number(i);
      result.push({ label: i, href: `${window.location.pathname}?page=${Number.isNaN(pageNumber) ? 1 : pageNumber}`, isCurrent: currentPage === i });
    } else if (
      i === currentPage - Math.floor(MAX_PAGES_SHOWN / 2) - 1
      || i === currentPage + Math.floor(MAX_PAGES_SHOWN / 2) + 1
    ) {
      result.push({ label: '...' });
    }
  }

  return result;
}

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

  const paginationElems = calculatePagination(page, total).map(({ label, href, isCurrent }) => {
    if (href) {
      return `<a ${isCurrent ? 'aria-current="page"' : ''} href="${href}">${label}</a>`;
    }
    return `<span class="pagination-separator">${label}</span>`;
  });

  block.innerHTML = `
    <nav aria-label="pagination">
      <ul>
        <li><a ${page <= 1 ? 'disabled' : ''} href="${window.location.pathname}?${prevParams}" aria-label="${getPlaceholder('previousPage')}"><span class="icon icon-chevron-large"></span></a></li>
        ${paginationElems.map((elem) => `<li>${elem}</li>`).join('')}
        <li><a ${cards?.childElementCount < limit ? 'disabled' : ''} href="${window.location.pathname}?${nextParams}" aria-label="${getPlaceholder('nextPage')}"><span class="icon icon-chevron-large"></span></a></li>
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

  // Wath for added cards if not already in the DOM
  if (!document.querySelector('.cards ul')) {
    const addedObserver = new MutationObserver((entries) => {
      entries.forEach((e) => {
        if ([...e.addedNodes.values()].some((n) => n.querySelector && n.querySelector('.cards ul'))) {
          renderContent(block);
        }
      });
    });
    addedObserver.observe(document.querySelector('main'), { childList: true, subtree: true });
  }
}
