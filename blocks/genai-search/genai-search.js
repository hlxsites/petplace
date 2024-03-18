export default async function decorate(block) {
  const searchPlaceholder = block.firstElementChild.children && block.firstElementChild.children[0] && block.firstElementChild.children[0].textContent ? block.firstElementChild.children[0].textContent : 'Ask a question or enter a topic....';
  const searchButtonText = block.firstElementChild.children && block.firstElementChild.children[0] && block.firstElementChild.children[0].textContent ? block.firstElementChild.children[1].textContent : 'Submit';

  const form = document.createElement('form');
  form.setAttribute('role', 'search');
  form.className = 'search-box-wrapper';
  form.addEventListener('submit', (ev) => {
    const query = ev.target.querySelector('.search-input').value;
    if (query) {
      ev.preventDefault();
      window.localStorage.setItem('gen-ai-query', JSON.stringify(query));
      document.location.pathname = '/discovery';
    }
    // return;
  });

  const input = document.createElement('input');
  input.setAttribute('aria-label', searchPlaceholder);
  input.className = 'search-input';
  input.type = 'search';
  input.name = 'q';
  input.id = 'search-box';
  input.placeholder = searchPlaceholder;

  const clearButton = document.createElement('button');
  clearButton.setAttribute('id', 'clearButton');
  clearButton.setAttribute('type', 'button');
  clearButton.innerHTML = '&#10005;';

  input.addEventListener('input', () => {
    if (input.value.trim() !== '') {
      clearButton.classList.add('show');
    } else {
      clearButton.classList.remove('show');
    }
  });

  input.addEventListener('focus', () => {
    if (input.value.trim() !== '') {
      clearButton.classList.add('show');
    }
  });
  input.addEventListener('focusout', () => {
    clearButton.classList.remove('show');
  });

  clearButton.addEventListener('click', () => {
    input.value = '';
    input.focus();
    clearButton.classList.remove('show');
  });

  // form.append(clearButton);

  form.append(input);

  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'search-button';
  button.textContent = searchButtonText;
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `${window.hlx.codeBasePath}/icons/send.svg`, true);
  // eslint-disable-next-line func-names
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      // On successful response, create and append the SVG element
      const svgElement = document.createElement('svg');
      svgElement.className = 'icon-search';
      svgElement.innerHTML = xhr.responseText;
      button.appendChild(svgElement);
    }
  };
  xhr.send();
  form.append(button);
  block.innerHTML = '';
  block.append(form);

  const query = window.localStorage.getItem('gen-ai-query');
  if (query && document.location.pathname.indexOf('/discovery') !== -1) {
    block.querySelector('.search-input').value = JSON.parse(query);
  }
}
