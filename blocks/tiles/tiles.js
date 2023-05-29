import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
import { getCategory } from '../../scripts/scripts.js';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

let articles;
let breed;
export default async function decorate(block) {
  // Create containing div of three tiles (one big, two small)
  const tileContainer = document.createElement('div');
  tileContainer.className = 'tiles-block-container';

  if (!articles) {
    const res = await fetch('/article/query-index.json?sheet=article&limit=2000');
    const queryData = await res.json();
    articles = queryData?.data;
  }

  const data = (await Promise.all([...block.children].map(async (row) => {
    const path = new URL(row.firstElementChild.firstElementChild.href).pathname;

    for (let i = 0; i < articles.length; i += 1) {
      if (articles[i].path === path) {
        return articles[i];
      }
    }

    if (!breed) {
      const res = await fetch('/article/query-index.json?sheet=breed');
      const queryData = await res.json();
      breed = queryData?.data;
    }

    for (let i = 0; i < breed.length; i += 1) {
      if (breed[i].path === path) {
        return breed[i];
      }
    }

    // eslint-disable-next-line no-console
    console.error(`No article in index found for ${path}`);
    return null;
  }))).filter((item) => item); // filter out null values returned from the for loop

  const categories = await Promise.all(data.map(async (dta) => {
    const category = await getCategory(dta.path.split('/').slice(-2).shift());
    if (category) {
      return category;
    }
    return null;
  }));

  data.forEach((dta, index) => {
    const tileTitle = dta.title.endsWith(' - PetPlace')
      ? dta.title.substring(0, dta.title.lastIndexOf(' - PetPlace'))
      : dta.title;
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
    let picture;
    let img;
    if (index === 0) {
      picture = createOptimizedPicture(
        dta.image,
        dta?.imageAlt || tileTitle,
        false,
        [{ width: 768 }],
      );
      img = picture.querySelector('img');
      img.width = 768;
      img.height = 432;
    } else {
      picture = document.createElement('a');
      picture.href = dta.path;
      picture.append(createOptimizedPicture(
        dta.image,
        dta?.imageAlt || tileTitle,
        false,
        [{ width: 200 }],
      ));
      img = picture.querySelector('img');
      img.width = 200;
      img.height = 200;
    }

    // Create content div.  This contains title, author, date etc..
    const content = document.createElement('div');
    content.className = 'tile-contents';
    if (index === 0) {
      content.style.setProperty('--bg-color', `var(--color-${categories[index]?.Color}-transparent)`);
    }

    const categoryLink = document.createElement('a');
    categoryLink.classList.add('category-link-btn');
    categoryLink.href = dta.path.substring(0, dta.path.lastIndexOf('/'));
    categoryLink.innerHTML = categories[index]?.Category;
    categoryLink.style.setProperty('--bg-color', `var(--color-${categories[index]?.Color})`);

    if (index !== 0) {
      categoryLink.classList.add('category-link-btn-transparent');
    }

    const categoryLinkMobile = categoryLink.cloneNode(true);
    categoryLinkMobile.classList.add('category-link-btn-mobile');

    const title = document.createElement('a');
    title.href = dta.path;
    const titleHeader = document.createElement('h3');
    titleHeader.innerHTML = tileTitle;
    title.append(titleHeader);
    const dateAuthorContainer = document.createElement('div');
    dateAuthorContainer.classList.add('date-author-container');

    const date = new Date(dta.date * 1000);
    date.setHours(date.getHours() + (date.getTimezoneOffset() / 60));
    const formattedDate = `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

    dateAuthorContainer.append(`${formattedDate} · `);
    dateAuthorContainer.append(dta.author);

    imgContainer.append(imgPadding);
    imgContainer.append(picture);
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
    // Not a mistake using index 1 two times.  When we appended smallTilesWrapper
    // with the first child
    // then that child is removed... leaving us with just two.
    smallTilesWrapper.append(tileContainer.children[1]);
    smallTilesWrapper.append(tileContainer.children[1]);
    // Replace the second and third child nodes in tileContainer with the smallTilesWrapper
    tileContainer.append(smallTilesWrapper);
  }

  block.textContent = '';
  block.append(tileContainer);
}
