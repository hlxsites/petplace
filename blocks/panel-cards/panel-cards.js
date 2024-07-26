import { clickHelper } from '../../scripts/utils/helpers.js';

export default function decorate(block) {
  // const cols = [...block.firstElementChild.children];

  // eslint-disable-next-line no-unused-vars
  let rowIndex = 0;

  // setup image columns
  [...block.children].forEach((row) => {
    row.classList.add('panel-card');
    const link = row.querySelector('a');

    // Make entire panel clickable
    row.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = link.href;
      const h2 = row.querySelector('h2');
      clickHelper('hero_card_cta', h2.innerHTML, 'button', link.href);
    });

    [...row.children].forEach((col) => {
      const pic = col.querySelector('svg');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('panel-card-img');
        }
      } else {
        const txtWrapper = col.closest('div');
        if (txtWrapper) {
          txtWrapper.classList.add('panel-card-txt');
        }
      }
    });
    rowIndex += 1;
  });
}
