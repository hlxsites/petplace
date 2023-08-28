import { sampleRUM } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  // for backward compatibility, there are some pet insurance blocks in existing
  // pages that don't have content. Continue showing nothing for those cases
  if (!block.textContent.trim()) {
    block.remove();
    return;
  }

  const a = document.createElement('a');
  a.classList.add('button', 'primary');
  a.href = 'https://www.petpartners.com/enroll?p=PPFB2020';

  const buttonCell = block.children[0].children[1];
  a.innerText = buttonCell.innerText;
  buttonCell.remove();
  block.children[0].append(a);

  if (sampleRUM.convert) {
    a.addEventListener('click', () => {
      sampleRUM.convert('insurance-enroll', a.innerText, a, []);
    });
  }
}
