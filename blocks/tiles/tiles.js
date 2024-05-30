import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
import {
  getCategories,
  getCategory,
  getPlaceholder,
  isMobile,
} from '../../scripts/scripts.js';

let articles;
let breed;
export default async function decorate(block) {
  // Pre-fetch the categories
  await getCategories();

  // Create containing div of three tiles (one big, two small)
  const tileBlockContainer = document.createElement('div');
  tileBlockContainer.className = 'tiles-block-container';

  if (!articles) {
    const data = await Promise.all(
      [
        fetch(
          `${window.hlx.contentBasePath}/article/query-index.json?sheet=article&limit=500`,
        ),
        fetch(
          `${window.hlx.contentBasePath}/article/query-index.json?sheet=breed`,
        ),
      ].map((fetch) => fetch.then((res) => res.json())),
    );
    [articles, breed] = data.map((json) => json?.data);
  }

  const data = (
    await Promise.all(
      [...block.children].map(async (row) => {
        const path = new URL(row.querySelector('a').href).pathname;

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
            category: doc.querySelector('head > meta[name="category"]')
              ?.content,
            title: doc.querySelector('head > title').textContent,
            description: doc.querySelector('head > meta[name="description"]')
              ?.content,
            image: doc.querySelector('head > meta[property="og:image"]')
              ?.content,
            imageAlt: doc.querySelector('head > meta[property="og:image:alt"]')
              ?.content,
            author: doc.querySelector('head > meta[name="author"]')?.content,
            date: Math.floor(
              new Date(
                doc.querySelector(
                  'head > meta[name="publication-date"]',
                )?.content,
              ).getTime() / 1000,
            ),
          };
        }

        // eslint-disable-next-line no-console
        console.error(`No article in index found for ${path}`);
        return null;
      }),
    )
  ).filter((item) => item); // filter out null values returned from the for loop

  const categories = await Promise.all(
    data.map(async (dta) => {
      const category = await getCategory(dta.path.split('/').slice(-2).shift());
      const metaCat = await getCategory(dta.category);

      return category || metaCat || null;
    }),
  );

  data.forEach((dta, index) => {
    const tileTitle = dta.title.replace(/[-|] Petplace(\.com)?$/i, '');
    // Create tile div for each individual tile
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.setAttribute('itemscope', '');
    tile.setAttribute('itemtype', 'https://schema.org/Article');

    const imgPadding = document.createElement('div');

    const imgContainer = document.createElement('div');
    imgContainer.className = 'img-container';

    // Create Image tag.. future will be <picture> tag
    let picture;
    let img;
    // if (index === 0) {
    //   picture = createOptimizedPicture(
    //     dta.image,
    //     dta?.imageAlt || tileTitle,
    //     false,
    //     [
    //       { media: '(min-width: 1024px)', width: 760 },
    //       { media: '(min-width: 600px)', width: 1200 },
    //       { width: 900 },
    //     ],
    //   );
    //   img = picture.querySelector('img');
    //   img.width = 768;
    //   img.height = 432;
    // } else {
    picture = document.createElement('a');
    picture.href = dta.path;
    picture.append(
      createOptimizedPicture(dta.image, dta?.imageAlt || tileTitle, false, [
        { media: '(min-width: 768px)', width: 500 },
        { width: 300 },
      ]),
    );
    img = picture.querySelector('img');
    img.width = 200;
    img.height = 200;
    img.setAttribute('itemprop', 'image');
    // }

    // Create content div.  This contains title, author, date etc..
    const content = document.createElement('div');
    content.className = 'tile-contents';
    // if (index === 0) {
    //   content.style.setProperty('--bg-color', `var(--color-${categories[index]?.Color}-transparent)`);
    // }

    const categoryLink = document.createElement('a');
    categoryLink.classList.add('category-link-btn');
    categoryLink.href = categories[index]?.Path;

    categoryLink.innerHTML = `<span itemprop="about">${categories[index]?.Category}</span>`;
    categoryLink.style.setProperty(
      '--bg-color',
      `var(--color-${categories[index]?.Color})`,
    );

    // if (index !== 0) {
    categoryLink.classList.add('category-link-btn-transparent');
    // }

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

    const titleDiv = document.createElement('div');
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
    // titleDiv.className = 'article-title-container';
    titleDiv.append(title);

    const dateAuthorContainer = document.createElement('div');
    dateAuthorContainer.classList.add('date-author-container');

    const date = new Date(dta.date * 1000);
    date.setHours(date.getHours() + date.getTimezoneOffset() / 60);
    const formattedDate = document.createElement('span');
    formattedDate.setAttribute('itemprop', 'datePublished');
    formattedDate.setAttribute('content', date.toISOString().substring(0, 10));
    formattedDate.textContent = `${
      monthNames[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`;

    const authorText = document.createElement('span');
    authorText.setAttribute('itemprop', 'author');
    authorText.textContent = dta.author;

    const authorDiv = document.createElement('div');
    const authorIcon = document.createElement('img');
    authorIcon.src = '/icons/pencil.svg';
    authorDiv.append(authorIcon);
    authorDiv.append(authorText);

    const dateDiv = document.createElement('div');
    const dateIcon = document.createElement('img');
    dateIcon.src = '/icons/calendar.svg';
    dateDiv.append(dateIcon);
    dateDiv.append(formattedDate);

    dateAuthorContainer.append(authorDiv);
    dateAuthorContainer.append(dateDiv);

    imgContainer.append(categoryLink);
    imgContainer.append(imgPadding);
    imgContainer.append(picture);
    content.append(titleDiv);
    content.append(dateAuthorContainer);

    // if (index === 0) {
    //   tile.append(categoryLinkMobile);
    // }
    tile.append(imgContainer);
    tile.append(content);
    tileBlockContainer.append(tile);
  });

  block.textContent = '';
  block.append(tileBlockContainer);

  if (tileBlockContainer.closest('.spotlight') && !isMobile()) {
    const tile0 = tileBlockContainer.children[0];
    tile0.classList.add('tile-0');

    const content = tile0.querySelector('.tile-contents');
    const titleDiv = content.children[0];
    const dateAuthor = content.children[1];
    content.append(dateAuthor);
    content.append(titleDiv);

    const linkContainer = document.createElement('p');
    const linkBtn = document.createElement('a');
    linkContainer.className = 'button-container';
    linkBtn.textContent = 'Read Article';
    linkBtn.href = titleDiv.querySelector('a').href;
    linkBtn.className = 'button primary';
    linkContainer.appendChild(linkBtn);
    content.append(linkContainer);

    // main spotlight div to show featured item
    const spotlightDiv = document.createElement('div');
    spotlightDiv.className = 'tile-spotlight';
    spotlightDiv.append(tile0);

    // rest of the tiles go back into row setup
    const othersDiv = document.createElement('div');
    othersDiv.className = 'tiles-featured';
    othersDiv.append(tileBlockContainer.children[0]);
    othersDiv.append(tileBlockContainer.children[0]);
    othersDiv.append(tileBlockContainer.children[0]);

    tileBlockContainer.append(spotlightDiv);
    tileBlockContainer.append(othersDiv);
  }

  if (!tileBlockContainer.closest('.spotlight')) {
    const tileContainer = tileBlockContainer.closest('.tiles-container');
    tileContainer.classList.add('tiles-with-bg');
  } else {
    const tileContainer = tileBlockContainer.closest('.tiles-container');
    tileContainer.classList.add('tiles-without-bg');
  }
}
