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

async function getPopularPosts(block) {
  const res = await fetch('/popular-posts');
  const text = await res.text();
  const html = document.createElement('div');
  let paths = [];
  html.innerHTML = text;
  // Get the content within the <main> tag
  const heading = html.querySelector('h2');
  block.innerHTML = heading.outerHTML;

  const popularPostsElem = html.querySelector('.popularposts');

  if (popularPostsElem) {
    // eslint-disable-next-line max-len
    paths = [...popularPostsElem.children].map((child) => new URL(child.textContent.trim()).pathname);
  }
  // if popularPostsElem is not found or there is less than three paths
  if (paths.length < 3) {
    paths.push(...await getPathsFromSlideshow());
  }
  paths.splice(3, paths.length);

  return fetchArticleData(paths);
}

export default async function decorate(block) {
  const PopularPostsData = await getPopularPosts(block);

  const cardWrapper = document.createElement('div');
  cardWrapper.classList.add('popular-cards-wrapper');

  PopularPostsData.forEach((post, i) => {
    const popularPostsWrapper = `
      <div class="popular-posts-card">
        <a href=" ${post.path}">
            <div class="img-div"></div>
        </a>
        <div class="title-div">
            <a href="${post.categoryPath}">${post.category}</a>
            <a href=" ${post.path}"><h3>${post.title}</h3></a>
        </div>
      </div>          
    `;
    cardWrapper.innerHTML += popularPostsWrapper;
    cardWrapper.querySelectorAll('.img-div')[i].append(createOptimizedPicture(post.image, post.imageAlt, false, [{ width: '300' }]));
  });

  block.append(cardWrapper);
}
