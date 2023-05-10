import { constants } from './aria-accordion.js';

export default async function decorate(block) {
  const accordions = [...block.children];
  accordions.forEach((accordion) => {
    accordion.classList.add('accordion-section');
    accordion.firstElementChild.classList.add('header');
    accordion.firstElementChild.nextElementSibling.classList.add('text');
  });

  const element = document.createElement(constants.tagName);
  element.setAttribute(constants.withControls, block.classList.contains('with-controls'));
  element.innerHTML = block.innerHTML;
  block.innerHTML = '';
  block.append(element);
  block.querySelectorAll('p:empty').forEach((el) => el.remove());
}
