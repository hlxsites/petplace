import {
  buildBlock,
  decorateBlock,
  loadBlock,
} from '../../scripts/lib-franklin.js';
import { createBreadCrumbs } from '../../scripts/scripts.js';

async function createTemplateBlock(container, blockName, elems = []) {
  const wrapper = document.createElement('div');
  container.append(wrapper);

  const block = buildBlock(blockName, { elems });
  wrapper.append(block);

  decorateBlock(block);
  await loadBlock(block);
}

function injectAggregator(document, selector) {
  const widgetContainer = document.createElement('div');
  widgetContainer.classList.add('widget', 'aggregator');
  widgetContainer.setAttribute('id', 'widgetTarget');

  const widget = document.createElement('script');
  widget.setAttribute('brand', 'petplace');
  widget.setAttribute('source', 'california_insurance_lp');
  widget.text = `
    (()=>{const e=document.currentScript.getAttributeNames(),t=document.getElementById("widgetTarget");document.createElement("object");let r="";if(e&&e.length>0){let t=e.find((e=>"brand"===e.toLocaleLowerCase()));t&&(r="/"+document.currentScript.getAttribute(t)),r+="/widget";let c=!0;e.forEach((e=>{if("brand"===e.toLocaleLowerCase())return;let t=\`\${e}=\${document.currentScript.getAttribute(e)}\`;c?(c=!1,r+="?"):t="&"+t,r+=t}))}let c="https://quote.petpremium.com"+r;t.innerHTML=\`<iframe style='width: 100%; height: 100%; border: none' src='\${c}'></object>\`})();
  `;

  widgetContainer.appendChild(widget);
  document.querySelector(selector).appendChild(widgetContainer);
}

export async function loadEager(document) {
  const main = document.querySelector('main');

  // Create side section container
  const sideSection = document.createElement('section');
  sideSection.classList.add('section', 'side-section');

  main.prepend(sideSection);

  // Add side section blocks
  createTemplateBlock(sideSection, 'article-author');
  createTemplateBlock(sideSection, 'social-share', ['<div>facebook</div>', '<div>instagram</div>', '<div>tiktok</div>']);

  // Build side section page links
  createTemplateBlock(sideSection, 'fragment', ['<a href="/fragments/insurance-anchor-links"></a>']);

  // Move subhead to the footer
  const subhead = document.querySelector('.subhead');
  document.querySelector('footer').appendChild(subhead);
}

export async function loadLazy(document) {
  // Create breadcrumbs
  const main = document.querySelector('main');
  const body = main.parentNode;
  const breadcrumbContainer = document.createElement('div');
  body.insertBefore(breadcrumbContainer, main);

  const heading = main.querySelector('h1');
  const breadcrumbData = await createBreadCrumbs([{
    url: `${window.hlx.contentBasePath}/pet-insurance`,
    path: 'Pet Insurance',
    color: 'black',
    label: 'Pet Insurance',
  }, {
    url: window.location,
    path: heading.innerText,
    color: 'black',
    label: heading.innerText,
  }], { chevronAll: true, chevronIcon: 'chevron-large', useHomeLabel: true });
  createTemplateBlock(breadcrumbContainer, 'breadcrumb', [breadcrumbData]);

  // Adjust structure of article author for styling
  const authorContainer = document.querySelector('.article-author [itemprop="author"]');
  const timePublished = document.querySelector('.article-author [itemprop="datePublished"]');
  authorContainer.appendChild(timePublished);

  // Inject aggregator widget
  injectAggregator(document, '[data-inject-widget-name="p3-aggregator"]');
}
