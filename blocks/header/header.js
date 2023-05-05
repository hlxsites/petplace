import { getMetadata, decorateIcons } from '../../scripts/lib-franklin.js';
import { constants as AriaDialog } from '../../scripts/aria/aria-dialog.js';
import { constants as AriaTreeView } from '../../scripts/aria/aria-treeview.js';

// // media query match that indicates mobile/tablet width
// const isDesktop = window.matchMedia('(min-width: 900px)');

// function closeOnEscape(e) {
//   if (e.code === 'Escape') {
//     const nav = document.getElementById('nav');
//     const navSections = nav.querySelector('.nav-sections');
//     const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
//     if (navSectionExpanded && isDesktop.matches) {
//       // eslint-disable-next-line no-use-before-define
//       toggleAllNavSections(navSections);
//       navSectionExpanded.focus();
//     } else if (!isDesktop.matches) {
//       // eslint-disable-next-line no-use-before-define
//       toggleMenu(nav, navSections);
//       nav.querySelector('button').focus();
//     }
//   }
// }

// function openOnKeydown(e) {
//   const focused = document.activeElement;
//   const isNavDrop = focused.className === 'nav-drop';
//   if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
//     const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
//     // eslint-disable-next-line no-use-before-define
//     toggleAllNavSections(focused.closest('.nav-sections'));
//     focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
//   }
// }

// function focusNavSection() {
//   document.activeElement.addEventListener('keydown', openOnKeydown);
// }

// /**
//  * Toggles all nav sections
//  * @param {Element} sections The container element
//  * @param {Boolean} expanded Whether the element should be expanded or collapsed
//  */
// function toggleAllNavSections(sections, expanded = false) {
//   sections.querySelectorAll('.nav-sections > ul > li').forEach((section) => {
//     section.setAttribute('aria-expanded', expanded);
//   });
// }

// /**
//  * Toggles the entire nav
//  * @param {Element} nav The container element
//  * @param {Element} navSections The nav sections within the container element
//  * @param {*} forceExpanded Optional param to force nav expand behavior when not null
//  */
// function toggleMenu(nav, navSections, forceExpanded = null) {
//   const expanded = forceExpanded !== null
//      ? !forceExpanded
//      : nav.getAttribute('aria-expanded') === 'true';
//   const button = nav.querySelector('.nav-hamburger button');
//   document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
//   nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
//   toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
//   button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
//   // enable nav dropdown keyboard accessibility
//   const navDrops = navSections.querySelectorAll('.nav-drop');
//   if (isDesktop.matches) {
//     navDrops.forEach((drop) => {
//       if (!drop.hasAttribute('tabindex')) {
//         drop.setAttribute('role', 'button');
//         drop.setAttribute('tabindex', 0);
//         drop.addEventListener('focus', focusNavSection);
//       }
//     });
//   } else {
//     navDrops.forEach((drop) => {
//       drop.removeAttribute('role');
//       drop.removeAttribute('tabindex');
//       drop.removeEventListener('focus', focusNavSection);
//     });
//   }
//   // enable menu collapse on escape keypress
//   if (!expanded || isDesktop.matches) {
//     // collapse menu on escape press
//     window.addEventListener('keydown', closeOnEscape);
//   } else {
//     window.removeEventListener('keydown', closeOnEscape);
//   }
// }

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
  navHamburger.querySelector('button').addEventListener('click', () => console.log('TODO'));
  // const navSections = nav.querySelector('.nav-sections');
  // if (navSections) {
  //   navSections.querySelectorAll(':scope > ul > li').forEach((navSection) => {
  //     if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
  //     navSection.addEventListener('click', () => {
  //       if (isDesktop.matches) {
  //         const expanded = navSection.getAttribute('aria-expanded') === 'true';
  //         toggleAllNavSections(navSections);
  //         navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  //       }
  //     });
  //   });
  // }

  const navTools = nav.querySelector('.nav-tools');
  const searchField = document.createElement('input');
  searchField.name = 'query';
  searchField.type = 'search';
  searchField.placeholder = navTools.textContent;
  const searchForm = document.createElement('form');
  searchForm.action = 'search';
  searchForm.method = 'get';
  searchForm.append(searchField);
  navTools.innerHTML = '';
  navTools.append(searchForm);

  // nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  // toggleMenu(nav, navSections, isDesktop.matches);
  // isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

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

  const ariaTreeView = document.createElement(AriaTreeView.tagName);
  ariaTreeView.setAttribute('label', 'Secondary Navigation');
  ariaTreeView.innerHTML = dialogContent.querySelector('ul').parentElement.innerHTML;
  dialogContent.querySelector('ul').parentElement.replaceWith(ariaTreeView);
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

  const close = ariaDialog.querySelector('[role="dialog"] button');
  close.setAttribute('aria-label', 'Close side bar');
  close.innerHTML = '<span class="icon icon-close"></span>';

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
