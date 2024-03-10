import {
  decorateIcons,
  getMetadata,
  sampleRUM,
} from '../../scripts/lib-franklin.js';
import { getPlaceholder } from '../../scripts/scripts.js';
import { constants as AriaDialog } from '../../scripts/aria/aria-dialog.js';
import { constants as AriaTreeView } from '../../scripts/aria/aria-treeview.js';
import { pushToDataLayer } from '../../scripts/utils/helpers.js';

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // fetch nav content
  const navMeta = getMetadata('mega-nav');
  const navPath = navMeta ? new URL(navMeta).pathname : `${window.hlx.contentBasePath}/fragments/mega-nav`;
  let resp = await fetch(`${navPath}.plain.html`);

  if (!resp.ok) {
    return;
  }

  const html = await resp.text();

  // decorate nav DOM
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.innerHTML = html;

  const classes = ['brand', 'tools', 'login', 'hamburger', 'meganav'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  // const navHamburger = nav.querySelector('.nav-hamburger');
  // navHamburger.innerHTML = `
  //   <button type="button" aria-controls="nav" aria-label="${getPlaceholder('openNavigation')}">
  //     ${navHamburger.innerHTML}
  //   </button>`;

  // nav.querySelector('.nav-brand a').setAttribute('aria-label', getPlaceholder('logoLinkLabel'));

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

  const navLogin = nav.querySelector('.nav-login');
  const loginBtnContainer = document.createElement('div');
  loginBtnContainer.classList.add('login-btn-container');
  const loginBtn = document.createElement('button');
  loginBtn.className = 'login-btn';
  loginBtn.setAttribute('aria-label', 'login');
  loginBtn.textContent = navLogin.textContent;
  loginBtnContainer.append(loginBtn);
  navLogin.innerHTML = '';
  navLogin.append(loginBtnContainer);

  const megaNav = nav.querySelector('.nav-meganav');
  const megaNavContent = nav.querySelector('.nav-meganav div');
  const megaNavWrapper = document.createElement('ul');
  megaNavWrapper.className = 'nav-wrapper';
  megaNavWrapper.append(nav);
  block.append(nav);

  const petMenuList = document.createElement('ul');
  let tempLI;
  let tempUl;

  [...megaNavContent.children].forEach((item) => {
    const listItem = document.createElement('li');
    const petSubMenuList = document.createElement('ul');
    petSubMenuList.classList.add('content');

    if (item.children.length === 1) {
      let menuTitle = document.createElement('button');
      menuTitle.innerHTML = item.innerHTML;
      menuTitle.querySelector('a');

      if (menuTitle.querySelector('a') !== null) {
        menuTitle = menuTitle.querySelector('a');
        menuTitle.classList.add('menu-item');
      } else {
        menuTitle.innerText = item.innerText;
        menuTitle.setAttribute('role', 'button');
        menuTitle.classList.add('collapsible', 'menu-item');
      }
      listItem.appendChild(menuTitle);
      petMenuList.append(listItem);
      tempLI = listItem;
      tempUl = petSubMenuList;
    } else if (item.children.length > 1) {
      listItem.innerHTML = item.innerHTML;
      tempUl.append(listItem);
      tempLI.append(tempUl);
      tempUl.previousElementSibling.classList.add('collapsible', 'menu-item');

      const parentEl = tempUl.previousElementSibling;
      if (parentEl.tagName === 'A') {
        const newButton = document.createElement('button');
        newButton.textContent = parentEl.textContent;
        newButton.setAttribute('role', 'button');
        newButton.classList.add('collapsible', 'menu-item');
        parentEl.parentNode.insertBefore(newButton, parentEl);
        parentEl.parentNode.removeChild(parentEl);
      }
    }
  });

  megaNav.innerHTML = '';
  megaNav.append(petMenuList);

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

  block.querySelector('.collapsible').addEventListener('click', (event) => {
    event.target.classList.toggle('active');
    const content = event.target.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = `${content.scrollHeight}px`;
    }
  });

  decorateIcons(nav);
}
