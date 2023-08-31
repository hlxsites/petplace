import { sampleRUM, decorateIcons } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  // for backward compatibility, there are some pet insurance blocks in existing
  // pages that don't have content. Continue showing nothing for those cases
  if (!block.textContent.trim()) {
    block.remove();
  }

  if (sampleRUM.convert) {
    const a = block.querySelector('a');
    a.addEventListener('click', () => {
      sampleRUM.convert('insurance-enroll', a.innerText, a, []);
    });
  }
}
