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

export const handleDataLayerApproach = () => {
  handleGlobalVariables();
  handleArticleShare();

  // ELEMENT CLICKS
  handleHeaderClicks();
  handleFooterClicks();
};
