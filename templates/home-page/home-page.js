import { adsenseFunc } from '../../scripts/adsense.js';

function isValidZipcode(code) {
  const regex = /^[0-9]{5}(?:-[0-9]{4})?$/;

  return regex.test(code);
}

function createSpanBlock(main) {
  const insuranceSearch = main.querySelector('.insurance-search');
  const formEl = insuranceSearch.querySelector('.search-box-wrapper');
  formEl.removeAttribute('action');
  const searchInput = formEl.querySelector('.search-input');
  const searchButton = insuranceSearch.querySelector('.search-button');
  const errorMsg = main.querySelector('.find-useful-wrapper');

  // Eventlistener to redirect user to aggregator site.
  searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    const code = searchInput.value;
    if (isValidZipcode(code)) {
      errorMsg.style.display = 'none';
      searchInput.classList.remove('error-state');
      formEl.classList.remove('error-spacing');
      searchInput.value = '';
      window.open(
        `https://quote.petplace.com/questionnaire?zipCode=${code}`,
        '_blank',
      );
    } else {
      errorMsg.style.display = 'block';
      searchInput.classList.add('error-state');
      formEl.classList.add('error-spacing');
      searchInput.value = '';
    }
  });
}

export function loadLazy() {
  const main = document.querySelector('#main');
  createSpanBlock(main);
  adsenseFunc('home', 'create');
}

// eslint-disable-next-line import/prefer-default-export
export function loadEager() {
  return false;
}

export function loadDelayed() {
  adsenseFunc('home');
}
