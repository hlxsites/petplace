import { slide, initializeTouch } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const breedColorClasses = ['breed-purple', 'breed-red', 'breed-blue'];

  [...block.children].forEach((child, i) => {
    if (i === 0) child.setAttribute('active', true);

    if (block.classList.contains('numbered')) {
      const factNumber = document.createElement('h4');
      factNumber.innerText = i + 1;
      child.prepend(factNumber);
    }

    if (block.classList.contains('media')) {
      child.children[0].classList.add('media-container');
      child.children[0].append(child.querySelector('.button-container'));
    }

    child.classList.add('slide-card', breedColorClasses[i]);
  });

  // Create the Toggle button elements
  const buttonPrev = document.createElement('button');
  buttonPrev.setAttribute('type', 'button');
  buttonPrev.setAttribute('data-role', 'none');
  buttonPrev.setAttribute('aria-label', 'View previous slide.');
  buttonPrev.classList.add('slick-arrow', 'slick-prev');
  buttonPrev.addEventListener('click', () => {
    slide('prev', block, block.parentElement);
  });
  const buttonNext = document.createElement('button');
  buttonNext.setAttribute('type', 'button');
  buttonNext.setAttribute('data-role', 'none');
  buttonNext.setAttribute('aria-label', 'View next slide.');
  buttonNext.classList.add('slick-arrow', 'slick-next');
  buttonNext.addEventListener('click', () => {
    slide('next', block, block.parentElement);
  });
  // Add the button to the DOM
  block.parentElement.parentElement.append(buttonPrev);
  block.parentElement.parentElement.append(buttonNext);

  initializeTouch(block, block.parentElement);
}
