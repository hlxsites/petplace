/* eslint-disable no-nested-ternary */
import { getMetadata } from './lib-franklin.js';
import {
  clickHelper,
  getSocialName,
  pushToDataLayer,
  articleLinksHelper,
  articlePopularHelper,
} from './utils/helpers.js';

// GLOBAL VARIABLES
const handleGlobalVariables = () => {
  const contentGroup = document.querySelector('meta[name="category"]');
  pushToDataLayer({
    content_group: contentGroup
      ? contentGroup.content
      : 'N/A - Content Group Not Set',
  });
};

// ARTICLES - sharing
const handleArticleShare = () => {
  const shareIcon = document.querySelector('.social-share');
  if (!shareIcon) return;

  shareIcon.addEventListener('click', (ev) => {
    const icon = ev.target.closest('a');
    if (!icon) return;

    pushToDataLayer({
      event: 'article_share',
      method: getSocialName(icon.href),
    });
  });
};

// ARTICLES - links
const handleArticleClicks = () => {
  articleLinksHelper();
  articlePopularHelper();
};

// INSURANCE PAID PAGE

// Header Quote CTA
const handleHeaderCtaClicks = () => {
  const headerQuoteCTA = document.querySelector('.header-quote-cta');
  if (!headerQuoteCTA) return;
  headerQuoteCTA.addEventListener('click', () => {
    pushToDataLayer({
      cta_location: 'header_cta',
    });
  });
};

// Body CTAs
const handleBodyCtaClicks = () => {
  const callOuts = document.querySelectorAll('.callout-get-a-quote');
  if (!callOuts) return;
  callOuts.forEach((callOut, i) => {
    callOut.addEventListener('click', (ev) => {
      const link = ev.target.closest('a');
      if (!link) return;

      pushToDataLayer({
        cta_location: `body_${i + 1}_cta`,
      });
    });
  });
};

// Sidebar Btns
const handleSidebarBtns = () => {
  const sidebarBtns = document.querySelectorAll('.sidebar-right button');
  if (!sidebarBtns) return;
  sidebarBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      pushToDataLayer({
        cta_location: 'right_margin_cta',
      });
    });
  });
};

// HEADER - nav, menu, sidebar, social
const handleHeaderClicks = () => {
  document.querySelector('header').addEventListener('click', (ev) => {
    const link = ev.target.closest('a');
    if (!link) return;

    const headerText = link.closest('.nav-sidebar-social')
      ? getSocialName(link.href)
      : link.innerHTML;
    const headerCat = link.closest('.nav-sections')
      ? 'Nav'
      : link.closest('.nav-sidebar-links')
        ? 'Menu'
        : link.closest('.nav-sidebar-misc')
          ? 'Sidebar'
          : link.closest('.nav-sidebar-social')
            ? 'Social'
            : 'Other';

    clickHelper(`Header ${headerCat}`, headerText, 'link', link.href);
  });
};

// FOOTER - nav, social, legal
const handleFooterClicks = () => {
  document.querySelector('footer').addEventListener('click', (ev) => {
    const link = ev.target.closest('a');
    if (!link) return;

    const footerText = link.closest('.footer-social')
      ? getSocialName(link.href)
      : link.innerHTML;
    const footerCat = link.closest('.footer-nav-links')
      ? 'Nav'
      : link.closest('.footer-legal')
        ? 'Legal'
        : link.closest('.footer-social')
          ? 'Social'
          : 'Other';

    clickHelper(`Footer ${footerCat}`, footerText, 'link', link.href);
  });
};

const handleComparePlanClicks = (className) => {
  document.querySelector(className)?.addEventListener('click', (ev) => {
    const btn = ev.target.closest('button');
    if (!btn) return;

    clickHelper(
      'CTA Button',
      btn.innerText,
      'button',
      'https://quote.petplace.com/quote',
    );
  });
};

// CTA - hero banner, insurance button
const handleCtaClicks = () => {
  if (window.location.pathname === `${window.hlx.contentBasePath}/`) {
    handleComparePlanClicks('.insurance-search');

    document.querySelectorAll('.home-banner.image-hero').forEach((banner) => {
      banner.addEventListener('click', (ev) => {
        const btn = ev.target.closest('.image-hero');
        if (!btn) return;
        const title = btn.querySelector('h2').innerHTML;
        const link = btn.querySelector('a').href;

        clickHelper('hero_cta_button', title, 'button', link);
      });
    });
  }

  if (
    window.location.pathname === `${window.hlx.contentBasePath}/pet-insurance`
  ) {
    handleComparePlanClicks('.top-search');
    handleComparePlanClicks('.bottom-search');
  }
};

const handleExperiments = () => {
  if (getMetadata('experiment')) {
    pushToDataLayer({
      event: 'experiment',
      experiment: window.hlx.experiment.id,
      variant: window.hlx.experiment.selectedVariant,
    });
  }
};

export const handleDataLayerApproach = () => {
  handleGlobalVariables();

  // additional check to only run on article pages
  if (window.location.pathname.includes('article')) {
    handleArticleShare();
    handleArticleClicks();
  }

  // additional check to only run on insurance paid pages
  if (window.location.pathname.includes('insurance-paid-page')) {
    handleHeaderCtaClicks();
    handleBodyCtaClicks();
    handleSidebarBtns();
  }

  // ELEMENT CLICKS
  handleHeaderClicks();
  handleFooterClicks();
  handleCtaClicks();

  handleExperiments();
};
