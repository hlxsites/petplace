import { decorateIcons } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const breeds = ['Sporting', 'Hound', 'Terrier', 'Non-Sporting', 'Toy', 'Herding', 'Working', 'N/A'];
  const usp = new URLSearchParams(window.location.search);
  const type = usp.get('type').split(',');
  block.innerHTML = `
    <div class="type-filter">
      <div class="category-filters">
        <h3>
          Type <span class="icon icon-chevron"></span>
        </h3>
        <div class="filter-type is-active">
          ${breeds.map((breed) => `
            <div class="checkbox-wrapper">
              <label>
                <input type="checkbox" name="type" ${!type.length || type.includes(breed) ? 'checked' : ''} value="${breed}"> ${breed}
              </label>
            </div>`).join('')}
        </div>
      </div>
    </div>`;

  // Add click listener for the category  filter chevron button
  const chevron = block.querySelector('.icon-chevron');
  chevron.addEventListener('click', () => {
    const filterType = block.querySelector('.filter-type');

    if (filterType.classList.contains('is-active')) {
      filterType.classList.remove('is-active');
      chevron.style.setProperty('transform', 'rotateX(0deg)');
    } else {
      filterType.classList.add('is-active');
      chevron.style.setProperty('transform', 'rotateX(180deg)');
    }
  });

  // Add click listener for all the filter checkboxes.
  block.parentElement.addEventListener('click', (ev) => {
    const label = ev.target.closest('label');
    if (!label) {
      return;
    }
    // eslint-disable-next-line no-shadow
    const usp = new URLSearchParams(window.location.search);
    // eslint-disable-next-line no-shadow
    const type = [...block.querySelectorAll('[type="checkbox"]')]
      .filter((input) => input.checked)
      .map((input) => input.value);
    usp.set('type', type);
    window.location.assign(`${window.location.pathname}?${usp.toString()}`);
  });

  decorateIcons(block);
}
