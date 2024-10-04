import { loadScript } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const blockMetadata = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const row of block.children) {
    const key = row.children[0].textContent;
    const value = row.children[1].innerText;
    if (key) {
      blockMetadata[key] = value;
    }
  }
  const { source, script } = blockMetadata;

  block.setAttribute('id', 'petplace-quote-form');
  if (script === 'iframe') {
    const frame = document.createElement('iframe');
    frame.id = source;
    frame.src = 'https://quote.petted.com/widget/petplace';
    frame.setAttribute('loading', 'lazy');

    block.innerText = '';
    block.append(frame);
  } else if (script === 'widget') {
    block.innerText = '';
    loadScript('https://quote.petted.com/Scripts/lib/widgets/petplace/quote-form/widget.min.js', { async: true }).then(() => {
      if (window.QuoteEngine) {
        window.QuoteEngine.setOptions({
          targetId: 'petplace-quote-form',
          redirectUrl: 'https://quote.petted.com/quote',
          baseUrl: 'https://quote.petted.com/',
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
        window.QuoteEngine.init();
      }
    });
  } else {
    block.innerText = '';
  }
}
