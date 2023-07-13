import { meterCalls } from '../../scripts/scripts.js';

const PAGE_SIZE = 12;

function renderAuthors(authors) {
  const block = document.querySelector('.cards');
  block.querySelectorAll('li').forEach((li) => li.remove());
  for (let i = 0; i < PAGE_SIZE; i += 1) {
    const div = document.createElement('div');
    div.classList.add('skeleton');
    block.append(div);
  }
  authors.then((data) => data.data.forEach(async (author) => {
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 100));
    const div = document.createElement('div');
    div.dataset.json = JSON.stringify(author);
    meterCalls(() => block.append(div)).then(() => {
      window.requestAnimationFrame(() => {
        block.querySelectorAll('.skeleton').forEach((sk) => sk.parentElement.remove());
      });
    });
  }));
}

async function getAuthors() {
  return fetch('/authors/query-index.json')
    .then((response) => response.json());
}

// eslint-disable-next-line import/prefer-default-export
export async function loadLazy() {
  renderAuthors(getAuthors());
}
