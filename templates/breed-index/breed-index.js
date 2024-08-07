import ffetch from '../../scripts/ffetch.js';
import { buildBlock } from '../../scripts/lib-franklin.js';
import { decorateResponsiveImages, getId, isTablet } from '../../scripts/scripts.js';

async function renderArticles(articles) {
  const block = document.querySelector('.cards');
  const res = await articles;
  // block.querySelectorAll('li').forEach((li) => li.remove());
  // eslint-disable-next-line no-restricted-syntax
  for await (const article of res) {
    const div = document.createElement('div');
    div.textContent = article.path;
    div.dataset.json = JSON.stringify(article);
    block.append(div);
  }
  document.querySelector('.pagination').dataset.total = res.total();
  window.requestAnimationFrame(() => {
    block.querySelectorAll('.skeleton').forEach((sk) => sk.parentElement.remove());
  });
}

async function getArticles() {
  const usp = new URLSearchParams(window.location.search);
  const type = usp.get('type')?.split(',') || [];
  const limit = usp.get('limit') || 6;
  const offset = (Number(usp.get('page') || 1) - 1) * limit;
  return ffetch(`${window.hlx.contentBasePath}/article/query-index.json`)
    .sheet('breed')
    .withTotal(true)
    .filter((article) => article.path.startsWith(`${window.hlx.contentBasePath}/article/breed`)
      && (!type.length || (type.length === 1 && type[0] === '') || type.includes(article.type)))
    .slice(offset, offset + limit);
}

function buildSidebar() {
  const section = document.createElement('div');
  section.classList.add('sidebar');
  section.setAttribute('role', 'complementary');

  const id = getId();
  const filterToggle = document.createElement('button');
  filterToggle.disabled = !isTablet();
  filterToggle.setAttribute('aria-controls', `${id}`);
  filterToggle.textContent = 'Filters';
  section.append(filterToggle);

  const typeFilter = buildBlock('type-filters', { elems: [] });
  typeFilter.id = id;
  typeFilter.setAttribute('aria-hidden', isTablet());
  section.append(typeFilter);

  filterToggle.addEventListener('click', () => {
    const isVisible = typeFilter.getAttribute('aria-hidden') === 'false';
    if (!isVisible) {
      filterToggle.dataset.mobileVisible = true;
    }
    typeFilter.setAttribute('aria-hidden', isVisible);
  });

  window.addEventListener('resize', () => {
    const isVisible = filterToggle.getAttribute('aria-hidden') === 'false';
    if (!isVisible && !isTablet()) {
      filterToggle.disabled = true;
      filterToggle.setAttribute('aria-hidden', false);
    } else if (isVisible && isTablet() && !filterToggle.dataset.mobileVisible) {
      filterToggle.disabled = false;
      filterToggle.setAttribute('aria-hidden', true);
    }
  }, { passive: true });

  return section;
}

function createTemplateBlock(main, blockName, insertBefore) {
  const section = document.createElement('div');

  const block = buildBlock(blockName, { elems: [] });
  section.append(block);
  if (insertBefore) {
    main.insertBefore(section, insertBefore);
  } else {
    main.append(section);
  }
  return block;
}

function buildHeroBlock(container) {
  const div = container.firstElementChild;
  const pictures = div.querySelectorAll('div:first-child picture');
  const heading = div.querySelector('div:first-child h1');
  const subHeadings = div.querySelectorAll('div:first-child p');

  const imgDiv = document.createElement('div');
  imgDiv.className = 'img-div';
  pictures.forEach((el) => imgDiv.append(el));
  decorateResponsiveImages(imgDiv, ['461']);

  const textDiv = document.createElement('div');
  textDiv.classList = 'text-div';
  textDiv.append(heading);
  subHeadings.forEach((el) => textDiv.append(el));

  const hero = buildBlock('hero', { elems: [imgDiv, textDiv] });
  div.prepend(hero);
}

export function loadEager(document) {
  const main = document.querySelector('main');
  main.insertBefore(buildSidebar(), main.querySelector(':scope > div:nth-of-type(2)'));

  const cards = createTemplateBlock(main, 'cards', main.querySelector('.slide-cards').parentElement);
  cards.classList.add('breed');
  cards.dataset.limit = 6;
  for (let i = 0; i < 12; i += 1) {
    const div = document.createElement('div');
    div.classList.add('skeleton');
    cards.append(div);
  }

  const pagination = createTemplateBlock(main, 'pagination');
  pagination.dataset.limit = 6;
  buildHeroBlock(main);
}

// eslint-disable-next-line import/prefer-default-export
export async function loadLazy(document) {
  renderArticles(getArticles());

  // Softnav progressive enhancement for browsers that support it
  if (window.navigation) {
    const typeFilters = document.querySelector('.type-filters');
    window.addEventListener('popstate', () => {
      renderArticles(getArticles());
    });

    typeFilters.addEventListener('click', (ev) => {
      const label = ev.target.closest('label');
      if (!label) {
        return;
      }
      ev.stopPropagation();
      if (ev.target.nodeName !== 'INPUT') {
        return;
      }
      // eslint-disable-next-line no-shadow
      const usp = new URLSearchParams(window.location.search);
      // eslint-disable-next-line no-shadow
      const type = [...typeFilters.querySelectorAll('[type="checkbox"]')]
        .filter((input) => input.checked)
        .map((input) => input.value);
      usp.set('type', type);
      window.history.pushState({}, '', `${window.location.pathname}?${usp.toString()}`);
      renderArticles(getArticles());
    });
  }

  const { adsenseFunc } = await import('../../scripts/adsense.js');
  adsenseFunc('breed', 'create');
}

export async function loadDelayed() {
  const { adsenseFunc } = await import('../../scripts/adsense.js');
  adsenseFunc('breed');
}
