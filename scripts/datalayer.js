import {
  clickHelper,
  getSocialName,
  pushToDataLayer,
  footerNavHelper,
  headerNavHelper,
  headerMenuHelper,
  footerLegalHelper,
  footerSocialHelper,
  headerSidebarHelper,
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

// ARTICLE SHARE
const handleArticleShare = () => {
  const aTags = document.querySelectorAll('.social-share a');
  aTags.forEach((tag) => {
    tag.addEventListener('click', () => {
      pushToDataLayer({
        event: 'article_share',
        method: getSocialName(tag.href),
      });
    });
  });
};

// ELEMENT CLICK
const handleElementClicks = () => {
  // header links
  headerNavHelper();
  headerMenuHelper();
  headerSidebarHelper();

  // cta buttons (homepage only)
  if (window.location.pathname === '/') {
    const btnTracking = document.querySelectorAll(
      '.slides-container .button-container a'
    );
    btnTracking.forEach((btn) => {
      btn.addEventListener('click', () => {
        clickHelper('CTA Button', btn.title, 'button', btn.href);
      });
    });
  }


  // footer links
  const observer = new MutationObserver((entries) => {
    entries.forEach((link) => {
      const footClass = link.target.className.split('footer-');
      // TODO - unable to detect 'footer-legal' div
      if (footClass[1] === 'legal') footerLegalHelper();
      if (footClass[1] === 'social') footerSocialHelper();
      if (footClass[1] === 'nav-links') footerNavHelper();
    });
  });
  if (document.querySelector('.footer-wrapper')) {
    observer.observe(document.querySelector('.footer-wrapper'), {
      subtree: true,
      attributes: true,
      childList: true,
    });
  }
};

export const handleDataLayerApproach = () => {
  handleGlobalVariables();
  handleArticleShare();
  handleElementClicks();
};
