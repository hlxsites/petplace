import { pushToDataLayer } from '../../scripts/utils/helpers.js';

export function loadLazy() {
  document.querySelector('.details-list-wrapper').addEventListener('click', (ev) => {
    const btn = ev.target.closest('a');
    if (!btn) return;

    // TODO: check if correct event, and details
    pushToDataLayer({
      event: 'insurance',
      url: btn.href,
    });
  });
}
