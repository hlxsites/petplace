function removeAllErrorMessage(searchContainers) {
  [...searchContainers].forEach((el) => {
    const searchDiv = el.querySelector('.search-box-wrapper');
    const errorMsg = el.querySelector('.find-useful-wrapper');
    const searchInput = el.querySelector('.search-input');

    errorMsg.style.display = 'none';
    searchInput.classList.remove('error-state');
    searchDiv.classList.remove('error-spacing');
    searchInput.value = '';
  });
}

// below functions are to break up and rejoin the url params
function getFilteredQueryParams() {
  const includedParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const filteredParams = [];
  urlParams.forEach((value, key) => {
    if (includedParams.includes(key)) {
      filteredParams.push({ key, value });
    }
  });
  
  return filteredParams;
}

function getUrlParamString() {
  const paramsArr = getFilteredQueryParams();
  const parts = paramsArr.map(param => `${encodeURIComponent(param.key)}=${ 
  encodeURIComponent(param.value)}`)
  const url = parts.join('&');
  return url;
}

function isValidZipcode(code) {
  const regex = /^[0-9]{5}(?:-[0-9]{4})?$/;

  return regex.test(code);
}

function createSpanBlock(main) {
  const searchContainers = main.getElementsByClassName('search-container');

  [...searchContainers].forEach((el) => {
    const searchDiv = el.querySelector('.search-box-wrapper');
    const errorMsg = el.querySelector('.find-useful-wrapper');

    searchDiv.removeAttribute('action');
    const searchInput = searchDiv.querySelector('.search-input');
    const searchButton = searchDiv.querySelector('.search-button');

    // Eventlistener to redirect user to aggregator site.
    searchButton.addEventListener('click', (ev) => {
      ev.preventDefault();
      const code = searchInput.value;
      if (isValidZipcode(code)) {
        removeAllErrorMessage(searchContainers);
        const utmParams = getUrlParamString();
        const pageUrl = `https://quote.petplace.com/questionnaire?zipCode=${code}${utmParams ? `&${utmParams}` : ''}`;
        window.open(pageUrl);
      } else {
        errorMsg.style.display = 'block';
        searchInput.classList.add('error-state');
        searchDiv.classList.add('error-spacing');
        searchInput.value = '';
      }
    });
  });
}

export function loadLazy() {
  const main = document.querySelector('#main');
  createSpanBlock(main);
}
