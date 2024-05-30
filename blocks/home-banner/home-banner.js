export default function decorate(block) {
  const ctaLink = block.querySelector('.button-container');
  const arrow = document.createElement('p');
  ctaLink.append(arrow);
}
