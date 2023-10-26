window.dataLayer ||= [];

export const pushToDataLayer = (layer) => {
  window.dataLayer.push(layer);
};

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
      const strSplit = tag.href.split('.com')[0];
      const strValue = strSplit.split('.')[1] || 'Email';
      const strCaps = strValue.charAt(0).toUpperCase() + strValue.slice(1);

      pushToDataLayer({
        event: 'article_share',
        method: strCaps,
      });
    });
  });
};

// ELEMENT CLICK
// Categories -> Outbound Link, Embedded Link, Header Link, Footer Link, CTA Button, Social Link

const clickHelper = (category, text, type, url) => {
  console.log('here', category, text, type, url);
  pushToDataLayer({
    event: 'element_click',
    element_category: category,
    element_text: text,
    element_type: type,
    element_url: url,
  });
};

const handleElementClicks = () => {
  // header link
  const headerTracking = document.querySelectorAll('.nav-sections a');
  headerTracking.forEach((tag) => {
    tag.addEventListener('click', () => {
      clickHelper('Header', tag.innerHTML, 'link', tag.href);
    });
  });
};

export const handleDataLayerApproach = () => {
  handleGlobalVariables();
  handleArticleShare();
  handleElementClicks();
};
