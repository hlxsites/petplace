import { loadCSS, loadScript } from '../../scripts/lib-franklin.js';

const FALLBACK_PUBLICATION_DATE = '2013-07-18'; // go-live date for the Franklin site, but could be any value

const getDefaultEmbed = (url) => `<iframe src="${url.href}" allowfullscreen allow="encrypted-media" title="Content from ${url.hostname}" loading="lazy"></iframe>`;

const embedYoutubeFacade = async (url) => {
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
  const litePlayer = document.createElement('lite-youtube');
  litePlayer.setAttribute('videoid', videoId);
  wrapper.append(litePlayer);

  try {
    const response = await fetch(`https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=${videoId}`);
    const json = await response.json();
    wrapper.innerHTML = `
      <meta itemprop="name" content="${json.title}"/>
      <meta itemprop="uploadDate" content="${document.head.querySelector('[name="publication-date"]')?.content || FALLBACK_PUBLICATION_DATE}"/>
      <link itemprop="embedUrl" href="https://www.youtube.com/embed/${videoId}"/>
      <link itemprop="thumbnailUrl" href="${json.thumbnail_url}"/>
      
      ${wrapper.innerHTML}
    `;
  } catch (err) {
    // Nothing to do, metadata just won't be added to the video
  }
  return wrapper.outerHTML;
};

const embedInstagram = (url) => {
  const endingSlash = url.pathname.endsWith('/') ? '' : '/';
  const location = window.location.href.endsWith('.html') ? window.location.href : `${window.location.href}.html`;
  const src = `${url.origin}${url.pathname}${endingSlash}embed/captioned/?rd=${window.encodeURIComponent(location)}`;
  const embedHTML = `
    <div itemscope itemtype="https://schema.org/SocialMediaPosting">
      <link itemprop="url" href="${url.origin}${url.pathname}${endingSlash}embed/captioned/"/>
      <iframe src="${src}" allowfullscreen allowtransparency scrolling="no" frameborder="0" loading="lazy"></iframe>
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
  loadScript('/blocks/embed/lite-tiktok/lite-tiktok.js', { async: true, type: 'module' });
  const videoId = url.pathname.split('/').pop();
  try {
    const request = await fetch(`https://www.tiktok.com/oembed?url=https://www.tiktok.com/video/${videoId}`);
    const json = await request.json();
    return `
      <div itemscope itemtype="https://schema.org/VideoObject">
        <meta itemprop="name" content="${json.title}"/>
        <meta itemprop="uploadDate" content="${document.head.querySelector('[name="publication-date"]')?.content || FALLBACK_PUBLICATION_DATE}"/>
        <link itemprop="thumbnailUrl" href="${json.thumbnail_url}"/>
        <link itemprop="embedUrl" href="https://www.tiktok.com/video/${videoId}"/>
        <lite-tiktok videoid="${videoId}"></lite-tiktok>
      </div>
    `;
  } catch (err) {
    return `
      <div itemscope itemtype="https://schema.org/VideoObject">
        <link itemprop="embedUrl" href="https://www.tiktok.com/video/${videoId}"/>
        <lite-tiktok videoid="${videoId}"></lite-tiktok>
      </div>
    `;
  }
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
    // Nothing to do, the message isn't the one we are looking for
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
export default async function decorate(block) {
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
    return Promise.resolve();
  }
  return loadEmbed(block, service, url);
}
