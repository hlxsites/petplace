import { loadScript } from './lib-franklin.js';
// eslint-disable-next-line import/no-cycle
import { isMobile } from './scripts.js';

export async function loadLazy() {
  // Load ads early on desktop since the impact is minimal there and
  // this helps reduce CLS and loading animation duration
  if (
    (document.querySelector('.block.ad')
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
}
