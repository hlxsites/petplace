import ffetch from '../../scripts/ffetch.js';
import { createOptimizedPicture, decorateIcons } from '../../scripts/lib-franklin.js';

async function fetchCategoryData() {
  const childCategories = ffetch('/categories.json').filter((c) => c.Path === window.location.pathname || c['Parent Path'] === window.location.pathname);
  const categoryList = [];
  // eslint-disable-next-line no-restricted-syntax
  for await (const category of childCategories) {
    categoryList.push(category);
  }
  if (!categoryList.length) {
    return false;
  }
  return categoryList;
}

function buildPost(post, eager, childCategories) {
  let category;
  let categorypath;
  let categorycolor;
  const postCard = document.createElement('div');
  postCard.classList.add('blog-cards');
  const postDate = new Date(0);
  postDate.setUTCSeconds(post.date);
  const postDateStr = postDate.toLocaleString('default', { month: 'long' }).concat(' ', postDate.getDate(), ', ', postDate.getFullYear());
  childCategories.forEach((item) => {
    if (item.Category === post.category) {
      category = item.Category;
      categorypath = item.Path;
      categorycolor = item.Color;
    }
  });
  postCard.innerHTML = `
      <div class="blogs-card-image">
        <a href="${post.path}">${createOptimizedPicture(post.image, `Teaser image for ${post.title}`, eager).outerHTML}</a>
        <a aria-current="page" class="blogs-card-category ${categorycolor}" href="${categorypath}" data-acsb-clickable="true" data-acsb-navigable="true" data-acsb-now-navigable="true">${category}</a>
      </div>
      <div>              
        <a href="${post.path}">
        <div class="blogs-card-body">
        <h3>${post.title}</h3>
        <p><span class="card-date">${postDateStr.concat(' · ', post.author)}</span></p>
      </div></a>          
      </div>
    </a>
  `;
  return postCard;
}

async function buildBlogFeed(ul, pageNum, pagesElem) {
  const limit = 18;
  const offset = pageNum * limit;
  let morePages = false;
  const categoriesData = await fetchCategoryData();
  const category = [];
  categoriesData.forEach((element) => category.push(element.Category));
  const blogPosts = ffetch('/article/query-index.json').sheet('article')
    .filter((p) => (p.path.startsWith('/article/') && category.includes(p.category)))
    .slice(offset, offset + limit + 1);
  let i = 0;
  const newUl = document.createElement('ul');
  // eslint-disable-next-line no-restricted-syntax
  for await (const post of blogPosts) {
    if (i >= limit) {
      // skip render, but know we have more page
      morePages = true;
      break;
    }
    const li = document.createElement('li');
    li.append(buildPost(post, i < 1, categoriesData));
    newUl.append(li);
    i += 1;
  } 
  pagesElem.innerHTML = `
      <ul class="pagination">
        <li class="prev"><a data-page="${pageNum - 1}" href="${window.location.pathname}?page=${pageNum}"><span class="icon icon-previous"><span class="sr-only">Previous Page</span></a></li>
        <li><span>Page ${pageNum + 1}</span></li>
        <li class="next"><a data-page="${pageNum + 1}" href="${window.location.pathname}?page=${pageNum + 2}"><span class="icon icon-next"></span><span class="sr-only">Next Page</span></a></li>
      </ul>
    `;
  if (pageNum === 0) {
    pagesElem.querySelector('.prev').remove();
  }
  if (!morePages) {
    pagesElem.querySelector('.next').remove();
  }
  pagesElem.querySelectorAll('li > a').forEach((link) => {
    link.addEventListener('click', (evt) => {
      evt.preventDefault();
      buildBlogFeed(ul, Number(link.dataset.page), pagesElem);
    });
  });

  await decorateIcons(pagesElem);
  await decorateIcons(newUl);

  ul.innerHTML = newUl.innerHTML;
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

export default function decorate(block) {
  const observer = new IntersectionObserver(async (entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      const ul = document.createElement('ul');
      block.append(ul);
      const pagesElem = document.createElement('div');
      block.append(pagesElem);
      const usp = new URLSearchParams(window.location.search);
      const page = usp.get('page');
      const pageNum = Number(!page ? '0' : page - 1);
      buildBlogFeed(ul, pageNum, pagesElem);
    }
  });
  observer.observe(block);
}
