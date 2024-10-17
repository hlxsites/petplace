import {
  buildBlock,
  createOptimizedPicture,
  decorateBlock,
  decorateBlocks,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateTemplateAndTheme,
  fetchPlaceholders,
  getAllMetadata,
  getMetadata,
  loadBlock,
  loadBlocks,
  loadCSS,
  loadFooter,
  loadHeader,
  sampleRUM,
  toClassName,
  waitForLCP,
} from './lib-franklin.js';

export const PREFERRED_REGION_KEY = 'petplace-preferred-region';
const NEWSLETTER_POPUP_KEY = 'petplace-newsletter-popup';
const NEWSLETTER_SIGNUP_KEY = 'petplace-newsletter-signedup';

const LCP_BLOCKS = ['slideshow', 'hero']; // add your LCP blocks to the list
window.hlx.RUM_GENERATION = 'project-1'; // add your RUM generation information here
window.hlx.cache = {};

// Define the custom audiences mapping for experience decisioning
const AUDIENCES = {
  mobile: () => window.innerWidth < 600,
  desktop: () => window.innerWidth >= 600,
};

export const DEFAULT_REGION = 'en-US';
export const ACTIVE_REGIONS = ['en-US'];
export const REGIONS = {
  // Africa:
  en_GH: ['ACC'],
  en_ZA: ['CPT', 'JNB'],
  // North America:
  en_CA: ['YUL', 'YVR', 'YYC', 'YYZ'],
  en_US: ['ADS', 'BFI', 'BOS', 'BUR', 'CHI', 'CMH', 'DCA', 'DEN', 'DFW', 'DTW', 'EWR', 'GNV', 'HNL', 'IAD', 'IAH', 'LAX', 'LCK', 'LGA', 'MCI', 'MIA', 'MSP', 'NYC', 'PAO', 'PDK', 'PDX', 'PHX', 'SJC', 'STL', 'STP', 'WVI'],
  // South America:
  es_AR: ['EZE'],
  es_BR: ['CWB', 'FOR', 'GIG', 'GRU'],
  es_CL: ['SCL'],
  es_CO: ['BOG'],
  es_PE: ['LIM'],
  // Asia:
  ko_KR: ['ICN'],
  ar_AE: ['DXB', 'FJR'],
  en_PH: ['MNL'],
  en_SG: ['QPG'],
  en_IN: ['BOM', 'CCU', 'DEL', 'HYD', 'MAA'],
  ja_JP: ['HND', 'ITM', 'NRT', 'TYO'],
  ms_MY: ['KUL'],
  th_TH: ['BKK'],
  zh_HK: ['HKG'],
  // Europe:
  bg_BG: ['SOF'],
  da_DK: ['CPH'],
  de_AT: ['VIE'],
  de_DE: ['FRA', 'MUC', 'WIE'],
  en_GB: ['LCY', 'LHR', 'LON', 'MAN'],
  es_ES: ['MAD'],
  fi_FI: ['HEL'],
  fr_BE: ['BRU'],
  fr_FR: ['PAR', 'MRS'],
  ga_IE: ['DUB'],
  it_IT: ['FCO', 'LIN', 'MXP', 'PMO'],
  nl_NL: ['AMS'],
  pt_PT: ['LIS'],
  sv_SE: ['BMA', 'OSL'],
  // Oceania:
  en_AU: ['ADL', 'BNE', 'MEL', 'PER', 'SYD'],
  en_NZ: ['AKL', 'CHC', 'WLG'],
};

window.hlx.templates.add([
  '/templates/about-us',
  '/templates/account-activation/',
  '/templates/adopt',
  '/templates/adoption-landing-page',
  '/templates/article-page',
  '/templates/article-signup',
  '/templates/ask-author-page',
  '/templates/author-index',
  '/templates/author-page',
  '/templates/bytetag',
  '/templates/breed-index',
  '/templates/breed-page',
  '/templates/category-index',
  '/templates/gen-ai',
  '/templates/home-page/',
  '/templates/insurance-landing-page',
  '/templates/insurance-page',
  '/templates/insurance-paid-page',
  '/templates/puppy-diaries-index',
  '/templates/remove-default-markup',
  '/templates/searchresults',
  '/templates/tag-index',
  '/templates/travel-guide-page',
  '/templates/traveling-page',
  '/templates/write-for-us',
]);

const consentConfig = JSON.parse(localStorage.getItem('aem-consent') || 'null');

window.hlx.plugins.add('experimentation', {
  url: '/plugins/experimentation/src/index.js',
  condition: () => getMetadata('experiment')
    || Object.keys(getAllMetadata('campaign')).length
    || Object.keys(getAllMetadata('audience')).length,
  load: 'eager',
  options: {
    audiences: AUDIENCES,
    prodHost: 'www.petplace.com',
    storage: consentConfig && consentConfig.categories.includes('CC_ANALYTICS')
      ? window.localStorage : window.SessionStorage,
  },
});

window.hlx.plugins.add('martech', {
  url: './third-party.js',
  condition: () => new URLSearchParams(window.location.search).get('martech') !== 'off',
  load: 'lazy',
});

window.hlx.plugins.add('rum-conversion', {
  url: '/plugins/rum-conversion/src/index.js',
  load: 'lazy',
});

// eslint-disable-next-line prefer-rest-params
function gtag() { window.dataLayer.push(arguments); }

/**
 * Logs the information about an error encountered by the site.
 * @param {string} source Description of the source that generated the error.
 * @param {Error} e Error information to log.
 */
export async function captureError(source, e) {
  sampleRUM('error', { source, target: e.message });
}

// checks against Fastly pop locations: https://www.fastly.com/documentation/guides/concepts/pop/
export async function getRegion() {
  const resp = await fetch(window.location.href, { method: 'HEAD' });
  const locations = resp.headers.get('X-Served-By').split(',');
  const pops = locations.map((l) => l.split('-').pop());
  return Object.entries(REGIONS)
    .find(([, values]) => pops.some((loc) => values.includes(loc)))?.[0] || DEFAULT_REGION;
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

/**
 * Triggers the callback when the page is actually activated,
 * This is to properly handle speculative page prerendering and marketing events.
 * @param {Function} cb The callback to run
 */
export async function onPageActivation(cb) {
  // Speculative prerender-aware execution.
  // See: https://developer.mozilla.org/en-US/docs/Web/API/Speculation_Rules_API#unsafe_prerendering
  if (document.prerendering) {
    document.addEventListener('prerenderingchange', cb, { once: true });
  } else {
    cb();
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
  const subkey = url.split('/').pop().split('.')[0];
  const key = `${window.hlx.contentBasePath}/${subkey}`;
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
  return fetchAndCacheJson(`${window.hlx.contentBasePath}/article/category/categories.json`);
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
  const excludedPages = ['home-page', 'breed-index', 'searchresults', 'article-signup', 'adopt', 'article-page', 'insurance-paid-page'];
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

function buildCookieConsent(main) {
  // do not initialize consent logic twice
  if (window.hlx.consent) {
    return;
  }
  // US region does not need the cookie consent logic
  if (document.documentElement.lang === 'en-US') {
    gtag('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted',
    });
    window.clarity('consent');
    return;
  }
  const updateConsentHandler = (ev) => {
    gtag('consent', 'update', {
      ad_storage: ev.detail.categories.includes('CC_TARGETING') ? 'granted' : 'denied',
      ad_user_data: ev.detail.categories.includes('CC_TARGETING') ? 'granted' : 'denied',
      ad_personalization: ev.detail.categories.includes('CC_TARGETING') ? 'granted' : 'denied',
      analytics_storage: ev.detail.categories.includes('CC_ANALYTICS') ? 'granted' : 'denied',
    });
    window.clarity('consent', ev.detail.categories.includes('CC_ANALYTICS'));
  };
  window.addEventListener('consent', updateConsentHandler);
  window.addEventListener('consent-updated', updateConsentHandler);

  const ccPath = `${window.hlx.contentBasePath}/fragments/cookie-consent`;
  window.hlx.consent = { status: 'pending' };
  const blockHTML = `<div>${ccPath}</div>`;
  const section = document.createElement('div');
  const ccBlock = document.createElement('div');
  ccBlock.innerHTML = blockHTML;
  section.append(buildBlock('cookie-consent', ccBlock));
  main.append(section);
}

function fixHyperLinks(main) {
  // We only want to fix links on 'en' pages that are not the default US
  if (!window.hlx.contentBasePath || !document.documentElement.lang.startsWith('en-')) {
    return;
  }
  [...main.querySelectorAll('a[href]')]
    .filter((a) => !a.href.startsWith(window.hlx.contentBasePath))
    .forEach(async (a) => {
      const { pathname } = new URL(a.href);
      if (pathname.startsWith(window.hlx.contentBasePath)) {
        return;
      }
      const newURL = `${window.hlx.contentBasePath}${pathname}`;
      // If the localized version of the page exists, let's point to it instead of the US page
      const resp = await fetch(newURL, { method: 'HEAD' });
      if (resp.ok) {
        a.href = newURL;
      }
    });
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
    buildEmbedBlocks(main);
    buildHyperlinkedImages(main);
    buildCookieConsent(main);
    fixHyperLinks(main);
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
 * Gets the value of a placeholder.
 * @param {string} key The key of the placeholder to retrieve
 * @param {Object} options The template strings to use
 * @returns the desired placeholder string, or throws an error if not found
 */
export function getPlaceholder(key, options = {}) {
  if (!window.placeholders) {
    throw new Error('Please load placeholders first using "fetchPlaceholders".');
  }
  const placeholders = window.placeholders[window.hlx.contentBasePath || 'default'];
  if (!placeholders[key]) {
    throw new Error(`Placeholder "${key}" not found`);
  }
  return Object.entries(options).reduce((str, [k, v]) => str.replace(`{{${k}}}`, v), placeholders[key]);
}

/**
 * Adds hidden quick navigation links to improve accessibility.
 * @param {Object[]} links a map of links (label and id for the element to jump to)
 */
function createA11yQuickNav(links = []) {
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', getPlaceholder('accessibilityNavigationLabel'));
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
        [...entry.addedNodes]
          .map((el) => (el.querySelectorAll ? [...el.querySelectorAll('.skeleton')] : []))
          .flat()
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
export function decorateMain(main) {
  main.id = 'main';
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
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

function setLocale() {
  const [, lang = 'en', region = 'US'] = window.location.pathname.split('/')[1].match(/^(\w{2})-(\w{2})$/i) || [];
  const locale = `${lang.toLowerCase()}-${region.toUpperCase()}`;
  document.documentElement.lang = locale;
  window.hlx.contentBasePath = locale === DEFAULT_REGION ? '' : `/${locale.toLowerCase()}`;
}

function redirectToPreferredRegion() {
  const preferredRegion = localStorage.getItem(PREFERRED_REGION_KEY);
  if (!preferredRegion) {
    return;
  }
  if (preferredRegion === 'en-GB' && window.hlx.contentBasePath !== '/en-gb') {
    window.location = '/en-gb/';
  } else if (preferredRegion === 'us' && window.hlx.contentBasePath) {
    window.location = '/';
  }
}

let placeholdersPromise;

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  decorateTemplateAndTheme();

  await placeholdersPromise;
  await window.hlx.plugins.run('loadEager');

  const main = doc.querySelector('main');
  if (main) {
    // await decorateTemplate(main);
    if (!document.title.match(/[-|] Petplace(\.com)?$/i)) {
      document.title += ` | ${getPlaceholder('websiteName')}`;
    }
    decorateMain(main);
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

async function addRegionSelectorPopup() {
  const region = await getRegion();
  window.hlx.region = region;

  const span = document.createElement('div');
  span.textContent = getPlaceholder('changeRegion');

  const dialogContent = document.createElement('div');

  const regionSelector = buildBlock('region-selector', [[]]);
  dialogContent.append(regionSelector);
  decorateBlock(regionSelector);
  await loadBlock(regionSelector);

  const dialog = buildBlock('popup', [[span], [dialogContent]]);

  const li = document.createElement('li');
  li.append(dialog);
  document.querySelector('footer .footer-legal ul').append(li);
  decorateBlock(dialog);
  await loadBlock(dialog);
  const popup = document.querySelector('.popup');
  if (!localStorage.getItem(PREFERRED_REGION_KEY)) {
    if (window.hlx.contentBasePath === '/en-gb' && region !== 'en-GB') {
      popup.querySelector('hlx-aria-dialog').open();
    } else if (!window.hlx.contentBasePath && region !== 'en-US') {
      popup.querySelector('hlx-aria-dialog').open();
    }
    popup.querySelector('hlx-aria-dialog .primary').focus();
  }
  popup.addEventListener('click', (ev) => {
    if (!ev.target.closest('.button')) {
      return;
    }
    localStorage.setItem(PREFERRED_REGION_KEY, ev.target.getAttribute('hreflang'));
  });
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
  const isNoMarkupTemplate = document.body.classList.contains('remove-default-markup');
  if (isNoMarkupTemplate) return null;

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
  const newsletterBlock = await createNewsletterAutoBlock(`${window.hlx.contentBasePath}/fragments/newsletter-footer`, (block) => {
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
  const newsletterBlock = await createNewsletterAutoBlock(
    `${window.hlx.contentBasePath}/fragments/newsletter-popup`,
    (block) => {
      popupContainer.append(block);
    },
  );
  await loadBlock(newsletterBlock);

  const popupBlock = buildBlock('popup', popupContainer);
  footer.append(popupBlock);
  decorateBlock(popupBlock);
  await loadBlock(popupBlock);

  const dialog = footer.querySelector('hlx-aria-dialog');
  const closeBtn = dialog.children[1].children[0].children[0];
  closeBtn.className = 'popup-close';

  const nlBlock = dialog.querySelector('.newsletter-signup div');
  const heading = document.createElement('div');
  heading.appendChild(closeBtn);
  heading.appendChild(nlBlock.querySelector('h2'));
  nlBlock.firstElementChild.prepend(heading);
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
  const [globRegex, newsletterConfig] = await Promise.all([
    import('./glob-regex/glob-regex.js'),
    await getConfiguration('newsletter-popup'),
  ]);

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
    const regexp = globRegex.default(item.Value);
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

  animateSkeletons(main);
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
  loadFooter(footer).then(() => {
    decorateScreenReaderOnly(footer);
    // FIXME: remove conditional on UK website go-live
    if (window.hlx.contentBasePath) {
      addRegionSelectorPopup();
    }
  });

  const FOOTER_SPACING = 'footer-top-spacing';
  footer.id = 'footer';
  footer.classList.add(FOOTER_SPACING);
  if (!isNewsletterSignedUp() && getMetadata('show-newsletter-footer').toLowerCase() !== 'false') {
    await loadNewsletter(footer);
    footer.classList.remove(FOOTER_SPACING);
  }

  // identify the first item in the menu
  // const firstMenu = document.querySelector('.nav-wrapper .nav-sections ul li a');
  // firstMenu.id = 'menu';

  // Add hidden quick navigation links
  createA11yQuickNav([
    { id: 'main', label: getPlaceholder('skipMain') },
    { id: 'menu', label: getPlaceholder('skipMenu') },
    { id: 'footer', label: getPlaceholder('skipFooter') },
  ]);

  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
  sampleRUM('variant', { source: 'page-language', target: document.documentElement.lang });
  sampleRUM('variant', { source: 'preferred-languages', target: navigator.languages.join(',') });
  getRegion().then((region) => sampleRUM('variant', { source: 'user-region', target: region }));

  await window.hlx.plugins.run('loadLazy');

  if (!window.hlx.contentBasePath) {
    await addNewsletterPopup();
  }

  const { handleDataLayerApproach } = await import('./datalayer.js');
  handleDataLayerApproach();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // load anything that can be postponed to the latest here
  window.setTimeout(() => {
    window.hlx.plugins.load('delayed');
    window.hlx.plugins.run('loadDelayed');
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
export async function createBreadCrumbs(crumbData, options = {}) {
  const { chevronAll = false, chevronIcon = 'chevron', useHomeLabel = false } = options;
  const { color } = crumbData[crumbData.length - 1];
  const breadcrumbContainer = document.createElement('nav');
  breadcrumbContainer.setAttribute('aria-label', getPlaceholder('breadcrumb'));

  const ol = document.createElement('ol');

  const homeLi = document.createElement('li');
  const homeLink = document.createElement('a');
  homeLink.href = window.hlx.contentBasePath || '/';
  if (useHomeLabel) {
    homeLink.innerText = getPlaceholder('homeNavigation');
    homeLink.classList.add('category-link-btn');
    homeLink.style.setProperty('--bg-color', 'var(--background-color)');
    homeLink.style.setProperty('--border-color', `var(--color-${color})`);
    homeLink.style.setProperty('--text-color', `var(--color-${color})`);
  } else {
    homeLink.innerHTML = '<span class="icon icon-home"></span>';
    homeLink.setAttribute('aria-label', getPlaceholder('logoLinkLabel'));
  }
  homeLi.append(homeLink);
  ol.append(homeLi);

  crumbData.forEach((crumb, i) => {
    const li = document.createElement('li');
    if (i > 0 || chevronAll) {
      const chevron = document.createElement('span');
      chevron.classList.add('icon', `icon-${chevronIcon}`);
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
  setLocale();
  redirectToPreferredRegion();

  placeholdersPromise = fetchPlaceholders(window.hlx.contentBasePath || 'default');

  window.dataLayer ||= {};
  gtag('js', new Date());
  gtag('config', 'GT-KD23TWW');
  gtag('config', 'G-V3CZKM4K6N');
  gtag('config', 'AW-11334653569');

  await window.hlx.plugins.load('eager');
  await loadEager(document);
  await window.hlx.plugins.load('lazy');
  await loadLazy(document);
  loadDelayed(document);
}

loadPage();
