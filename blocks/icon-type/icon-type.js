import { toClassName } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const iconList = block.querySelector('ul');

  iconList.classList.add('icon-type-list');

  // Find the li elements containing the desired text
  const liElements = iconList.querySelectorAll('li');

  // Iterate over each li element
  liElements.forEach((liElement) => {
    const textContent = liElement.textContent.trim();
    const icon = 'city-' + toClassName(textContent);
    // Fetch the SVG file from the 'icons' folder
    const svgFilePath = `/icons/${icon}.svg`;
    fetch(svgFilePath)
      .then((response) => response.text())
      .then((svgContent) => {
        const iconItem = document.createElement('icon-item');
        const pElement = document.createElement('span');
        pElement.textContent = textContent;

        iconItem.innerHTML = svgContent;
        iconItem.appendChild(pElement);

        liElement.textContent = '';
        liElement.appendChild(iconItem);
      });
  });
}
