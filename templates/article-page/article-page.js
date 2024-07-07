import { buildBlock, getMetadata, toClassName } from '../../scripts/lib-franklin.js';
import { pushToDataLayer } from '../../scripts/utils/helpers.js';

function createTableOfContents(main) {
  const hasToc = getMetadata('has-toc');
  if (!hasToc) {
    return;
  }
  const tocDiv = document.createElement('div');
  tocDiv.classList.add('toc');

  // if there is a disclosure, add the toc after it, otherwise add it after the h1
  const title = main.querySelector('h1');
  const disclosure = main.querySelector('.disclosure');
  if (title.nextElementSibling === disclosure) {
    disclosure.after(tocDiv);
  } else {
    title.after(tocDiv);
  }
}

function createAutoBlockSection(main, blockName, gridName) {
  const gridNameValue = gridName || blockName;
  const section = document.createElement('div');
  // section.classList.add('article-template-autoblock', `article-template-grid-${gridNameValue}`);
  section.classList.add(gridNameValue);

  main.append(section);
  return section;
}

function createTemplateBlock(main, blockName, gridName, elems = []) {
  const section = createAutoBlockSection(main, blockName, gridName);

  const block = buildBlock(blockName, { elems });
  section.append(block);
}

export function loadEager(document) {
  const main = document.querySelector('main');
  createTableOfContents(main);
  createTemplateBlock(main, 'article-author');
  createTemplateBlock(main, 'popular-articles');
  createTemplateBlock(main, 'related-reading');
}

export async function loadLazy(document) {
  const main = document.querySelector('main');
  const heroTitleSection = document.createElement('div');
  heroTitleSection.classList.add('hero-title-container', 'section');

  const articleTitle = main.querySelectorAll('h1')[0];
  const authorDiv = main.querySelector('.article-author-container');
  authorDiv.classList.remove('section');
  const heroImgContainer = main.querySelectorAll('p')[0];
  heroImgContainer.classList.add('hero-pic-div');
  heroTitleSection.append(articleTitle);
  heroTitleSection.append(authorDiv);
  heroTitleSection.append(heroImgContainer);
  main.prepend(heroTitleSection);

  const { adsenseFunc } = await import('../../scripts/adsense.js');
  adsenseFunc('article', 'create');

  // genai block will go here below
}

export async function loadDelayed() {
  const articleCat = toClassName(getMetadata('category').split(',')[0]?.trim());
  await pushToDataLayer({
    event: 'adsense',
    type: 'article',
    category: articleCat,
  });

  const { adsenseFunc } = await import('../../scripts/adsense.js');
  adsenseFunc('article', articleCat);
}
