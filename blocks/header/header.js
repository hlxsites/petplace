import {
  decorateIcons,
  getMetadata,
  sampleRUM,
  fetchPlaceholders,
} from '../../scripts/lib-franklin.js';
import {
  DEFAULT_REGION,
  PREFERRED_REGION_KEY,
  REGIONS,
  getId,
  getPlaceholder,
  isTablet,
} from '../../scripts/scripts.js';
import { constants as AriaDialog } from '../../scripts/aria/aria-dialog.js';
import { constants as AriaTreeView } from '../../scripts/aria/aria-treeview.js';
import { pushToDataLayer } from '../../scripts/utils/helpers.js';
import { login, logout, isLoggedIn } from '../../scripts/lib/msal/msal-authentication.js';

const placeholders = await fetchPlaceholders('/pet-adoption');
const {
  unitedStates,
  unitedKingdom,
} = placeholders;

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

  const classes = ['brand', 'tools', 'login', 'hamburger', 'close', 'meganav', 'featured-article', 'language-selector'];
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

  // meganav and featuredArticle
  const megaNav = nav.querySelector('.nav-meganav');
  const megaNavContent = nav.querySelector('.nav-meganav div');
  const megaNavWrapper = document.createElement('ul');
  megaNavWrapper.className = 'nav-wrapper';
  megaNavWrapper.append(nav);
  block.append(nav);

  // featuredArticle
  const featuredArticle = nav.querySelector('.nav-featured-article');
  const articleTitle = document.createElement('span');
  articleTitle.classList.add('article-title');
  articleTitle.innerText = featuredArticle.children[0].innerText;
  const articleImg = document.createElement('picture');
  articleImg.innerHTML = featuredArticle.querySelector('picture').innerHTML;
  articleImg.classList.add('article-img');
  const articleDescription = document.createElement('p');
  articleDescription.innerText = featuredArticle.children[2].innerText;
  articleDescription.classList.add('article-desc');
  const articleUrl = document.createElement('a');
  articleUrl.setAttribute('href', featuredArticle.querySelector('a').getAttribute('href'));
  articleUrl.innerText = featuredArticle.querySelector('a').innerText;
  articleUrl.classList.add('article-url');

  featuredArticle.innerHTML = '';
  featuredArticle.append(articleTitle);
  featuredArticle.append(articleImg);
  featuredArticle.append(articleDescription);
  featuredArticle.append(articleUrl);

  const petMenuList = document.createElement('ul');
  const ulEl = document.createElement('ul');
  let tempLI;
  let tempDiv;

  [...megaNavContent.children].forEach((item, index) => {
    const listItem = document.createElement('li');
    const petSubMenuList = document.createElement('div');
    petSubMenuList.classList.add('content', 'content-dropdown');

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
        menuTitle.classList.add('collapsible', 'menu-item', 'button-dropdown');
      }
      listItem.appendChild(menuTitle);
      petMenuList.append(listItem);
      tempLI = listItem;
      tempDiv = petSubMenuList;
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

      const breakLi = document.createElement('li');
      breakLi.classList.add('break');

      aEl.append(picEl);
      aEl.append(divEl);
      divEl.append(spanEl);
      divEl.append(pEl);
      listItem.append(aEl);

      tempDiv.append(ulEl);
      tempDiv.append(featuredArticle);
      ulEl.append(listItem);
      if (index % 4 === 0) {
        ulEl.append(breakLi);
      }
      tempLI.append(tempDiv);
      tempDiv.previousElementSibling.classList.add('collapsible', 'menu-item');

      const parentEl = tempDiv.previousElementSibling;
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

  // region selector
  const regionSelectorWrapper = nav.querySelector('.nav-language-selector');
  const regionSelector = document.createElement('button');
  const regionSelectorName = document.createElement('span');
  const regionMenu = document.createElement('div');
  const regions = [DEFAULT_REGION, ...Object.keys(REGIONS)];
  regions
    .filter((r) => r !== document.documentElement.lang)
    .forEach((r) => {
      const regionLink = document.createElement('a');
      const regionName = document.createElement('span');
      regionLink.setAttribute('hreflang', r);
      regionLink.setAttribute('href', r === DEFAULT_REGION ? '/' : `/${r.toLowerCase()}/`);
      regionLink.title = `Navigate to our ${r} website`;
      regionLink.addEventListener('click', (ev) => {
        localStorage.setItem(PREFERRED_REGION_KEY, ev.target.getAttribute('hreflang'));
      });
      regionName.classList.add('region-name');
      regionName.textContent = DEFAULT_REGION === r ? unitedStates : unitedKingdom;
      const regionIcon = document.createElement('span');
      regionIcon.classList.add('icon', `icon-flag-${r.toLowerCase()}`);
      regionLink.append(regionIcon);
      regionLink.append(regionName);
      regionMenu.append(regionLink);
    });
  const regionSelectorIcon = document.createElement('span');
  regionSelectorIcon.classList.add('icon', `icon-flag-${document.documentElement.lang.toLowerCase()}`);
  regionSelector.append(regionSelectorIcon);
  regionSelectorName.classList.add('region-name');
  regionSelectorName.textContent = document.documentElement.lang.toLowerCase() === 'en-us' ? unitedStates : unitedKingdom;
  regionSelector.append(regionSelectorName);
  if (isPopoverSupported()) {
    regionMenu.popover = 'auto';
    regionSelector.popoverTargetElement = regionMenu;
    regionSelector.popoverTargetAction = 'toggle';
    regionSelector.addEventListener('click', () => {
      const currentAction = regionSelector.getAttribute('popovertargetaction');

      if (currentAction === 'show') {
        regionSelector.classList.remove('active');
        regionSelector.setAttribute('popovertargetaction', 'hide');
      } else {
        regionSelector.classList.add('active');
        regionSelector.setAttribute('popovertargetaction', 'show');
      }
      regionMenu.togglePopover();
    });
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

  regionSelectorWrapper.append(regionSelector);
  regionSelectorWrapper.append(regionMenu);
  decorateIcons(regionSelectorWrapper);
  nav.insertBefore(regionSelectorWrapper, navToolsMobile);

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
    document.querySelector('.nav-language-selector').classList.remove('hidden');
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
    document.querySelector('.nav-language-selector').classList.add('hidden');
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
        megaNav.classList.add('hidden');
        navHamburger.classList.remove('hidden');
        document.querySelector('.nav-language-selector').classList.add('hidden');
      }
    } else {
      navClose.classList.add('hidden');
      navHamburger.classList.add('hidden');
      navToolsDesktop.classList.remove('hidden');
      navToolsMobile.classList.add('hidden');
      megaNav.classList.remove('hidden');
      document.querySelector('.nav-language-selector').classList.remove('hidden');
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
    const buttonDropdown = document.querySelector('.button-dropdown');
    const contentDropdown = document.querySelector('.content-dropdown');
    if (!document.querySelector('.content-dropdown').contains(event.target) && !document.querySelector('.button-dropdown').contains(event.target)) {
      buttonDropdown.classList.remove('active');
      contentDropdown.style.maxHeight = null;
    }
  });

  decorateIcons(nav);
}
