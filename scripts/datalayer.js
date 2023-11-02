import {
  clickHelper,
  getSocialName,
  pushToDataLayer,
  footerNavHelper,
  footerLegalHelper,
  footerSocialHelper,
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
  const headerTracking = document.querySelectorAll('.nav-sections a');
  headerTracking.forEach((tag) => {
    tag.addEventListener('click', () => {
      clickHelper('Header', tag.innerHTML, 'link', tag.href);
    });
  });

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
