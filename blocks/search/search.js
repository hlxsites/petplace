export default async function decorate(block) {
  const searchPlaceholder = block.firstElementChild.children[0].textContent || 'Search…';
  const searchButtonText = block.firstElementChild.children[1].textContent || 'Submit';

  const form = document.createElement('form');
  form.setAttribute('role', 'search');
  form.className = 'search-box-wrapper';
  form.action = '/search';

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
}
