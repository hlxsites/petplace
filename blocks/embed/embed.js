import { loadCSS } from '../../scripts/lib-franklin.js';
import { loadScript } from '../../scripts/scripts.js';

const getDefaultEmbed = (url) => `
    <iframe src="${url.href}" allowfullscreen allow="encrypted-media" title="Content from ${url.hostname}" loading="lazy">
    </iframe>`;

const embedYoutube = (url) => {
  loadCSS('/scripts/lite-yt-embed/lite-yt-embed.css');
  loadScript('/scripts/lite-yt-embed/lite-yt-embed.js');

  const usp = new URLSearchParams(url.search);
  let videoId = usp.get('v');
  if (url.origin.includes('youtu.be')) {
    videoId = url.pathname.substring(1);
  }
  const litePlayer = document.createElement('lite-youtube');
  litePlayer.setAttribute('videoid', videoId);
  return litePlayer.outerHTML;
};

const embedInstagram = (url) => {
  const endingSlash = url.pathname.endsWith('/') ? '' : '/';
  const location = window.location.href.endsWith('.html') ? window.location.href : `${window.location.href}.html`;
  const src = `${url.origin}${url.pathname}${endingSlash}embed/?cr=1&amp;v=13&amp;wp=1316&amp;rd=${location}`;
  const embedHTML = `
      <iframe src="${src}" allowfullscreen allowtransparency scrolling="no" frameborder="0" loading="lazy">
      </iframe>`;
  return embedHTML;
};

const embedTwitter = (url) => {
  loadScript('https://platform.twitter.com/widgets.js');
  const embedHTML = `<blockquote><a href="${url}"></a></blockquote>`;
  return embedHTML;
};

const embedTiktok = async (url) => {
  try {
    const response = await fetch(`https://www.tiktok.com/oembed?url=${url}`);
    const json = await response.json();
    loadScript('https://www.tiktok.com/embed.js', () => {}, { async: true });
    return json.html;
  } catch (err) {
    return null;
  }
};

const EMBEDS_CONFIG = [
  {
    match: ['youtube', 'youtu.be'],
    embed: embedYoutube,
  },
  {
    match: ['instagram'],
    embed: embedInstagram,
  },
  {
    match: ['twitter'],
    embed: embedTwitter,
  },
  {
    match: ['tiktok'],
    embed: embedTiktok,
  },
];

const loadEmbed = async (block, url) => {
  block.classList.add('skeleton');

  const config = EMBEDS_CONFIG.find((cfg) => cfg.match.some((host) => url.hostname.includes(host)));
  if (!config) {
    block.classList.toggle('generic', true);
    block.innerHTML = getDefaultEmbed(url);
    return;
  }

  try {
    block.classList.toggle(config.match[0], true);
    block.innerHTML = await config.embed(url);
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
  const link = block.querySelector('a').href;

  block.textContent = '';
  loadEmbed(block, new URL(link));
}
