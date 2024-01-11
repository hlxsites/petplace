window.googletag ||= { cmd: [] };

const mappingHelper = (adLoc) => {
  // Ad Unit size mapping
  const mapping_side_desktop = googletag
    .sizeMapping()
    .addSize([0, 0], [])
    .addSize(
      [980, 200],
      [
        [160, 600],
        [300, 600],
      ]
    )
    .build();

  const mapping_top_mobile = googletag
    .sizeMapping()
    .addSize(
      [0, 0],
      [
        [320, 50],
        [320, 100],
      ]
    )
    .addSize([980, 200], [])
    .build();

  const mapping_middle_mobile = googletag
    .sizeMapping()
    .addSize(
      [0, 0],
      [
        [320, 50],
        [320, 100],
        [300, 250],
        [336, 280],
      ]
    )
    .addSize([980, 200], [])
    .build();

  const mapping_leaderboard = googletag
    .sizeMapping()
    .addSize(
      [0, 0],
      [
        [320, 50],
        [320, 100],
        [300, 250],
        [336, 280],
      ]
    )
    .addSize(
      [980, 200],
      [
        [728, 90],
        [970, 90],
        [970, 250],
      ]
    )
    .build();

  console.log('adloc', adLoc);

  if (adLoc.includes('top')) return mapping_top_mobile;
  if (adLoc.includes('side')) return mapping_side_desktop;
  if (adLoc.includes('middle')) return mapping_middle_mobile;
  if (adLoc.includes('bottom')) return mapping_leaderboard;
};

const sizingArr = (adLoc) => {
  const sizeSide = [[160, 600]];
  const sizeTopMid = [[320, 50]];
  const sizeBottom = [[728, 90]];

  if (adLoc.includes('top') || adLoc.includes('middle')) return sizeTopMid;
  if (adLoc.includes('side')) return sizeSide;
  if (adLoc.includes('bottom')) return sizeBottom;

  return null;
};

// script for display (loop)
const gtagDisplay = (argsArr) => {
  googletag.cmd.push(function () {
    for (let i = 0; i < argsArr.length; i++) {
      googletag.display(argsArr[i]);
    }
  });
};

export const adsDivCreator = (adLoc) => {
  const mainDiv = document.createElement('div');
  mainDiv.className = 'publi-container bg-white';

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
    const hero = document.querySelector('.hero');
    hero.after(mainDiv);
  }

  // MIDDLE COMES LATER

  if (adLoc.includes('bottom')) {
    const footer = document.querySelector('footer');
    footer.before(mainDiv);
  }
};

// google tag for adsense
export const adsDefineSlot = (...args) => {
  let anchor_slot;
  const REFRESH_KEY = 'refresh';
  const REFRESH_VALUE = 'true';
  const lastItemIndex = args.length - 1;

  googletag.cmd.push(function () {
    // var dataLayer = document.DataLayer
    // var articleValue; TRY CAPTURING THIS VALUE FROM THE DATALAYER BEFORE ASSIGN THE VALUE FOR THE VARIABLE

    for (let i = 0; i < lastItemIndex; i++) {
      googletag
        .defineSlot(
          `/1004510/petplace_web/${args[i]}`,
          sizingArr(args[i]),
          args[i]
        )
        .defineSizeMapping(mappingHelper(args[i]))
        .setTargeting(REFRESH_KEY, REFRESH_VALUE)
        .setTargeting('refreshed_slot', 'false')
        .addService(googletag.pubads());
    }

    anchor_slot = googletag.defineOutOfPageSlot(
      `/1004510/petplace_web/${args[lastItemIndex]}`,
      googletag.enums.OutOfPageFormat.BOTTOM_ANCHOR
    );

    if (anchor_slot) {
      anchor_slot
        .setTargeting(REFRESH_KEY, REFRESH_VALUE)
        .setTargeting('refreshed_slot', 'false')
        .addService(googletag.pubads());
    } else console.log('Anchor not loaded');

    // Refresh subroutine
    const SECONDS_TO_WAIT_AFTER_VIEWABILITY = 30;
    googletag.pubads().addEventListener('impressionViewable', function (event) {
      const slot = event.slot;
      if (slot.getTargeting(REFRESH_KEY).indexOf(REFRESH_VALUE) > -1) {
        slot.setTargeting('refreshed_slot', 'true');
        setTimeout(function () {
          googletag.pubads().refresh([slot]);
        }, SECONDS_TO_WAIT_AFTER_VIEWABILITY * 1000);
      }
    });

    // Lazy loading subroutine
    googletag.pubads().enableLazyLoad({
      fetchMarginPercent: 100,
      renderMarginPercent: 100,
      mobileScaling: 2.0,
    });

    googletag.pubads().set('page_url', 'https://www.petplace.com');
    //googletag.pubads().setTargeting('article', articleValue);
    googletag.pubads().setCentering(true);
    googletag.enableServices();
  });

  // after the definitions
  const newArgs = args.filter((arg) => !arg.includes('anchor'));
  newArgs.push(anchor_slot);
  gtagDisplay(newArgs);
};
