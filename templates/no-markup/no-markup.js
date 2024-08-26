export async function loadEager(document) {
  // get main element
  const main = document.querySelector('main');

  // cleanup body html
  document.body.innerHTML = '';

  // append only the main element to body
  document.body.appendChild(main);
}
