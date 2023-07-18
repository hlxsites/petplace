import { createOptimizedPicture, toClassName } from '../../scripts/lib-franklin.js';
import { getCategories } from '../../scripts/scripts.js';

const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
const categories = await getCategories();
let isAuthorCard = false;

async function buildPost(post) {
  const postCategories = post.category ? post.category.split(',') : [];
  const postCategoriesLowerCase = postCategories.map((c) => c.trim().toLowerCase());

  const category = categories.find((c) => {
    if (post.category && post.category !== '0') {
      return postCategoriesLowerCase.some((item) => c.Slug === toClassName(item)
        || item === c.Category.toLowerCase());
    }
    return c.Slug === post.path.split('/').splice(-2, 1)[0];
  });

  const postCard = document.createElement('div');
  postCard.classList.add('blog-cards');
  const postDate = new Date(0);
  postDate.setUTCSeconds(post.date);
  const style = `--bg-color: var(--color-${category.Color}); --border-color: var(--color-${category.Color}); `;
  postCard.innerHTML = `
      <div class="blogs-card-image">
        <a href="${post.path}">${createOptimizedPicture(post.image, `Teaser image for ${post.title}`, false, [{ width: 800 }]).outerHTML}</a>
        ${category.Category !== 'Breeds' ? `<a class="blogs-card-category" href=${category.Path} style ="${style}">${category.Category}</a>` : ''}
      </div>
      <div>              
        <a href="${post.path}">
        <div class="blogs-card-body">
        <h3>${post.title.replace(/- PetPlace$/, '')}</h3>
        ${category.Category !== 'Breeds' ? `<p><span class="card-date"> <time datetime="${postDate.toISOString().substring(0, 10)}">${dateFormatter.format(postDate)}</time> · ${post.author}</span></p>` : ''}
      </div></a>          
      </div>
    </a>
  `;
  return postCard;
}

async function buildAuthorPost(post) {
  const postCard = document.createElement('div');
  postCard.classList.add('blog-cards');
  postCard.innerHTML = `
      <div class="blogs-card-image">
        <a href="${post.path}">${createOptimizedPicture(post.avatar, `Avatar image for ${post.title}`, false, [{ width: 800 }]).outerHTML}</a>
      </div>
      <div>              
        <a href="${post.path}">
        <div class="blogs-card-body">
        <h3>${post.title.replace(/- Petplace$/i, '')}</h3>
        <span class="read-more">Read more</span>
      </div></a>          
      </div>
    </a>
  `;
  return postCard;
}

async function createCard(row) {
  const li = document.createElement('li');
  if (row.dataset.json) {
    const post = JSON.parse(row.dataset.json);
    li.append(isAuthorCard ? await buildAuthorPost(post) : await buildPost(post));
  } else {
    li.append(row);
  }
  return li;
}

export default function decorate(block) {
  if (block.classList.contains('author')) {
    isAuthorCard = true;
  }
  const ul = document.createElement('ul');
  [...block.children].forEach(async (row) => {
    if (row.classList.contains('skeleton')) {
      ul.append(await createCard(row));
    } else if (ul.querySelector('.skeleton')) {
      ul.querySelector('.skeleton').parentElement.replaceWith(await createCard(row));
    } else if (row.dataset.json || row.textContent.trim()) {
      ul.append(await createCard(row));
    }
  });
  block.innerHTML = '';
  block.append(ul);
  const observer = new MutationObserver((entries) => {
    entries.forEach((entry) => {
      entry.addedNodes.forEach(async (div) => {
        if (div.classList.contains('skeleton')) {
          ul.append(await createCard(div));
          return;
        }
        if (ul.querySelector('.skeleton')) {
          ul.querySelector('.skeleton').parentElement.replaceWith(await createCard(div));
        } else if (div.dataset.json || div.textContent.trim()) {
          ul.append(await createCard(div));
        }
        div.remove();
      });
    });
  });
  observer.observe(block, { childList: true });
}
