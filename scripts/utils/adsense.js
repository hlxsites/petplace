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
