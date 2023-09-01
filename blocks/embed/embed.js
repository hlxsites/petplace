import { loadCSS } from '../../scripts/lib-franklin.js';
import { loadScript } from '../../scripts/scripts.js';

const getDefaultEmbed = (url) => `<iframe src="${url.href}" allowfullscreen allow="encrypted-media" title="Content from ${url.hostname}" loading="lazy"></iframe>`;

const embedYoutubeFacade = (url) => {
  loadCSS('/blocks/embed/lite-yt-embed/lite-yt-embed.css');
  loadScript('/blocks/embed/lite-yt-embed/lite-yt-embed.js');

  const usp = new URLSearchParams(url.search);
  let videoId = usp.get('v');
  if (url.origin.includes('youtu.be')) {
    videoId = url.pathname.substring(1);
  } else {
    videoId = url.pathname.split('/').pop();
  }
  const wrapper = document.createElement('div');
  wrapper.setAttribute('itemscope', '');
  wrapper.setAttribute('itemtype', 'https://schema.org/VideoObject');
  const link = document.createElement('link');
  link.setAttribute('itemprop', 'embedUrl');
  link.href = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1`;
  wrapper.append(link);
  const litePlayer = document.createElement('lite-youtube');
  litePlayer.setAttribute('videoid', videoId);
  wrapper.append(litePlayer);
  return wrapper.outerHTML;
};

const embedInstagram = (url) => {
  const endingSlash = url.pathname.endsWith('/') ? '' : '/';
  const location = window.location.href.endsWith('.html') ? window.location.href : `${window.location.href}.html`;
  const src = `${url.origin}${url.pathname}${endingSlash}embed/captioned/?rd=${window.encodeURIComponent(location)}`;
  const embedHTML = `
    <div itemscope itemtype="https://schema.org/SocialMediaPosting">
      <link itemprop="url" href="${url.origin}${url.pathname}${endingSlash}embed/captioned/"/>
      <iframe itemprop="url" src="${src}" allowfullscreen allowtransparency scrolling="no" frameborder="0" loading="lazy"></iframe>
    </div>
  `;
  return embedHTML;
};

const embedTwitter = (url) => {
  loadScript('https://platform.twitter.com/widgets.js');
  const embedHTML = `
    <blockquote itemscope itemtype="https://schema.org/SocialMediaPosting">
      <a itemprop="url" href="${url}"></a>
    </blockquote>
  `;
  return embedHTML;
};

const embedTiktokFacade = async (url) => {
  loadScript('/blocks/embed/lite-tiktok/lite-tiktok.js', () => {}, { async: true, type: 'module' });
  const videoId = url.pathname.split('/').pop();
  return `
    <div itemscope itemtype="https://schema.org/VideoObject">
      <link itemprop="embedUrl" href="https://www.tiktok.com/video/${videoId}"/>
      <lite-tiktok videoid="${videoId}"></lite-tiktok>
    </div>
  `;
};

const EMBEDS_CONFIG = {
  instagram: embedInstagram,
  tiktok: embedTiktokFacade,
  twitter: embedTwitter,
  youtube: embedYoutubeFacade,
};

function getPlatform(url) {
  const [service] = url.hostname.split('.').slice(-2, -1);
  if (service === 'youtu') {
    return 'youtube';
  }
  return service;
}

const loadEmbed = async (block, service, url) => {
  block.classList.toggle('skeleton', true);

  const embed = EMBEDS_CONFIG[service];
  if (!embed) {
    block.classList.toggle('generic', true);
    block.innerHTML = getDefaultEmbed(url);
    return;
  }

  try {
    block.classList.toggle(service, true);
    try {
      block.innerHTML = await embed(url);
    } catch (err) {
      block.style.display = 'none';
    } finally {
      block.classList.toggle('skeleton', false);
    }
  } catch (err) {
    block.style.maxHeight = '0px';
  }
};

// Listen for messages from instagram embeds to update the embed height.
window.addEventListener('message', (ev) => {
  const iframe = [...document.querySelectorAll('iframe')].find((i) => i.contentWindow === ev.source);
  if (!iframe) {
    return;
  }
  let data;
  try {
    data = typeof ev.data === 'string' ? JSON.parse(ev.data) : ev.data;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('[Embed] Error parsing data: ', e);
    return;
  }

  if (data.type !== 'MEASURE') {
    return;
  }

  iframe.closest('.block').style.height = `${data.details.height}px`;
});

/**
 * @param {HTMLDivElement} block
 */
export default function decorate(block) {
  const url = new URL(block.querySelector('a').href.replace(/%5C%5C_/, '_'));

  block.textContent = '';
  const service = getPlatform(url);
  // Both Youtube and TikTok use an optimized lib that already leverages the intersection observer
  if (service !== 'tiktok' && service !== 'youtube') {
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) {
        return;
      }

      loadEmbed(block, service, url);
      observer.unobserve(block);
    });
    observer.observe(block);
  } else {
    loadEmbed(block, service, url);
  }
}
