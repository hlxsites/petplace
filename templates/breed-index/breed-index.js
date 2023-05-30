import ffetch from '../../scripts/ffetch.js';
import { buildBlock } from '../../scripts/lib-franklin.js';
import { decorateResponsiveImages, getId, isMobile } from '../../scripts/scripts.js';

async function renderArticles(articles) {
  const block = document.querySelector('.cards');
  block.querySelectorAll('li').forEach((li) => li.remove());
  const res = await articles;
  // eslint-disable-next-line no-restricted-syntax
  for await (const article of res) {
    const div = document.createElement('div');
    div.textContent = article.path;
    div.dataset.json = JSON.stringify(article);
    block.append(div);
  }
}

async function getArticles() {
  const usp = new URLSearchParams(window.location.search);
  const type = usp.get('type').split(',');
  const limit = usp.get('limit') || 6;
  const offset = (Number(usp.get('page') || 1) - 1) * limit;
  return ffetch('/article/query-index.json')
    .sheet('breed')
    .filter((article) => article.path.startsWith('/article/breed')
      && (!type.length || (type.length === 1 && type[0] === '') || type.includes(article.type)))
    .slice(offset, offset + limit);
}


function buildSidebar() {
  const section = document.createElement('div');
  section.classList.add('sidebar');
  section.setAttribute('role', 'complementary');

  const id = getId();
  const filterToggle = document.createElement('button');
  filterToggle.disabled = !isMobile();
  filterToggle.setAttribute('aria-controls', `${id}`);
  filterToggle.textContent = 'Filters';
  section.append(filterToggle);

  const typeFilter = buildBlock('type-filters', { elems: [] });
  typeFilter.id = id;
  typeFilter.setAttribute('aria-hidden', isMobile());
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
    if (!isVisible && !isMobile()) {
      filterToggle.disabled = true;
      filterToggle.setAttribute('aria-hidden', false);
    } else if (isVisible && isMobile() && !filterToggle.dataset.mobileVisible) {
      filterToggle.disabled = false;
      filterToggle.setAttribute('aria-hidden', true);
    }
  }, { passive: true });

  return section;
}

function createTemplateBlock(main, blockName) {
  const section = document.createElement('div');

  const block = buildBlock(blockName, { elems: [] });
  section.append(block);
  main.append(section);
  return block;
}

export function loadEager(main) {
  main.insertBefore(buildSidebar(), main.querySelector(':scope > div:nth-of-type(2)'));
  const cards = createTemplateBlock(main, 'cards');
  cards.classList.add('breed');
  cards.dataset.limit = 6;
  const pagination = createTemplateBlock(main, 'pagination');
  pagination.dataset.limit = 6;
}

// eslint-disable-next-line import/prefer-default-export
export async function loadLazy(main) {
  const hero = document.createElement('div');
  const imgDiv = document.createElement('div');
  const textDiv = document.createElement('div');
  const defaultContentWrapper = main.querySelector('.default-content-wrapper');

  defaultContentWrapper.parentElement.classList.add('hero-container');
  hero.className = 'hero-wrapper';
  imgDiv.className = 'img-div';
  textDiv.classList = 'text-div';

  [...defaultContentWrapper.querySelectorAll('picture')].forEach((el) => {
    imgDiv.append(el);
  });
  hero.append(imgDiv);
  textDiv.append(document.querySelector('h1'));

  [...defaultContentWrapper.querySelectorAll('p')].forEach((el) => {
    if (el.innerText.trim() !== '') {
      textDiv.append(el);
    }
  });
  hero.append(textDiv);
  decorateResponsiveImages(imgDiv, ['461']);

  defaultContentWrapper.outerHTML = hero.outerHTML;

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
}
