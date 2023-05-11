import { slide } from '../../templates/breed-page/breed-page.js';

export default async function decorate(block) {
  const list = block.querySelector('ul');
  const breedColorClasses = ['breed-purple', 'breed-red', 'breed-blue'];

  [...list.children].forEach((listItem, i) => {
    if (i === 0) listItem.setAttribute('active', true);

    const factNumber = document.createElement('h4');
    factNumber.innerText = i + 1;
    listItem.prepend(factNumber);
    listItem.classList.add('fact-card', `fact-card-${i + 1}`, breedColorClasses[i]);
  });

  // Create the Toggle button elements
  const buttonPrev = document.createElement('button');
  buttonPrev.setAttribute('type', 'button');
  buttonPrev.setAttribute('data-role', 'none');
  buttonPrev.classList.add('slick-arrow', 'slick-prev');
  buttonPrev.addEventListener('click', () => {
    slide('prev', block.querySelector('ul'), block.parentElement);
  });
  const buttonNext = document.createElement('button');
  buttonNext.setAttribute('type', 'button');
  buttonNext.setAttribute('data-role', 'none');
  buttonNext.classList.add('slick-arrow', 'slick-next');
  buttonNext.addEventListener('click', () => {
    slide('next', block.querySelector('ul'), block.parentElement);
  });
  // Add the button to the DOM
  block.parentElement.parentElement.append(buttonPrev);
  block.parentElement.parentElement.append(buttonNext);
}
