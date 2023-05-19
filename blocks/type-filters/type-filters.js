import { decorateIcons } from '../../scripts/lib-franklin.js';

const dogData = [
  {
    title: 'Bernese Mountain Dog',
    path: '/article/breed/pembroke-welsh-corgi',
    image: 'https://www.petplace.com/static/13f543f6b95f2721e69c5837a93e8d2a/5f007/shutterstock_553932688.jpg',
    type: 'Working',
  },
  {
    title: 'German Shepherd',
    path: '/article/breed/pembroke-welsh-corgi',
    image: 'https://www.petplace.com/static/d9ef35df99413fbc95fa70fb5e2cb4a5/8c6c5/Image00077-2.jpg',
    type: 'Herding',
  },
  {
    title: 'Cane Corso',
    path: '/article/breed/pembroke-welsh-corgi',
    image: 'https://www.petplace.com/static/86340b3745ad87353e5d34cd6f7948d9/0979f/Image00879.jpg',
    type: 'Working',
  },
  {
    title: 'Pembroke Welsh Corgi',
    path: '/article/breed/pembroke-welsh-corgi',
    image: '/article/breed/media_13321bf0df5f5617215deec61f85105d21537b228.png?width=1200&format=pjpg&optimize=medium',
    type: 'Herding',
  },
  {
    title: 'Beauceron',
    path: '/article/breed/pembroke-welsh-corgi',
    image: 'https://www.petplace.com/static/6f41898a93761b510f45cf2951594f84/5f007/shutterstock_1561634782.jpg',
    type: 'Herding',
  },
  {
    title: 'Jindo',
    path: '/article/breed/pembroke-welsh-corgi',
    image: 'https://www.petplace.com/static/5e1e255b1f8b3d67089f9a4202630e5c/5f007/shutterstock_757757533.jpg',
    type: 'N/A',
  },
  // {
  //   title: 'Labradoodle',
  //   path: '/article/breed/pembroke-welsh-corgi',
  //   image: '',
  //   type: '',
  // },
  // {
  //   title: 'Bloodhound',
  //   path: '/article/breed/pembroke-welsh-corgi',
  //   image: '',
  //   type: '',
  // },
];

export default async function decorate(block) {
  block.innerHTML = `
      <div class="type-filter">
        <div class="filter-btn"><span>Filters</span></div>
        <div class="category-filters search-filters ">
          <h3>
            Type <span class="icon icon-chevron"></span>
          </h3>
          <div class="filter-type is-active ">
            <div class="checkbox-wrapper"><input type="checkbox" checked="" name="Sporting"><span><label for="Sporting">Sporting</label></span></div>
            <div class="checkbox-wrapper"><input type="checkbox" checked="" name="Hound"><span><label for="Hound">Hound</label></span></div>
            <div class="checkbox-wrapper"><input type="checkbox" checked="" name="Terrier"><span><label for="Terrier">Terrier</label></span></div>
            <div class="checkbox-wrapper"><input type="checkbox" checked="" name="Non-Sporting"><span><label for="Non-Sporting">Non-Sporting</label></span></div>
            <div class="checkbox-wrapper"><input type="checkbox" checked="" name="Toy"><span><label for="Toy">Toy</label></span></div>
            <div class="checkbox-wrapper"><input type="checkbox" checked="" name="Herding"><span><label for="Herding">Herding</label></span></div>
            <div class="checkbox-wrapper"><input type="checkbox" checked="" name="Working"><span><label for="Working">Working</label></span></div>
            <div class="checkbox-wrapper"><input type="checkbox" checked="" name="N/A"><span><label for="N/A">N/A</label></span></div>
          </div>
        </div>
      </div>
      <div class="card-container">
        <div class="card-grid"></div>
         <div class="pagination"><div class="pagination-buttons">Page: 1 of 12<button></button></div></div>
      </div>

`;

  block.querySelector('.filter-btn').addEventListener('click', () => {
    const categoryFilters = block.querySelector('.category-filters');

    if (categoryFilters.clientHeight === 0) {
      block.querySelector('.category-filters').style.removeProperty('max-height');
    } else {
      block.querySelector('.category-filters').style.setProperty('max-height', '0');
    }
  });

  const chevron = block.querySelector('.icon-chevron');
  chevron.addEventListener('click', () => {
    const filterType = block.querySelector('.filter-type');

    if (filterType.classList.contains('is-active')) {
      filterType.classList.remove('is-active');
      chevron.style.setProperty('transform', 'rotateX(0deg)');
    } else {
      filterType.classList.add('is-active');
      chevron.style.setProperty('transform', 'rotateX(180deg)');
    }
  });

  const cardGrid = block.querySelector('.card-grid');

  dogData.forEach((data) => {
    const item = `<div class="grid-item">
            <div class="img-container">
                <img src="${data.image}" alt="Dog 1">
            </div>
            <h3>${data.title}</h3>
          </div>`;
    cardGrid.innerHTML += item;
  });
  decorateIcons(block);
}
