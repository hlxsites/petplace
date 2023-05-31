import { createOptimizedPicture, toClassName } from '../../scripts/lib-franklin.js';
import { getCategory } from '../../scripts/scripts.js';

async function fetchArticleData(paths) {
  const PromiseArray = paths.map(async (path) => {
    const res = await fetch(path);
    const text = await res.text();

    // Create a temporary element to extract the content within the <main> tag
    const html = document.createElement('div');
    html.innerHTML = text;

    const catSlug = html.querySelector('meta[name="category"]').content;
    const catData = await getCategory(toClassName(catSlug));

    return {
      image: html.querySelector('meta[property="og:image"]').content,
      imageAlt: html.querySelector('meta[property="og:image:alt"]').content,
      path,
      title: html.querySelector('h1').textContent,
      category: catData.Category,
      categoryPath: catData.Path,
    };
  });

  return Promise.all(PromiseArray);
}

async function getPathsFromSlideshow() {
  const res = await fetch('/');
  const html = await res.text();

  // Create a temporary element to extract the content within the <main> tag
  const tempElement = document.createElement('div');
  tempElement.innerHTML = html;

  // Get the content within the <main> tag
  const slideShow = tempElement.querySelector('.slideshow');
  const paths = [...slideShow.children].map((child) => new URL(child.querySelector('a').href).pathname);
  paths.splice(3, paths.length);

  return paths;
}

async function getPopularPosts() {
  const res = await fetch('/popular-posts');
  const text = await res.text();
  const html = document.createElement('div');
  let paths = [];
  html.innerHTML = text;
  // Get the content within the <main> tag
  const popularPostsElem = html.querySelector('.popularposts');

  if (popularPostsElem) {
    // eslint-disable-next-line max-len
    paths = [...popularPostsElem.children].map((child) => new URL(child.textContent.trim()).pathname);
  }
  // if
  if (paths.length !== 3) {
    paths.push(...await getPathsFromSlideshow());
    paths.splice(3, paths.length);
  }

  return await fetchArticleData(paths);
}

export default async function decorate(block) {
  block.innerHTML = '<h2>Popular Posts</h2>';
  const PopularPostsData = await getPopularPosts();

  const cardWrapper = document.createElement('div');
  cardWrapper.classList.add('popular-cards-wrapper');

  PopularPostsData.forEach((post) => {
    const popularPostsWrapper = `
      <div class="popular-posts-card">
        <a href=" ${post.path}">
            <div class="img-div">${createOptimizedPicture(post.image, post.imageAlt).outerHTML}</div>
        </a>
        <div class="title-div">
            <a href="${post.categoryPath}">${post.category}</a>
            <a href=" ${post.path}"><h3>${post.title}</h3></a>
        </div>
      </div>          
    `;

    cardWrapper.innerHTML += popularPostsWrapper;
  });

  block.append(cardWrapper);
}
