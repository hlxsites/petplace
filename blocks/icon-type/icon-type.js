import { decorateIcons, toClassName } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const iconList = block.querySelector('ul');

  iconList.classList.add('icon-type-list');

  // Find the li elements containing the desired text
  const liElements = iconList.querySelectorAll('li');
  // Iterate over each li element
  liElements.forEach((liElement) => {
    const textContent = liElement.textContent.trim();
    const iconName = block.classList.contains('guide') ? `icon-logo-solo`: `icon-city-${toClassName(textContent)}`;
    const iconItem = document.createElement('icon-item');
    // append svg span
    const element = document.createElement('span');
    element.classList.add('icon', `${iconName}`);
    iconItem.appendChild(element);
    // append text span
    const pElement = document.createElement('span');
    pElement.textContent = textContent;
    iconItem.appendChild(pElement);
    // add icon-item to li element
    liElement.textContent = '';
    liElement.appendChild(iconItem);
    // decorate icons
    decorateIcons(liElement);
  });
}
