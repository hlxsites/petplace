import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
import { getCategories, getCategory, getPlaceholder } from '../../scripts/scripts.js';

let articles;
let breed;
export default async function decorate(block) {
  // Pre-fetch the categories
  await getCategories();

  // Create containing div of three tiles (one big, two small)
  const tileContainer = document.createElement('div');
  tileContainer.className = 'tiles-block-container';

  if (!articles) {
    const data = await Promise.all([
      fetch(`${window.hlx.contentBasePath}/article/query-index.json?sheet=article&limit=500`),
      fetch(`${window.hlx.contentBasePath}/article/query-index.json?sheet=breed`),
    ].map((fetch) => fetch.then((res) => res.json())));
    [articles, breed] = data.map((json) => json?.data);
  }

  const data = (await Promise.all([...block.children].map(async (row) => {
    const path = new URL(row.firstElementChild.firstElementChild.href).pathname;

    for (let i = 0; i < articles.length; i += 1) {
      if (articles[i].path === path) {
        return articles[i];
      }
    }

    for (let i = 0; i < breed.length; i += 1) {
      if (breed[i].path === path) {
        return breed[i];
      }
    }

    const res = await fetch(path);
    if (res.ok) {
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return {
        path,
        category: doc.querySelector('head > meta[name="category"]')?.content,
        title: doc.querySelector('head > title').textContent,
        description: doc.querySelector('head > meta[name="description"]')?.content,
        image: doc.querySelector('head > meta[property="og:image"]')?.content,
        imageAlt: doc.querySelector('head > meta[property="og:image:alt"]')?.content,
        author: doc.querySelector('head > meta[name="author"]')?.content,
        date: Math.floor(new Date(doc.querySelector('head > meta[name="publication-date"]')?.content).getTime() / 1000),
      };
    }

    // eslint-disable-next-line no-console
    console.error(`No article in index found for ${path}`);
    return null;
  }))).filter((item) => item); // filter out null values returned from the for loop

  const categories = await Promise.all(data.map(async (dta) => {
    const category = await getCategory(dta.path.split('/').slice(-2).shift());
    const metaCat = await getCategory(dta.category);

    return category || metaCat || null;
  }));

  data.forEach((dta, index) => {
    const tileTitle = dta.title.replace(/[-|] Petplace(\.com)?$/i, '');
    // Create tile div for each individual tile
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.setAttribute('itemscope', '');
    tile.setAttribute('itemtype', 'https://schema.org/Article');

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
        [
          { media: '(min-width: 1024px)', width: 760 },
          { media: '(min-width: 600px)', width: 1200 },
          { width: 900 },
        ],
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
        [
          { media: '(min-width: 768px)', width: 500 },
          { width: 300 },
        ],
      ));
      img = picture.querySelector('img');
      img.width = 200;
      img.height = 200;
      img.setAttribute('itemprop', 'image');
    }

    // Create content div.  This contains title, author, date etc..
    const content = document.createElement('div');
    content.className = 'tile-contents';
    if (index === 0) {
      content.style.setProperty('--bg-color', `var(--color-${categories[index]?.Color}-transparent)`);
    }

    const categoryLink = document.createElement('a');
    categoryLink.classList.add('category-link-btn');
    categoryLink.href = categories[index]?.Path;
    categoryLink.innerHTML = `<span itemprop="about">${categories[index]?.Category}</span>`;
    categoryLink.style.setProperty('--bg-color', `var(--color-${categories[index]?.Color})`);

    if (index !== 0) {
      categoryLink.classList.add('category-link-btn-transparent');
    }

    const monthNames = [
      getPlaceholder('january'),
      getPlaceholder('february'),
      getPlaceholder('march'),
      getPlaceholder('april'),
      getPlaceholder('may'),
      getPlaceholder('june'),
      getPlaceholder('july'),
      getPlaceholder('august'),
      getPlaceholder('september'),
      getPlaceholder('october'),
      getPlaceholder('november'),
      getPlaceholder('december'),
    ];

    const categoryLinkMobile = categoryLink.cloneNode(true);
    categoryLinkMobile.classList.add('category-link-btn-mobile');

    const title = document.createElement('a');
    title.href = dta.path;
    const titleHeader = document.createElement('h3');
    titleHeader.setAttribute('itemprop', 'name');
    titleHeader.innerHTML = tileTitle;
    title.append(titleHeader);
    const link = document.createElement('link');
    link.setAttribute('itemprop', 'url');
    link.setAttribute('href', dta.path);
    title.append(link);
    const dateAuthorContainer = document.createElement('div');
    dateAuthorContainer.classList.add('date-author-container');

    const date = new Date(dta.date * 1000);
    date.setHours(date.getHours() + (date.getTimezoneOffset() / 60));
    const formattedDate = document.createElement('span');
    formattedDate.setAttribute('itemprop', 'datePublished');
    formattedDate.setAttribute('content', date.toISOString().substring(0, 10));
    formattedDate.textContent = `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

    const author = document.createElement('span');
    author.setAttribute('itemprop', 'author');
    author.textContent = dta.author;

    dateAuthorContainer.append(formattedDate);
    dateAuthorContainer.append(' · ');
    dateAuthorContainer.append(author);

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
