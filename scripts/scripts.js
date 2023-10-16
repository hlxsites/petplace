import globRegex from './glob-regex/glob-regex.js';
import {
  sampleRUM,
  buildBlock,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlock,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlock,
  loadBlocks,
  loadCSS,
  loadHeader,
  getMetadata,
  toClassName,
  createOptimizedPicture,
} from './lib-franklin.js';
// eslint-disable-next-line import/no-cycle
import integrateMartech from './third-party.js';
import { handleDataLayerApproach } from './datalayer.js';

const NEWSLETTER_POPUP_KEY = 'petplace-newsletter-popup';
const NEWSLETTER_SIGNUP_KEY = 'petplace-newsletter-signedup';

const LCP_BLOCKS = ['slideshow', 'hero']; // add your LCP blocks to the list
let templateModule;
window.hlx.RUM_GENERATION = 'project-1'; // add your RUM generation information here
window.hlx.cache = {};

export const isMartechDisabled = new URLSearchParams(window.location.search).get('martech') === 'off';

/**
 * Loads a script src and provides a callback that fires after
 * the script has loaded.
 * @param {string} url Full value to use as the script's src attribute.
 * @param {function} callback Will be invoked once the script has loaded.
 * @param {*} attributes Simple object containing attribute keys and values
 *  to add to the script tag.
 * @returns Script tag representing the script.
 */
export function loadScript(url, callback, attributes) {
  const head = document.querySelector('head');
  if (!head.querySelector(`script[src="${url}"]`)) {
    const script = document.createElement('script');
    script.src = url;

    if (attributes) {
      Object.keys(attributes).forEach((key) => {
        script.setAttribute(key, attributes[key]);
      });
    }

    head.append(script);
    script.onload = callback;
    return script;
  }
  if (callback) callback();
  return head.querySelector(`script[src="${url}"]`);
}

/**
 * Load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

let queue = 0;
/**
 * Perform some metering on a repeated function call to reduce the chances to block the CPU/GPU
 * for too long.
 * @param {function} fn The function to execute repeatedly
 * @param {number} [wait] The delay to wait between batch executions, defaults to 200ms
 * @param {number} [max] The number of function executions to trigger on each pass, defaults to 5
 * @returns a promise that the functions were all called
 */
export async function meterCalls(fn, wait = 200, max = 5) {
  queue += 1;
  return new Promise((resolve) => {
    window.requestAnimationFrame(async () => {
      await fn.call(null);
      if (queue >= max) {
        queue -= max;
        setTimeout(() => resolve(), wait);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Generates a random identifier.
 *
 * @param {string} [prefix] Optional prefix to use for the identifier
 * @returns a string representation of a random identifier
 */
export function getId(prefix = 'hlx') {
  return `${prefix}-${Math.random().toString(32).substring(2)}`;
}

/**
 * A generic helper function that checks if we are in a mobile context based on viewport size
 * @returns true if we are on a mobile, and false otherwise
 */
export function isMobile() {
  return window.innerWidth < 600;
}

/**
 * A generic helper function that checks if we are in a tablet context based on viewport size
 * @returns true if we are on a tablet, and false otherwise
 */
export function isTablet() {
  return window.innerWidth < 1024;
}

/**
 * Fetches the desired json file and cache it to avoid repeated calls.
 * @param {string} url The json file to fetch
 * @returns an array of obejects contained in the json file
 */
export async function fetchAndCacheJson(url) {
  const key = url.split('/').pop().split('.')[0];
  if (window.hlx.cache[key]) {
    return window.hlx.cache[key];
  }
  try {
    const response = await fetch(url);
    const json = await response.json();
    window.hlx.cache[key] = json.data;
    return window.hlx.cache[key];
  } catch (err) {
    return [];
  }
}

/**
 * Returns the categories for the articles.
 * @returns a promise returning an array of categories
 */
export async function getCategories() {
  return fetchAndCacheJson('/article/category/categories.json');
}

/**
 * Gets the category given its name or slug.
 * @param {string} name The category name or slug
 * @returns the category for the given name or slug, or null
 */
export async function getCategory(name) {
  const categories = await getCategories();
  const standardizedName = toClassName(name);
  return categories.find((c) => c.Slug === standardizedName
    || toClassName(c.Category) === standardizedName);
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
    ], 'low');
    heroPics.pictures.push(optimized);
    heroPics.pictureParent = picture.parentElement;
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

/**
 * Creates a responsive picture tag from several different images for different breakpoints.
 * @param {HTMLPictureElement[]} pictures the picture elements to add to the responsive image
 * @param {object[]} breakpoint an array of breakpoints to use for the responsive image
 * @param {string} [quality] the quality to use on the images, defaults to 'medium'
 *                           (one of 'low', 'medium' or 'high')
 * @returns a HTMLPictureElement tag that is composed of the different source images and
 * provided breakpoints
 */
function createResponsiveImage(pictures, breakpoint, quality = 'medium') {
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
    srcElemBackup.srcset = srcElemBackup.srcset
      .replace('format=webply', 'format=png')
      .replace('quality=medium', `quality=${quality}`);
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
 * Replaces several immediate sibling images by a responsive picture element.
 * @param container - HTML parent element that contains the multiple <picture>
 *     tags to be used in building responsive image
 * @param breakpoints - Array of numbers to be used to define the breakpoints for the pictures.
 */
export function decorateResponsiveImages(container, breakpoints = [440, 768]) {
  const img = container.querySelector('img');
  const pictures = [...container.querySelectorAll('picture')];
  pictures.sort((p1, p2) => {
    const img1 = p1.querySelector('img');
    const img2 = p2.querySelector('img');
    return img1.width - img2.width;
  });
  const responsiveImage = pictures.length > 1
    ? createResponsiveImage(pictures, breakpoints)
    : createOptimizedPicture(img.src, img.alt, false, [
      { media: '(min-width: 1200px)', width: 1600 },
      { media: '(min-width: 600px)', width: 800 },
      { width: 440 },
    ]);
  container.innerHTML = '';
  container.append(responsiveImage);
}

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
async function buildHeroBlock(main) {
  const excludedPages = ['home-page', 'breed-index', 'searchresults', 'article-signup'];
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
      pictureParent,
    } = getResponsiveHeroPictures(main, h1);
    if (!pictures.length) {
      return;
    }
    const responsive = createResponsiveImage(pictures, breakpoints, 'low');
    if (main.querySelector('.hero')) {
      // hero block has been explicitly added to the page. put the responsive
      // pictures back to where they were originally
      pictureParent.append(responsive);
      pictureParent.classList.add('hero-picture-container');
      return;
    }
    const section = document.createElement('div');
    if (bodyClass.includes('breed-page') || bodyClass.includes('author-page')) {
      section.append(buildBlock('hero', { elems: [responsive] }));
    } else {
      section.append(buildBlock('hero', { elems: [responsive, h1] }));
    }
    main.prepend(section);
  }
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
            window.location.replace('/404.html');
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
 * Builds embed block for inline links to known social platforms.
 * @param {Element} main The container element
 */
function buildEmbedBlocks(main) {
  const HOSTNAMES = [
    'youtube',
    'youtu',
  ];
  [...main.querySelectorAll(':is(p, div) > a[href]:only-child')]
    .filter((a) => HOSTNAMES.includes(new URL(a.href).hostname.split('.').slice(-2, -1).pop()))
    .forEach((a) => {
      const parent = a.parentElement;
      const block = buildBlock('embed', { elems: [a] });
      parent.replaceWith(block);
      decorateBlock(block);
    });
}

/**
 * Builds hyperlinked images from picture tags followed by a link.
 * @param {Element} main The container element
 */
function buildHyperlinkedImages(main) {
  [...main.querySelectorAll('picture')]
    .filter((picture) => {
      const parent = picture.parentElement;
      const a = parent.nextElementSibling?.querySelector('a[href]');
      try {
        return parent.childElementCount === 1 && a
          && new URL(a.href).pathname === new URL(a.textContent).pathname;
      } catch (err) {
        return false;
      }
    })
    .forEach((picture) => {
      const parent = picture.parentElement;
      const a = parent.nextElementSibling.querySelector('a[href]');
      a.className = '';
      a.innerHTML = '';
      a.append(picture);
      a.parentElement.classList.toggle('button-container', false);
      parent.remove();
    });
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
async function buildAutoBlocks(main) {
  try {
    await buildHeroBlock(main);
    await buildEmbedBlocks(main);
    await buildHyperlinkedImages(main);
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
        if (el.title) {
          el.title = el.title.replace(srOnly, (text) => text.slice(1, -1));
        }
      }
    });
}

/**
 * Adds hidden quick navigation links to improve accessibility.
 * @param {object[]} links a map of links (label and id for the element to jump to)
 */
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
 * Decorates sections with a background image based on the metadata that are set on it.
 * @param {HTMLElement} main The container to apply this to
 */
function decorateSectionsWithBackgroundImage(main) {
  main.querySelectorAll('.section[data-background]').forEach((el) => {
    const div = document.createElement('div');
    const desktopImage = el.dataset.background;
    const desktopImageHighRes = desktopImage.replace('width=750', `width=${window.innerWidth}`);
    const mobileImage = el.dataset.mobileBackground;
    div.classList.add('section-background');
    div.isMobile = window.innerWidth < 900;
    div.style.backgroundImage = `url(${
      div.isMobile ? (mobileImage || desktopImage) : desktopImageHighRes
    })`;
    el.append(div);
    window.addEventListener('resize', () => {
      if (div.isMobile === window.innerWidth < 900) {
        return;
      }
      div.isMobile = window.innerWidth < 900;
      div.style.backgroundImage = `url(${
        div.isMobile ? (mobileImage || desktopImage) : desktopImageHighRes
      })`;
    }, { passive: true });
  });
}

/**
 * Standardizes how the browser navigates when clicking links.
 */
function standardizeLinkNavigation() {
  document.querySelectorAll('a[href]').forEach((a) => {
    let url;
    try {
      url = new URL(a.href);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Invalid link', err);
      return;
    }
    // External links always open in a new tab
    if (url.hostname !== window.location.hostname) {
      a.setAttribute('target', '_blank');
      return;
    }
    // Links in the article bodies should also open in a new tab
    if (document.body.classList.contains('article-page') && a.closest('main')) {
      a.setAttribute('target', '_blank');
    }
  });
}

/**
 * Animate the skeleton placeholders in the given container.
 * @param {HTMLElement} main the container this applies to
 */
function animateSkeletons(main) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('is-animated', entry.isIntersecting);
    });
  });
  const observer1 = new MutationObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.type === 'childList' && !entry.addedNodes.length) {
        return;
      }
      if (entry.type === 'attributes' && entry.attributeName !== 'class') {
        return;
      }
      if (entry.addedNodes.length) {
        [...entry.addedNodes]
          .filter((el) => el.classList?.contains('skeleton'))
          .forEach((el) => {
            observer.observe(el);
          });
      } else if (entry.target.classList?.contains('skeleton')) {
        observer.observe(entry.target);
      }
    });
  });
  observer1.observe(main, { attributes: true, childList: true, subtree: true });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
export async function decorateMain(main) {
  main.id = 'main';
  decorateButtons(main);
  await decorateIcons(main);
  await buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  decorateScreenReaderOnly(main);
  decorateSectionsWithBackgroundImage(main);
  standardizeLinkNavigation();
}

function fixLinks() {
  const links = document.querySelectorAll('a');

  links.forEach((link) => {
    const href = link.getAttribute('href');
    // handle href not starting with '/'
    //   e.g. /article/... is a valid link
    //   e.g. http://article/... is an invalid link
    if (!href.startsWith('/')) {
      try {
        const url = new URL(href);
        // If the hostname doesn't contain '.', it's likely broken
        if (url.protocol.startsWith('http') && !url.hostname.includes('.')) {
          // log the broken link
          sampleRUM('fix-links-in-article', { source: window.location.href, target: href });
          // Fix the link by making it absolute
          // Suppose the common broken link is article/...., the article/ is read as hostname,
          // which should be added back as pathname
          link.setAttribute('href', `${window.location.origin}/${url.hostname}${url.pathname}`);
        }
      } catch (e) {
        // Do nothing here, keep the link as-is
      }
    }
  });
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
    if (!document.title.match(/[-|] Petplace(\.com)?$/i)) {
      document.title += ' | PetPlace.com';
    }
    await decorateMain(main);
    fixLinks();
    document.body.classList.add('appear');
    await waitForLCP(LCP_BLOCKS);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (!isMobile() || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
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

function initPartytown() {
  window.partytown = {
    lib: '/scripts/partytown/',
    forward: ['dataLayer.push'],
  };
  import('./partytown/partytown.js');
}

/**
 * A helper that will load resources in an optimal way.
 *
 * @param {Promise[]} promises an array of promises
 * @returns a promise that all resources have been loaded
 */
async function optimizedBatchLoading(promises) {
  if (isMobile()) {
    return promises.reduce(
      (sequence, promise) => sequence.then(() => promise()),
      Promise.resolve(),
    );
  }
  return Promise.all(promises.map((promise) => promise()));
}

export async function createNewsletterAutoBlock(fragmentUrl, addElement) {
  const res = await fetch(fragmentUrl);
  const text = await res.text();

  const fragmentHtml = document.createElement('div');
  fragmentHtml.innerHTML = text;
  const blockElements = fragmentHtml.querySelector('.newsletter-signup > div > div');
  const newsletterBlock = buildBlock('newsletter-signup', { elems: [...blockElements.children] });
  addElement(newsletterBlock);
  decorateBlock(newsletterBlock);
  return newsletterBlock;
}

async function loadNewsletter(footer) {
  const newsletterBlock = await createNewsletterAutoBlock('/fragments/newsletter-footer', (block) => {
    footer.insertBefore(block, footer.children[0]);
  });
  newsletterBlock.classList.add('horizontal');
  return loadBlock(newsletterBlock);
}

/**
 * Retrieves a value indicating whether the user has already signed up
 * for the newsletter.
 * @returns {boolean} True if the user has already signed up, false
 *  otherwise.
 */
export function isNewsletterSignedUp() {
  return !!localStorage.getItem(NEWSLETTER_SIGNUP_KEY);
}

async function loadNewsletterPopup(footer) {
  if (isNewsletterSignedUp()) {
    return;
  }
  if (localStorage.getItem(NEWSLETTER_POPUP_KEY)) {
    return;
  }
  localStorage.setItem(NEWSLETTER_POPUP_KEY, 'true');
  const popupContainer = document.createElement('div');
  const newsletterBlock = await createNewsletterAutoBlock('/fragments/newsletter-popup', (block) => {
    popupContainer.append(block);
  });
  await loadBlock(newsletterBlock);

  const popupBlock = buildBlock('popup', popupContainer);
  footer.append(popupBlock);
  decorateBlock(popupBlock);
  await loadBlock(popupBlock);
}

/**
 * Sets the value indicating that the user has signed up for
 * the newsletter.
 */
export function setNewsletterSignedUp() {
  localStorage.setItem(NEWSLETTER_SIGNUP_KEY, 'true');
}

/**
 * Loads configuration values from the site's configuration.xlsx file.
 * @param {string} sheet The name of the sheet whose configuration should
 *  be loaded.
 * @returns {Promise<Array<*>|undefined>} Resolves with the array of
 *  configuration values from the specified sheet. Will be undefined
 *  if the configuration could not be found.
 */
export async function getConfiguration(sheet) {
  try {
    const res = await fetch(`/configuration.json?sheet=${sheet}`);
    if (!res.ok) {
      return undefined;
    }
    const json = await res.json();
    return json.data;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`Unable to load ${sheet} configuration`);
  }
  return undefined;
}

async function addNewsletterPopup() {
  const newsletterConfig = await getConfiguration('newsletter-popup');
  if (!newsletterConfig) {
    return;
  }
  const delay = newsletterConfig
    .find((item) => item.Key === 'delay-seconds');
  const seconds = delay ? Number(delay.Value) : 10;
  const excluded = newsletterConfig.filter((item) => {
    if (item.Key !== 'exclude-pattern') {
      return false;
    }
    const regexp = globRegex(item.Value);
    return regexp.test(window.location.pathname);
  });
  if (excluded.length) {
    return;
  }
  window.setTimeout(() => {
    loadNewsletterPopup(document.querySelector('footer'));
  }, seconds * 1000);

  document.body.addEventListener('mouseleave', () => loadNewsletterPopup(document.querySelector('footer')));
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');

  const context = { getMetadata, toClassName };
  // eslint-disable-next-line import/no-relative-packages
  const { initConversionTracking } = await import('../plugins/rum-conversion/src/index.js');
  await initConversionTracking.call(context, document);

  animateSkeletons(main);
  if (templateModule?.loadLazy) {
    templateModule.loadLazy(main);
  }
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  await optimizedBatchLoading([
    () => loadFonts(),
    () => loadHeader(doc.querySelector('header')),
    () => loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`),
  ]);

  const footer = doc.querySelector('footer');
  loadFooter(footer);

  const FOOTER_SPACING = 'footer-top-spacing';
  footer.id = 'footer';
  footer.classList.add(FOOTER_SPACING);
  if (!isNewsletterSignedUp() && getMetadata('show-newsletter-footer').toLowerCase() !== 'false') {
    loadNewsletter(footer);
    footer.classList.remove(FOOTER_SPACING);
  }

  // identify the first item in the menu
  const firstMenu = document.querySelector('.nav-wrapper .nav-sections ul li a');
  firstMenu.id = 'menu';

  // Add hidden quick navigation links
  createA11yQuickNav([
    { id: 'main', label: 'Skip to Content' },
    { id: 'menu', label: 'Skip to Menu' },
    { id: 'footer', label: 'Skip to Footer' },
  ]);

  addFavIcon(`${window.hlx.codeBasePath}/styles/favicon.svg`);
  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));

  const usp = new URLSearchParams(window.location.search);
  const utmParams = [...usp.entries()]
    .filter(([key]) => key.startsWith('utm_') && key !== 'utm_id');
  utmParams.forEach(([key, value]) => {
    sampleRUM('utm-campaign', { source: key, target: value });
  });

  if (!isMartechDisabled) {
    integrateMartech();
    initPartytown();
  }

  addNewsletterPopup();
  handleDataLayerApproach();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed(doc) {
  // load anything that can be postponed to the latest here
  window.setTimeout(() => {
    if (templateModule?.loadDelayed) {
      templateModule.loadDelayed(doc);
    }
    // eslint-disable-next-line import/no-cycle
    return import('./delayed.js');
  }, 3000);
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
export async function createBreadCrumbs(crumbData, chevronAll = false) {
  const { color } = crumbData[crumbData.length - 1];
  const breadcrumbContainer = document.createElement('nav');
  breadcrumbContainer.setAttribute('aria-label', 'Breadcrumb');

  const ol = document.createElement('ol');

  const homeLi = document.createElement('li');
  const homeLink = document.createElement('a');
  homeLink.href = '/';
  homeLink.innerHTML = '<span class="icon icon-home"></span>';
  homeLink.setAttribute('aria-label', 'Go to our Homepage');
  homeLi.append(homeLink);
  ol.append(homeLi);

  crumbData.forEach((crumb, i) => {
    const li = document.createElement('li');
    if (i > 0 || chevronAll) {
      const chevron = document.createElement('span');
      chevron.classList.add('icon', 'icon-chevron');
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

/**
 * Logs the information about an error encountered by the site.
 * @param {string} source Description of the source that generated the error.
 * @param {Error} e Error information to log.
 */
export async function captureError(source, e) {
  sampleRUM('error', { source, target: e.message });
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed(document);
}

// Initialize the data layer and mark the Google Tag Manager start event
window.dataLayer ||= [];
window.dataLayer.push({
  'gtm.start': Date.now(),
  event: 'gtm.js',
});

loadPage();
