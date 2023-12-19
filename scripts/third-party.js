import { loadScript } from './lib-franklin.js';
// eslint-disable-next-line import/no-cycle
import { isMobile } from './scripts.js';

const GTM_ID = 'GTM-WP2SGNL';
const TAG_ID = 'AW-11334653569';

function gtag(...args) {
  window.dataLayer.push(...args);
}

async function loadGTag(id) {
  await loadScript(`https://www.googletagmanager.com/gtag/js?id=${TAG_ID}`, { async: '' });
  gtag('js', new Date());
  gtag('config', id);

  const metaTemplate = document.querySelector('meta[name="template"]');
  if (
    metaTemplate.content === 'Home-page'
    && window.location.pathname === '/'
  ) {
    gtag('event', 'conversion', {
      send_to: `${TAG_ID}/iQbBCNzr2OoYEIGt5Jwq`,
    });
  }
}

window.dataLayer = window.dataLayer || [];

export async function loadLazy() {
  // Load ads early on desktop since the impact is minimal there and
  // this helps reduce CLS and loading animation duration
  if (!isMobile() && document.querySelector('.block.ad')) {
    loadScript('https://securepubads.g.doubleclick.net/tag/js/gpt.js', { async: '' });
  }
}

export function loadDelayed() {
  /* eslint-disable */
  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    let f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l != 'dataLayer' ? '&l=' + l : '';

    j.async = true;
    j.type = 'text/javascript';
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', GTM_ID);
  /* eslint-enable */
  loadGTag(TAG_ID);
}
