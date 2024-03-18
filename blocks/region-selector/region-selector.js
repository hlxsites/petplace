import { decorateButtons, decorateIcons } from '../../scripts/lib-franklin.js';
import { DEFAULT_REGION } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const { region } = window.hlx;
  const resp = await fetch(`${region === DEFAULT_REGION ? '' : `/${region}`}/fragments/region-selector.plain.html`);
  const html = await resp.text();
  block.innerHTML = html;
  decorateButtons(block);
  decorateIcons(block);

  block.querySelectorAll('a').forEach((a) => {
    const path = new URL(a.href).pathname;
    const currentRegion = path.split('/')[1];
    let locale = `${currentRegion.substring(0, 2)}-${currentRegion.substring(3, 5).toUpperCase()}`;
    if (currentRegion?.match(/\w{2}-\w{2}/)) {
      locale = `${currentRegion.substring(0, 2)}-${currentRegion.substring(3, 5).toUpperCase()}`;
    } else if (currentRegion === '') {
      locale = DEFAULT_REGION;
    }
    a.classList.add('button');
    a.setAttribute('href', path);
    a.setAttribute('hreflang', locale);
    if (locale !== window.hlx.region) {
      a.classList.remove('primary');
      a.classList.add('secondary');
    }
  });
}