export default function decorate(block) {
  const a = document.createElement('a');
  a.classList.add('button', 'primary');
  a.href = 'https://www.petpartners.com/enroll?p=PPFB2020';

  const buttonCell = block.children[0].children[1];
  a.innerText = buttonCell.innerText;
  buttonCell.remove();
  block.children[0].append(a);
}
