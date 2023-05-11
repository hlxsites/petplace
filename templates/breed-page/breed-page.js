import {
  buildBlock,
  getMetadata,
  decorateIcons,
} from '../../scripts/lib-franklin.js';

export async function buildTemplateBlock(main) {
  const author = getMetadata('author');
  const h1 = main.querySelector('h1');

  const icon = document.createElement('span');
  icon.classList.add('icon', 'icon-user');

  const p = document.createElement('p');
  p.classList.add('author-wrapper');

  p.innerText = author;
  p.prepend(icon);
  await decorateIcons(p);
  h1.insertAdjacentHTML('afterend', p.outerHTML);
  const generalAttributesContainer = document.querySelector('.general-attributes-container');
  const children = [...generalAttributesContainer.children];
  const fragment = document.createDocumentFragment();

  // Append the new children to the fragment
  children.forEach((child) => {
    fragment.appendChild(child);
  });

  const subContainer = document.createElement('div');
  subContainer.classList.add('general-attributes-sub-container');

  subContainer.append(fragment);

  generalAttributesContainer.append(subContainer);
}

export async function buildHeroBlock(section, picture) {
  section.append(buildBlock('hero', { elems: [picture] }));
}

export function getActiveSlide(block) {
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
