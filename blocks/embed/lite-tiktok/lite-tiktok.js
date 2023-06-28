export class LiteTTEmbed extends HTMLElement {
  constructor() {
      super();
      this.isIframeLoaded = false;
      this.setupDom();
  }
  static get observedAttributes() {
      return ['videoid', 'playlistid'];
  }
  connectedCallback() {
      this.addEventListener('pointerover', LiteTTEmbed.warmConnections, {
          once: true,
      });
      this.addEventListener('click', () => this.addIframe());
  }
  get videoId() {
      return encodeURIComponent(this.getAttribute('videoid') || '');
  }
  set videoId(id) {
      this.setAttribute('videoid', id);
  }
  get autoLoad() {
      return this.hasAttribute('autoload');
  }
  set __data(obj) {
      this.__data = obj;
  }
  get __data() {
      return this.__data;
  }
  setupDom() {
      const shadowDom = this.attachShadow({ mode: 'open' });
      shadowDom.innerHTML = `
    <style>
      :host {
        contain: content;
        display: block;
        position: relative;
        width: 100%;
        height: 735px;
      }

      #frame, iframe {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
      }

      #frame {
        cursor: pointer;
      }

      #fake {
        display: flex;
        position: relative;
        height: 100%;
        justify-content: center;
        background: #000;
        width: 80%;
        margin: auto;
      }

      #logo {
        position: absolute;
        width: 48px;
        height: 48px;
        margin: 1rem;
        right: 0;
      }

      #fallbackPlaceholder {
        height: 100%;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      #playButton {
        width: 150px;
        height: 150px;
        background-color: transparent;
        z-index: 1;
        border: 0;
      }

      #playButton:before {
        content: '';
        border-style: solid;
        border-width: 22px 0 22px 40px;
        border-color: transparent transparent transparent #fff;
      }

      #playButton,
      #playButton:before {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -50%, 0);
        cursor: inherit;
      }

      /* Post-click styles */
      .activated {
        cursor: unset;
      }

      #frame.activated::before,
      #frame.activated > #fake {
        display: none;
      }
    </style>
    <div id="frame">
      <div id="fake">
        <picture>
          <source id="jpegPlaceholder" type="image/jpeg">
          <img id="fallbackPlaceholder" referrerpolicy="origin" loading="lazy" alt="Video placeholder image">
        </picture>
        <button id="playButton" aria-label="Play"></button>
        <svg id="logo" xmlns="http://www.w3.org/2000/svg"><path d="M19.8 19.8v-1.6L18 18a12.1 12.1 0 0 0-7 22 12 12 0 0 1 8.6-20.3Z" fill="#25F4EE"/><path d="M20 37.4c3 0 5.5-2.4 5.6-5.3V5.7h4.8L30.3 4h-6.6v26.4a5.5 5.5 0 0 1-8.1 4.7c1 1.4 2.6 2.3 4.4 2.3Zm19.4-22.7v-1.5c-1.8 0-3.5-.6-5-1.5a9 9 0 0 0 5 3Z" fill="#25F4EE"/><path d="M34.4 11.7a9.1 9.1 0 0 1-2.2-6h-1.8c.4 2.5 2 4.6 4 6ZM18.1 24.6c-3 0-5.6 2.5-5.6 5.6 0 2.1 1.3 4 3 4.9a5.5 5.5 0 0 1 6.2-8.5v-6.7l-1.7-.2h-.2v5.1l-1.7-.2Z" fill="#FE2C55"/><path d="M39.4 14.6v5.1c-3.4 0-6.6-1.1-9.2-3v13.5a12 12 0 0 1-19 10 12.1 12.1 0 0 0 21-8.3V18.5a16 16 0 0 0 9.1 3v-6.7c-.6 0-1.3 0-1.9-.2Z" fill="#FE2C55"/><path d="M30.3 30.2V16.8a15 15 0 0 0 9.1 3v-5.2c-2-.4-3.7-1.4-5-3a9.2 9.2 0 0 1-4-6h-4.8v26.5a5.5 5.5 0 0 1-10 3 5.5 5.5 0 0 1 4.2-10.2v-5.2a12.1 12.1 0 0 0-8.6 20.4 12 12 0 0 0 19-9.9Z" fill="#fff"/></svg>
      </div>
    </div>
  `;
      this.domRefFrame = shadowDom.querySelector('#frame');
      this.domRefImg = {
          fallback: shadowDom.querySelector('#fallbackPlaceholder'),
          webp: shadowDom.querySelector('#webpPlaceholder'),
          jpeg: shadowDom.querySelector('#jpegPlaceholder'),
      };
      this.domRefPlayButton = shadowDom.querySelector('#playButton');
  }
  async setupComponent() {
      if (!this.autoLoad) {
          const request = await fetch(`https://www.tiktok.com/oembed?url=https://www.tiktok.com/video/${this.videoId}`);
          const data = await request.json();
          this.initImagePlaceholder(data);
          this.domRefPlayButton.setAttribute('aria-label', `Play: ${data.title}`);
          this.setAttribute('title', `Play: ${data.title}`);
      }
      else {
          this.initIntersectionObserver();
      }
  }
  attributeChangedCallback(name, oldVal, newVal) {
      switch (name) {
          case 'videoid': {
              if (oldVal !== newVal) {
                  this.setupComponent();
                  if (this.domRefFrame.classList.contains('activated')) {
                      this.domRefFrame.classList.remove('activated');
                      this.shadowRoot.querySelector('iframe').remove();
                      this.isIframeLoaded = false;
                  }
              }
              break;
          }
          default:
              break;
      }
  }
  addIframe(isIntersectionObserver = false) {
      if (!this.isIframeLoaded) {
          const iframeHTML = `
<iframe frameborder="0"
sandbox="allow-popups allow-popups-to-escape-sandbox allow-scripts allow-top-navigation allow-same-origin"
src="https://www.tiktok.com/embed/v2/${this.videoId}">
</iframe>
`;
          this.domRefFrame.insertAdjacentHTML('beforeend', iframeHTML);
          this.domRefFrame.classList.add('activated');
          this.isIframeLoaded = true;
      }
  }
  initImagePlaceholder(data) {
      this.domRefImg.jpeg.srcset = data.thumbnail_url;
      this.domRefImg.fallback.src = data.thumbnail_url;
      this.domRefImg.fallback.setAttribute('aria-label', `Play: ${data.title}`);
      this.domRefImg?.fallback?.setAttribute('alt', `Play: ${data.title}`);
  }
  initIntersectionObserver() {
      const options = {
          root: null,
          rootMargin: '0px',
          threshold: 0,
      };
      const observer = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
              if (entry.isIntersecting && !this.isIframeLoaded) {
                  LiteTTEmbed.warmConnections();
                  this.addIframe(true);
                  observer.unobserve(this);
              }
          });
      }, options);
      observer.observe(this);
  }
  static addPrefetch(kind, url) {
      const linkElem = document.createElement('link');
      linkElem.rel = kind;
      linkElem.href = url;
      linkElem.crossOrigin = 'true';
      document.head.append(linkElem);
  }
  static warmConnections() {
      if (LiteTTEmbed.isPreconnected)
          return;
      LiteTTEmbed.addPrefetch('preconnect', 'https://www.tiktok.com');
      LiteTTEmbed.addPrefetch('preconnect', 'https://mcs.us.tiktok.com');
      LiteTTEmbed.addPrefetch('preconnect', 'https://mon.us.tiktokv.com');
      LiteTTEmbed.isPreconnected = true;
  }
}
LiteTTEmbed.isPreconnected = false;
customElements.define('lite-tiktok', LiteTTEmbed);
//# sourceMappingURL=lite-tiktok.js.map