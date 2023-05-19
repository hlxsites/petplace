import { decorateResponsiveImages } from '../../scripts/scripts.js';

// eslint-disable-next-line import/prefer-default-export
export async function loadLazy(main) {
  const hero = document.createElement('div');
  const imgDiv = document.createElement('div');
  const textDiv = document.createElement('div');
  const defaultContentWrapper = main.querySelector('.default-content-wrapper');

  defaultContentWrapper.parentElement.classList.add('hero-container');
  hero.className = 'hero-wrapper';
  imgDiv.className = 'img-div';
  textDiv.classList = 'text-div';

  [...defaultContentWrapper.querySelectorAll('picture')].forEach((el) => {
    imgDiv.append(el);
  });
  hero.append(imgDiv);
  textDiv.append(document.querySelector('h1'));

  [...defaultContentWrapper.querySelectorAll('p')].forEach((el) => {
    if (el.innerText.trim() !== '') {
      textDiv.append(el);
    }
  });
  hero.append(textDiv);
  decorateResponsiveImages(imgDiv, ['461']);

  defaultContentWrapper.outerHTML = hero.outerHTML;
}
