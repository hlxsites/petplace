/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console, class-methods-use-this */

function toClassName(name) {
  return typeof name === 'string'
    ? name.toLowerCase().replace(/[^0-9a-z]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    : '';
}

const getDefaultMetadata = (document) => {
  const meta = {};

  const title = document.querySelector('title');
  if (title) {
    meta.Title = title.innerHTML.replace(/[\n\t]/gm, '');
  }

  const desc = document.querySelector('[property="og:description"]');
  if (desc) {
    meta.Description = desc.content;
  }

  const img = document.querySelector('[property="og:image"]');
  if (img && img.content) {
    const el = document.createElement('img');
    el.src = img.content;
    meta.Image = el;
  }

  return meta;
};

function getTemplate(url) {
  const { pathname } = new URL(url);
  if (pathname === '/') {
    return 'home-page';
  }
  if (pathname.startsWith('/article/breed/')) {
    return 'breed-page';
  }
  if (pathname.startsWith('/article/category/')) {
    return 'category-index';
  }
  if (pathname.startsWith('/article/')) {
    return 'article-page';
  }
  return 'default-page';
}

function transformArticlePage(document) {
  const main = document.querySelector('.single-post');
  main.prepend(main.querySelector('.gatsby-image-wrapper'));

  const toc = [...document.querySelectorAll('h2')].find((h2) => toClassName(h2.textContent) === 'table-of-contents');

  const meta = getDefaultMetadata(document);
  meta.Author = document.querySelector('.author-name').textContent;
  meta['Publication Date'] = new Date(document.querySelector('.post-date').textContent).toISOString().substring(0, 10);
  meta.Category = [...document.querySelectorAll('.category-link')].pop().textContent;
  if (toc) {
    meta['Has TOC'] = true;
    toc.nextElementSibling.remove();
    toc.remove();
  }

  const petInsuranceQuote = document.querySelector('.gift-pet-insurance-cta');
  if (petInsuranceQuote) {
    const cells = [
      ['Pet Insurance Quote'],
      [''],
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    main.append(table);
  }

  const disclosure = document.querySelector('.petpartners-disclosure');
  if (disclosure) {
    const cells = [
      ['Disclosure'],
      [''],
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    main.append(table);
  }

  const block = WebImporter.Blocks.getMetadataBlock(document, meta);
  main.append(block);

  // use helper method to remove header, footer, etc.
  WebImporter.DOMUtils.remove(main, [
    '.is-hidden-desktop',
    '.breadcrumbs',
    '.single-post-sidebar',
    '.counter-wrapper',
    '.share-icons-horizontal',
    '.similar-post-section',
    '.next-prev-post-section',
    '.gift-pet-insurance-cta',
    '.petpartners-disclosure',
  ]);

  return main;
}

function transformBreedPage(document) {
  // TODO: add base64 images and section dividers
  const main = document.querySelector('#___gatsby > div');

  const meta = getDefaultMetadata(document);
  meta.Author = document.querySelector('.author-name').textContent;
  meta.Type = [...document.querySelectorAll('.general-attributes')].find((attr) => attr.firstElementChild.textContent === 'Type').children[1].textContent;

  const generalAttributes = document.querySelector('.general-attributes-wrapper');
  if (generalAttributes) {
    const cells = [
      ['General Attributes'],
      ...[...generalAttributes.children].map((attr) => ([
        attr.children[0],
        attr.children[1],
      ])),
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    generalAttributes.replaceWith(table);
    table.after(document.createElement('hr'));
  }

  const breedMainSection = document.querySelector('.breed-main-section');
  if (breedMainSection) {
    const cells = [
      ['Blade'],
      [...breedMainSection.querySelectorAll('.column')],
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    breedMainSection.replaceWith(table);
  }

  const attributesSection = document.querySelector('.is-hidden-touch .attributes-wrapper');
  if (attributesSection) {
    const cells = [
      ['Attributes'],
      ...[...attributesSection.querySelectorAll('.attribute')].map((attr) => ([
        attr.children[0],
      ])),
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    attributesSection.replaceWith(table);
  }

  const historyWrapper = document.querySelector('.is-hidden-touch .history-wrapper');
  if (historyWrapper) {
    const cells = [
      ['Blade'],
      [...historyWrapper.querySelectorAll('.column')],
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    historyWrapper.replaceWith(table);
    table.after(document.createElement('hr'));
  }

  const careSection = document.querySelector('.is-hidden-desktop .care-section');
  if (careSection) {
    let cells = [
      ['Care Tabs'],
      ...[...careSection.querySelectorAll('.slick-slide:not(.slick-cloned) .care-slider')].map((slider) => ([
        slider.children[0],
        slider.children[1],
      ])),
    ];
    let table = WebImporter.DOMUtils.createTable(cells, document);
    document.querySelector('.is-hidden-touch .care-section').querySelector('.care-columns').replaceWith(table);

    cells = [
      ['Section Metadata'],
      ...Object.entries({ Style: 'Centered' }).map(([key, value]) => [key, value]),
    ];
    table = WebImporter.DOMUtils.createTable(cells, document);
    document.querySelector('.is-hidden-touch .care-section').append(table);
    table.after(document.createElement('hr'));
  }

  const breedStandardsSection = document.querySelector('.breed-standards-section');
  if (breedStandardsSection) {
    let cells = [
      ['Accordion'],
      ...[...breedStandardsSection.querySelectorAll('.breed-standard-accordion > div')].map((accordion) => ([
        accordion.children[0],
        accordion.children[1],
      ])),
    ];
    let table = WebImporter.DOMUtils.createTable(cells, document);
    breedStandardsSection.querySelector('.breed-standard-accordion').replaceWith(table);

    cells = [
      ['Section Metadata'],
      ...Object.entries({ Style: 'Centered' }).map(([key, value]) => [key, value]),
    ];
    table = WebImporter.DOMUtils.createTable(cells, document);
    breedStandardsSection.append(table);
    table.after(document.createElement('hr'));
  }

  const factsSection = document.querySelector('.facts-section');
  if (factsSection) {
    let cells = [
      ['Slide Cards (numbered)'],
      ...[...factsSection.querySelectorAll('.slick-slide:not(.slick-cloned) .fact-slide-content p')].map((slide) => ([
        slide,
      ])),
    ];
    let table = WebImporter.DOMUtils.createTable(cells, document);
    factsSection.querySelector('.slick-slider').replaceWith(table);

    cells = [
      ['Section Metadata'],
      ...Object.entries({ Style: 'Centered' }).map(([key, value]) => [key, value]),
    ];
    table = WebImporter.DOMUtils.createTable(cells, document);
    factsSection.append(table);
    table.after(document.createElement('hr'));
  }

  const breedsToExploreSection = document.querySelector('.breeds-to-explore-section');
  if (breedsToExploreSection) {
    let cells = [
      ['Slide Cards (media)'],
      ...[...breedsToExploreSection.querySelectorAll('.breeds_to_explore-content')].map((slide) => {
        const title = slide.querySelector('.breeds_to_explore-title').textContent;
        console.log(213, title);
        const anchor = document.createElement('a');
        anchor.href = title.startsWith('Choosing')
          ? `/article/dogs/breeds/${toClassName(title)}`
          : `/article/breed/${toClassName(title)}`;
        anchor.append(title);
        return [
          slide.querySelector('picture'),
          anchor,
        ];
      }),
    ];
    let table = WebImporter.DOMUtils.createTable(cells, document);
    breedsToExploreSection.querySelector('.slick-slider').replaceWith(table);

    cells = [
      ['Section Metadata'],
      ...Object.entries({ Style: 'Centered' }).map(([key, value]) => [key, value]),
    ];
    table = WebImporter.DOMUtils.createTable(cells, document);
    breedsToExploreSection.append(table);
    table.after(document.createElement('hr'));
  }

  const cells = [
    ['Section Metadata'],
    ...Object.entries({ Style: 'Centered, Well' }).map(([key, value]) => [key, value]),
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  main.append(table);

  const block = WebImporter.Blocks.getMetadataBlock(document, meta);
  main.append(block);

  // use helper method to remove header, footer, etc.
  WebImporter.DOMUtils.remove(main, [
    'header',
    'footer',
    '.is-hidden-desktop',
    '.author-name',
    '.care-content',
    '.cat-footer',
  ]);

  return main;
}

function cleanupUrls(main) {
  main.querySelectorAll('[href],[src]').forEach((el) => {
    if (el.href && el.href.startsWith('https://petplace.uat.petpartners.com/')) {
      el.href.replace('https://petplace.uat.petpartners.com/', '/');
    } else if (el.href && el.href.startsWith('http://localhost:3001/')) {
      el.href.replace('http://localhost:3001/', '/');
    } else if (el.src && el.src.startsWith('https://petplace.uat.petpartners.com/')) {
      el.src.replace('https://petplace.uat.petpartners.com/', '/');
    } else if (el.src && el.src.startsWith('http://localhost:3001/')) {
      el.src.replace('http://localhost:3001/', '/');
    }
  });
}

function rewrapDataTables(main) {
  main.querySelectorAll('table').forEach((table) => {
    const caption = table.nextElementSibling?.querySelector('small');
    table.innerHTML = `
      <tr><th>Table</th></tr>
      <tr>
        <td>
          ${table.outerHTML}
          ${caption ? `<p>${caption.outerHTML}</p>` : ''}
        </td>
      </tr>`;
    caption?.parentElement.remove();
  });
}

function transformLongLists(main) {
  [...main.querySelectorAll('ul,ol')]
    .filter((list) => list.childElementCount > 20)
    .forEach((list) => {
      list.outerHTML = `
        <table>
          <tr><th>Column List (Four)</th></tr>
          <tr>
            <td>
              ${list.outerHTML}
            </td>
          </tr>
        </table>`;
    });
}

export default {
  /**
   * Apply DOM operations to the provided document and return
   * the root element to be then transformed to Markdown.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @returns {HTMLElement} The root element to be transformed
   */
  transformDOM: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => {
    rewrapDataTables(document);
    transformLongLists(document);
    let main;
    const template = getTemplate(url);
    switch (template) {
      case 'article-page':
        main = transformArticlePage(document);
        break;
      case 'breed-page':
        main = transformBreedPage(document);
        break;
      default:
        main = document.body;
        break;
    }

    cleanupUrls(main);

    return main;
  },

  /**
   * Return a path that describes the document being transformed (file name, nesting...).
   * The path is then used to create the corresponding Word document.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @return {string} The path
   */
  generateDocumentPath: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => WebImporter.FileUtils.sanitizePath(new URL(url).pathname.replace(/\.html$/, '').replace(/\/$/, '')),
};
