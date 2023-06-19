export default function decorate(block) {
  const iconTextDiv = block.querySelector('.tips.block > div > div');
  iconTextDiv.classList.add('tip');

  const divElement = document.createElement('div');
  divElement.classList.add('tips-icon');

  const path = '/icons/tips-star.svg';
  const alt = 'Tips Star Image';

  divElement.innerHTML = `<img src=${path} alt=${alt}>`;

  // Get the parent element.
  const parentElement = block.querySelector('.tips.block > div');

  // Insert the 'tips-icon' at the beginning of the parent element.
  parentElement.insertBefore(divElement, parentElement.firstChild);
}
