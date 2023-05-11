export default function decorate(block) {
  const generalAttributesContainer = block.closest('.section');
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
