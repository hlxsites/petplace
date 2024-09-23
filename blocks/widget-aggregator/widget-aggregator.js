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
    widget.text = script;

    block.innerText = '';
    document.body.append(widget);
  }
}
