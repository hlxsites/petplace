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
        window.open(`https://quote.petplace.com/questionnaire?zipCode=${code}`, '_blank');
      } else {
        errorMsg.style.display = 'block';
        searchInput.classList.add('error-state');
        searchDiv.classList.add('error-spacing');
        searchInput.value = '';
      }
    });
  });
}

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

function isValidZipcode(code){
  const regex = /^([0-9]{5})(?:[-\s]*([0-9]{4}))?$/

  return regex.test(code);
}

export function loadLazy() {
  const main = document.querySelector('#main');
  createSpanBlock(main);
  // document.querySelector('.details-list-wrapper').addEventListener('click', (ev) => {
  //   const btn = ev.target.closest('a');
  //   if (!btn) return;

  //   // TODO: check if correct event, and details
  //   pushToDataLayer({
  //     event: 'insurance',
  //     url: btn.href,
  //   });
  // });
}
