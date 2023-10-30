import {
  clickHelper,
  getSocialName,
  pushToDataLayer,
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

  // social link
  const socialTracking = document.querySelectorAll('.footer-social a');
  console.log('socials', socialTracking);
  socialTracking.forEach((tag) => {
    tag.addEventListener('click', (ev) => {
      ev.preventDefault();
      clickHelper('Social', tag.innerHTML, 'link', tag.href);
    });
  });

  // footer link
  const footerTracking = document.querySelectorAll('.footer-navs a');
  console.log('footer', footerTracking);
  footerTracking.forEach((tag) => {
    tag.addEventListener('click', (ev) => {
      ev.preventDefault();
      clickHelper('Footer', tag.innerHTML, 'link', tag.href);
    });
  });
};

export const handleDataLayerApproach = () => {
  handleGlobalVariables();
  handleArticleShare();
  handleElementClicks();
};
