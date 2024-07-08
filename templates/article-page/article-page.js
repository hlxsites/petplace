import {
  buildBlock,
  decorateBlock,
  getMetadata,
  loadBlock,
  toClassName,
} from '../../scripts/lib-franklin.js';
import { pushToDataLayer } from '../../scripts/utils/helpers.js';

const GENAI_TOOLTIP = 'Try our AI powered discovery tool and get all your questions answered';

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

async function sectionGenAi(main) {
  const genAIDiv = document.createElement('div');
  genAIDiv.classList.add('section');
  genAIDiv.classList.add('genai-search');

  const genAIMeta = document.createElement('meta');
  genAIMeta.setAttribute('itemprop', 'description');
  genAIMeta.setAttribute(
    'content',
    document.head.querySelector('meta[name="description"]').content,
  );
  genAIDiv.append(genAIMeta);

  const articleContainer = main.querySelector('.section:nth-of-type(2)');
  const genaiBlock = buildBlock('genai-search', '');
  const genAITitle = document.createElement('h2');
  const genAISubtitle = document.createElement('h2');
  genAITitle.innerText = 'Learn even more with...  ';
  genAISubtitle.innerText = 'AI Powered PetPlace Discovery';

  genAIDiv.append(genAITitle);
  genAIDiv.append(genAISubtitle);
  genAIDiv.append(genaiBlock);
  articleContainer.append(genAIDiv);

  // genAIBlock.insertBefore(secondHeadline);

  decorateBlock(genaiBlock);
  await loadBlock(genaiBlock);
}

const createGenAISearchCTA = () => {
  const headerSearchButton = document.createElement('div');
  headerSearchButton.className = 'header-search';
  headerSearchButton.innerHTML = `<a data-modal="/tools/search"><img src="${window.hlx.codeBasePath}/icons/ai_generate_white.svg"><span class="tooltip">${GENAI_TOOLTIP}</span></a>`;

  window.addEventListener('scroll', () => {
    if (window.scrollY >= 68) {
      headerSearchButton.classList.add('scrolled'); // New position when scrolled to the threshold
    } else {
      headerSearchButton.classList.remove('scrolled'); // Original position
    }
  });

  headerSearchButton.addEventListener('click', async () => {
    await pushToDataLayer({
      event: 'genai_floater',
      element_type: 'button',
    });
    document.location.pathname = '/discovery';
  });

  return headerSearchButton;
};

export function loadEager(document) {
  const main = document.querySelector('main');

  // content
  createTableOfContents(main);
  createTemplateBlock(main, 'article-author');

  // sidebar
  createTemplateBlock(main, 'popular-articles');
  createTemplateBlock(main, 'article-cta');

  // bottom
  createTemplateBlock(main, 'related-reading');

  // same attribute setting as earlier
  main.setAttribute('itemscope', '');
  const articleType = toClassName(getMetadata('type'));

  if (articleType === 'faq') {
    main.setAttribute('itemtype', 'https://schema.org/FAQPage');
    [...main.querySelectorAll(':scope > div > :is(h1,h2,h3)')]
      .filter((h) => h.textContent.endsWith('?') || h.textContent.match(/#\d+/))
      .forEach((h) => {
        if (h.nodeName === 'H1') {
          const meta = document.createElement('meta');
          meta.setAttribute('itemprop', 'name');
          meta.setAttribute('content', h.textContent);
          h.after(meta);
        } else {
          h.setAttribute('itemprop', 'name');
        }
        const question = document.createElement('div');
        question.setAttribute('itemscope', '');
        question.setAttribute('itemprop', 'mainEntity');
        question.setAttribute('itemtype', 'https://schema.org/Question');
        if (h.nodeName === 'H1') {
          h.after(question);
          question.append(question.nextElementSibling);
        } else {
          h.replaceWith(question);
          question.append(h);
        }
        const answer = document.createElement('div');
        answer.setAttribute('itemscope', '');
        answer.setAttribute('itemprop', 'acceptedAnswer');
        answer.setAttribute('itemtype', 'https://schema.org/Answer');
        question.append(answer);
        const div = document.createElement('div');
        div.setAttribute('itemprop', 'text');
        answer.append(div);
        while (
          question.nextElementSibling &&
          question.nextElementSibling.tagName !== h.nodeName
        ) {
          div.append(question.nextElementSibling);
        }
      });
  } else {
    main.setAttribute('itemtype', 'https://schema.org/BlogPosting');
  }
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

  const contentSection = main.querySelectorAll('.section')[1];
  contentSection.classList.add('article-content-container');

  // genai block code is unchanged from before
  sectionGenAi(main);

  if (document.body.classList.contains('article-page')) {
    main.append(createGenAISearchCTA());
  }
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
