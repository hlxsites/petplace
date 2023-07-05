import { getJson, loadScript } from '../../scripts/scripts.js';

function addPrefetch(kind, url, as) {
  const linkEl = document.createElement('link');
  linkEl.rel = kind;
  linkEl.href = url;
  if (as) {
    linkEl.as = as;
  }
  document.head.append(linkEl);
}

addPrefetch('preconnect', 'https://securepubads.g.doubleclick.net');
addPrefetch('preconnect', 'https://pagead2.googlesyndication.com');
addPrefetch('preconnect', 'https://adservice.google.com');
addPrefetch('preconnect', 'https://tpc.googlesyndication.com');
addPrefetch('preconnect', 'https://www.googletagservices.com');
addPrefetch('preconnect', 'https://www.googletagservices.com');

/**
 * Retrieves information about the sites ads, which will ultimately be pulled
 * from the "ads" spreadsheet at the root of the project. There is some caching
 * in place to ensure fast subsequent retrieval of the ad data in the same
 * session.
 * @param {string} adId ID of the ad from the spreadsheet.
 * @returns Simple object containing all the ad's information, or falsy
 *  if the ad could not be found.
 */
export async function getAd(adId) {
  const ads = await getJson('/ads.json', 'ads');
  if (!ads) {
    return null;
  }
  return ads.data.find((c) => c.ID === adId);
}

function getAdTargets(ad) {
  if (ad.Targeting) {
    return String(ad.Targeting).split(',').map((target) => String(target).trim());
  }
  return null;
}

/**
 *
 * @param {HTMLElement} block Ad block to decorate.
 */
export default async function decorate(block) {
  window.googletag = window.googletag || { cmd: [] };

  if (!block.id) {
    block.id = `ad-${Math.random().toString(32).substring(2)}`;
  }
  [...block.children].forEach((row, index) => {
    if (index === 0) {
      block.dataset.adid = String(row.innerText).trim();
    }
    row.remove();
  });

  const { id } = block;
  const data = await getAd(block.dataset.adid);
  const width = parseInt(data.Width, 10);
  const height = parseInt(data.Height, 10);
  block.classList.add('skeleton');
  block.style.width = `${width}px`;
  block.style.minHeight = `${height}px`;
  window.googletag.cmd.push(() => {
    const adSlot = window.googletag
      .defineSlot(data.Path, [[width, height]], id)
      .addService(window.googletag.pubads());

    const targets = getAdTargets(data);
    if (targets) {
      adSlot.setTargeting(...targets);
    }
  });
  // Enable SRA and services.
  window.googletag.cmd.push(() => {
    window.googletag.pubads().enableSingleRequest();
    window.googletag.pubads().enableLazyLoad();
    window.googletag.enableServices();
  });

  window.googletag.cmd.push(() => {
    window.googletag.display(block.id);
  });
  window.setTimeout(() => {
    block.classList.remove('skeleton');
    block.style.minHeight = 0;
  }, 3000);
}
