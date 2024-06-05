export default function decorate(block) {
  const ctaLink = block.querySelector('.button-container');
  const arrow = document.createElement('p');
  ctaLink.append(arrow);

  // Make entire block clickable.
  block.style = 'cursor: pointer';
  block.onclick = () => {
    const link = ctaLink.querySelector('a');
    if (link) {
      link.click();
    }
  };
}
