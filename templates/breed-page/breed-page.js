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
