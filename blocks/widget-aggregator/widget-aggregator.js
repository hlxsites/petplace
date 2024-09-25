/* eslint-disable no-undef */
/* eslint-disable func-names */
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

  if (script) {
    block.setAttribute('id', 'petplace-quote-form');

    const widget = document.createElement('script');
    widget.setAttribute('brand', 'petplace');
    widget.setAttribute('source', source);
    widget.text = `
    (function (doc, tag, id) {
      let js = doc.getElementsByTagName(tag)[0];
      if (doc.getElementById(id)) return;
      js = doc.createElement(tag);
      js.id = id;
      js.src = 'https://dev-quote.petted.com/Scripts/lib/widgets/petplace/quote-form/widget.min.js';
      js.async = true;
      js.type = "text/javascript";
      js.onload = function() {

      if (typeof window.QuoteEngine !== 'undefined') {
        window.QuoteEngine.setOptions({
          targetId: "petplace-quote-form",
          redirectUrl: "https://dev-quote.petted.com/quote",
          baseUrl: "https://dev-quote.petted.com/",
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
      };
      doc.body.appendChild(js);
    })(document, 'script', 'petplace-quote-engine');`;

    block.innerText = '';
    document.body.append(widget);
  }
}
