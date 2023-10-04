import { sampleRUM } from '../../scripts/lib-franklin.js';
import {
  fetchAndCacheJson,
  getId,
  isMartechDisabled,
  isMobile,
} from '../../scripts/scripts.js';

function addPrefetch(kind, url, as) {
  const linkEl = document.createElement('link');
  linkEl.rel = kind;
  linkEl.href = url;
  if (as) {
    linkEl.as = as;
  }
  document.head.append(linkEl);
}

if (isMobile()) {
  addPrefetch('preconnect', 'https://securepubads.g.doubleclick.net');
  addPrefetch('preconnect', 'https://pagead2.googlesyndication.com');
  addPrefetch('preconnect', 'https://adservice.google.com');
  addPrefetch('preconnect', 'https://tpc.googlesyndication.com');
}

async function getAds() {
  return fetchAndCacheJson('/ads.json');
}

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
  const ads = await getAds();
  return ads.find((c) => c.ID === adId);
}

function getAdTargets(ad) {
  if (ad.Targeting) {
    return String(ad.Targeting).split(',').map((target) => String(target).trim());
  }
  return null;
}

function parseAdSizes(rawSizes) {
  if (rawSizes) {
    return String(rawSizes).split(',')
      .map((size) => parseInt(String(size).trim(), 10));
  }
  return null;
}

function getAdSizes(el, ad) {
  if (!ad) {
    return [];
  }
  const widths = parseAdSizes(ad.Width);
  const heights = parseAdSizes(ad.Height);
  const sizes = [];
  let maxWidth;
  widths.forEach((width, i) => {
    if (heights.length > i && width <= el.clientWidth) {
      sizes.push([width, heights[i]]);
    }
  });
  return sizes;
}

const loadedObserver = new MutationObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.attributeName !== 'data-google-query-id') {
      return;
    }
    entry.target.classList.remove('skeleton');
    entry.target.style.minHeight = 0;
  });
});

let conversionMonitor;
let exitIframe;
const enterIframe = () => {
  const el = document.activeElement;
  const block = el?.closest('.ad');
  if (block && el.tagName === 'IFRAME') {
    window.clearInterval(conversionMonitor);
    sampleRUM.convert('ad-click', block.dataset.adid, block, []);
    conversionMonitor = setInterval(exitIframe, 100);
  }
};
exitIframe = () => {
  const el = document.activeElement;
  if (el && el.tagName !== 'IFRAME') {
    window.clearInterval(conversionMonitor);
    conversionMonitor = setInterval(enterIframe, 100);
  }
};

/**
 *
 * @param {HTMLElement} block Ad block to decorate.
 */
export default async function decorate(block) {
  if (isMartechDisabled) {
    block.closest('.section').classList.remove('ad-container');
    block.parentElement.remove();
    return;
  }

  if (!conversionMonitor && sampleRUM.convert) {
    conversionMonitor = setInterval(enterIframe, 100);
  }

  window.googletag = window.googletag || { cmd: [] };

  if (!block.id) {
    block.id = getId('ad');
  }
  [...block.children].forEach((row, index) => {
    if (index === 0) {
      block.dataset.adid = String(row.innerText).trim();
    }
    row.remove();
  });

  const { id } = block;
  const data = await getAd(block.dataset.adid);
  if (!data) {
    // eslint-disable-next-line no-console
    console.error('Unknown ad type', block.dataset.adid);
    return;
  }

  block.classList.add('skeleton');

  // Defer ad configuration until the block is rendered and we have a valid
  // width to check against
  window.setTimeout(() => {
    const sizes = getAdSizes(block, data);
    block.style.width = `${sizes[0][0]}px`;
    block.style.minHeight = `${sizes[0][1]}px`;
    window.googletag.cmd.push(() => {
      const adSlot = window.googletag
        .defineSlot(data.Path, sizes, id)
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
  });

  loadedObserver.observe(block, { attributes: true });
}
