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
} from './lib-franklin.js';

const LCP_BLOCKS = []; // add your LCP blocks to the list
window.hlx.RUM_GENERATION = 'project-1'; // add your RUM generation information here

async function loadScript(path, options = {}) {
  const script = document.createElement('script');
  if (options.async) {
    script.async = true;
  }
  if (options.defer) {
    script.defer = true;
  }
  script.src = path;
  document.head.appendChild(script);
  return new Promise((resolve, reject) => {
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);
  });
}

async function loadAccessibeWidget() {
  await loadScript('https://acsbapp.com/apps/app/dist/js/app.js', { async: true });
  const HIGHLIGHT_COLOR = '#FF7D5A';
  window.acsbJS.init({
    statementLink: '',
    footerHtml: '',
    hideMobile: false,
    hideTrigger: false,
    language: 'en',
    position: 'right',
    leadColor: HIGHLIGHT_COLOR,
    triggerColor: HIGHLIGHT_COLOR,
    triggerRadius: '50%',
    triggerPositionX: 'right',
    triggerPositionY: 'bottom',
    triggerIcon: 'wheels',
    triggerSize: 'medium',
    triggerOffsetX: 20,
    triggerOffsetY: 20,
    mobile: {
      triggerSize: 'small',
      triggerPositionX: 'right',
      triggerPositionY: 'bottom',
      triggerOffsetX: 10,
      triggerOffsetY: 10,
      triggerRadius: '50%',
    },
  });
}

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
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
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
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
    decorateMain(main);
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
  if (window.location.hostname === 'www.petplace.com') {
    loadAccessibeWidget();
  }
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
