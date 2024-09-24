/* eslint-disable no-undef */
import { readBlockConfig } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const config = readBlockConfig(block);
  const { source, script } = config;
  console.log('config', JSON.stringify(config));
  block.innerText = '';
  const widget = document.createElement('div');
  widget.setAttribute('id', 'petplace-quote-form');
  widget.setAttribute('brand', 'petplace');
  widget.setAttribute('source', source);
  block.appendChild(widget);

  if (script) {
    const scriptTag = document.createElement('script');
    scriptTag.src = script;
    scriptTag.async = true;
    scriptTag.setAttribute('brand', 'petplace');
    scriptTag.setAttribute('source', source);
    // make code in script to be treated as JavaScript module
    // scriptTag.type = 'module';
    scriptTag.onload = () => {
      console.log('Script loaded successfuly');
      window.addEventListener('load', () => {
        if (typeof QuoteEngine === 'undefined') {
          // Failed to load Quote Form Widget
          console.error('Failed to load Quote Engine Widget');
          return;
        }

        QuoteEngine.setOptions({
          targetId: 'petplace-quote-form',
          redirectUrl: 'https://dev-quote.petted.com/quote',
          baseUrl: 'https://dev-quote.petted.com/',
          urlParam: {
            source: 'petplace-widget',
            utm_source: '',
            utm_medium: '',
            utm_campaign: '',
            utm_content: '',
            utm_term: '',
          },
          refCode: 'petplace',
        });
        QuoteEngine.init();
      }, false);
    };
    scriptTag.onerror = () => {
      console.log('Error occurred while loading script');
    };
    document.body.appendChild(scriptTag);
  }
}
