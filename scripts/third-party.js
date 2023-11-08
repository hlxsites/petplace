import { loadScript } from './lib-franklin.js';
// eslint-disable-next-line import/no-cycle
import { isMobile } from './scripts.js';

const GTM_ID = 'GTM-WP2SGNL';
const TAG_ID = 'AW-11334653569';

function initPartytown() {
  window.partytown = {
    lib: '/scripts/partytown/',
    forward: ['dataLayer.push'],
  };
  import('./partytown/partytown.js');
}

const GTM_SCRIPT = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`;

function loadGTag(id) {
  loadScript(`https://www.googletagmanager.com/gtag/js?id=${TAG_ID}`, () => {
    function gtag(...args) {
      window.dataLayer.push(...args);
    }
    gtag('js', new Date());
    gtag('config', id);
  }, { async: '' });
}

function loadScriptInWorker(innerHTML, parent) {
  const script = document.createElement('script');
  script.type = 'text/partytown';
  script.innerHTML = innerHTML;
  parent.appendChild(script);
}

export function loadLazy() {
  // Load ads early on desktop since the impact is minimal there and
  // this helps reduce CLS and loading animation duration
  if (!isMobile() && document.querySelector('.block.ad')) {
    loadScript('https://securepubads.g.doubleclick.net/tag/js/gpt.js', { async: '' });
  }

  window.dataLayer ||= [];
  loadScriptInWorker(GTM_SCRIPT, document.body);
  initPartytown();
}

export function loadDelayed() {
  loadGTag(TAG_ID);
}
