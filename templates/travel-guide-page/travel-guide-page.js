const REGION_INFO_ELEMENTS = ['.columns-txt-col', '.icon-type-wrapper', '.button-container'];

function updateSection(section) {
  const image = section.querySelector('.columns-img-col');
  const regionInfo = document.createElement('div');
  regionInfo.classList.add('region-info');
  REGION_INFO_ELEMENTS
    .map((e) => section.querySelector(e))
    .filter((e) => e)
    .forEach((e) => regionInfo.appendChild(e));

  // clean redundant childs
  while (section.firstChild) {
    section.removeChild(section.firstChild);
  }
  // append arranged city section under original city section
  section.append(regionInfo);
  section.append(image);
}

function observeSection(section) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName !== 'class') {
        return;
      }
      if (mutation.target.classList.contains('columns-img-col')) {
        updateSection(section);
      }
    });
  });

  // Start observing the section for changes in its class attribute
  observer.observe(section, { attributes: true, subtree: true });
}

// eslint-disable-next-line import/prefer-default-export
export function loadLazy() {
  const regionSections = Array.from(document.querySelectorAll('.section.columns-container'));
  regionSections.forEach(observeSection);
}
