import {
  buildBlock,
  decorateBlock,
  getMetadata,
} from '../../scripts/lib-franklin.js';

import {
  isMobile,
} from '../../scripts/scripts.js';

// import { pushToDataLayer } from '../../scripts/utils/helpers.js';

function createTableOfContents(main) {
  const hasToc = getMetadata('has-toc');
  if (!hasToc) {
    return;
  }
  const tocDiv = document.createElement('div');
  tocDiv.classList.add('toc');

  const title = main.querySelector('h1');
  title.after(tocDiv);
}

async function createTemplateBlock(container, blockName, elems = []) {
  const wrapper = document.createElement('div');
  container.append(wrapper);

  const block = buildBlock(blockName, { elems });
  wrapper.append(block);

  decorateBlock(block);
}

export async function loadEager(document) {
  const main = document.querySelector('main');

  // top
  createTableOfContents(main);
  createTemplateBlock(main, 'article-author');

  // sidebar
  createTemplateBlock(main, 'article-cta');

  // same attribute setting as earlier
  main.setAttribute('itemscope', '');

  const heroTitleSection = document.createElement('div');
  heroTitleSection.classList.add('hero-title-container', 'section');

  const articleTitle = main.querySelector('h1');
  const heroImgContainer = main.querySelectorAll('p')[0];
  heroImgContainer.classList.add('hero-pic-div');

  heroTitleSection.append(articleTitle);
  heroTitleSection.append(heroImgContainer);
  main.prepend(heroTitleSection);
}

export async function loadLazy(document) {
  const main = document.querySelector('main');
  const authorDiv = main.querySelector('.article-author-container');
  authorDiv.classList.remove('section');
  const heroTitleSection = main.querySelector('.hero-title-container');

  const contentSection = main.querySelectorAll('.section')[1];
  contentSection.classList.add('article-content-container');

  heroTitleSection.prepend(authorDiv);

  if (!isMobile()) {
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content-left');
    const heroTitleDiv = document.querySelector('.hero-title-container');
    const blogSection = document.querySelector('.article-content-container');
    contentDiv.append(heroTitleDiv);
    contentDiv.append(blogSection);

    const sidebarDiv = document.createElement('div');
    const compareDiv = document.querySelector('.article-cta-container');
    sidebarDiv.classList.add('sidebar-right');
    sidebarDiv.append(compareDiv);

    main.append(contentDiv);
    main.append(sidebarDiv);
  }
}
