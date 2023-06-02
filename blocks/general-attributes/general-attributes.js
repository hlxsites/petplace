export default function decorate(block) {
  const dl = document.createElement('dl');
  [...block.children].forEach((attr) => {
    const dt = document.createElement('dt');
    dt.textContent = attr.children[0].textContent;
    dl.append(dt);
    const dd = document.createElement('dd');
    dd.textContent = attr.children[1].textContent;
    dl.append(dd);
  });
  block.innerHTML = '';
  block.append(dl);

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
