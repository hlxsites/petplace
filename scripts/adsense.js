import { isMiddleAd, mappingHelper, sizingArr } from './utils/helpers.js';

window.googletag ||= { cmd: [] };

const adsDivCreator = (adLoc) => {
  const mainAdsDiv = document.createElement('div');
  mainAdsDiv.className = 'publi-container';

  const subDiv = document.createElement('div');
  subDiv.className = 'sub-container';
  mainAdsDiv.appendChild(subDiv);

  const adDiv = document.createElement('div');
  adDiv.className = 'publi-wrapper publi-wrapper-bg';
  subDiv.appendChild(adDiv);

  const idLoc = document.createElement('div');
  if (adLoc.includes('breeds')) {
    const locSplice = adLoc.split('_');
    idLoc.id = `breed_${locSplice[1]}`;
  } else idLoc.id = adLoc;
  adDiv.appendChild(idLoc);

  if (adLoc.includes('top')) {
    if (adLoc.includes('home')) {
      const adSection = document.querySelectorAll('.tiles-container')[0];
      adSection.before(mainAdsDiv);
    } else if (adLoc.includes('breeds')) {
      const attrSection = document.querySelector('.blade-wrapper');
      attrSection.before(mainAdsDiv);
    } else if (adLoc.includes('category')) {
      const initialCard = document.querySelector(':scope .cards li:first-child');
      initialCard.before(mainAdsDiv);
    } else {
      const content = document.querySelector('.article-content-container .default-content-wrapper')
        || document.querySelector('main .default-content-wrapper');
      content.before(mainAdsDiv);
    }
  }

  if (adLoc === 'article_side') {
    const content = document.querySelector('.sidebar-container');
    mainAdsDiv.classList.add('skyscraper');
    content.append(mainAdsDiv);
  }

  if (adLoc.includes('bottom')) {
    if (adLoc.includes('breeds')) {
      const refs = document.querySelector('.section.well');
      refs.after(mainAdsDiv);
    } else {
      const footer = document.querySelector('footer');
      footer.before(mainAdsDiv);
    }
  }

  if (adLoc.includes('middle')) {
    if (adLoc.includes('home')) {
      const adSection = document
        .querySelectorAll('.tiles-container')[1]
        .querySelector('.tiles-wrapper');

      adSection.after(mainAdsDiv);
    }

    if (adLoc.includes('breeds')) {
      const adSection = document.querySelector('.blade-container');
      adSection.after(mainAdsDiv);
    }

    if (adLoc.includes('article')) {
      const allParas = document.querySelectorAll('p');
      const parasLength = allParas.length;
      if (parasLength >= 4) {
        allParas[Math.ceil(parasLength / 2)].after(mainAdsDiv);
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

  const adLocale = window.hlx.contentBasePath === '/en-gb'
    ? 'petplace_uk_web'
    : 'petplace_web';

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < lastItemIndex; i++) {
    window.googletag
      .defineSlot(
        `/1004510/${adLocale}/${adArgs[i]}`,
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
    `/1004510/${adLocale}/${adArgs[lastItemIndex]}`,
    window.googletag.enums.OutOfPageFormat.BOTTOM_ANCHOR,
  );

  if (anchorSlot) {
    anchorSlot
      .setTargeting(REFRESH_KEY, REFRESH_VALUE)
      .setTargeting(REFRESH_SLOT, !REFRESH_VALUE)
      .addService(window.googletag.pubads());
    // eslint-disable-next-line no-console
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
  const boolMiddle = isMiddleAd(pageType);

  if (catVal === 'create') {
    if (boolArticle) adsDivCreator(`${pageType}_side`);
    if (boolMiddle) adsDivCreator(`${pageType}_middle`);

    adsDivCreator(`${pageType}_top`);
    adsDivCreator(`${pageType}_bottom`);
    return;
  }

  const adPage = pageType === 'breeds' ? 'breed' : pageType;
  const adsArr = [`${adPage}_top`, `${adPage}_bottom`, `${adPage}_anchor`];

  if (boolArticle) adsArr.unshift(`${adPage}_side`);
  if (boolMiddle) adsArr.unshift(`${adPage}_middle`);

  adsDefineSlot(adsArr, catVal);
};
