export default function decorate(block) {
  // Make entire block clickable.
  block.onclick = () => {
    const link = ctaLink.querySelector('a');
    if (link) {
      link.click();
    }
  };
}
