import { constants } from './aria-care-tabs.js';

export default async function decorate(block) {
  const element = document.createElement(constants.tagName);
  element.innerHTML = block.innerHTML;
  block.innerHTML = '';
  block.append(element);
}
