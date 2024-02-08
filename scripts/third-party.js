import { loadScript } from './lib-franklin.js';
// eslint-disable-next-line import/no-cycle
import { isMobile } from './scripts.js';

function loadMSClarity() {
  ((c, l, a, r, i, t, y) => {
    c[a] = c[a] || ((...args) => { (c[a].q = c[a].q || []).push(args); });
    // eslint-disable-next-line no-param-reassign
    t = l.createElement(r);
    t.async = 1;
    t.src = `https://www.clarity.ms/tag/${i}?ref=gtm2`;
    // eslint-disable-next-line no-param-reassign
    [y] = l.getElementsByTagName(r);
    y.parentNode.insertBefore(t, y);
  })(window, document, 'clarity', 'script', 'hz6a0je2i3');
}

export async function loadLazy() {
  // Load ads early on desktop since the impact is minimal there and
  // this helps reduce CLS and loading animation duration
  if (
    (window.location.pathname === '/'
    || window.location.pathname.includes('tags')
    || window.location.pathname.includes('article')
    || window.location.pathname.includes('category'))
    && !isMobile()
  ) {
    loadScript('https://securepubads.g.doubleclick.net/tag/js/gpt.js', {
      async: '',
    });
  }
}

export function loadDelayed() {
  loadMSClarity();
}
