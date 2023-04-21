import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

const data = [
  {
    title: 'Best Ways to Make a Pet First Aid Kit',
    category: 'Pet Care',
    img: 'https://www.petplace.com/static/eb4551c6490d1ce6c22a7f271b3b56bb/c2d8e/first-aid-header-1.webp',
    date: '2023-04-05T06:00:00.000Z',
    author: 'Victoria Brown',
  },
  {
    title: 'The Ultimate Guide to What Cats Cannot Eat',
    category: 'Cat Diet & Nutrition',
    img: 'https://www.petplace.com/static/72e9901bf82ce584171b78a27767b643/1a9f5/shutterstock_1033889674-1.webp',
    date: '2023-04-13T06:00:00.000Z',
    author: 'Dr. Debra Primovic - DVM',
  },
  {
    title: 'The Ultimate Guide to Dog Obedience',
    category: 'Behavior & Training',
    img: 'https://www.petplace.com/static/90a2517f4ae2ccfba999ac79a5773884/1a9f5/shutterstock_610385162.webp',
    date: '2023-03-30T06:00:00.000Z',
    author: 'PetPlace Staff',
  },

];

export default function decorate(block) {
  // Create containing div of three tiles (one big, two small)
  const tileContainer = document.createElement('div');
  tileContainer.className = 'tiles-container';

  [...block.children].forEach(async (row, index) => {
    const dta = data[index];
    // Create tile div for each individual tile
    const tile = document.createElement('div');
    tile.classList.add('tile');

    const imgPadding = document.createElement('div');
    if (index === 0) {
      tile.classList.add('tile-0');
      imgPadding.setAttribute('style', 'width:100%;padding-bottom:75%');
    }

    const imgContainer = document.createElement('div');
    imgContainer.className = 'img-container';

    // Create Image tag.. future will be <picture> tag
    const img = document.createElement('img');
    img.src = dta.img;

    // Create content div.  This contains title, author, date etc..
    const content = document.createElement('div');
    content.className = 'tile-contents';

    const categoryLink = document.createElement('a');
    categoryLink.className = 'category-link-btn';
    categoryLink.setAttribute('href', dta.category);
    categoryLink.innerHTML = dta.category;

    const title = document.createElement('h4');
    title.innerHTML = dta.title;

    const dateAuthorContainer = document.createElement('div');
    dateAuthorContainer.classList.add('date-author-container');

    const date = new Date(dta.date);
    const dateOptions = { month: 'long', day: 'numeric', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', dateOptions);

    dateAuthorContainer.append(`${formattedDate} · `);
    dateAuthorContainer.append(dta.author);

    imgContainer.append(imgPadding);
    imgContainer.append(img);
    content.append(title);
    content.append(dateAuthorContainer);

    tile.append(imgContainer);
    tile.append(categoryLink);
    tile.append(content);

    tileContainer.append(tile);
  });
  // ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(tileContainer);
}
