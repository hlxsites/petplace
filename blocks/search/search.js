export default async function decorate(block) {
  let searchPlaceholder = 'Search for Posts...';
  let searchButtonText = 'Search';
  if (document.querySelector('body').classList.contains('search-page')) {
    searchPlaceholder = 'Search...';
    searchButtonText = 'Submit';
  }

  const form = document.createElement('form');
  form.className = 'search-box-wrapper';
  form.action = '/search';

  const input = document.createElement('input');
  input.className = 'search-input';
  input.type = 'text';
  input.name = 'query';
  input.placeholder = searchPlaceholder;

  form.append(input);

  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'search-button';
  button.innerHTML = searchButtonText;

  form.append(button);
  block.textContent = '';
  block.append(form);

  // button.addEventListener('click', (e) => {
  //   window.location.href = `/search?q=${input.value}`;
  // });
}
