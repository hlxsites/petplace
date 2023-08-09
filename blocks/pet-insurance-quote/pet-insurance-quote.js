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
  block.children[0].insertBefore(a, buttonCell);
  buttonCell.remove();

  block.children[0].children[0].classList.add('insurance-label');
  block.children[0].children[1].classList.add('insurance-button');

  if (block.children[0].children.length > 2) {
    block.children[0].children[2].classList.add('insurance-description');
  }
}
