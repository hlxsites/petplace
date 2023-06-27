import { sequenceCalls } from '../../scripts/scripts.js';

async function updateSection(section) {
  // make all links open in new tab
  section.querySelectorAll('a').forEach((link) => link.setAttribute('target', '_blank'));

  // get all essential elements
  const elements = [
    '.default-content-wrapper',
    '.icon-type-wrapper',
    '.link-box-wrapper',
    ['.columns.city-header .columns-img-col', 'city-header-img'],
    ['.columns.city-header .columns-txt-col', 'city-header-txt'],
    ['.columns.city-middle .columns-txt-col', 'city-middle-txt'],
    ['.columns.city-middle .columns-img-col', 'city-middle-img'],
    ['.columns.city-footer .columns-img-col', 'city-footer-img'],
    ['.columns.city-footer .columns-txt-col', 'city-footer-txt'],
    '.section.city .tips-wrapper',
  ].map((e) => {
    if (Array.isArray(e)) {
      const el = section.querySelector(e[0]);
      el.classList.add(e[1]);
      return el;
    }
    return section.querySelector(e);
  });

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

export function loadEager() {
  return false;
}

export function loadLazy() {
  const citySections = Array.from(document.querySelectorAll('.section.city'));
  
  citySections.forEach((section) => {
    section.addEventListener('decorationDone', () => {sequenceCalls([section], updateSection)});
 });
}
