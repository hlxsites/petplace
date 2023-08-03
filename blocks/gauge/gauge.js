export default function decorate(block) {
  const divs = block.querySelectorAll('div div');
  divs[1].classList.add('gauge-icon');
  divs[2].classList.add('gauge-title');
  divs[3].classList.add('gauge-value');
}
