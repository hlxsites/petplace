import ffetch from '../../scripts/ffetch.js';
import { getCategories } from '../../scripts/scripts.js';
import { createOptimizedPicture, decorateIcons } from '../../scripts/lib-franklin.js';

async function fetchCategoryData() {
  const allCategories = await getCategories();
  const childCategories = allCategories.data.filter((c) => c.Path === window.location.pathname || c['Parent Path'] === window.location.pathname);
  return childCategories;
}

function buildPost(post, eager, childCategories) {
  let category;
  let categorypath;
  let categorycolor;
  const postCard = document.createElement('div');
  postCard.classList.add('blog-cards');
  const postDate = new Date(0);
  postDate.setUTCSeconds(post.date);
  const postDateStr = postDate.getMonth().toString().concat(' ', postDate.getDate(), ', ', postDate.getFullYear());
  childCategories.forEach((item) => {
    if (item.Category.toLowerCase() === post.category.toLowerCase()) {
      category = item.Category;
      categorypath = item.Path;
      categorycolor = item.Color;
    }
  });
  const style = `--bg-color: var(--color-${categorycolor}); --border-color: var(--color-${categorycolor}); `;
  postCard.innerHTML = `
      <div class="blogs-card-image">
        <a href="${post.path}">${createOptimizedPicture(post.image, `Teaser image for ${post.title}`, eager).outerHTML}</a>
        <a class="blogs-card-category" href=${categorypath} style ="${style}">${category}</a>
      </div>
      <div>              
        <a href="${post.path}">
        <div class="blogs-card-body">
        <h3>${post.title}</h3>
        <p><span class="card-date"> <time datetime="${postDateStr}">${postDateStr}</time> · ${post.author}</span></p>
      </div></a>          
      </div>
    </a>
  `;
  setTimeout(() => {
    window.requestAnimationFrame(() => {
      postCard.querySelector('time').textContent = postDate.toLocaleString('default', { month: 'long' }).concat(' ', postDate.getDate(), ', ', postDate.getFullYear());
    });
  });
  return postCard;
}

function compareCategory(categoryList, category) {
  const tempCategory = category.toLowerCase();
  let match = false;
  categoryList.forEach((element) => {
    if (element.toLowerCase() === tempCategory) {
      match = true;
    }
  });
  return match;
}

async function buildBlogFeed(ul, pageNum, pagesElem) {
  const limit = 18;
  const offset = pageNum * limit;
  let morePages = false;
  const categoriesData = await fetchCategoryData();
  const category = [];
  categoriesData.forEach((element) => category.push(element.Category));
  const blogPosts = ffetch('/article/query-index.json').sheet('article')
    .filter((p) => (p.path.startsWith('/article/') && compareCategory(category, p.category)))
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
    <li class="prev"><a data-page="${pageNum - 1}" href="${window.location.pathname}?page=${pageNum}"><span class="icon icon-previous"></span></a></li>
    <li><span aria-current="page">Page ${pageNum + 1}</span></li>
    <li class="next"><a data-page="${pageNum + 1}" href="${window.location.pathname}?page=${pageNum + 2}"><span class="icon icon-next"></span></span></a></li>
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
}

function createCard(row) {
  const li = document.createElement('li');
  li.innerHTML = row.innerHTML;
  [...li.children].forEach((div) => {
    if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
    else div.className = 'cards-card-body';
  });
  li.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  return li;
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  if (block.classList.contains('article')) {
    // artcile cards block
    block.append(ul);
    const pagesElem = document.createElement('div');
    block.append(pagesElem);
    const usp = new URLSearchParams(window.location.search);
    const page = usp.get('page');
    const pageNum = Number(!page ? '0' : page - 1);
    buildBlogFeed(ul, pageNum, pagesElem);
  } else {
    // default cards block
    [...block.children].forEach((row) => {
      const li = document.createElement('li');
      li.innerHTML = row.innerHTML;
      [...li.children].forEach((div) => {
        if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
        else div.className = 'cards-card-body';
      });
      ul.append(li);
    });
    ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
    block.textContent = '';
    block.append(ul);
  }

  const observer = new MutationObserver((entries) => {
    entries.forEach((entry) => {
      entry.addedNodes.forEach((div) => {
        ul.append(createCard(div));
        div.remove();
      });
    });
  });
  observer.observe(block, { childList: true });
}
