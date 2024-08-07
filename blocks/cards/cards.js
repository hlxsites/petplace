import { createOptimizedPicture, decorateIcons, toClassName } from '../../scripts/lib-franklin.js';
import { getCategories, getPlaceholder } from '../../scripts/scripts.js';

const categories = await getCategories();
let isAuthorCard = false;
let isEager = true;
let dateFormatter;

async function buildPost(post, eager) {
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
  postCard.setAttribute('itemscope', '');
  postCard.setAttribute('itemtype', 'https://schema.org/Article');
  const postDate = new Date(0);
  postDate.setUTCSeconds(post.date);
  const style = `--bg-color: var(--article-color-${category.Color}); --border-color: var(--article-color-${category.Color}); `;
  postCard.innerHTML = `
    <div class="blogs-card-image">
      <a href="${post.path}">${createOptimizedPicture(post.image, `${getPlaceholder('teaserLabel')} ${post.title}`, eager, [{ width: 800 }]).outerHTML}</a>
      ${category.Category !== 'Breeds' ? `<a class="blogs-card-category" href=${category.Path} style ="${style}"><span itemprop="about">${category.Category}</span></a>` : ''}
    </div>
    <div class="blogs-card-content">
      <a class="blogs-card-link" href="${post.path}">
        <div class="blogs-card-body">
          <link itemprop="url" href="${post.path}"/>
          <h3 itemprop="name">${post.title.replace(/[-|] Petplace(\.com)?$/i, '')}</h3>
          ${category.Category !== 'Breeds' ? `<p class="card-metadata">
            <span class="card-author">
              <span class="icon icon-pencil"></span>
              <span itemprop="author">${post.author}</span>
            </span>
            <span class="card-date">
              <span class="icon icon-calendar"></span>
              <time itemprop="datePublished" datetime="${postDate.toISOString().substring(0, 10)}"></time>
            </span>
          </p>` : ''}
          <div class="card-cta">Read Article</div>
        </div>
      </a>
    </div>
  </a>`;
  window.setTimeout(() => {
    if (!dateFormatter) {
      dateFormatter = new Intl.DateTimeFormat(document.documentElement.lang, { month: 'long', day: 'numeric', year: 'numeric' });
    }
    postCard.querySelector('time').textContent = dateFormatter.format(postDate);
  });
  postCard.querySelector('img').setAttribute('itemprop', 'image');
  return postCard;
}

async function buildAuthorPost(post, eager) {
  const postCard = document.createElement('div');
  postCard.classList.add('blog-cards');
  postCard.setAttribute('itemscope', '');
  postCard.setAttribute('itemtype', 'https://schema.org/Person');
  postCard.innerHTML = `
      <div class="blogs-card-image">
        <a href="${post.path}">${createOptimizedPicture(post.avatar, `${getPlaceholder('avatarLabel')} ${post.title}`, eager, [{ width: 800 }]).outerHTML}</a>
      </div>
      <div>              
        <a href="${post.path}">
        <div class="blogs-card-body">
        <h3 itemprop="name">${post.title.replace(/[-|] Petplace(\.com)?$/i, '')}</h3>
        <span class="read-more">Read more</span>
      </div></a>          
      </div>
    </a>
  `;
  postCard.querySelector('img').setAttribute('itemprop', 'image');
  return postCard;
}

async function createCard(row, eager) {
  const li = document.createElement('li');
  if (row.dataset.json) {
    const post = JSON.parse(row.dataset.json);
    li.append(isAuthorCard
      ? await buildAuthorPost(post, eager)
      : await buildPost(post, eager));
  } else {
    li.append(row);
  }
  await decorateIcons(li);
  return li;
}

export default async function decorate(block) {
  block.setAttribute('role', 'region');
  block.setAttribute('aria-live', 'polite');
  if (block.classList.contains('author')) {
    isAuthorCard = true;
  }
  const ul = document.createElement('ul');
  [...block.children].forEach(async (row) => {
    const card = await createCard(row, !row.classList.contains('skeleton') && isEager);
    if (row.classList.contains('skeleton')) {
      ul.append(card);
    } else if (ul.querySelector('.skeleton')) {
      ul.querySelector('.skeleton').parentElement.replaceWith(card);
      isEager = false;
    } else if (row.dataset.json || row.textContent.trim()) {
      if (ul.querySelector('.skeleton')) {
        ul.querySelector('.skeleton').parentElement.replaceWith(card);
      } else {
        ul.append(card);
      }
      isEager = false;
    }
  });
  block.innerHTML = '';
  block.append(ul);
  const observer = new MutationObserver((entries) => {
    entries.forEach((entry) => {
      entry.addedNodes.forEach(async (div) => {
        const card = await createCard(div, !div.classList.contains('skeleton') && isEager);
        if (div.classList.contains('skeleton')) {
          ul.append(card);
          return;
        }
        if (ul.querySelector('.skeleton')) {
          ul.querySelector('.skeleton').parentElement.replaceWith(card);
          isEager = false;
        } else if (div.dataset.json || div.textContent.trim()) {
          ul.append(card);
          isEager = false;
        }
        div.remove();
      });
    });
  });
  observer.observe(block, { childList: true });
}
