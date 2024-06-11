import { decorateIcons } from '../../scripts/lib-franklin.js';
import { getPlaceholder } from '../../scripts/scripts.js';

function getMaxTags(block) {
  const mediaObj = {
    mobile: 0,
    tablet: 768,
    desktop: 1024,
  };

  const { viewport } = Object.entries(mediaObj).reduce((acc, [val, minWidth]) => {
    if (minWidth > acc.minWidth && document.documentElement.clientWidth >= minWidth) {
      return { viewport: val, minWidth };
    }
    return acc;
  }, { minWidth: -1 });

  const maxTags = block.getAttribute(`data-max-tags-${viewport}`);
  return maxTags;
}

function updateTagDisplay(block) {
  const maxTags = getMaxTags(block);
  const tags = block.querySelectorAll('li');
  tags.forEach((tag, idx) => {
    if (maxTags && idx >= maxTags) {
      tag.setAttribute('hidden', true);
    } else {
      tag.removeAttribute('hidden');
    }
  });

  const button = block.querySelector('button');
  if (tags.length <= maxTags) {
    button.setAttribute('hidden', true);
  } else {
    button.removeAttribute('hidden');
  }
}

export default async function decorate(block) {
  const resp = await fetch(`${window.hlx.contentBasePath}/fragments/popular-tags.plain.html`);
  if (!resp.ok) {
    block.remove();
    return;
  }

  const html = await resp.text();
  block.innerHTML = html;

  const moreTagsTrigger = document.createElement('button');
  moreTagsTrigger.innerHTML = `${getPlaceholder('morePopularTags')} <span class="icon icon-chevron-large"></span>`;
  block.querySelector('ul').append(moreTagsTrigger);
  decorateIcons(block);

  updateTagDisplay(block);
  window.addEventListener('resize', () => updateTagDisplay(block));
}
