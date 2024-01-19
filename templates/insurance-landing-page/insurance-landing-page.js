import { pushToDataLayer } from '../../scripts/utils/helpers.js';
import { buildBlock } from '../../scripts/lib-franklin.js';

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
      if(code) {
        ev.preventDefault();
        window.open(`https://polite-smoke-035c7bd10.4.azurestaticapps.net?zipCode=${code}`, '_blank');
      }
    });

    const spanBlock = document.createElement('span');
    spanBlock.className ='arrow-right';
    searchButton.appendChild(spanBlock);
  });
}

export function loadLazy() {
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