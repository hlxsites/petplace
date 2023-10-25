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

    for (let i = 0; i < aTags.length; i++) {
      aTags[i].addEventListener('click', (ev) => {
        ev.preventDefault(); // TODO remove this for click
        const strSplit = aTags[i].href.split('.com')[0];
        const strValue = strSplit.split('.')[1] || 'Email';
        const strCaps = strValue.charAt(0).toUpperCase() + strValue.slice(1);

        pushToDataLayer({
          event: 'article_share',
          method: strCaps,
        });
      });
    }
  } catch (err) {
    console.warn('Article Share Error', err);
    }
};

// ELEMENT CLICK -> to come later (#5)
const handleElementClicks = () => {};

export const handleDataLayerApproach = () => {
  handleGlobalVariables();
  handleArticleShare();
  handleElementClicks();
};
