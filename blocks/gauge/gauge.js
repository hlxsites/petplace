export default function decorate(block) {
  const divs = block.querySelectorAll('div div');
  divs[1].classList.add('cell1');
  divs[2].classList.add('cell2');
  divs[3].classList.add('cell3');
}
