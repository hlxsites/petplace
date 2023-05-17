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

  const meta = getDefaultMetadata(document);
  meta.Author = document.querySelector('.author-name').textContent;
  meta['Publication Date'] = new Date(document.querySelector('.post-date').textContent).toISOString().substring(0, 10);
  meta.Category = [...document.querySelectorAll('.category-link')].pop().textContent;

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
    let main;
    const template = getTemplate(url);
    switch (template) {
      case 'article-page':
        main = transformArticlePage(document);
        break;
      case 'breed-page':
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
