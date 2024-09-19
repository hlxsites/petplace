import {
  buildBlock,
  decorateBlock,
  getMetadata,
  loadBlock,
  toClassName,
} from '../../scripts/lib-franklin.js';
import {
  isMobile,
  createBreadCrumbs,
  getCategories,
} from '../../scripts/scripts.js';

const GENAI_TOOLTIP = 'Try our AI powered discovery tool and get all your questions answered';

const categoriesPromise = getCategories();

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

async function createTemplateBlock(container, blockName, elems = []) {
  const wrapper = document.createElement('div');
  container.append(wrapper);

  const block = buildBlock(blockName, { elems });
  wrapper.append(block);

  decorateBlock(block);
}

async function buildGenAiSearchSection(main) {
  const genAIDiv = document.createElement('div');
  genAIDiv.classList.add('section');

  const genAIMeta = document.createElement('meta');
  genAIMeta.setAttribute('itemprop', 'description');
  genAIMeta.setAttribute(
    'content',
    document.head.querySelector('meta[name="description"]').content,
  );
  genAIDiv.append(genAIMeta);

  const articleContainer = main.querySelector('.article-content-container');
  const genaiBlock = buildBlock('genai-search', '');
  const genAITitle = document.createElement('h2');
  const genAISubtitle = document.createElement('h2');
  genAITitle.innerText = 'Learn even more with...  ';
  genAISubtitle.innerText = 'AI Powered PetPlace Discovery';

  genAIDiv.append(genAITitle);
  genAIDiv.append(genAISubtitle);
  genAIDiv.append(genaiBlock);
  articleContainer.after(genAIDiv);

  // genAIBlock.insertBefore(secondHeadline);

  decorateBlock(genaiBlock);
  await loadBlock(genaiBlock);
}

const buildGenAISearchCTA = () => {
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
    const { pushToDataLayer } = await import('../../scripts/utils/helpers.js');
    await pushToDataLayer({
      event: 'genai_floater',
      element_type: 'button',
    });
    document.location.pathname = '/discovery';
  });

  return headerSearchButton;
};

async function getCategoryByKey(key, value) {
  const categories = await categoriesPromise;
  return categories.find((c) => c[key].toLowerCase() === value.toLowerCase());
}

function convertToTitleCase(str) {
  const words = str.split('-');
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1),
  );
  return capitalizedWords.join(' ');
}

/**
 * Fetches page category.  If parent path exists, recursively fetches parent data and so on.
 * @returns {Promise<*[]>}
 * @param categorySlug snake case value of category
 */
async function getBreadcrumbs(categorySlug) {
  const breadcrumbs = [];

  async function fetchSegmentData(slug) {
    const categoryData = await getCategoryByKey('Slug', slug);
    breadcrumbs.push({
      color: categoryData.Color,
      url: categoryData.Path,
      label: convertToTitleCase(categoryData.Slug),
    });

    if (
      categoryData['Parent Path']
      !== `${window.hlx.contentBasePath}/article/category/`
      && categoryData['Parent Path']
    ) {
      const { Slug } = await getCategoryByKey(
        'Path',
        categoryData['Parent Path'],
      );
      await fetchSegmentData(Slug);
    }
  }

  await fetchSegmentData(categorySlug);

  return breadcrumbs.reverse();
}

function buildHeroSection(container) {
  const hero = document.createElement('div');
  hero.classList.add('section', 'hero-container');
  hero.append(container.querySelector('h1'));
  hero.append(buildBlock('article-author', { elems: [] }));
  hero.append(container.querySelector('picture'));
  container.prepend(hero);
}

async function buildBreadcrumb(container) {
  const main = document.querySelector('main');
  // breadcrumb
  const heading = main.querySelector('h1');
  const categorySlugs = getMetadata('category')
    .split(',')
    .map((slug) => toClassName(slug.trim()));
  const category = await getBreadcrumbs(categorySlugs[0]);
  const breadcrumbData = await createBreadCrumbs(
    [
      {
        url: `${window.hlx.contentBasePath}${category[0].url}`,
        path: category[0].label,
        color: 'black',
        label: category[0].label,
      },
      {
        url: window.location,
        path: heading.innerText,
        color: 'black',
        label: heading.innerText,
      },
    ],
    { chevronAll: true, chevronIcon: 'chevron-large', useHomeLabel: true },
  );
  breadcrumbData.querySelectorAll('.icon.icon-chevron').forEach((icon) => {
    icon.classList.replace('icon-chevron', 'icon-chevron-large');
  });
  const section = document.createElement('div');
  section.classList.add('section');
  section.append(buildBlock('breadcrumb', { elems: [breadcrumbData] }));
  container.prepend(section);
}

export async function loadEager(document) {
  const main = document.querySelector('main');

  main.firstElementChild.classList.add('article-content-container');

  buildHeroSection(main);

  // sidebar
  const sidebar = document.createElement('div');
  sidebar.classList.add('section', 'sidebar-container');
  main.append(sidebar);
  // share
  sidebar.append(buildBlock('social-share', { elems: [] }));
  // popular articles
  sidebar.append(buildBlock('popular-articles', { elems: [] }));
  // insurance
  sidebar.append(buildBlock('article-cta', { elems: [] }));

  // top
  createTableOfContents(main);

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
          question.nextElementSibling
          && question.nextElementSibling.tagName !== h.nodeName
        ) {
          div.append(question.nextElementSibling);
        }
      });
  } else {
    main.setAttribute('itemtype', 'https://schema.org/BlogPosting');
  }
  await buildBreadcrumb(main);
}

export async function loadLazy(document) {
  const main = document.querySelector('main');

  // breadcrumb

  const { adsenseFunc } = await import('../../scripts/adsense.js');
  adsenseFunc('article', 'create');

  // GenAI Search
  buildGenAiSearchSection(main);
  if (document.body.classList.contains('article-page')) {
    const contentDiv = document.querySelector('.default-content-wrapper');
    contentDiv.append(buildGenAISearchCTA());
  }
}

export async function loadDelayed() {
  const articleCat = toClassName(getMetadata('category').split(',')[0]?.trim());
  const { pushToDataLayer } = await import('../../scripts/utils/helpers.js');
  await pushToDataLayer({
    event: 'adsense',
    type: 'article',
    category: articleCat,
  });

  const { adsenseFunc } = await import('../../scripts/adsense.js');
  adsenseFunc('article', articleCat);

  if (!isMobile()) {
    const sidebarDiv = document.querySelector('.sidebar-container');
    const skyscraperAd = document.querySelector('.skyscraper');
    sidebarDiv.append(skyscraperAd);
  }
}
