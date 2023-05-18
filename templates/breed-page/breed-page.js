import {
  getMetadata,
  decorateIcons,
} from '../../scripts/lib-franklin.js';

// eslint-disable-next-line import/prefer-default-export
export async function loadEager(main) {
  const author = getMetadata('author');
  const h1 = main.querySelector('h1');

  const icon = document.createElement('span');
  icon.classList.add('icon', 'icon-user');

  const p = document.createElement('p');
  p.classList.add('author-wrapper');

  p.innerText = author;
  p.prepend(icon);
  await decorateIcons(p);
  h1.insertAdjacentElement('afterend', p);
}

function getActiveSlide(block) {
  return {
    index: [...block.children].findIndex((child) => child.getAttribute('active') === 'true'),
    element: block.querySelector('[active="true"]'),
    totalSlides: [...block.children].length,
  };
}

export function slide(slideDirection, block, slideWrapper) {
  const currentActive = getActiveSlide(block);
  currentActive.element.removeAttribute('active');
  let newIndex;
  if (slideDirection === 'next') {
    if (currentActive.index === currentActive.totalSlides - 1) {
      newIndex = 0;
    } else {
      newIndex = currentActive.index + 1;
    }
  } else if (currentActive.index === 0) {
    newIndex = currentActive.totalSlides - 1;
  } else {
    newIndex = currentActive.index - 1;
  }
  block.children[newIndex].setAttribute('active', true);

  slideWrapper.setAttribute('style', `transform:translateX(-${newIndex}00vw)`);
}

export function initializeTouch(block, slideWrapper) {
  const slideContainer = block.closest('.slide-cards-container');
  let startX; let currentX; let diffX = 0;

  slideContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX;
  });

  slideContainer.addEventListener('touchmove', (e) => {
    currentX = e.touches[0].pageX;
    diffX = currentX - startX;

    const { index } = getActiveSlide(block);
    slideWrapper.style.transform = `translateX(calc(-${index}00vw + ${diffX}px))`;
  });

  slideContainer.addEventListener('touchend', () => {
    if (diffX > 50) {
      slide('prev', block, slideWrapper);
    } else if (diffX < -50) {
      slide('next', block, slideWrapper);
    } else {
      const { index } = getActiveSlide(block);
      slideWrapper.setAttribute('style', `transform:translateX(-${index}00vw)`);
    }
  });
}
