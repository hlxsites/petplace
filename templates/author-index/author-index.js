import { buildBlock } from '../../scripts/lib-franklin.js';
import { meterCalls } from '../../scripts/scripts.js';

const PAGE_SIZE = 12;

async function renderAuthors(authorsPromise) {
  const block = document.querySelector('.cards');
  block.querySelectorAll('li').forEach((li) => li.remove());
  for (let i = 0; i < PAGE_SIZE; i += 1) {
    const div = document.createElement('div');
    div.classList.add('skeleton');
    block.append(div);
  }
  const authors = await authorsPromise;
  await Promise.all(authors.map(async (author) => {
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 100));
    const div = document.createElement('div');
    div.dataset.json = JSON.stringify(author);
    await meterCalls(() => block.append(div));
  }));
  window.requestAnimationFrame(() => {
    block.querySelectorAll('.skeleton').forEach((sk) => sk.parentElement.remove());
  });
}

async function getAuthors() {
  return fetch(`${window.hlx.contentBasePath}/authors/query-index.json`)
    .then((response) => response.json())
    .then((json) => json.data);
}

function createTemplateBlock(main, blockName, gridName, elems = []) {
  const gridNameValue = gridName || blockName;
  const section = document.createElement('div');
  section.classList.add('author-template-autoblock', `author-template-grid-${gridNameValue}`);

  const block = buildBlock(blockName, { elems });
  section.append(block);
  main.append(section);
}

// eslint-disable-next-line import/prefer-default-export
export async function loadEager(document) {
  const main = document.querySelector('main');
  createTemplateBlock(main, 'popular-articles', undefined, ['<h1 class="author-popular-posts"></h1>']);
}

// eslint-disable-next-line import/prefer-default-export
export async function loadLazy() {
  renderAuthors(getAuthors());
}
