import ffetch from '../../scripts/ffetch.js';
import { buildBlock } from '../../scripts/lib-franklin.js';
import {
  getCategories,
  getCategoryImage
} from '../../scripts/scripts.js';


async function renderArticles(articles) {
  const block = document.querySelector('.cards');
  block.querySelectorAll('li').forEach((li) => li.remove());
  const res = await articles;
  // eslint-disable-next-line no-restricted-syntax
  for await (const article of res) {
    const div = document.createElement('div');
    div.textContent = article.path;
    div.dataset.json = JSON.stringify(article);
    block.append(div);
  }
  document.querySelector('.pagination').dataset.total = res.total();
}

async function getArticles() {  
  const usp = new URLSearchParams(window.location.search);
  const limit = usp.get('limit') || 16;
  const query = usp.get('query');
  const offset = (Number(usp.get('page') || 1) - 1) * limit;
  return ffetch('/article/query-index.json')
    .sheet('article')
    .withTotal(true)
    .filter((article) => `${article.description} ${article.title}`.toLowerCase().includes(query.toLowerCase()))
    .slice(offset, offset + limit);
}


function createTemplateBlock(main, blockName) {
  const section = document.createElement('div');

  const block = buildBlock(blockName, { elems: [] });
  section.append(block);
  main.append(section);
}

export async function loadEager(main) {
 
  createTemplateBlock(main, 'pagination');
  // eslint-disable-next-line no-restricted-globals
  const heroImg = await getCategoryImage(location.pathname);
  if (heroImg) {
    main.querySelector('picture').replaceWith(heroImg);
  }
}

export async function loadLazy() {

  renderArticles(getArticles());

  // Softnav progressive enhancement for browsers that support it
  if (window.navigation) {
    const { data } = await getCategories();    
    window.addEventListener('popstate', () => {      
      renderArticles(getArticles());
    });  
  }
}
