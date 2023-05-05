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

function getId() {
  return Math.random().toString(32).substring(2);
}

function isMobile() {
  return window.innerWidth < 1200;
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
function buildHeroBlock(main) {
  const excludedPages = ['home-page'];
  const bodyClass = document.querySelector('body').className;
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
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

/**
 * Builds toc autoblock and prepends to first H2 in the document.
 * @param {Element} main The container element
 */
function buildTOCBlock(main) {
  const tocDiv = document.createElement('div');
  const allH2s = main.getElementsByTagName('h2');
  const tocHeader = document.createElement('h2');
  const tocList = document.createElement('ol');
  tocHeader.innerText = 'Table of Contents';
  tocDiv.appendChild(tocHeader);
  if (allH2s.length > 1) {
    for (let index = 0; index < allH2s.length; index += 1) {
      const tagname = 'h'.concat(index);
      allH2s[index].id = tagname;
      const tocListItem = document.createElement('li');
      const tocEntry = document.createElement('a');
      tocEntry.setAttribute('href', '#'.concat(tagname));
      tocEntry.innerText = allH2s[index].innerText;
      tocListItem.appendChild(tocEntry);
      tocList.appendChild(tocListItem);
    }
    tocDiv.appendChild(tocList);
    allH2s[0].parentNode.insertBefore(tocDiv, allH2s[0]);
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
    buildTOCBlock(main);
    if (document.body.classList.contains('category-index')) {
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
  loadDelayed();
}

loadPage();
