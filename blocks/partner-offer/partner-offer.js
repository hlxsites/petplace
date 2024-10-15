export default async function decorate(block) {
  if (block.children.length < 5) {
    // eslint-disable-next-line no-console
    console.warn('Invalid structure for partner-offer block');
    return;
  }

  ['featured-title', 'logo', 'name', 'data', 'cta'].forEach((name, index) => {
    block.children[index]?.classList.add(`partner-${name}`);
  });
  block.querySelector('.partner-data p:first-child')?.classList.add('partner-data-title');

  const featuredTitle = block.children[0].innerText;
  block.setAttribute('data-featured-title', featuredTitle);
}
