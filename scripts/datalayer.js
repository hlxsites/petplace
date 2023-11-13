/* eslint-disable no-nested-ternary */
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

export const handleDataLayerApproach = () => {
  handleGlobalVariables();
  handleArticleShare();

  // ELEMENT CLICKS
  handleHeaderClicks();
  handleFooterClicks();
};
