import {
  decorateIcons,
  getMetadata,
  sampleRUM,
} from '../../scripts/lib-franklin.js';
import { DETAULT_REGION, REGIONS, getId, getPlaceholder } from '../../scripts/scripts.js';
import { constants as AriaDialog } from '../../scripts/aria/aria-dialog.js';
import { constants as AriaTreeView } from '../../scripts/aria/aria-treeview.js';
import { pushToDataLayer } from '../../scripts/utils/helpers.js';

function isPopoverSupported() {
  // eslint-disable-next-line no-prototype-builtins
  return HTMLElement.prototype.hasOwnProperty('popover');
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // fetch nav content
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta).pathname : `${window.hlx.contentBasePath}/fragments/nav`;
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
    <button type="button" aria-controls="nav" aria-label="${getPlaceholder('openNavigation')}">
      ${navHamburger.innerHTML}
    </button>`;

  nav.querySelector('.nav-brand a').setAttribute('aria-label', getPlaceholder('logoLinkLabel'));

  const navTools = nav.querySelector('.nav-tools');
  const searchField = document.createElement('input');
  searchField.setAttribute('aria-label', navTools.textContent);
  searchField.className = 'search-input';
  searchField.name = 'query';
  searchField.type = 'search';
  searchField.placeholder = navTools.textContent;
  const searchForm = document.createElement('form');
  searchForm.setAttribute('role', 'search');
  searchForm.action = `${window.hlx.contentBasePath}/search`;
  searchForm.method = 'get';

  const searchButton = document.createElement('button');
  searchButton.className = 'search-btn';
  searchButton.setAttribute('aria-label', 'submit search');
  searchButton.type = 'submit';
  const searchIcon = document.createElement('span');
  searchIcon.className = 'icon icon-search';
  searchButton.append(searchIcon);

  searchForm.append(searchField, searchButton);
  navTools.innerHTML = '';
  navTools.append(searchForm);
  searchButton.addEventListener('click', (ev) => {
    ev.preventDefault();
    if (searchField.value !== '') {
      searchForm.submit();
    }
  });

  const regionSelector = document.createElement('button');
  const regionMenu = document.createElement('div');
  const regions = [DETAULT_REGION, ...Object.keys(REGIONS)];
  regions
    .filter((r) => r !== document.documentElement.lang)
    .forEach((r) => {
      const regionLink = document.createElement('a');
      regionLink.setAttribute('hreflang', r);
      regionLink.setAttribute('href', r === DETAULT_REGION ? '/' : `/${r.toLowerCase()}/`);
      regionLink.title = `Navigate to our ${r} website`;
      switch (r) {
        case 'en-GB':
          regionLink.textContent = '🇬🇧';
          break;
        default:
          regionLink.textContent = '🇺🇲';
          break;
      }
      regionMenu.append(regionLink);
    });
  switch (document.documentElement.lang) {
    case 'en-GB':
      regionSelector.textContent = '🇬🇧';
      break;
    default:
      regionSelector.textContent = '🇺🇲';
      break;
  }
  if (isPopoverSupported()) {
    regionMenu.popover = 'auto';
    regionSelector.popoverTargetElement = regionMenu;
    regionSelector.popoverTargetAction = 'toggle';
  } else {
    const id = getId('dropdown');
    regionMenu.id = id;
    regionMenu.setAttribute('aria-hidden', 'true');
    regionSelector.setAttribute('aria-controls', id);
    regionSelector.setAttribute('aria-haspopup', true);
    regionSelector.addEventListener('click', () => {
      const isHidden = regionMenu.getAttribute('aria-hidden') === 'true';
      regionMenu.setAttribute('aria-hidden', (!isHidden).toString());
      if (!isHidden) {
        regionMenu.querySelector('a').focus();
      }
    });
  }
  navTools.append(regionSelector);
  navTools.append(regionMenu);

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  const navSidebar = document.createElement('div');
  navSidebar.classList.add('nav-sidebar');
  resp = await fetch(`${window.hlx.contentBasePath}/fragments/sidenav.plain.html`);
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
  ariaTreeView.setAttribute('label', getPlaceholder('secondaryNavigationLabel'));
  ariaTreeView.append(dialogContent.querySelector('ul'));
  treeViewWrapper.replaceWith(ariaTreeView);
  ariaDialog.append(dialogContent);

  const sidebarSearch = document.createElement('div');
  sidebarSearch.append(searchForm.cloneNode(true));
  sidebarSearch.querySelector('form button')?.addEventListener('click', (ev) => {
    ev.preventDefault();
    if (sidebarSearch.querySelector('input')?.value !== '') {
      sidebarSearch.querySelector('form')?.submit();
    }
  });
  dialogContent.insertBefore(sidebarSearch, dialogContent.childNodes[4]);

  classes = ['header', 'links', 'search', 'misc', 'social'];
  classes.forEach((c, i) => {
    const section = dialogContent.children[i];
    if (section) section.classList.add(`nav-sidebar-${c}`);
  });

  navSidebar.append(ariaDialog);
  nav.querySelector('.nav-hamburger button').replaceWith(navSidebar);

  const sidebarToggle = ariaDialog.querySelector('button');
  sidebarToggle.setAttribute('aria-label', getPlaceholder('openNavigation'));
  const close = ariaDialog.querySelector('[role="dialog"] button');
  close.setAttribute('aria-label', getPlaceholder('closeNavigation'));
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
    toggle.setAttribute('aria-label', getPlaceholder('openNavItem', { item: item.textContent }));
  });
  const observer = new MutationObserver((entries) => {
    const { attributeName, target } = entries.pop();
    if (attributeName !== 'aria-expanded') {
      return;
    }
    const toggle = navSidebar.querySelector(`button[aria-controls="${target.id}"]`);
    const isExpanded = target.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-label', isExpanded
      ? getPlaceholder('closeNavItem')
      : getPlaceholder('openNavItem', { item: target.textContent }));
  });
  navSidebar.querySelectorAll('[role="tree"] [role="treeitem"]').forEach((item) => {
    observer.observe(item, { attributes: true });
  });

  block.querySelectorAll('.nav-sidebar-social a').forEach((a) => {
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.setAttribute('aria-label', getPlaceholder('socialLinkLabel', { page: a.firstElementChild.classList[1].substring(5) }));
  });

  block.querySelector('form').addEventListener('submit', (ev) => {
    const query = ev.target.querySelector('.search-input').value;
    if (!query) {
      ev.preventDefault();
      return;
    }
    pushToDataLayer({
      event: 'search',
      search_term: query,
    });
    sampleRUM('search', { source: '.search-input', target: query });
  });

  decorateIcons(nav);
}
