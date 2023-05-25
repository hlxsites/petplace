import { buildBlock } from '../../scripts/lib-franklin.js';
import { decorateResponsiveImages, getId, isMobile } from '../../scripts/scripts.js';

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

function createTemplateBlock(main, blockName, before) {
  const section = document.createElement('div');

  const block = buildBlock(blockName, { elems: [] });
  section.append(block);
  if (before) {
    main.insertBefore(section, before);
  } else {
    main.append(section);
  }
}

export function loadEager(main) {
  main.insertBefore(buildSidebar(), main.querySelector(':scope > div:nth-of-type(2)'));
  createTemplateBlock(main, 'pagination', main.lastElementChild);
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
}
