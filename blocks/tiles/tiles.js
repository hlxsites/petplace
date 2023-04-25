import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

const data = [
  {
    author: 'Victoria Brown',
    title: 'Best Ways to Make a Pet First Aid Kit - PetPlace',
    date: 1682446241904,
    image: '/article/general/pet-care/media_186661bf169bb626335c2ff1cf0486ebbe4488ce4.png?width=1200&format=pjpg&optimize=medium',
    category: 'Pet Care',
    type: '',
    tags: [],
    description: 'Accidents can happen anywhere, and having a first aid kit for your pet can help you feel more prepared in an emergency.',
    lastModified: 1682354664,
  },
  {
    author: 'Dr. Debra Primovic – DVM',
    title: 'The Ultimate Guide to What Cats Cannot Eat - PetPlace',
    date: 1681344000,
    image: '/article/cats/pet-health/cat-health/cat-diet-nutrition/media_1928f88006579dadfc31dc22e258aeaef2ce840e8.png?width=1200&format=pjpg&optimize=medium',
    category: 'Cat Diet Nutrition',
    type: '',
    tags: [],
    description: "Some human foods can be safe for cats, while others are dangerous, life-threatening, and potentially fatal when ingested. Here's what cats can't eat.",
    lastModified: 1682355689,
  },
  {
    author: 'PetPlace Staff',
    title: 'The Ultimate Guide to Dog Obedience - PetPlace',
    date: 1680134400,
    image: '/article/dogs/pet-behavior-training/media_19aed72998fc723ce2c816c30c6591e2922020e70.png?width=1200&format=pjpg&optimize=medium',
    category: 'Behavior Training',
    type: '',
    tags: [],
    description: 'Teaching a pet to be obedient requires patience, persistence & positivity. We review basic commands and list general dog training rules to keep in mind.',
    lastModified: 1682371908,
  },
];

export default function decorate(block) {
  // Create containing div of three tiles (one big, two small)
  const tileContainer = document.createElement('div');
  tileContainer.className = 'tiles-container';

  [...block.children].forEach(async (row, index) => {
    // const path = new URL(row.firstElementChild.firstElementChild.text).pathname;
    // console.log(path);
    // const res = await fetch(`https://admin.hlx.page/index/hlxsites/petplace/main/${path}`);
    // const json = await res.json();
    //
    // console.log(json?.results[0]?.record);

    const dta = data[index];
    // Create tile div for each individual tile
    const tile = document.createElement('div');
    tile.classList.add('tile');

    const imgPadding = document.createElement('div');
    if (index === 0) {
      tile.classList.add('tile-0');
      imgPadding.classList.add('img-padding');
    }

    const imgContainer = document.createElement('div');
    imgContainer.className = 'img-container';

    // Create Image tag.. future will be <picture> tag
    const img = document.createElement('img');
    img.src = dta.image;

    // Create content div.  This contains title, author, date etc..
    const content = document.createElement('div');
    content.className = 'tile-contents';

    const categoryLink = document.createElement('a');
    categoryLink.className = 'category-link-btn';
    categoryLink.setAttribute('href', dta.category);
    categoryLink.innerHTML = dta.category;

    const categoryLinkMobile = categoryLink.cloneNode(true);
    categoryLinkMobile.classList.add('category-link-btn-mobile');

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
    content.append(categoryLink);
    content.append(title);
    content.append(dateAuthorContainer);

    tile.append(imgContainer);
    if (index === 0) {
      tile.append(categoryLinkMobile);
    }
    tile.append(content);

    tileContainer.append(tile);
  });

  // Check if there are enough child nodes in tileContainer
  if (tileContainer.children.length >= 3) {
    const smallTilesWrapper = document.createElement('div');
    smallTilesWrapper.className = 'small-tiles-wrapper';
    // Move the second and third child nodes into the smallTilesWrapper
    // Not a mistake using index 1 two times.  When we appended smallTilesWrapper with the first child
    // then that child is removed... leaving us with just two.
    smallTilesWrapper.append(tileContainer.children[1]);
    smallTilesWrapper.append(tileContainer.children[1]);
    // Replace the second and third child nodes in tileContainer with the smallTilesWrapper
    tileContainer.append(smallTilesWrapper);
  }

  block.textContent = '';
  block.append(tileContainer);
}
