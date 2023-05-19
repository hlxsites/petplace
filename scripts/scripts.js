import {
  sampleRUM,
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
  getMetadata,
  toClassName,
  createOptimizedPicture,
} from './lib-franklin.js';

const LCP_BLOCKS = ['slideshow']; // add your LCP blocks to the list
let templateModule;
window.hlx.RUM_GENERATION = 'project-1'; // add your RUM generation information here

function getId() {
  return Math.random().toString(32).substring(2);
}

function isMobile() {
  return window.innerWidth < 1024;
}

let categoriesPromise = null;
async function loadCategories() {
  if (categoriesPromise) {
    return categoriesPromise;
  }
  if (!window.sessionStorage.getItem('categories')) {
    categoriesPromise = fetch('/categories.json')
      .then((res) => res.json())
      .then((json) => {
        window.sessionStorage.setItem('categories', JSON.stringify(json));
      })
      .catch((err) => {
        window.sessionStorage.setItem('categories', JSON.stringify({ data: [] }));
        // eslint-disable-next-line no-console
        console.error('Failed to fetch categories.', err);
      });
    return categoriesPromise;
  }
  return Promise.resolve();
}

export async function getCategories() {
  try {
    await loadCategories();
    return JSON.parse(window.sessionStorage.getItem('categories'));
  } catch (err) {
    return null;
  }
}

export async function getCategory(name) {
  const categories = await getCategories();
  if (!categories) {
    return null;
  }
  return categories.data.find((c) => c.Slug === name);
}

function buildCategorySidebar() {
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

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
async function buildHeroBlock(main) {
  const excludedPages = ['home-page'];
  const bodyClass = [...document.body.classList];
  // check the page's body class to see if it matched the list
  // of excluded page for auto-blocking the hero
  const pageIsExcluded = excludedPages.some((page) => bodyClass.includes(page));
  if (pageIsExcluded) {
    return;
  }
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    let breakpoints;
    if (!bodyClass.includes('author-page')) {
      breakpoints = [
        { width: Math.ceil(window.innerWidth / 100) * 100 },
      ];
    }
    const img = picture.querySelector('img');
    const optimized = createOptimizedPicture(img.src, img.alt, true, breakpoints);
    picture.replaceWith(optimized);
    const section = document.createElement('div');
    if (bodyClass.includes('breed-page')) {
      section.append(buildBlock('hero', { elems: [optimized] }));
    } else if (bodyClass.includes('article-page')) {
      const breadcrumb = document.createElement('div');
      breadcrumb.classList.add('breadcrumb', 'article-template-breadcrumb');
      section.append(buildBlock('hero', { elems: [optimized, h1, breadcrumb] }));
    } else if (bodyClass.includes('author-page')) {
      const breadcrumb = document.createElement('div');
      breadcrumb.classList.add('breadcrumb', 'author-template-breadcrumb');
      const avatar = getMetadata('avatar');
      const optimizedAvatar = createOptimizedPicture(avatar, getMetadata('title'), true, [
        { width: 200 },
      ]);
      optimizedAvatar.classList.add('author-page-avatar');
      section.append(buildBlock('hero', { elems: [optimized, optimizedAvatar, breadcrumb] }));
    } else {
      section.append(buildBlock('hero', { elems: [optimized, h1] }));
    }
    main.prepend(section);
  }
}

function buildVideoEmbeds(container) {
  container.querySelectorAll('a[href*="youtube.com/embed"]').forEach((a) => {
    a.parentElement.innerHTML = `
      <iframe
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        frameborder="0"
        loading="lazy"
        height="360"
        width="640"
        src="${a.href}"></iframe>`;
  });
}

/**
 * Builds template block and adds to main as sections.
 * @param {Element} main The container element.
 * @returns {Promise} Resolves when the template block(s) have
 *  been loaded.
 */
async function decorateTemplate(main) {
  const template = toClassName(getMetadata('template'));
  if (!template) {
    return;
  }

  try {
    const cssLoaded = loadCSS(`${window.hlx.codeBasePath}/templates/${template}/${template}.css`);
    const decorationComplete = new Promise((resolve) => {
      (async () => {
        try {
          templateModule = await import(`../templates/${template}/${template}.js`);
          if (templateModule?.loadEager) {
            await templateModule.loadEager(main);
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(`failed to load template for ${template}`, error);
        }
        resolve();
      })();
    });
    await Promise.all([cssLoaded, decorationComplete]);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(`failed to load template ${template}`, error);
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
async function buildAutoBlocks(main) {
  const bodyClass = [...document.body.classList];

  try {
    await buildHeroBlock(main);

    if (bodyClass.includes('category-index')) {
      main.insertBefore(buildCategorySidebar(), main.querySelector(':scope > div:nth-of-type(2)'));
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export async function decorateMain(main) {
  loadCategories(main);
  // hopefully forward compatible button decoration
  decorateButtons(main);
  await decorateIcons(main);
  await buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    await decorateTemplate(main);
    await decorateMain(main);
    document.body.classList.add('appear');
    await waitForLCP(LCP_BLOCKS);
  }
}

/**
 * Adds the favicon.
 * @param {string} href The favicon URL
 */
export function addFavIcon(href) {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/svg+xml';
  link.href = href;
  const existingLink = document.querySelector('head link[rel="icon"]');
  if (existingLink) {
    existingLink.parentElement.replaceChild(link, existingLink);
  } else {
    document.getElementsByTagName('head')[0].appendChild(link);
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  if (templateModule?.loadLazy) {
    templateModule.loadLazy(doc);
  }
  const main = doc.querySelector('main');
  if (document.body.classList.contains('article-page')) {
    buildVideoEmbeds(main);
  }
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  await loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  await loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  addFavIcon(`${window.hlx.codeBasePath}/styles/favicon.svg`);
  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed(doc) {
  // eslint-disable-next-line import/no-cycle
  // load anything that can be postponed to the latest here
  window.setTimeout(() => {
    if (templateModule?.loadDelayed) {
      templateModule.loadDelayed(doc);
    }
    return import('./delayed.js');
  }, 3000);
}

function createResponsiveImage(pictures, breakpoint) {
  pictures.sort((p1, p2) => {
    const img1 = p1.querySelector('img');
    const img2 = p2.querySelector('img');
    return img1.width - img2.width;
  });

  const responsivePicture = document.createElement('picture');
  const defaultImage = pictures[0].querySelector('img');
  responsivePicture.append(defaultImage);
  pictures.forEach((picture, index) => {
    const srcElem = picture.querySelector('source:not([media])');
    const srcElemBackup = srcElem.cloneNode();
    srcElemBackup.srcset = srcElemBackup.srcset.replace('format=webply', 'format=png');
    srcElemBackup.type = 'img/png';

    if (index > 0) {
      srcElem.setAttribute('media', `(min-width: ${breakpoint[index - 1]}px)`);
      srcElemBackup.setAttribute('media', `(min-width: ${breakpoint[index - 1]}px)`);
    }
    responsivePicture.prepend(srcElemBackup);
    responsivePicture.prepend(srcElem);
  });

  return responsivePicture;
}

/**
 *
 * @param container - HTML parent element that contains the multiple <picture>
 *     tags to be used in building responsive image
 * @param breakpoints - Array of numbers to be used to define the breakpoints for the pictures.
 */
export function decorateResponsiveImages(container, breakpoints = [440, 768]) {
  const responsiveImage = createResponsiveImage([...container.querySelectorAll('picture')], breakpoints);
  container.innerHTML = '';
  container.append(responsiveImage);
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed(document);
}

loadPage();
