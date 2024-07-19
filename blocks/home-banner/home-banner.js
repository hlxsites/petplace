export default function decorate(block) {
  const ctaContainer = block.querySelector('.button-container');
  const ctaLink = ctaContainer.querySelector('a');

  // Make entire banner clickable
  block.onclick = () => {
    if (ctaLink) {
      window.location.href = ctaLink.href;
    }
  };
}
