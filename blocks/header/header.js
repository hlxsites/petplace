import { getMetadata, decorateIcons } from '../../scripts/lib-franklin.js';
import { constants as AriaDialog } from '../../scripts/aria/aria-dialog.js';
import { constants as AriaTreeView } from '../../scripts/aria/aria-treeview.js';

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // fetch nav content
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta).pathname : '/nav';
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
  searchField.name = 'query';
  searchField.type = 'search';
  searchField.placeholder = navTools.textContent;
  const searchForm = document.createElement('form');
  searchForm.action = 'search';
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
  resp = await fetch('/sidenav.plain.html');
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
  window.requestAnimationFrame(() => {
    nav.querySelector('.nav-hamburger button').replaceWith(navSidebar);
  });

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

  decorateIcons(nav);
}
