function updateSection(section) {
  // make all links open in new tab
  section.querySelectorAll('a').forEach((link) => link.setAttribute('target', '_blank'));

  // get all essential elements
  const elements = [
    '.default-content-wrapper',
    '.icon-type-wrapper',
    '.link-box-wrapper',
    '.city-header-img',
    '.city-header-txt',
    '.city-middle-txt',
    '.city-middle-img',
    '.city-footer-img',
    '.city-footer-txt',
    '.section.city .tips-wrapper',
  ].map((e) => section.querySelector(e));

  // rearrange the elements under section city
  const updatedCitySection = document.createElement('div');
  updatedCitySection.classList.add('updated-city-section');
  elements.forEach((e) => updatedCitySection.appendChild(e));

  // clean redundant childs
  while (section.firstChild) {
    section.removeChild(section.firstChild);
  }
  // append arranged city section under original city section
  section.appendChild(updatedCitySection);

  // use backup layout if the middle image is vertical
  const cityMiddleImg = elements[6];
  if (cityMiddleImg.classList.contains('vertical')) {
    updatedCitySection.classList.add('backup-layout');
  }
}

function observeSection(section) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName !== 'class') {
        return;
      }
      if (mutation.target.classList.contains('city-footer-txt')) {
        // if the footer text is loaded, the whole columns block is loaded
        updateSection(section);
      }
    });
  });

  // Start observing the section for changes in its class attribute
  observer.observe(section, { attributes: true, subtree: true });
}

export function loadEager() {
  return false;
}

export function loadLazy() {
  const citySections = Array.from(document.querySelectorAll('.section.city'));

  citySections.forEach(observeSection);
}
