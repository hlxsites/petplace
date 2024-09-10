/* eslint-disable no-nested-ternary */
window.dataLayer ||= [];

/** DATALAYER */

export const pushToDataLayer = (layer) => window.dataLayer.push(layer);

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

// link helpers
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
  const articleNav = document.querySelector('.related-reading-wrapper');
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

/** ADSENSE */

export const mappingHelper = (adLoc) => {
  const mappingTop = window.googletag
    .sizeMapping()
    .addSize(
      [0, 0],
      [
        [320, 50],
        [320, 100],
      ],
    )
    .addSize(
      [980, 200],
      [
        [728, 90],
        [970, 90],
      ],
    )
    .build();

  const mappingSide = window.googletag
    .sizeMapping()
    .addSize([0, 0], [])
    .addSize(
      [980, 200],
      [
        [160, 600],
        [300, 600],
      ],
    )
    .build();

  const mappingLeaderboard = window.googletag
    .sizeMapping()
    .addSize(
      [0, 0],
      [
        [320, 50],
        [320, 100],
        [300, 250],
        [336, 280],
      ],
    )
    .addSize(
      [980, 200],
      [
        [728, 90],
        [970, 90],
        [970, 250],
      ],
    )
    .build();

  // this conditional is only for articles
  if (adLoc.includes('article')) {
    if (adLoc.includes('side')) return mappingSide;
    if (adLoc.includes('middle')) return mappingTop;
  }

  if (adLoc.includes('top')) return mappingTop;
  // for everything else, it returns leaderboard
  return mappingLeaderboard;
};

export const sizingArr = (adLoc) => {
  const sizeSide = [[160, 600]];
  const sizeTopMid = [[320, 50]];
  const sizeLeader = [[728, 90]];

  if (adLoc.includes('article')) {
    if (adLoc.includes('side')) return sizeSide;
    if (adLoc.includes('bottom')) return sizeLeader;
    return sizeTopMid;
  }

  return sizeLeader;
};

export const isMiddleAd = (type) => {
  switch (type) {
    case 'home':
    case 'article':
    case 'breeds':
      return true;
    case 'category':
    case 'tags':
    case 'breed':
    default:
      return false;
  }
};
