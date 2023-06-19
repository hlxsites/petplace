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

const queue = [];
let interval;
export async function meterCalls(fn, wait = 200, max = 5) {
  if (!interval) {
    setTimeout(() => fn.call(null));
    interval = window.setInterval(() => {
      queue.splice(0, max).forEach((item) => window.requestAnimationFrame(() => item.call(null)));
      if (!queue.length) {
        window.clearInterval(interval);
      }
    }, wait);
  } else {
    queue.push(fn);
  }
}

export function getId() {
  return Math.random().toString(32).substring(2);
}

export function isMobile() {
  return window.innerWidth < 1024;
}

async function render404() {
  const response = await fetch('/404.html');
  const html = await response.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');
  document.head.append(doc.querySelector('head>style'));
  const main = document.querySelector('main');
  main.innerHTML = doc.querySelector('main').innerHTML;
  main.classList.add('error');
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
        window.hlx.data = window.hlx.data || [];
        window.hlx.data.categories = json;
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
    if (window.hlx?.data?.categories) {
      return window.hlx.data.categories;
    }
    const categories = window.sessionStorage.getItem('categories');
    if (categories) {
      return JSON.parse(categories);
    }
    await loadCategories();
    return window.hlx.data.categories;
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

export async function getCategoryForUrl() {
  const { pathname } = window.location;
  const [category] = pathname.split('/').splice(pathname.endsWith('/') ? -2 : -1, 1);
  return getCategory(category);
}

export async function getCategoryByName(categoryName) {
  const categories = await getCategories();
  if (!categories) {
    return null;
  }
  return categories.data.find((c) => c.Category.toLowerCase() === categoryName.toLowerCase());
}

export async function getCategoryByKey(key, value) {
  const categories = await getCategories();
  if (!categories) {
    return null;
  }
  return categories.data.find((c) => c[key].toLowerCase() === value.toLowerCase());
}

export async function getCategoriesPath(path) {
  const categories = await getCategories();
  return categories.data.filter((c) => c.Path === path || c['Parent Path'].startsWith(path));
}

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
/**
 * @typedef ResponsiveHeroPictures
 * @property {Array<Element>} pictures Picture elements that make up the various resolutions
 *  of images provided for the hero image.
 * @property {Array<number>} breakpoints List of breakpoint widths where each hero image
 *  resolution will be used. This array will always be one less than the picture array.
 */

/**
 * Retrieves information about all of the hero images that were included in the authored
 * document. The images are assumed to appear in order of smallest resolution to largest,
 * and the breakpoints for each will be determined by the number of resolutions.
 *
 * For example, if there is only one picture, it will be used for all resolutions. If
 * there are two pictures, the first will be used for mobile and tablet, and the last
 * will be used for desktop. If there are 3, the first will be mobile, second will be
 * tablet, and third will be desktop.
 * @param {Element} main The current document's main element.
 * @param {Element} h1 The first heading in the document, assumed to be the title of
 *  the page.
 * @returns {ResponsiveHeroPictures} Information about the different hero image resolutions provided
 *  in the authored document.
 */
function getResponsiveHeroPictures(main, h1) {
  const heroPics = {
    pictures: [],
    breakpoints: [],
  };
  const pictures = main.querySelectorAll('picture');
  for (let i = 0; i < pictures.length; i += 1) {
    const picture = pictures[i];

    // eslint-disable-next-line no-bitwise
    if (i > 2 || !(h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
      break;
    }

    // create an optimized version of the image based on screen width
    const img = picture.querySelector('img');
    const optimized = createOptimizedPicture(img.src, img.alt, true, [
      { width: Math.ceil(window.innerWidth / 100) * 100 },
    ]);
    heroPics.pictures.push(optimized);
    picture.remove();
  }
  if (heroPics.pictures.length) {
    if (heroPics.pictures.length === 2) {
      // if there are two pictures, use the first for both mobile and tablet
      heroPics.breakpoints.push(1024);
    } else if (heroPics.pictures.length === 3) {
      // if there are three pictures, use the first for mobile, second for tablet
      heroPics.breakpoints.push(768);
      heroPics.breakpoints.push(1024);
    }
  }

  return heroPics;
}

function createResponsiveImage(pictures, breakpoint) {
  const responsivePicture = document.createElement('picture');
  const defaultImage = pictures[0].querySelector('img');
  responsivePicture.append(defaultImage);
  pictures.forEach((picture, index) => {
    let srcElem;
    if (index !== 0) {
      srcElem = picture.querySelector('source[media]');
    }
    if (!srcElem) {
      srcElem = picture.querySelector('source:not([media])');
    }
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
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
async function buildHeroBlock(main) {
  const excludedPages = ['home-page', 'breed-index'];
  const bodyClass = [...document.body.classList];
  // check the page's body class to see if it matched the list
  // of excluded page for auto-blocking the hero
  const pageIsExcluded = excludedPages.some((page) => bodyClass.includes(page));
  if (pageIsExcluded) {
    return;
  }
  const h1 = main.querySelector('h1');
  // eslint-disable-next-line no-bitwise
  if (h1) {
    const {
      pictures,
      breakpoints,
    } = getResponsiveHeroPictures(main, h1);
    if (!pictures.length) {
      return;
    }
    const responsive = createResponsiveImage(pictures, breakpoints);
    const section = document.createElement('div');
    if (bodyClass.includes('breed-page') || bodyClass.includes('author-page')) {
      section.append(buildBlock('hero', { elems: [responsive] }));
    } else {
      section.append(buildBlock('hero', { elems: [responsive, h1] }));
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
  if (!template || template === 'generic') {
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
          if (error.message === '404') {
            await render404();
          }
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
  try {
    await buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Creates hidden screen reader content for improving the website's screen
 * reader compatibility. The method will look for all "a" tags in the given
 * container, and replace content between square brackets with a span whose
 * class is "sr-only". For example, the following element:
 *
 * <a href="...">Read more [about The Best Gifts for Dog Moms]</a>
 *
 * Will be replaced with:
 *
 * <a href="...">
 *  Read more
 *  <span class="sr-only">about The Best Gifts for Dog Moms</span>
 * </a>
 * @param {HTMLElement} container Element whose descendent "a" tags will
 *  be modified.
 */
export function decorateScreenReaderOnly(container) {
  const srOnly = /\[(.*?)\]/g;
  [...container.querySelectorAll('a')]
    .forEach((el) => {
      if (el.innerHTML.match(srOnly)) {
        el.innerHTML = el.innerHTML.replace(srOnly, (text) => `<span class="sr-only">${text.slice(1, -1)}</span>`);
      }
    });
}

function createA11yQuickNav(links = []) {
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Skip to specific locations on the page');
  nav.classList.add('a11y-quicknav', 'sr-focusable');
  links.forEach((l) => {
    const button = document.createElement('button');
    button.setAttribute('aria-label', l.label);
    button.href = `#${l.id}`;
    button.innerHTML = l.label;
    button.addEventListener('click', (ev) => {
      ev.preventDefault();
      const el = document.getElementById(ev.currentTarget.href.split('#')[1]);
      el.setAttribute('tabindex', 0);
      el.focus();
      el.addEventListener('focusout', () => { el.setAttribute('tabindex', -1); }, { once: true });
    });
    nav.append(button);
  });
  document.body.prepend(nav);
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export async function decorateMain(main) {
  main.id = 'main';
  loadCategories(main);
  // hopefully forward compatible button decoration
  decorateButtons(main);
  await decorateIcons(main);
  await buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  decorateScreenReaderOnly(main);
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
  const main = doc.querySelector('main');
  if (templateModule?.loadLazy) {
    templateModule.loadLazy(main);
  }
  if (document.body.classList.contains('article-page')) {
    buildVideoEmbeds(main);
  }
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  await loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  await loadHeader(doc.querySelector('header'));
  const footer = doc.querySelector('footer');
  footer.id = 'footer';
  loadFooter(footer);

  // identify the first item in the menu
  const firstMenu = document.querySelector('.nav-wrapper .nav-sections ul li a');
  firstMenu.id = 'menu';

  createA11yQuickNav([
    { id: 'main', label: 'Skip to Content' },
    { id: 'menu', label: 'Skip to Menu' },
    { id: 'footer', label: 'Skip to Footer' },
  ]);

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

/**
 *
 * @param container - HTML parent element that contains the multiple <picture>
 *     tags to be used in building responsive image
 * @param breakpoints - Array of numbers to be used to define the breakpoints for the pictures.
 */
export function decorateResponsiveImages(container, breakpoints = [440, 768]) {
  const pictures = [...container.querySelectorAll('picture')];
  pictures.sort((p1, p2) => {
    const img1 = p1.querySelector('img');
    const img2 = p2.querySelector('img');
    return img1.width - img2.width;
  });
  const responsiveImage = createResponsiveImage(pictures, breakpoints);
  container.innerHTML = '';
  container.append(responsiveImage);
}

function getActiveSlide(block) {
  return {
    index: [...block.children].findIndex((child) => child.getAttribute('active') === 'true'),
    element: block.querySelector('[active="true"]'),
    totalSlides: [...block.children].length,
  };
}

export function slide(slideDirection, block, slideWrapper) {
  const currentActive = getActiveSlide(block);
  currentActive.element.removeAttribute('active');
  let newIndex;
  if (slideDirection === 'next') {
    if (currentActive.index === currentActive.totalSlides - 1) {
      newIndex = 0;
    } else {
      newIndex = currentActive.index + 1;
    }
  } else if (currentActive.index === 0) {
    newIndex = currentActive.totalSlides - 1;
  } else {
    newIndex = currentActive.index - 1;
  }
  block.children[newIndex].setAttribute('active', true);

  slideWrapper.setAttribute('style', `transform:translateX(-${newIndex}00vw)`);
}

export function initializeTouch(block, slideWrapper) {
  const slideContainer = block.closest('[class*="-container"]');
  let startX;
  let currentX;
  let diffX = 0;

  slideContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX;
  }, { passive: true });

  slideContainer.addEventListener('touchmove', (e) => {
    currentX = e.touches[0].pageX;
    diffX = currentX - startX;

    const { index } = getActiveSlide(block);
    slideWrapper.style.transform = `translateX(calc(-${index}00vw + ${diffX}px))`;
  }, { passive: true });

  slideContainer.addEventListener('touchend', () => {
    if (diffX > 50) {
      slide('prev', block, slideWrapper);
    } else if (diffX < -50) {
      slide('next', block, slideWrapper);
    } else {
      const { index } = getActiveSlide(block);
      slideWrapper.setAttribute('style', `transform:translateX(-${index}00vw)`);
    }
  }, { passive: true });
}

/**
 * @typedef CrumbData
 * @property {string} url Full URL to which clicking the crumb will redirect.
 * @property {string} path Name of the crumb as it will appear on its label.
 * @property {string} color Name of the color in which the breadcrumb should
 *  be rendered.
 */

/**
 * Creates an element that contains the structure for a given list of crumb information.
 * @param {Array<CrumbData>} crumbData Information about the crumbs to add.
 * @returns {Promise<Element>} Resolves with the crumb element.
 */
export async function createBreadCrumbs(crumbData) {
  const { color } = crumbData[crumbData.length - 1];
  const breadcrumbContainer = document.createElement('nav');
  breadcrumbContainer.setAttribute('aria-label', 'Breadcrumb');

  const ol = document.createElement('ol');
  ol.setAttribute('role', 'list');

  const homeLi = document.createElement('li');
  const homeLink = document.createElement('a');
  homeLink.href = '/';
  homeLink.innerHTML = '<span class="icon icon-home"></span>';
  homeLink.setAttribute('aria-label', 'Go to our Homepage');
  homeLi.append(homeLink);
  ol.append(homeLi);

  crumbData.forEach((crumb, i) => {
    const li = document.createElement('li');
    if (i > 0) {
      const chevron = document.createElement('span');
      chevron.innerHTML = '<span class="icon icon-chevron"></span>';
      li.append(chevron);
    }
    const linkButton = document.createElement('a');
    linkButton.href = crumb.url;
    linkButton.innerText = crumb.label;
    linkButton.classList.add('category-link-btn');
    if (i === crumbData.length - 1) {
      linkButton.setAttribute('aria-current', 'page');
      linkButton.style.setProperty('--bg-color', `var(--color-${color})`);
      linkButton.style.setProperty('--border-color', `var(--color-${color})`);
      linkButton.style.setProperty('--text-color', 'var(--text-color-inverted)');
    } else {
      linkButton.style.setProperty('--bg-color', 'var(--background-color)');
      linkButton.style.setProperty('--border-color', `var(--color-${color})`);
      linkButton.style.setProperty('--text-color', `var(--color-${color})`);
    }
    li.append(linkButton);
    ol.append(li);
  });

  breadcrumbContainer.append(ol);

  await decorateIcons(breadcrumbContainer);
  return breadcrumbContainer;
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed(document);
}

loadPage();
