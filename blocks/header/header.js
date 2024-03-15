import {
  decorateIcons,
  getMetadata,
  sampleRUM,
} from '../../scripts/lib-franklin.js';
import { getPlaceholder, isTablet } from '../../scripts/scripts.js';
import { constants as AriaDialog } from '../../scripts/aria/aria-dialog.js';
import { constants as AriaTreeView } from '../../scripts/aria/aria-treeview.js';
import { pushToDataLayer } from '../../scripts/utils/helpers.js';
import { login, logout, isLoggedIn } from '../../scripts/lib/msal/msal-authentication.js';

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // fetch nav content
  const navMeta = getMetadata('mega-nav');
  const navPath = navMeta ? new URL(navMeta).pathname : `${window.hlx.contentBasePath}/fragments/mega-nav`;
  const resp = await fetch(`${navPath}.plain.html`);

  if (!resp.ok) {
    return;
  }

  const html = await resp.text();

  // decorate nav DOM
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.innerHTML = html;

  const classes = ['brand', 'tools', 'login', 'hamburger', 'close', 'meganav'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  // logo
  nav.querySelector('.nav-brand a').setAttribute('aria-label', getPlaceholder('logoLinkLabel'));

  // search bar
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

  const navToolsDesktop = document.createElement('div');
  navToolsDesktop.classList.add('nav-tools-desktop', 'hidden');
  navToolsDesktop.append(searchForm);

  const mobileSearchForm = searchForm.cloneNode(true);
  const navToolsMobile = document.createElement('div');
  navToolsMobile.classList.add('nav-tools-mobile', 'hidden');
  navToolsMobile.append(mobileSearchForm);

  navTools.append(navToolsDesktop);

  searchButton.addEventListener('click', (ev) => {
    ev.preventDefault();
    if (searchField.value !== '') {
      searchForm.submit();
    }
  });

  // login
  const navLogin = nav.querySelector('.nav-login');
  const userMenu = document.createElement('button');
  const loginBtnsContainer = document.createElement('div');
  loginBtnsContainer.classList.add('account-options', 'hidden');
  navLogin.querySelectorAll('li').forEach((item, index) => {
    if (index === 0) {
      const loginBtn = document.createElement('button');
      loginBtn.className = 'login-btn';
      loginBtn.setAttribute('aria-label', 'login');
      loginBtn.textContent = item.textContent;
      navLogin.append(loginBtn);
    }

    if (index > 0) {
      if (item.querySelector('a')) {
        const userLinks = item.querySelector('a');
        userLinks.classList.add('account-btn');
        loginBtnsContainer.append(userLinks);
      } else if (item.querySelector('picture')) {
        userMenu.classList.add('user-btn', 'hidden');
        userMenu.append(item.querySelector('picture'));
        navLogin.append(userMenu);
      } else {
        const signOutBtn = document.createElement('button');
        signOutBtn.className = 'sign-out-btn';
        signOutBtn.setAttribute('aria-label', 'sign out');
        signOutBtn.textContent = item.textContent;
        loginBtnsContainer.append(signOutBtn);
      }
    }
  });
  navLogin.querySelector('ul').remove();
  navLogin.append(loginBtnsContainer);

  navLogin.querySelector('.login-btn').addEventListener('click', (event) => {
    login(() => {
      if (isLoggedIn()) {
        event.target.classList.add('hidden');
        userMenu.classList.remove('hidden');
      } else {
        event.target.classList.remove('hidden');
        userMenu.classList.add('hidden');
      }
    });
  });

  navLogin.querySelector('.user-btn').addEventListener('click', () => {
    navLogin.querySelector('.account-options').classList.toggle('hidden');
  });

  navLogin.querySelector('.sign-out-btn').addEventListener('click', () => {
    logout(() => {
      if (!isLoggedIn()) {
        navLogin.querySelector('.login-btn').classList.remove('hidden');
        navLogin.querySelector('.user-btn').classList.add('hidden');
      }
    });
  });

  // hamburguer menu
  const navHamburger = nav.querySelector('.nav-hamburger');
  navHamburger.innerHTML = `
    <button type="button" aria-controls="nav" aria-label="${getPlaceholder('openNavigation')}">
      ${navHamburger.innerHTML}
    </button>`;

  nav.querySelector('.nav-brand a').setAttribute('aria-label', getPlaceholder('logoLinkLabel'));

  const navClose = nav.querySelector('.nav-close');
  navClose.innerHTML = `
    <button type="button" aria-controls="nav" aria-label="${getPlaceholder('closeNavigation')}">
      ${navClose.innerHTML}
    </button>`;
  navClose.classList.add('hidden');

  // meganav
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
      const aHref = item.querySelector('a').getAttribute('href');
      const aText = item.querySelector('a').innerText;
      const picEl = item.querySelector('picture');
      const pEl = item.querySelectorAll('p')[1];
      pEl.classList.add('pet-topic-description');

      const aEl = document.createElement('a');
      aEl.setAttribute('href', aHref);
      aEl.classList.add('pet-topic');

      const spanEl = document.createElement('span');
      spanEl.innerText = aText;
      spanEl.classList.add('pet-topic-title');

      const divEl = document.createElement('div');
      divEl.classList.add('pet-topic-info');

      aEl.append(picEl);
      aEl.append(divEl);
      divEl.append(spanEl);
      divEl.append(pEl);
      listItem.append(aEl);

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
  megaNav.classList.add('hidden');
  nav.insertBefore(navToolsMobile, megaNav);
  const megaNavBg = document.createElement('div');
  megaNavBg.classList.add('meganav-bg', 'hidden');
  document.querySelector('.header-wrapper').append(megaNavBg);

  block.querySelector('.collapsible').addEventListener('click', (event) => {
    event.target.classList.toggle('active');
    const content = event.target.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = `${content.scrollHeight}px`;
    }
  });

  block.querySelector('.nav-hamburger').addEventListener('click', () => {
    navHamburger.classList.add('hidden');
    navClose.classList.remove('hidden');
    navClose.querySelector('button').focus();
    megaNavBg.classList.remove('hidden');
    document.querySelector('body').classList.add('body-locked');
    navToolsDesktop.classList.add('hidden');
    navToolsMobile.classList.remove('hidden');
    megaNav.classList.remove('hidden');
    megaNav.querySelectorAll('.collapsible').forEach((element) => {
      element.classList.remove('active');
      element.nextSibling.style.maxHeight = '';
    });
  });

  block.querySelector('.nav-close').addEventListener('click', () => {
    navClose.classList.add('hidden');
    navHamburger.classList.remove('hidden');
    navHamburger.querySelector('button').focus();
    document.querySelector('body').classList.remove('body-locked');
    navToolsDesktop.classList.add('hidden');
    navToolsMobile.classList.add('hidden');
    megaNav.classList.add('hidden');
    megaNavBg.classList.add('hidden');
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

  function checkInterface() {
    if (isTablet()) {
      if (document.querySelector('body').classList.contains('body-locked')) {
        navClose.click();
      } else {
        navToolsMobile.classList.add('hidden');
        navToolsDesktop.classList.add('hidden');
        navHamburger.classList.remove('hidden');
      }
    } else {
      navClose.classList.add('hidden');
      navHamburger.classList.add('hidden');
      navToolsDesktop.classList.remove('hidden');
      navToolsMobile.classList.add('hidden');
      megaNav.classList.remove('hidden');
    }

    isLoggedIn().then(isLoggedIn => {
      if (isLoggedIn) {
        navLogin.querySelector('.user-btn').classList.remove('hidden');
        navLogin.querySelector('.login-btn').classList.add('hidden');
      } else {
        navLogin.querySelector('.user-btn').classList.add('hidden');
        navLogin.querySelector('.login-btn').classList.remove('hidden');
      }
    });
  }

  checkInterface();

  window.addEventListener('resize', () => {
    checkInterface();
  });

  document.addEventListener('click', (event) => {
    if (!document.querySelector('.account-options').contains(event.target) && !document.querySelector('.user-btn').contains(event.target)) {
      document.querySelector('.account-options').classList.add('hidden');
    }
  });

  decorateIcons(nav);
}
