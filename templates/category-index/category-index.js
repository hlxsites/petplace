import ffetch from '../../scripts/ffetch.js';
import { buildBlock, createOptimizedPicture, toClassName } from '../../scripts/lib-franklin.js';
import {
  getCategories,
  getCategoryForUrl,
  getId,
  isMobile,
} from '../../scripts/scripts.js';
import { render as renderCategories } from '../../blocks/sub-categories/sub-categories.js';

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
  const { data } = await getCategories();
  const applicableCategories = data.filter((c) => c.Path === window.location.pathname
    || c['Parent Path'].startsWith(window.location.pathname));
  const usp = new URLSearchParams(window.location.search);
  const limit = usp.get('limit') || 25;
  const offset = (Number(usp.get('page') || 1) - 1) * limit;
  return ffetch('/article/query-index.json')
    .sheet('article')
    .filter((article) => {
      const articleCategories = article.category !== '0'
        ? article.category.split(',').map((c) => c.trim().toLowerCase())
        : article.path.split('/').splice(-2, 1);
      return applicableCategories.some((c) => articleCategories.includes(c.Category.toLowerCase())
        || articleCategories.map((ac) => toClassName(ac)).includes(c.Slug));
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

async function updateMetadata() {
  const { Category, Color, Image } = await getCategoryForUrl();
  document.title = document.title.replace(/<Category>/, Category);
  document.head.querySelector('meta[property="og:title"]').content = document.title;
  document.head.querySelector('meta[name="twitter:title"]').content = document.title;
  document.querySelector('h1').textContent = Category;
  const heroColorDiv = document.querySelector('.category-index .hero > div');
  heroColorDiv?.style.setProperty('--bg-color', `var(--color-${Color}-transparent)`);
  if (Image && heroColorDiv) {
    const picture = document.querySelector('.category-index .hero picture');
    picture.replaceWith(createOptimizedPicture(picture.querySelector('img').src, '', true, [{ width: 1600 }]));
  }
}

export async function loadEager(main) {
  updateMetadata();
  main.insertBefore(buildSidebar(), main.querySelector(':scope > div:nth-of-type(2)'));
  createTemplateBlock(main, 'pagination');
}

export async function loadLazy() {
  const { Color } = await getCategoryForUrl();
  const heroColorDiv = document.querySelector('.category-index .hero > div');
  heroColorDiv.style.setProperty('--bg-color', `var(--color-${Color}-transparent)`);

  renderArticles(getArticles());

  // Softnav progressive enhancement for browsers that support it
  if (window.navigation) {
    const { data } = await getCategories();
    const subCategories = document.querySelector('.sub-categories');
    window.addEventListener('popstate', () => {
      updateMetadata();
      renderCategories(subCategories, data);
      renderArticles(getArticles());
    });

    subCategories.addEventListener('click', (ev) => {
      const link = ev.target.closest('a');
      if (!link) {
        return;
      }
      ev.preventDefault();
      window.history.pushState({}, '', link.href);
      updateMetadata();
      renderCategories(subCategories, data);
      renderArticles(getArticles());
    });
  }
}
