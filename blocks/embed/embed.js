import { readBlockConfig } from '../../scripts/scripts.js';

const loadScript = (url, callback, type) => {
  const head = document.querySelector('head');
  const script = document.createElement('script');
  script.src = url;
  if (type) {
    script.setAttribute('type', type);
  }
  head.append(script);
  script.onload = callback;
  return script;
};

const getDefaultEmbed = (url) => `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
    <iframe src="${url.href}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen=""
      scrolling="no" allow="encrypted-media" title="Content from ${url.hostname}" loading="lazy">
    </iframe>
  </div>`;

const embedYoutube = (url) => {
  const usp = new URLSearchParams(url.search);
  let vid = usp.get('v');
  const embed = url.pathname;
  if (url.origin.includes('youtu.be')) {
    vid = url.pathname.substring(1);
  }
  const embedHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="https://www.youtube.com${vid ? `/embed/${vid}?rel=0&amp;v=${vid}` : embed}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allow="encrypted-media; accelerometer; gyroscope; picture-in-picture" allowfullscreen="" scrolling="no" title="Content from Youtube" loading="lazy"></iframe>
    </div>`;
  return embedHTML;
};

const embedInstagram = (url) => {
  const endingSlash = url.pathname.endsWith('/') ? '' : '/';
  const location = window.location.href.endsWith('.html') ? window.location.href : `${window.location.href}.html`;
  const src = `${url.origin}${url.pathname}${endingSlash}embed/?cr=1&amp;v=13&amp;wp=1316&amp;rd=${location}`;
  const embedHTML = `<div style="width: 100%; position: relative; display: flex; justify-content: center">
      <iframe class="instagram-media instagram-media-rendered" id="instagram-embed-0" src="${src}"
        allowtransparency="true" allowfullscreen="true" frameborder="0" loading="lazy" scrolling ="no">
      </iframe>
    </div>`;
  return embedHTML;
};

const embedTwitter = (url) => {
  const embedHTML = `<blockquote class="twitter-tweet"><a href="${url}"></a></blockquote>`;
  loadScript('https://platform.twitter.com/widgets.js');
  return embedHTML;
};

const embedTiktok = (url) => {
  const resultHtml = document.createElement('div');
  resultHtml.setAttribute('id', 'tiktok');

  const tiktokBuild = async (fetchUrl) => {
    loadScript('https://www.tiktok.com/embed.js');
    const response = await fetch(fetchUrl);
    const json = await response.json();
    const tiktok = document.getElementById('tiktok');
    tiktok.outerHTML = json.html;
  };
  tiktokBuild(`https://www.tiktok.com/oembed?url=${url}`);

  return resultHtml.outerHTML;
};

const loadEmbed = (block, link) => {
  if (block.classList.contains('embed-is-loaded')) {
    return;
  }

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

  const config = EMBEDS_CONFIG.find((e) => e.match.some((match) => link.includes(match)));

  const url = new URL(link);
  if (config) {
    block.innerHTML = config.embed(url);
    block.classList.add(`embed-${config.match[0]}`);
  } else {
    block.innerHTML = getDefaultEmbed(url);
  }
  block.classList.add('embed-is-loaded');
};

/**
 * @param {HTMLDivElement} block
 */
export default function decorate(block) {
  const link = block.querySelector('a').href;
  const conf = readBlockConfig(block);
  const isParticle = block.classList.contains('particle');

  block.textContent = '';
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      loadEmbed(block, link);
      if (!isParticle || !conf.id) return;

      const frame = block.querySelector('iframe');
      if (!frame) return;

      const parent = frame.parentElement;
      parent.style.paddingBottom = '0';

      window.addEventListener('message', (ev) => {
        let data;
        try {
          data = typeof ev.data === 'string' ? JSON.parse(ev.data) : ev.data;
          if (typeof data !== 'object') {
            throw Error(`Invalid payload type (${typeof data}): `, data);
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error('[Embed] Error parsing data: ', e);
          return;
        }
        if (data.id !== conf.id) return;
        // eslint-disable-next-line no-console
        console.debug(`[Embed/${conf.id}] message: `, data);
        if (data.height) {
          parent.style.height = `${data.height}px`;
        }
      });
    }
  });
  observer.observe(block);
}
