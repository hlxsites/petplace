export default async function decorate(block) {
  if (block.children.length < 5) {
    console.warn('Invalid structure for partner-offer block');
    return;
  }

  block.children[0].classList.add('partner-featured-title');
  block.children[1].classList.add('partner-logo');
  block.children[2].classList.add('partner-name');
  block.children[3].classList.add('partner-data');
  block.children[3].querySelector('p:first-child').classList.add('partner-data-title');
  block.children[4].classList.add('partner-cta');

  const featuredTitle = block.children[0].innerText;
  block.setAttribute('data-featured-title', featuredTitle);
}
