import { sampleRUM } from '../../scripts/lib-franklin.js';
import { getPlaceholder } from '../../scripts/scripts.js';
import { pushToDataLayer } from '../../scripts/utils/helpers.js';

export default async function decorate(block) {
  const searchPlaceholder = block.firstElementChild.children[0].textContent || getPlaceholder('search');
  const searchButtonText = block.firstElementChild.children[1].textContent || getPlaceholder('submit');

  const form = document.createElement('form');
  form.setAttribute('role', 'search');
  form.className = 'search-box-wrapper';
  form.action = `${window.hlx.contentBasePath}/search`;
  form.addEventListener('submit', (ev) => {
    const query = ev.target.querySelector('.search-input').value;
    if (!query) {
      ev.preventDefault();
      return;
    }
    pushToDataLayer({
      event: 'search',
      search_term: query,
    });
    sampleRUM('search', { source: '.search-input', target: query });
  });

  const input = document.createElement('input');
  input.setAttribute('aria-label', searchPlaceholder);
  input.className = 'search-input';
  input.type = 'search';
  input.name = 'query';
  input.placeholder = searchPlaceholder;

  form.append(input);

  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'search-button';
  button.textContent = searchButtonText;

  form.append(button);
  block.innerHTML = '';
  block.append(form);

  const usp = new URLSearchParams(window.location.search);
  block.querySelector('.search-input').value = usp.get('query') || '';
}
