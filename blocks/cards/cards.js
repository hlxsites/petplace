import { getCategories } from '../../scripts/scripts.js';
import { createOptimizedPicture, decorateIcons, toClassName } from '../../scripts/lib-franklin.js';

async function buildPost(post) {
  const categories = await getCategories();
  const category = categories.data.find((c) => {
    if (post.category && post.category !== '0') {
      return c.Slug === toClassName(post.category)
        || c.Category.toLowerCase() === post.category.toLowerCase();
    }
    return c.Slug === post.path.split('/').splice(-2, 1)[0];
  });
  const postCard = document.createElement('div');
  postCard.classList.add('blog-cards');
  const postDate = new Date(0);
  postDate.setUTCSeconds(post.date);
  const postDateStr = postDate.getMonth().toString().concat(' ', postDate.getDate(), ', ', postDate.getFullYear());
  const style = `--bg-color: var(--color-${category.Color}); --border-color: var(--color-${category.Color}); `;
  postCard.innerHTML = `
      <div class="blogs-card-image">
        <a href="${post.path}">${createOptimizedPicture(post.image, `Teaser image for ${post.title}`, false).outerHTML}</a>
        ${category.Category !== 'Breeds' ? `<a class="blogs-card-category" href=${category.Path} style ="${style}">${category.Category}</a>` : ''}
      </div>
      <div>              
        <a href="${post.path}">
        <div class="blogs-card-body">
        <h3>${post.title.replace(/- PetPlace$/, '')}</h3>
        ${category.Category !== 'Breeds' ? `<p><span class="card-date"> <time datetime="${postDateStr}">${postDateStr}</time> · ${post.author}</span></p>` : ''}
      </div></a>          
      </div>
    </a>
  `;
  if (category.Category !== 'Breeds') {
    setTimeout(() => {
      window.requestAnimationFrame(() => {
        postCard.querySelector('time').textContent = postDate.toLocaleString('default', { month: 'long' }).concat(' ', postDate.getDate(), ', ', postDate.getFullYear());
      });
    });
  }
  return postCard;
}

// async function buildBlogFeed(ul, pageNum, pagesElem) {
//   const limit = 18;
//   const offset = pageNum * limit;
//   let morePages = false;
//   const categoriesData = await fetchCategoryData();
//   const category = [];
//   categoriesData.forEach((element) => category.push(element.Category));
//   const blogPosts = ffetch('/article/query-index.json').sheet('article')
//     .filter((p) => (p.path.startsWith('/article/') && compareCategory(category, p.category)))
//     .slice(offset, offset + limit + 1);
//   let i = 0;
//   const newUl = document.createElement('ul');
//   // eslint-disable-next-line no-restricted-syntax
//   for await (const post of blogPosts) {
//     if (i >= limit) {
//       // skip render, but know we have more page
//       morePages = true;
//       break;
//     }
//     const li = document.createElement('li');
//     li.append(buildPost(post, i < 1, categoriesData));
//     newUl.append(li);
//     i += 1;
//   }
//   await decorateIcons(newUl);
//   ul.innerHTML = newUl.innerHTML;
// }

async function createCard(row) {
  const li = document.createElement('li');
  const post = JSON.parse(row.dataset.json);
  li.append(await buildPost(post));
  // [...li.children].forEach((div) => {
  //   if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
  //   else div.className = 'cards-card-body';
  // });
  // li.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  return li;
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach(async (row) => {
    if (row.textContent.trim()) {
      ul.append(await createCard(row));
    }
  });
  block.innerHTML = '';
  block.append(ul);
  // if (block.classList.contains('article')) {
  //   // artcile cards block
  //   block.append(ul);
  //   const usp = new URLSearchParams(window.location.search);
  //   const page = usp.get('page');
  //   const pageNum = Number(!page ? '0' : page - 1);
  //   buildBlogFeed(ul, pageNum, pagesElem);
  // } else {
  //   // default cards block
  //   [...block.children].forEach((row) => {
  //     const li = document.createElement('li');
  //     li.innerHTML = row.innerHTML;
  //     [...li.children].forEach((div) => {
  //       if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
  //       else div.className = 'cards-card-body';
  //     });
  //     ul.append(li);
  //   });
  //   ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  //   block.textContent = '';
  //   block.append(ul);
  // }

  const observer = new MutationObserver((entries) => {
    entries.forEach((entry) => {
      entry.addedNodes.forEach(async (div) => {
        ul.append(await createCard(div));
        div.remove();
      });
    });
  });
  observer.observe(block, { childList: true });
}
