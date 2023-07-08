import ffetch from '../../scripts/ffetch.js';
import { buildBlock } from '../../scripts/lib-franklin.js';
import { getAuthorImage, meterCalls } from '../../scripts/scripts.js';

async function renderAuthors(authors) {
  const block = document.querySelector('.cards');
  block.querySelectorAll('li').forEach((li) => li.remove());
  for (let i = 0; i < 12; i += 1) {
    const div = document.createElement('div');
    div.classList.add('skeleton');
    block.append(div);
  }
  const res = await authors;
  // eslint-disable-next-line no-restricted-syntax
  for await (const author of res) {
    const div = document.createElement('div');
    div.dataset.json = JSON.stringify(author);
    meterCalls(() => block.append(div)).then(() => {
      window.requestAnimationFrame(() => {
        block.querySelectorAll('.skeleton').forEach((sk) => sk.parentElement.remove());
      });
    });
  }
  document.querySelector('.pagination').dataset.total = res.total();
}

async function getAuthors() {
  const usp = new URLSearchParams(window.location.search);
  const limit = usp.get('limit') || 12;
  const offset = (Number(usp.get('page') || 1) - 1) * limit;
  return ffetch('/authors/author-index.json')
    .withTotal(true)
    .map(async (author) => {
      const image = await getAuthorImage(author.Path);
      author.Avatar = image.querySelector('img').src;
      return author;
    })
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
}

export async function loadLazy() {
  renderAuthors(getAuthors());
}
