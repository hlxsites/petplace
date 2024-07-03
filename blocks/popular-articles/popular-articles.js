import {
  createOptimizedPicture,
  decorateBlock,
  loadBlock,
  toClassName,
} from '../../scripts/lib-franklin.js';
import { getCategory, getPlaceholder } from '../../scripts/scripts.js';

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

async function fetchArticleData(paths) {
  const PromiseArray = paths.map(async (path) => {
    const res = await fetch(path);
    const text = await res.text();

    // Create a temporary element to extract the content within the <main> tag
    const html = document.createElement('div');
    html.innerHTML = text;

    const catSlug = html
      .querySelector('meta[name="category"]')
      .content.split(',')[0]
      ?.trim();
    const catData = await getCategory(toClassName(catSlug));
    const title = html.querySelector('h1').textContent;
    const imageAlt = html.querySelector('meta[property="og:image:alt"]');
    return {
      image: html.querySelector('meta[property="og:image"]').content,
      imageAlt: imageAlt ? imageAlt.content : title,
      path,
      title,
      category: catData.Category,
      categoryPath: catData.Path,
      author: html.querySelector('meta[name="author"]').content,
      publicationDate: html.querySelector('meta[name="publication-date"]')
        .content,
    };
  });

  return Promise.all(PromiseArray);
}

async function getPopularPosts(block, isAuthorPopularPosts) {
  const res = await fetch(
    `${window.hlx.contentBasePath}/fragments/popular-posts`,
  );
  const text = await res.text();
  const html = document.createElement('div');
  let paths = [];
  html.innerHTML = text;

  // Get the content within the <main> tag
  const heading = html.querySelector('h2');
  block.innerHTML = heading.outerHTML;
  if (isAuthorPopularPosts) {
    const popularPostsElem = html.querySelector('.popularpostsauthor');

    if (popularPostsElem) {
      // eslint-disable-next-line max-len
      paths = [...popularPostsElem.children].map(
        (child) => new URL(child.textContent.trim()).pathname,
      );
    }

    return fetchArticleData(paths);
  }
  const popularPostsElem = html.querySelector('.popularpostsarticle');

  if (popularPostsElem) {
    // eslint-disable-next-line max-len
    paths = [...popularPostsElem.children].map(
      (child) => new URL(child.textContent.trim()).pathname,
    );
  }
  paths.splice(4, paths.length);

  return fetchArticleData(paths);
}

export default async function decorate(block) {
  const isAuthorPopularPosts =
    block.querySelector('.author-popular-posts') !== null;
  const PopularPostsData = await getPopularPosts(block, isAuthorPopularPosts);

  if (!isAuthorPopularPosts) {
    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('popular-cards-wrapper');

    PopularPostsData.forEach((post, i) => {
      const date = new Date(post.publicationDate);
      const formattedDate = `${
        monthNames[date.getMonth()]
      } ${date.getDate()}, ${date.getFullYear()}`;

      const popularPostsWrapper = `
        <a href="${post.path}">
          <div class="popular-posts-card">
            <div class="author-date-div">
              <div>
                <img src="/icons/pencil.svg" />
                <p>${post.author}</p>
              </div>
              <div>
                <img src="/icons/calendar.svg" />
                <p>${formattedDate}</p>
              </div>
            </div>
            <div class="img-title-div">
              <div class="img-div"></div>
              <div class="title-div">
                <h3>${post.title}</h3>
              </div>
            </div>
          </div>          
        </a>
      `;
      cardWrapper.innerHTML += popularPostsWrapper;
      const imgDiv = cardWrapper.querySelectorAll('.img-div')[i];
      imgDiv.append(
        createOptimizedPicture(post.image, post.imageAlt, false, [
          { width: '300' },
        ]),
      );
    });

    return block.append(cardWrapper);
  }

  const slideCardMedia = document.createElement('div');
  slideCardMedia.classList.add('slide-cards');
  slideCardMedia.classList.add('media');

  PopularPostsData.forEach((post) => {
    const row = `
      <div>
        <div>
          ${
            createOptimizedPicture(post.image, post.imageAlt, false, [
              { width: '768' },
            ]).outerHTML
          }
        </div>
        <div class="button-container">
          <a href="${post.path}" title="${post.title}" class="button primary">
            ${post.title}
          </a>
          <p>${post.publicationDate} | ${post.author}</p>
        </div>
      </div>
    `;

    slideCardMedia.innerHTML += row;
  });

  block.append(slideCardMedia);
  decorateBlock(slideCardMedia);
  return loadBlock(slideCardMedia);
}
