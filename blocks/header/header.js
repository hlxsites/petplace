import { constants as AriaDialog } from '../../scripts/aria/aria-dialog.js';
import { constants as AriaTreeView } from '../../scripts/aria/aria-treeview.js';
import {
  decorateIcons,
  fetchPlaceholders,
  getMetadata,
  sampleRUM,
} from '../../scripts/lib-franklin.js';
import { isLoggedIn, login } from '../../scripts/lib/msal/msal-authentication.js';
import {
  ACTIVE_REGIONS,
  DEFAULT_REGION,
  getId,
  getPlaceholder,
  isTablet,
  PREFERRED_REGION_KEY,
  REGIONS,
} from '../../scripts/scripts.js';
import { pushToDataLayer } from '../../scripts/utils/helpers.js';
import { debounce } from '../../util/debouce.js';
import {
  addClassesTo, addClassesToSelector,
  removeClassesFrom,
  removeClassesFromSelector,
} from '../../util/element-util.js';

import { getAuthToken, parseJwt } from '../../scripts/parse-jwt.js';

const placeholders = await fetchPlaceholders('/pet-adoption');
const { unitedStates, unitedKingdom } = placeholders;

const USER_NAV_MY_PETS_ID = 'user-nav-my-pets-link';

function isPopoverSupported() {
  // eslint-disable-next-line no-prototype-builtins
  return HTMLElement.prototype.hasOwnProperty('popover');
}

async function setupMyPetsLink() {
  const authToken = await getAuthToken();
  if (!authToken) return;

  // check if the user has the required claims to access the link
  const claim = parseJwt(authToken);
  if (!claim) return;

  const hasRelationId = claim.extension_CustRelationId && claim.extension_CustRelationId !== '0';
  const hasAdoptionId = claim.extension_AdoptionId && claim.extension_AdoptionId !== '0';

  // if the user have the required claims, include the link
  if (hasRelationId || hasAdoptionId) {
    document.getElementById(USER_NAV_MY_PETS_ID)?.classList.remove('hidden');
  }
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // fetch nav content
  let navMeta = null;
  let navPath = '';
  let resp = null;

  if (document.documentElement.lang.toLowerCase() === 'en-us') {
    // Dev Note: this is a conditional check to use the minimal header
    // for the insurance paid page template
    if (window.location.href.includes('insurance-paid-page')) {
      // build minimal header for insurance paid page, which contains the logo and a cta
      navMeta = getMetadata('header-minimal');
      navPath = navMeta
        ? new URL(navMeta).pathname
        : `${window.hlx.contentBasePath}/fragments/header-minimal`;

      resp = await fetch(`${navPath}.plain.html`);

      if (!resp.ok) {
        return;
      }

      const html = await resp.text();

      // create minimal header
      const headerWrapper = document.querySelector('.header-wrapper');
      headerWrapper.innerHTML = '';

      const headerContent = document.createElement('div');
      addClassesTo(headerContent, 'header-content--minimal');

      const headerContainer = document.createElement('div');
      addClassesTo(headerContainer, 'header-container');

      headerContainer.innerHTML = html;

      const classes = ['brand', 'quote-cta'];
      classes.forEach((c, i) => {
        const section = headerContainer.children[i];
        if (section) section.classList.add(`header-${c}`);
      });

      // logo
      headerContainer
        .querySelector('.header-brand a')
        .setAttribute('aria-label', getPlaceholder('logoLinkLabel'));

      // cta button
      const ctaButton = headerContainer.querySelector('.header-quote-cta a');
      ctaButton.innerText = getPlaceholder('getQuoteLabel');
      ctaButton.setAttribute('target', '_blank');

      decorateIcons(headerContainer);
      headerContent.append(headerContainer);
      headerWrapper.append(headerContent);
    } else {
      // build new mega nav for US clients

      navMeta = getMetadata('mega-nav');
      navPath = navMeta
        ? new URL(navMeta).pathname
        : `${window.hlx.contentBasePath}/fragments/mega-nav`;
      resp = await fetch(`${navPath}.plain.html`);

      if (!resp.ok) {
        return;
      }

      const html = await resp.text();

      // decorate nav DOM
      const nav = document.createElement('nav');
      nav.id = 'nav';
      nav.innerHTML = html;

      const classes = [
        'brand',
        'tools',
        'login',
        'hamburger',
        'close',
        'meganav',
        'featured-article',
        'language-selector',
      ];
      classes.forEach((c, i) => {
        const section = nav.children[i];
        if (section) section.classList.add(`nav-${c}`);
      });

      // logo
      nav
        .querySelector('.nav-brand a')
        .setAttribute('aria-label', getPlaceholder('logoLinkLabel'));

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
      addClassesTo(navToolsDesktop, 'nav-tools-desktop', 'hidden');
      navToolsDesktop.append(searchForm);

      const mobileSearchForm = searchForm.cloneNode(true);
      const navToolsMobile = document.createElement('div');
      addClassesTo(navToolsMobile, 'nav-tools-mobile', 'hidden');
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
      addClassesTo(loginBtnsContainer, 'account-options', 'hidden');
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
            addClassesTo(userLinks, 'account-btn');

            const linkText = userLinks.textContent.toLowerCase();

            // The "My Pets" menu link is treated differently
            if (linkText === 'my pets') {
              userLinks.setAttribute('id', USER_NAV_MY_PETS_ID);
              addClassesTo(userLinks, 'my-pets-link', 'hidden');
              setupMyPetsLink();
            }

            if (linkText === 'my account') {
              addClassesTo(userLinks, 'my-account-link');
            } else if (linkText === 'pet adoption') {
              addClassesTo(userLinks, 'pet-adoption-link');
            }

            loginBtnsContainer.append(userLinks);
          } else if (item.querySelector('picture')) {
            addClassesTo(userMenu, 'user-btn', 'hidden');
            userMenu.append(item.querySelector('picture'));
            navLogin.append(userMenu);
          } else {
            const signOutBtn = document.createElement('button');
            signOutBtn.className = 'sign-out-btn logout-link';
            signOutBtn.setAttribute('aria-label', 'sign out');
            signOutBtn.textContent = item.textContent;
            loginBtnsContainer.append(signOutBtn);
          }
        }
      });
      navLogin.querySelector('ul').remove();
      navLogin.append(loginBtnsContainer);
      navLogin
        .querySelector('.login-btn')
        .addEventListener('click', async (event) => {
          login(() => {
            if (isLoggedIn()) {
              event.target.classList.add('hidden');
              userMenu.classList.remove('hidden');

              setupMyPetsLink();
            } else {
              event.target.classList.remove('hidden');
              addClassesTo(userMenu, 'hidden');
            }
          });
        });

      navLogin.querySelector('.user-btn').addEventListener('click', () => {
        navLogin.querySelector('.account-options').classList.toggle('hidden');
      });
      navLogin
        .querySelector('.sign-out-btn')
        .addEventListener('click', async () => {
          // eslint-disable-next-line
          const { logout, isLoggedIn } = await import(
            '../../scripts/lib/msal/msal-authentication.js'
          );
          logout(() => {
            if (!isLoggedIn()) {
              removeClassesFromSelector('.login-btn', 'hidden');
              addClassesToSelector('.user-btn', 'hidden');
            }
          });
        });

      // hamburguer menu
      const navHamburger = nav.querySelector('.nav-hamburger');
      navHamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="${getPlaceholder(
        'openNavigation',
      )}">${navHamburger.innerHTML}</button>`;

      nav
        .querySelector('.nav-brand a')
        .setAttribute('aria-label', getPlaceholder('logoLinkLabel'));

      const navClose = nav.querySelector('.nav-close');
      navClose.innerHTML = `<button type="button" aria-controls="nav" aria-label="${getPlaceholder(
        'closeNavigation',
      )}">${navClose.innerHTML}</button>`;
      addClassesTo(navClose, 'hidden');

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
      addClassesTo(articleTitle, 'article-title');
      articleTitle.innerText = featuredArticle.children[0].innerText;
      const articleImg = document.createElement('picture');
      articleImg.innerHTML = featuredArticle.querySelector('picture').innerHTML;
      addClassesTo(articleImg, 'article-img');
      const articleDescription = document.createElement('p');
      articleDescription.innerText = featuredArticle.children[2].innerText;
      addClassesTo(articleDescription, 'article-desc');
      const articleUrl = document.createElement('a');
      articleUrl.setAttribute(
        'href',
        featuredArticle.querySelector('a').getAttribute('href'),
      );
      articleUrl.innerText = featuredArticle.querySelector('a').innerText;
      addClassesTo(articleUrl, 'article-url');

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
        addClassesTo(petSubMenuList, 'content', 'content-dropdown');

        if (item.children.length === 1) {
          let menuTitle = document.createElement('button');
          menuTitle.innerHTML = item.innerHTML;
          menuTitle.querySelector('a');

          if (menuTitle.querySelector('a') !== null) {
            menuTitle = menuTitle.querySelector('a');
            addClassesTo(menuTitle, 'menu-item');
          } else {
            menuTitle.innerText = item.innerText;
            menuTitle.setAttribute('role', 'button');
            addClassesTo(
              menuTitle,
              'collapsible',
              'menu-item',
              'button-dropdown',
            );
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
          addClassesTo(pEl, 'pet-topic-description');

          const aEl = document.createElement('a');
          aEl.setAttribute('href', aHref);
          addClassesTo(aEl, 'pet-topic');

          const spanEl = document.createElement('span');
          spanEl.innerText = aText;
          addClassesTo(spanEl, 'pet-topic-title');

          const divEl = document.createElement('div');
          addClassesTo(divEl, 'pet-topic-info');

          const breakLi = document.createElement('li');
          addClassesTo(breakLi, 'break');

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
          addClassesTo(
            tempDiv.previousElementSibling,
            'collapsible',
            'menu-item',
          );

          const parentEl = tempDiv.previousElementSibling;
          if (parentEl.tagName === 'A') {
            const newButton = document.createElement('button');
            newButton.textContent = parentEl.textContent;
            newButton.setAttribute('role', 'button');
            addClassesTo(newButton, 'collapsible', 'menu-item');
            parentEl.parentNode.insertBefore(newButton, parentEl);
            parentEl.parentNode.removeChild(parentEl);
          }
        }
      });

      megaNav.innerHTML = '';
      megaNav.append(petMenuList);
      addClassesTo(megaNav, 'hidden');
      nav.insertBefore(navToolsMobile, megaNav);
      const megaNavBg = document.createElement('div');
      addClassesTo(megaNavBg, 'meganav-bg', 'hidden');
      document.querySelector('.header-wrapper').append(megaNavBg);

      // region selector
      const regionSelectorWrapper = nav.querySelector('.nav-language-selector');
      const regionSelector = document.createElement('button');
      const regionSelectorName = document.createElement('span');
      const regionMenu = document.createElement('div');
      const regions = new Set([
        DEFAULT_REGION,
        ...Object.keys(ACTIVE_REGIONS),
      ]).entries();
      if (regions.length > 1) {
        regions
          .filter((r) => r !== document.documentElement.lang)
          .forEach((r) => {
            const regionLink = document.createElement('a');
            const regionName = document.createElement('span');
            regionLink.setAttribute('hreflang', r);
            regionLink.setAttribute(
              'href',
              r === DEFAULT_REGION ? '/' : `/${r.toLowerCase()}/`,
            );
            regionLink.title = `Navigate to our ${r} website`;
            regionLink.addEventListener('click', (ev) => {
              localStorage.setItem(
                PREFERRED_REGION_KEY,
                ev.target.closest('a').getAttribute('hreflang'),
              );
            });
            addClassesTo(regionName, 'region-name');
            regionName.textContent = DEFAULT_REGION === r ? unitedStates : unitedKingdom;
            const regionIcon = document.createElement('span');
            addClassesTo(regionIcon, 'icon', `icon-flag-${r.toLowerCase()}`);
            regionLink.append(regionIcon);
            regionLink.append(regionName);
            regionMenu.append(regionLink);
          });
        const regionSelectorIcon = document.createElement('span');
        addClassesTo(
          regionSelectorIcon,
          'icon',
          `icon-flag-${document.documentElement.lang.toLowerCase()}`,
        );
        regionSelector.append(regionSelectorIcon);
        addClassesTo(regionSelectorName, 'region-name');
        regionSelectorName.textContent = document.documentElement.lang.toLowerCase() === 'en-us'
          ? unitedStates
          : unitedKingdom;
        regionSelector.append(regionSelectorName);
        addClassesTo(regionSelector, 'btn-regions-list');
        addClassesTo(regionMenu, 'regions-list', 'hidden');
        regionSelector.addEventListener('click', () => {
          regionMenu.classList.toggle('hidden');
          regionSelector.classList.toggle('active');
        });

        regionSelectorWrapper.append(regionSelector);
        regionSelectorWrapper.append(regionMenu);
        decorateIcons(regionSelectorWrapper);
        nav.insertBefore(regionSelectorWrapper, navToolsMobile);
      }

      block.querySelector('.collapsible').addEventListener('click', (event) => {
        event.target.classList.toggle('active');
        const content = event.target.nextElementSibling;
        if (content.style.maxHeight) {
          content.style.maxHeight = null;
        } else {
          content.style.maxHeight = `${content.scrollHeight}px`;
        }
      });

      window.addEventListener('scroll', () => {
        const collapsible = block.querySelector('.collapsible');
        const content = collapsible.nextElementSibling;
        const isActive = collapsible.classList.value.includes('active');

        if (content.style.maxHeight) {
          content.style.maxHeight = null;
        }
        if (isActive) {
          removeClassesFrom(collapsible, 'active');
        }
      });

      block.querySelector('.nav-hamburger').addEventListener('click', (event) => {
        addClassesTo(navHamburger, 'hidden');
        removeClassesFrom(navClose, 'hidden');
        navClose.querySelector('button').focus();
        removeClassesFrom(megaNavBg, 'hidden');
        addClassesTo(navToolsDesktop, 'hidden');
        removeClassesFrom(navToolsMobile, 'hidden');
        removeClassesFrom(megaNav, 'hidden');
        megaNav.querySelectorAll('.collapsible').forEach((element) => {
          removeClassesFrom(element, 'active');
          element.nextSibling.style.maxHeight = '';
        });
        removeClassesFromSelector('.nav-language-selector', 'hidden');
        removeClassesFromSelector('.btn-regions-list', 'active');
        const buttonDropdown = document.querySelector('.button-dropdown');
        const contentDropdown = document.querySelector('.content-dropdown');
        if (
          !document.querySelector('.content-dropdown').contains(event.target)
          && !document.querySelector('.button-dropdown').contains(event.target)
        ) {
          removeClassesFrom(buttonDropdown, 'active');
          contentDropdown.style.maxHeight = null;
        }
        if (
          !document.querySelector('.regions-list')?.contains(event.target)
          && !document.querySelector('.btn-regions-list')?.contains(event.target)
        ) {
          addClassesToSelector('.regions-list', 'hidden');
        }
      });

      block.querySelector('.nav-close').addEventListener('click', () => {
        addClassesTo(navClose, 'hidden');
        removeClassesFrom(navHamburger, 'hidden');
        navHamburger.querySelector('button').focus();
        removeClassesFromSelector('body', 'body-locked');
        addClassesTo(navToolsDesktop, 'hidden');
        addClassesTo(navToolsMobile, 'hidden');
        addClassesTo(megaNav, 'hidden');
        addClassesTo(megaNavBg, 'hidden');
        addClassesToSelector('.nav-language-selector', 'hidden');
        removeClassesFrom(regionSelector, 'active');
        removeClassesFromSelector('.btn-regions-list', 'active');
        addClassesToSelector('.regions-list', 'hidden');
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

      // eslint-disable-next-line no-inner-declarations
      function checkInterface() {
        if (isTablet()) {
          if (document.querySelector('body').classList.contains('body-locked')) {
            navClose.click();
          } else {
            addClassesTo(navToolsMobile, 'hidden');
            addClassesTo(navToolsDesktop, 'hidden');
            addClassesTo(megaNav, 'hidden');
            removeClassesFrom(navHamburger, 'hidden');
            addClassesToSelector('.nav-language-selector', 'hidden');
            removeClassesFromSelector('.btn-regions-list', 'active');
            addClassesToSelector('.regions-list', 'hidden');
          }
        } else {
          addClassesTo(navClose, 'hidden');
          addClassesTo(navHamburger, 'hidden');
          removeClassesFrom(navToolsDesktop, 'hidden');
          addClassesTo(navToolsMobile, 'hidden');
          removeClassesFrom(megaNav, 'hidden');
          removeClassesFromSelector('.nav-language-selector', 'hidden');
        }

        isLoggedIn().then((isLoggedInParam) => {
          if (isLoggedInParam) {
            removeClassesFromSelector('.user-btn', 'hidden');
            addClassesToSelector('.login-btn', 'hidden');
          } else {
            addClassesToSelector('.user-btn', 'hidden');
            removeClassesFromSelector('.login-btn', 'hidden');
          }
        });
      }

      checkInterface();

      // Schedule a new checkInterface call after 2 seconds
      // to be sure that the interface is loaded correctly
      setTimeout(checkInterface, 2000);

      if (isTablet()) {
        addClassesToSelector('.nav-language-selector', 'hidden');
      }

      // Debounce the checkInterface function to avoid multiple calls when resizing the window
      window.addEventListener('resize', debounce(checkInterface));

      document.addEventListener('click', (event) => {
        if (
          !document.querySelector('.account-options').contains(event.target)
          && !document.querySelector('.user-btn').contains(event.target)
        ) {
          addClassesToSelector('.account-options', 'hidden');
        }
        const buttonDropdown = document.querySelector('.button-dropdown');
        const contentDropdown = document.querySelector('.content-dropdown');
        if (
          !document.querySelector('.content-dropdown').contains(event.target)
          && !document.querySelector('.button-dropdown').contains(event.target)
        ) {
          removeClassesFrom(buttonDropdown, 'active');
          contentDropdown.style.maxHeight = null;
        }
        if (document.querySelector('.regions-list')
          && !document.querySelector('.regions-list')?.contains(event.target)
          && !document.querySelector('.btn-regions-list')?.contains(event.target)
        ) {
          addClassesToSelector('.regions-list', 'hidden');
        }
      });

      decorateIcons(nav);
    }
  } else {
    // build british nav

    navMeta = getMetadata('nav');
    navPath = navMeta
      ? new URL(navMeta).pathname
      : `${window.hlx.contentBasePath}/fragments/nav`;
    let response = await fetch(`${navPath}.plain.html`);
    if (!response.ok) {
      return;
    }

    const headerWrapper = document.querySelector('.header-wrapper');
    addClassesTo(headerWrapper, 'header-wrapper-gb');

    let html = await response.text();

    // decorate nav DOM
    const nav = document.createElement('nav');
    nav.id = 'nav-gb';
    nav.innerHTML = html;

    let classes = ['hamburger', 'brand', 'sections', 'tools'];
    classes.forEach((c, i) => {
      const section = nav.children[i];
      if (section) section.classList.add(`nav-${c}`);
    });

    const navHamburger = nav.querySelector('.nav-hamburger');
    navHamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="${getPlaceholder('openNavigation')}">${navHamburger.innerHTML}</button>`;

    nav
      .querySelector('.nav-brand a')
      .setAttribute('aria-label', getPlaceholder('logoLinkLabel'));

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
    searchForm.dataset.rumSource = '.header .search';

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

    // FIXME: remove conditional on UK website go-live
    if (window.hlx.contentBasePath) {
      const regionSelector = document.createElement('button');
      const regionMenu = document.createElement('div');
      const regions = [DEFAULT_REGION, ...Object.keys(REGIONS)];
      regions
        .filter((r) => r !== document.documentElement.lang)
        .forEach((r) => {
          const regionLink = document.createElement('a');
          regionLink.setAttribute('hreflang', r);
          regionLink.setAttribute(
            'href',
            r === DEFAULT_REGION ? '/' : `/${r.toLowerCase()}/`,
          );
          regionLink.title = `Navigate to our ${r} website`;
          regionLink.addEventListener('click', (ev) => {
            localStorage.setItem(
              PREFERRED_REGION_KEY,
              ev.target.closest('a').getAttribute('hreflang'),
            );
          });
          const regionIcon = document.createElement('span');
          addClassesTo(regionIcon, 'icon', `icon-flag-${r.toLowerCase()}`);
          regionLink.append(regionIcon);
          regionMenu.append(regionLink);
        });
      const regionSelectorIcon = document.createElement('span');
      addClassesTo(
        regionSelectorIcon,
        'icon',
        `icon-flag-${document.documentElement.lang.toLowerCase()}`,
      );
      regionSelector.append(regionSelectorIcon);
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
      decorateIcons(navTools);
    }

    const navWrapper = document.createElement('div');
    navWrapper.className = 'nav-wrapper';
    navWrapper.append(nav);
    block.append(navWrapper);

    const navSidebar = document.createElement('div');
    addClassesTo(navSidebar, 'nav-sidebar');
    response = await fetch(
      `${window.hlx.contentBasePath}/fragments/sidenav.plain.html`,
    );
    if (!response.ok) {
      return;
    }

    html = await response.text();

    const ariaDialog = document.createElement(AriaDialog.tagName);
    ariaDialog.setAttribute('modal', true);

    ariaDialog.append(nav.querySelector('.nav-hamburger span').cloneNode(true));

    const dialogContent = document.createElement('div');
    dialogContent.innerHTML = html;

    const treeViewWrapper = dialogContent.querySelector('ul').parentElement;
    const ariaTreeView = document.createElement(AriaTreeView.tagName);
    ariaTreeView.setAttribute(
      'label',
      getPlaceholder('secondaryNavigationLabel'),
    );
    ariaTreeView.append(dialogContent.querySelector('ul'));
    treeViewWrapper.replaceWith(ariaTreeView);
    ariaDialog.append(dialogContent);

    const sidebarSearch = document.createElement('div');
    const sidebarSearchForm = searchForm.cloneNode(true);
    sidebarSearchForm.dataset.rumSource = '.nav-sidebar-search .search';
    sidebarSearch.append(sidebarSearchForm);
    sidebarSearch
      .querySelector('form button')
      ?.addEventListener('click', (ev) => {
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
          dialog.firstElementChild.addEventListener('transitionend', resolve, {
            once: true,
          });
        });
      }
      dialog.firstElementChild.style.transform = 'translate(0,0)';
      return Promise.resolve();
    };

    navSidebar
      .querySelectorAll('[role="tree"] button[aria-controls]')
      .forEach((toggle) => {
        const item = navSidebar.querySelector(
          `#${toggle.getAttribute('aria-controls')}`,
        );
        toggle.setAttribute(
          'aria-label',
          getPlaceholder('openNavItem', { item: item.textContent }),
        );
      });
    const observer = new MutationObserver((entries) => {
      const { attributeName, target } = entries.pop();
      if (attributeName !== 'aria-expanded') {
        return;
      }
      const toggle = navSidebar.querySelector(
        `button[aria-controls="${target.id}"]`,
      );
      const isExpanded = target.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute(
        'aria-label',
        isExpanded
          ? getPlaceholder('closeNavItem')
          : getPlaceholder('openNavItem', { item: target.textContent }),
      );
    });
    navSidebar
      .querySelectorAll('[role="tree"] [role="treeitem"]')
      .forEach((item) => {
        observer.observe(item, { attributes: true });
      });

    block.querySelectorAll('.nav-sidebar-social a').forEach((a) => {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
      a.setAttribute(
        'aria-label',
        getPlaceholder('socialLinkLabel', {
          page: a.firstElementChild.classList[1].substring(5),
        }),
      );
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
}
