import ffetch from '../../scripts/ffetch.js';
import {
  buildBlock,
  createOptimizedPicture,
  toClassName,
} from '../../scripts/lib-franklin.js';
import {
  getCategories,
  getCategory,
  getPlaceholder,
  getId,
  isTablet,
  meterCalls,
} from '../../scripts/scripts.js';
import { adsDefineSlot, adsDivCreator } from '../../scripts/utils/adsense.js';
// import { render as renderCategories } from '../../blocks/sub-categories/sub-categories.js';

/**
 * Queries the colum and finds the matching image else uses default image.
 * @param path
 * @returns {Promise<HTMLPictureElement || undefined>}
 */
export async function getCategoryImage(path) {
  const res = await fetch('/article/category/category-images.plain.html');
  const htmlText = await res.text();
  const div = document.createElement('div');
  div.innerHTML = htmlText;

  const column = div.querySelector('.columns');
  // eslint-disable-next-line max-len
  return [...column.children].find((el) => el.children[0].textContent.trim() === path)?.children[1].children[0];
}

export async function getCategoryForUrl() {
  const { pathname } = window.location;
  const [category] = pathname.split('/').splice(pathname.endsWith('/') ? -2 : -1, 1);
  return getCategory(category);
}

let articleLoadingPromise;
async function renderArticles(articles) {
  const block = document.querySelector('.cards');
  block.querySelectorAll('li').forEach((li) => li.remove());
  for (let i = 0; i < 25; i += 1) {
    const div = document.createElement('div');
    div.classList.add('skeleton');
    block.append(div);
  }
  document.querySelector('.pagination').dataset.total = '…';
  articleLoadingPromise = await articles;
  let articleCount = 0;
  const pagination = document.querySelector('.pagination.block');
  // eslint-disable-next-line no-restricted-syntax
  for await (const article of articleLoadingPromise) {
    const div = document.createElement('div');
    div.dataset.json = JSON.stringify(article);
    articleCount += 1;
    await meterCalls(() => block.append(div));
    pagination.style.display = '';
  }
  if (articleCount === 0) {
    const container = document.querySelector('.cards-container');
    let noResults = container.querySelector('h2');
    if (!document.querySelector('h2')) {
      noResults = document.createElement('h2');
      container.append(noResults);
    }
    noResults.innerText = getPlaceholder('noArticles');
    if (pagination) {
      pagination.style.display = 'none';
    }
  }
  document.querySelector('.pagination').dataset.total = articleLoadingPromise.total();
  window.requestAnimationFrame(() => {
    block.querySelectorAll('.skeleton').forEach((sk) => sk.parentElement.remove());
  });
}

async function getArticles() {
  const categories = await getCategories();
  const categoryPath = new URL(document.head.querySelector('link[rel="canonical"]').href).pathname;
  const applicableCategories = categories
    .filter((c) => c.Path === categoryPath
      || c['Parent Path'].startsWith(categoryPath))
    .map((c) => ({ id: c.Slug, name: toClassName(c.Category) }));
  const usp = new URLSearchParams(window.location.search);
  const limit = usp.get('limit') || 25;
  const offset = (Number(usp.get('page') || 1) - 1) * limit;
  return ffetch('/article/query-index.json')
    .sheet('article')
    .withTotal(true)
    .filter((article) => {
      const articleCategories = article.category !== '0'
        ? article.category.split(',').map((c) => toClassName(c))
        : article.path.split('/').splice(-2, 1);
      return applicableCategories.some((c) => articleCategories.includes(c.name)
        || articleCategories.includes(c.id));
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
  filterToggle.disabled = !isTablet();
  filterToggle.setAttribute('aria-controls', `${id1} ${id2}`);
  filterToggle.textContent = getPlaceholder('filters');
  section.append(filterToggle);

  const subCategories = buildBlock('sub-categories', { elems: [] });
  subCategories.id = id1;
  subCategories.setAttribute('aria-hidden', isTablet());
  section.append(subCategories);

  const popularTags = buildBlock('popular-tags', { elems: [] });
  popularTags.id = id2;
  popularTags.setAttribute('aria-hidden', isTablet());
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
    if (!isVisible && !isTablet()) {
      filterToggle.disabled = true;
      subCategories.setAttribute('aria-hidden', false);
      popularTags.setAttribute('aria-hidden', false);
    } else if (isVisible && isTablet() && !filterToggle.dataset.mobileVisible) {
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
  const category = await getCategoryForUrl();
  if (!category) {
    throw new Error(404);
  }
  const {
    Category, Color, Image, Path,
  } = category;
  document.title = Category;
  document.head.querySelector('link[rel="canonical"]').href = `${window.location.origin}${Path}`;
  document.head.querySelector('meta[property="og:title"]').content = document.title;
  document.head.querySelector('meta[name="twitter:title"]').content = document.title;
  const h1 = document.querySelector('h1');
  h1.textContent = Category;
  h1.id = toClassName(Category);
  const heroColorDiv = document.querySelector('.category-index .hero > div');
  heroColorDiv?.style.setProperty('--bg-color', `var(--color-${Color}-transparent)`);
  if (Image && heroColorDiv) {
    const picture = document.querySelector('.category-index .hero picture');
    picture.replaceWith(createOptimizedPicture(picture.querySelector('img').src, '', true, [{ width: 1600 }]));
  }
}

export async function loadEager(document) {
  const main = document.querySelector('main');
  await updateMetadata();
  const h2 = document.createElement('h2');
  h2.classList.add('sr-only');
  h2.textContent = getPlaceholder('articles');
  const h1 = main.querySelector('h1');
  h1.after(h2);
  main.insertBefore(buildSidebar(), main.querySelector(':scope > div:nth-of-type(1)'));
  createTemplateBlock(main, 'pagination');
  // eslint-disable-next-line no-restricted-globals
  const heroImg = await getCategoryImage(location.pathname);
  if (heroImg) {
    main.querySelector('picture').replaceWith(heroImg);
  }
}

export async function loadLazy() {
  const category = await getCategoryForUrl();
  if (!category) {
    return;
  }

  const { Color } = category;
  const heroColorDiv = document.querySelector('.category-index .hero > div');
  heroColorDiv.style.setProperty('--bg-color', `var(--color-${Color}-transparent)`);

  renderArticles(getArticles());

  // Softnav progressive enhancement for browsers that support it
  // if (window.navigation) {
  //   const categories = await getCategories();
  //   const subCategories = document.querySelector('.sub-categories');
  //   window.addEventListener('popstate', () => {
  //     articleLoadingPromise.interrupt();
  //     updateMetadata();
  //     renderCategories(subCategories, categories);
  //     renderArticles(getArticles());
  //   });

  //   subCategories.addEventListener('click', (ev) => {
  //     const link = ev.target.closest('a');
  //     if (!link) {
  //       return;
  //     }
  //     ev.preventDefault();
  //     articleLoadingPromise.interrupt();
  //     window.history.pushState({}, '', link.href);
  //     updateMetadata();
  //     renderCategories(subCategories, categories);
  //     renderArticles(getArticles());
  //   });
  // }
}

// top, bottom, anchor
export function loadDelayed() {
  adsDivCreator('category_top');
  adsDivCreator('category_bottom');

  adsDefineSlot('category_top', 'category_bottom', 'category_anchor');
}
