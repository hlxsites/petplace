import { sampleRUM } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  // for backward compatibility, there are some pet insurance blocks in existing
  // pages that don't have content. Continue showing nothing for those cases
  if (!block.textContent.trim()) {
    block.remove();
  }

  if (sampleRUM.convert) {
    a.addEventListener('click', () => {
      sampleRUM.convert('insurance-enroll', a.innerText, a, []);
    });
  }
}
