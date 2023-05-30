import { createOptimizedPicture, toClassName } from '../../scripts/lib-franklin.js';
import { getCategory } from '../../scripts/scripts.js';

async function getPopularPosts() {
  const res = await fetch('/popular-posts');
  const html = await res.text();
  const tempElement = document.createElement('div');
  tempElement.innerHTML = html;

  // Get the content within the <main> tag
  const popularPosts = tempElement.querySelector('.popularposts');
  const foo = [...popularPosts.children].map(async (child) => {
    const url = new URL(child.textContent.trim());
    const res = await fetch(url.pathname);
    const html = await res.text();

    // Create a temporary element to extract the content within the <main> tag
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;

    const catSlug = tempElement.querySelector('meta[name="category"]').content;
    const catData = await getCategory(toClassName(catSlug));

    return {
      image: tempElement.querySelector('meta[property="og:image"]').content,
      imageAlt: tempElement.querySelector('meta[property="og:image:alt"]').content,
      path: url.pathname,
      title: tempElement.querySelector('h1').textContent,
      category: catData.Category,
      categoryPath: catData.Path,
    };
  });

  return await Promise.all(foo);
}

async function getTopPostsFromSlideshow() {
  const res = await fetch('/');
  const html = await res.text();

  // Create a temporary element to extract the content within the <main> tag
  const tempElement = document.createElement('div');
  tempElement.innerHTML = html;

  // Get the content within the <main> tag
  const slideShow = tempElement.querySelector('.slideshow');

  const data = [...slideShow.children].map((child) => ({
    image: child.querySelector('picture').outerHTML,
    imageAlt: 'foo',
    path: child.querySelector('a').href,
    title: child.querySelector('h1').textContent,
    category: '[Placeholder]',
    categoryPath: catData.Path,
  }));

  data.splice(3, data.length);

  return data;
}

export default async function decorate(block) {
  block.innerHTML = '<h2>Popular Posts</h2>';

  let PopularPostsData = await getPopularPosts();
  if (!PopularPostsData) {
    PopularPostsData = await getTopPostsFromSlideshow;
  }

  const cardWrapper = document.createElement('div');
  cardWrapper.classList.add('popular-cards-wrapper');

  PopularPostsData.forEach((post) => {
    const foo = `
      <div class="popular-posts-wrapper">
        <a href=" ${post.path}">
            <div class="img-div">${createOptimizedPicture(post.image, post.imageAlt).outerHTML}</div>
        </a>
        <div class="title-div">
            <a href="${post.categoryPath}">${post.category}</a>
            <a href=" ${post.path}"><h3>${post.title}</h3></a>
        </div>
      </div>          
`;

    cardWrapper.innerHTML += foo;
  });

  block.append(cardWrapper);
}
