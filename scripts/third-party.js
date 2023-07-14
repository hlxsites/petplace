// eslint-disable-next-line import/no-cycle
import { isMobile, loadScript } from './scripts.js';

const GTM_ID = 'GTM-WP2SGNL';

//  Load Google Tag Manager
const fireGTM = (w, d, s, l, i) => {
  w[l] = w[l] || [];
  w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  const f = d.getElementsByTagName(s)[0];
  const j = d.createElement(s);
  j.type = 'text/partytown';
  const dl = l !== 'dataLayer' ? `&l=${l}` : '';
  j.async = true;
  j.src = `https://www.googletagmanager.com/gtm.js?id=${i}${dl}`;
  f.parentNode.insertBefore(j, f);
};

export default function integrateMartech() {
  // Load ads early on desktop since the impact is minimal there and
  // this helps reduce CLS and loading animation duration
  if (!isMobile() && document.querySelector('.block.ad')) {
    loadScript('https://securepubads.g.doubleclick.net/tag/js/gpt.js', () => {}, { async: '' });
  }

  fireGTM(window, document, 'script', 'dataLayer', GTM_ID);
}
