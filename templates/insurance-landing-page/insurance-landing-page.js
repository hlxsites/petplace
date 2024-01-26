function createSpanBlock(main) {
  const searches = main.getElementsByClassName('search-box-wrapper');

  [...searches].forEach((el) => {
    el.removeAttribute('action');
    const searchInput = el.querySelector('.search-input');

    // For zipcode input validation.
    // searchInput.addEventListener('input', (event) => {
    //   event.target.value = event.target.value.replace(/[^0-9]/g, '');
    // })
    const searchButton = el.querySelector('.search-button');

    // Eventlistener to redirect user to aggregator site.
    searchButton.addEventListener('click', (ev) => {
      const code = searchInput.value;
      if (code) {
        ev.preventDefault();
        window.open(`https://quote.petplace.com/questionnaire?zipCode=${code}`, '_blank');
      }
    });
  });
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
