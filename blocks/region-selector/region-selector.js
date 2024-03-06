import { decorateButtons } from '../../scripts/lib-franklin.js';
import { DETAULT_REGION } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const resp = await fetch(`${window.hlx.contentBasePath}/fragments/region-selector.plain.html`);
  const html = await resp.text();
  block.innerHTML = html;
  decorateButtons(block);

  block.querySelectorAll('a').forEach((a) => {
    const path = new URL(a.href).pathname;
    const region = path.split('/')[1];
    let locale = `${region.substring(0, 2)}-${region.substring(3, 5).toUpperCase()}`;
    if (region?.match(/\w{2}-\w{2}/)) {
      locale = `${region.substring(0, 2)}-${region.substring(3, 5).toUpperCase()}`;
    } else if (region === '') {
      locale = DETAULT_REGION;
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
