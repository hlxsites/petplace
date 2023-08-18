import { getMetadata, decorateIcons, sampleRUM } from '../../scripts/lib-franklin.js';
import { constants as AriaDialog } from '../../scripts/aria/aria-dialog.js';
import { constants as AriaTreeView } from '../../scripts/aria/aria-treeview.js';
import {  decorateSearch, createSearchSummary, displaySearchResults, isRequestInProgress, GENAI_SEARCH_TITLE } from './genai-search.js';

const loadScript = (url, callback, type, section, defer) => {
  const head = document.querySelector('head');
  const script = document.createElement('script');
  script.src = url;
  if (type) {
    script.setAttribute('type', type);
  }
  if (defer && script.src) {
    script.defer = defer;
  }
  if (section) section.append(script);
  else head.append(script);
  script.onload = callback;
  return script;
};
loadScript("https://cdn.jsdelivr.net/npm/marked/marked.min.js", () => {
  console.log("Marked.js loaded");
});
loadScript("https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.min.js", () => {
  console.log("Masonry.js loaded");
});
loadScript("https://unpkg.com/imagesloaded@5/imagesloaded.pkgd.min.js", () => {
  console.log("ImagesLoaded.js loaded");
});

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // fetch nav content
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta).pathname : '/fragments/nav';
  let resp = await fetch(`${navPath}.plain.html`);
  if (!resp.ok) {
    return;
  }

  let html = await resp.text();

  // decorate nav DOM
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.innerHTML = html;

  let classes = ['hamburger', 'brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navHamburger = nav.querySelector('.nav-hamburger');
  navHamburger.innerHTML = `
    <button type="button" aria-controls="nav" aria-label="Open navigation">
      ${navHamburger.innerHTML}
    </button>`;

  nav.querySelector('.nav-brand a').setAttribute('aria-label', 'Navigate to homepage');

  const navTools = nav.querySelector('.nav-tools');
  const searchField = document.createElement('input');
  searchField.setAttribute('aria-label', navTools.textContent);
  searchField.className = 'search-input';
  searchField.name = 'query';
  searchField.type = 'search';
  searchField.placeholder = navTools.textContent;
  const searchForm = document.createElement('form');
  searchForm.setAttribute('role', 'search');
  searchForm.action = '/search';
  searchForm.method = 'get';
  searchForm.append(searchField);
  navTools.innerHTML = '';
  navTools.append(searchForm);

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  const navSidebar = document.createElement('div');
  navSidebar.classList.add('nav-sidebar');
  resp = await fetch('/fragments/sidenav.plain.html');
  if (!resp.ok) {
    return;
  }

  html = await resp.text();

  const ariaDialog = document.createElement(AriaDialog.tagName);
  ariaDialog.setAttribute('modal', true);

  ariaDialog.append(nav.querySelector('.nav-hamburger span').cloneNode(true));

  const dialogContent = document.createElement('div');
  dialogContent.innerHTML = html;

  const treeViewWrapper = dialogContent.querySelector('ul').parentElement;
  const ariaTreeView = document.createElement(AriaTreeView.tagName);
  ariaTreeView.setAttribute('label', 'Secondary Navigation');
  ariaTreeView.append(dialogContent.querySelector('ul'));
  treeViewWrapper.replaceWith(ariaTreeView);
  ariaDialog.append(dialogContent);

  const sidebarSearch = document.createElement('div');
  sidebarSearch.append(searchForm.cloneNode(true));
  dialogContent.insertBefore(sidebarSearch, dialogContent.childNodes[4]);

  classes = ['header', 'links', 'search', 'misc', 'social'];
  classes.forEach((c, i) => {
    const section = dialogContent.children[i];
    if (section) section.classList.add(`nav-sidebar-${c}`);
  });

  navSidebar.append(ariaDialog);
  nav.querySelector('.nav-hamburger button').replaceWith(navSidebar);

  const sidebarToggle = ariaDialog.querySelector('button');
  sidebarToggle.setAttribute('aria-label', 'Open side bar');
  const close = ariaDialog.querySelector('[role="dialog"] button');
  close.setAttribute('aria-label', 'Close side bar');
  close.innerHTML = '<span class="icon icon-close"></span>';

  const dialog = ariaDialog.querySelector('[role="dialog"]');
  dialog.firstElementChild.style.transform = 'translate(-450px,0)';
  dialog.addEventListener('click', (ev) => {
    if (ev.target !== dialog) {
      return;
    }
    ariaDialog.close();
  });
  ariaDialog.onToggle = async (open) => {
    if (!open) {
      return new Promise((resolve) => {
        dialog.firstElementChild.style.transform = 'translate(-450px,0)';
        dialog.firstElementChild.addEventListener('transitionend', resolve, { once: true });
      });
    }
    dialog.firstElementChild.style.transform = 'translate(0,0)';
    return Promise.resolve();
  };

  navSidebar.querySelectorAll('[role="tree"] button[aria-controls]').forEach((toggle) => {
    const item = navSidebar.querySelector(`#${toggle.getAttribute('aria-controls')}`);
    toggle.setAttribute('aria-label', `Opens the ${item.textContent} item`);
  });
  const observer = new MutationObserver((entries) => {
    const { attributeName, target } = entries.pop();
    if (attributeName !== 'aria-expanded') {
      return;
    }
    const toggle = navSidebar.querySelector(`button[aria-controls="${target.id}"]`);
    const isExpanded = target.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-label', `${isExpanded ? 'Closes' : 'Opens'} the ${target.textContent} item`);
  });
  navSidebar.querySelectorAll('[role="tree"] [role="treeitem"]').forEach((item) => {
    observer.observe(item, { attributes: true });
  });

  block.querySelectorAll('.nav-sidebar-social a').forEach((a) => {
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.setAttribute('aria-label', `Open our ${a.firstElementChild.classList[1].substring(5)} page in a new tab.`);
  });

  block.querySelector('form').addEventListener('submit', (ev) => {
    const query = ev.target.querySelector('.search-input').value;
    if (!query) {
      ev.preventDefault();
      return;
    }
    sampleRUM('search', { source: '.search-input', target: query });
  });

  decorateIcons(nav);

  const createGenAISearch = () => {
    const div = document.createElement('div');
    div.className = 'header-search';
    div.innerHTML = `<a data-modal="/tools/search"><img src="${window.hlx.codeBasePath}/icons/help.svg"><span class="tooltip"><em>${GENAI_SEARCH_TITLE}</em></span></a>`;

    // document.body.style.overflowY = 'hidden';
    div.addEventListener('click', async () => {
      const elem = document.getElementById('header-search-modal');
      const headerSearch = document.querySelector('.header-search');
      if (!elem) {
        const modal = document.createElement('div');
        modal.className = 'header-search-modal';
        modal.id = 'header-search-modal';
        modal.innerHTML = '<div class="header-search-close"></div>';
        modal.append(decorateSearch());
        block.append(modal);
        modal.classList.add('visible');
        headerSearch.classList.add('hide');
        document.body.classList.add('overlay');

        const searchBox = document.getElementById('search-box');
        const resultsBlock = block.querySelector('.search-results');
        
        searchBox.addEventListener('keypress', (event) => {
          if (event.key === 'Enter') {
            searchBox.blur();

            const summaryContainer = resultsBlock.querySelector('.summary-columns');
            if (!summaryContainer) {
              resultsBlock.innerHTML = '';
              const regenerateButtonContainer = document.querySelector('.regenerate-button-container');
              regenerateButtonContainer.classList.remove('show');
            }

            displaySearchResults(searchBox.value, resultsBlock);
          }
        });

        const searchButton = document.getElementById('search-button');
        searchButton.addEventListener('click', () => {
          const summaryContainer = resultsBlock.querySelector('.summary-columns');
          if (!summaryContainer) {
            resultsBlock.innerHTML = '';
            const regenerateButtonContainer = document.querySelector('.regenerate-button-container');
            regenerateButtonContainer.classList.remove('show');
          }
          displaySearchResults(searchBox.value, resultsBlock);
        });

        resultsBlock.addEventListener('click', (event) => {
          if (event.target.matches('.search-card-button') && isRequestInProgress === false) {
            console.log("Further questions clicked!");
            block.querySelector('.genai-search-container').scrollIntoView({ behavior: 'smooth' });
            searchBox.value = event.target.innerText;
            resultsBlock.innerHTML = '';
            const regenerateButtonContainer = document.querySelector('.regenerate-button-container');
            regenerateButtonContainer.classList.remove('show');
            displaySearchResults(event.target.innerText, resultsBlock);
          }
        });

        const close = modal.querySelector('.header-search-close');
        close.addEventListener('click', () => {
          // Hide modal
          modal.classList.remove('visible');
          document.body.classList.remove('overlay');
          headerSearch.classList.remove('hide');
          document.body.style.overflowY = '';

          // Clear search results
          document.getElementById('clearButton').classList.remove("show");
          document.getElementById('vertical-bar').classList.remove("show");
        });
      } else {
        elem.classList.add('visible');
        document.body.classList.add('overlay');
        headerSearch.classList.add('hide');
      }
      const searchBox = document.getElementById('search-box');
      const stopButtonContainer = document.querySelector('.stop-button-container');
      const regenerateButtonContainer = document.querySelector('.regenerate-button-container');
      const resultsBlock = block.querySelector('.search-results');
      
      searchBox.value = '';
      searchBox.focus();
      stopButtonContainer.classList.remove('show');
      regenerateButtonContainer.classList.remove('show');
      resultsBlock.innerHTML = '';
      resultsBlock.appendChild(createSearchSummary());
      document.body.style.overflowY = 'hidden';
    });

    return div;
  };

  block.append(createGenAISearch());
}
