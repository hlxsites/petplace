/* eslint-disable no-nested-ternary */
window.dataLayer ||= [];

export const pushToDataLayer = (layer) => {
  window.dataLayer.push(layer);
};

export const clickHelper = (...args) => {
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

    const linkType = imgAlt ? 'image' : textBody ? 'text' : 'title';
    const linkText = textBody ? textBody.innerHTML : link.innerHTML;
    const logText = imgAlt ? imgAlt.alt : linkText;

    clickHelper('Popular Article', logText, linkType, link.href);
  });
};

export const articlePrevNextHelper = () => {
  const articleNav = document.querySelector('.article-navigation-wrapper');
  if (!articleNav) return;

  articleNav.addEventListener('click', (ev) => {
    const link = ev.target.closest('a');
    if (!link) return;

    const imgAlt = link.querySelector('img');
    const textSpan = link.querySelector('span');

    // initialize variables
    let pnCat = 'N/A';
    let pnType = 'N/A';
    let pnText = 'N/A';

    // text + icon
    if (textSpan) {
      const spanClass = textSpan.className;
      if (spanClass.includes('icon-less-than')) {
        pnCat = 'Prev';
        pnType = 'icon';
      } else if (spanClass.includes('previous')) {
        pnCat = 'Prev';
        pnType = 'text';
        pnText = textSpan.innerHTML;
      } else if (spanClass.includes('icon-greater-than')) {
        pnCat = 'Next';
        pnType = 'icon';
      } else if (spanClass.includes('next')) {
        pnCat = 'Next';
        pnType = 'text';
        pnText = textSpan.innerHTML;
      }
    } else {
      // image + title
      const node = link.parentNode;
      pnCat = node.className.includes('previous')
        ? 'Previous'
        : node.className.includes('next')
          ? 'Next'
          : 'Other';

      pnType = imgAlt ? 'image' : 'title';
      pnText = imgAlt ? imgAlt.alt : link.innerHTML;
    }

    clickHelper(`${pnCat} Article`, pnText, pnType, link.href);
  });
};
