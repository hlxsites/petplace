import { mappingHelper, sizingArr } from './utils/helpers.js';

window.googletag ||= { cmd: [] };

const adsDivCreator = (adLoc) => {
  const mainDiv = document.createElement('div');
  mainDiv.className = 'publi-container';

  const subDiv = document.createElement('div');
  subDiv.className = 'sub-container';
  mainDiv.appendChild(subDiv);

  const adDiv = document.createElement('div');
  adDiv.className = 'publi-wrapper publi-wrapper-bg';
  subDiv.appendChild(adDiv);

  const idLoc = document.createElement('div');
  idLoc.id = adLoc;
  adDiv.appendChild(idLoc);

  if (adLoc.includes('top')) {
    if (adLoc.includes('home')) {
      const adSection = document
        .querySelectorAll('.tiles-container')[0]
        .querySelectorAll('.default-content-wrapper')[0];
      adSection.before(mainDiv);
    } else {
      const hero = document.querySelector('.hero-wrapper');
      hero.after(mainDiv);
    }
  }

  if (adLoc.includes('bottom')) {
    const footer = document.querySelector('footer');
    footer.before(mainDiv);
  }

  if (adLoc.includes('side')) {
    const aside = document.querySelector('.social-share-wrapper');
    aside.after(mainDiv);
  }

  if (adLoc.includes('middle')) {
    if (adLoc.includes('home')) {
      const adSection = document
        .querySelectorAll('.tiles-container')[1]
        .querySelectorAll('.default-content-wrapper')[1];

      adSection.before(mainDiv);
    }

    if (adLoc.includes('article')) {
      const allParas = document.querySelectorAll('p');
      const parasLength = allParas.length;
      if (parasLength >= 4) {
        allParas[Math.ceil(parasLength / 2)].after(mainDiv);
      }
    }
  }
};

// script for display (loop)
const gtagDisplay = (argsArr) => {
  argsArr.forEach((arg) => {
    window.googletag.display(arg);
  });
};

const adsenseSetup = (adArgs, catVal) => {
  const REFRESH_KEY = 'refresh';
  const REFRESH_SLOT = 'refreshed_slot';
  const REFRESH_VALUE = 'true';
  const lastItemIndex = adArgs.length - 1;

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < lastItemIndex; i++) {
    window.googletag
      .defineSlot(
        `/1004510/petplace_web/${adArgs[i]}`,
        sizingArr(adArgs[i]),
        adArgs[i],
      )
      .defineSizeMapping(mappingHelper(adArgs[i]))
      .setTargeting(REFRESH_KEY, REFRESH_VALUE)
      .setTargeting(REFRESH_SLOT, !REFRESH_VALUE)
      .setCollapseEmptyDiv(true)
      .addService(window.googletag.pubads());
  }

  const anchorSlot = window.googletag.defineOutOfPageSlot(
    `/1004510/petplace_web/${adArgs[lastItemIndex]}`,
    window.googletag.enums.OutOfPageFormat.BOTTOM_ANCHOR,
  );

  if (anchorSlot) {
    anchorSlot
      .setTargeting(REFRESH_KEY, REFRESH_VALUE)
      .setTargeting(REFRESH_SLOT, !REFRESH_VALUE)
      .addService(window.googletag.pubads());
  } else console.log('Anchor not loaded');

  // refresh subroutine
  const SECONDS_TO_WAIT_AFTER_VIEWABILITY = 30;
  window.googletag.pubads().addEventListener('impressionViewable', (event) => {
    const { slot } = event;
    if (slot.getTargeting(REFRESH_KEY).indexOf(REFRESH_VALUE) > -1) {
      slot.setTargeting(REFRESH_SLOT, REFRESH_VALUE);
      setTimeout(() => {
        window.googletag.pubads().refresh([slot]);
      }, SECONDS_TO_WAIT_AFTER_VIEWABILITY * 1000);
    }
  });

  // lazy loading subroutine
  window.googletag.pubads().enableLazyLoad({
    fetchMarginPercent: 100,
    renderMarginPercent: 100,
    mobileScaling: 2.0,
  });

  if (catVal) {
    const pageType = adArgs[lastItemIndex].split('_')[0];
    window.googletag.pubads().setTargeting(pageType, catVal);
  }

  window.googletag.pubads().set('page_url', 'https://www.petplace.com');
  window.googletag.pubads().setCentering(true);
  window.googletag.pubads().collapseEmptyDivs(true);
  window.googletag.enableServices();

  return anchorSlot;
};

const adsDefineSlot = async (adArgs, catVal) => {
  window.googletag.cmd.push(async () => {
    // separate function to return the anchor slot
    const anchorSlot = await adsenseSetup(adArgs, catVal);

    // after the definitions to display
    const newArgs = adArgs.filter((arg) => !arg.includes('anchor'));
    if (anchorSlot) newArgs.push(anchorSlot);
    gtagDisplay(newArgs);
  });
};

// google tag for adsense
export const adsenseFunc = async (pageType, catVal) => {
  const boolArticle = pageType === 'article';
  const boolMiddle = pageType === 'home' || boolArticle;

  if (catVal === 'create') {
    if (boolArticle) adsDivCreator(`${pageType}_side`);
    if (boolMiddle) adsDivCreator(`${pageType}_middle`);

    adsDivCreator(`${pageType}_top`);
    adsDivCreator(`${pageType}_bottom`);
    return;
  }

  const adsArr = [
    `${pageType}_top`,
    `${pageType}_bottom`,
    `${pageType}_anchor`,
  ];

  if (boolArticle) adsArr.unshift(`${pageType}_side`);
  if (boolMiddle) adsArr.unshift(`${pageType}_middle`);

  adsDefineSlot(adsArr, catVal);
};
