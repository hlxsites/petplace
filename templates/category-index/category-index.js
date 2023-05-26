import ffetch from '../../scripts/ffetch.js';
import { buildBlock, toClassName } from '../../scripts/lib-franklin.js';
import { getCategoryForUrl, getId, isMobile } from '../../scripts/scripts.js';

async function renderArticles(articles) {
  const block = document.querySelector('.cards');
  block.innerHTML = '';
  const res = await articles;
  // eslint-disable-next-line no-restricted-syntax
  for await (const article of res) {
    const div = document.createElement('div');
    div.textContent = article.path;
    block.append(div);
  }
}

async function getArticles() {
  const usp = new URLSearchParams(window.location.search);
  const limit = usp.get('limit') || 25;
  const offset = (Number(usp.get('page') || 1) - 1) * limit;
  const category = window.location.pathname.split('/').slice(3, -1).pop();
  return ffetch('/article/query-index.json')
    .sheet('article')
    .filter((article) => {
      const articleCategory = toClassName(article.category);
      return articleCategory.split(',').map((c) => c.trim()).includes(category)
        || article.path.includes(`/${category}/`);
    })
    .slice(offset, offset + limit);
}

function buildSidebar() {
  const section = document.createElement('div');
  section.classList.add('sidebar');
  section.setAttribute('role', 'complementary');

  const id1 = getId();
  const id2 = getId();
  const filterToggle = document.createElement('button');
  filterToggle.disabled = !isMobile();
  filterToggle.setAttribute('aria-controls', `${id1} ${id2}`);
  filterToggle.textContent = 'Filters';
  section.append(filterToggle);

  const subCategories = buildBlock('sub-categories', { elems: [] });
  subCategories.id = id1;
  subCategories.setAttribute('aria-hidden', isMobile());
  section.append(subCategories);

  const popularTags = buildBlock('popular-tags', { elems: [] });
  popularTags.id = id2;
  popularTags.setAttribute('aria-hidden', isMobile());
  section.append(popularTags);

  filterToggle.addEventListener('click', () => {
    const isVisible = subCategories.getAttribute('aria-hidden') === 'false';
    if (!isVisible) {
      filterToggle.dataset.mobileVisible = true;
    }
    subCategories.setAttribute('aria-hidden', isVisible);
    popularTags.setAttribute('aria-hidden', isVisible);
  });

  window.addEventListener('resize', () => {
    const isVisible = subCategories.getAttribute('aria-hidden') === 'false';
    if (!isVisible && !isMobile()) {
      filterToggle.disabled = true;
      subCategories.setAttribute('aria-hidden', false);
      popularTags.setAttribute('aria-hidden', false);
    } else if (isVisible && isMobile() && !filterToggle.dataset.mobileVisible) {
      filterToggle.disabled = false;
      subCategories.setAttribute('aria-hidden', true);
      popularTags.setAttribute('aria-hidden', true);
    }
  }, { passive: true });

  return section;
}

function createTemplateBlock(main, blockName) {
  const section = document.createElement('div');

  const block = buildBlock(blockName, { elems: [] });
  section.append(block);
  main.append(section);
}

export async function loadEager(main) {
  const { Category } = await getCategoryForUrl();
  document.title = document.title.replace(/<Category>/, Category);
  document.head.querySelector('meta[property="og:title"]').content = document.title;
  document.head.querySelector('meta[name="twitter:title"]').content = document.title;
  document.querySelector('h1').textContent = Category;
  main.insertBefore(buildSidebar(), main.querySelector(':scope > div:nth-of-type(2)'));
  createTemplateBlock(main, 'pagination');
}

export async function loadLazy() {
  const { Color } = await getCategoryForUrl();
  const heroColorDiv = document.querySelector('.category-index .hero > div');
  heroColorDiv.style.setProperty('--bg-color', `var(--color-${Color}-transparent)`);

  renderArticles(getArticles());
}
