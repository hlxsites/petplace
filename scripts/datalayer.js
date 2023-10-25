export const pushToDataLayer = (layer) => {
  window.dataLayer ||= [];
  window.dataLayer.push(layer);
};

// GLOBAL VARIABLES
const handleGlobalVariables = () => {
  // TODO : if meta category not present, create user story (avinash)
  const contentGroup = document.querySelector('meta[name="category"]');
  pushToDataLayer({
    content_group: contentGroup
      ? contentGroup.content
      : 'N/A - Content Group Not Set',
  });
};

// ARTICLE SHARE
const handleArticleShare = () => {
  try {
    const aTags = document
      .querySelector('.social-share')
      .getElementsByTagName('a');

    aTags.forEach((tag) => {
      tag.addEventListener('click', () => {
        const strSplit = tag.href.split('.com')[0];
        const strValue = strSplit.split('.')[1] || 'Email';
        const strCaps = strValue.charAt(0).toUpperCase() + strValue.slice(1);

        pushToDataLayer({
          event: 'article_share',
          method: strCaps,
        });
      });
    });
  } catch (err) {
    // TODO figure out best way to handle no tags
    console.warn('Warning - No Articles Found', err);
  }
};

// ELEMENT CLICK -> to come later (#5)
const handleElementClicks = () => {};

export const handleDataLayerApproach = () => {
  handleGlobalVariables();
  handleArticleShare();
  handleElementClicks();
};
