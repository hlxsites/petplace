/* eslint-disable no-nested-ternary */
window.dataLayer ||= [];

export const pushToDataLayer = (layer) => {
  console.log('layer:', layer); // TODO: remove later
  window.dataLayer.push(layer);
};

export const clickHelper = (...args) => {
  console.log('el_clicks:', args); // TODO: remove later
  pushToDataLayer({
    event: 'element_click',
    element_category: args[0],
    element_text: args[1],
    element_type: args[2],
    element_url: args[3],
  });
};

export const getSocialName = (href) => {
  const strSplit = href.split('.com')[0];
  const strValue = strSplit.split('.')[1] || 'email';
  const strCaps = strValue.charAt(0).toUpperCase() + strValue.slice(1);
  return strCaps;
};

// LINK HELPERS
export const articleLinksHelper = () => {
  // this is done because article template has multiple classes
  const linkTracking = document.querySelectorAll('.default-content-wrapper');
  if (!linkTracking) return;

  linkTracking.forEach((link) => {
    link.addEventListener('click', (ev) => {
      const aTag = ev.target.closest('a');
      if (!aTag) return;

      const linkCat = aTag.href.includes('petplace.com')
        ? 'Embedded'
        : 'Outbound';

      clickHelper(`${linkCat} Link`, aTag.innerHTML, 'link', aTag.href);
    });
  });
};

export const articlePopularHelper = () => {
  const popularTracking = document.querySelector('.popular-articles-wrapper');
  if (!popularTracking) return;

  popularTracking.addEventListener('click', (ev) => {
    const link = ev.target.closest('a');
    if (!link) return;

    const imgAlt = link.querySelector('img');
    const textBody = link.querySelector('h3');
    clickHelper('Popular Article', logText, linkType, link.href);
  });
};
