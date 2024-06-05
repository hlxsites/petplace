export default function decorate(block) {
  const ctaContainer = block.querySelector('.button-container');
  const ctaLink = ctaContainer.querySelector('a');

  // Make entire block clickable.
  block.onclick = () => {
    if (ctaLink) {
      ctaLink.click();
    }
  };
}
