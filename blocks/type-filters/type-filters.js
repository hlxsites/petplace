import { decorateIcons } from '../../scripts/lib-franklin.js';

let dogData;
const excludedTypes = [];
const pageLimit = 6;
let pageIndex = 0;

function buildCards(block) {
  const cardGrid = block.querySelector('.card-grid');
  cardGrid.innerHTML = '';

  dogData
    .filter((data) => !excludedTypes.includes(data.type))
    .filter((data, i) => {
      const startingPoint = pageIndex * pageLimit;

      return i >= startingPoint && i < (startingPoint + pageLimit);
    })

    .forEach((data) => {
      const item = `<a href="${data.path}"><div class="grid-item">
            <div class="img-container">
                <img src="${data.image}" alt="Dog 1">
            </div>
            <h3>${data.title}</h3>
          </div></a>`;
      cardGrid.innerHTML += item;
    });
  // eslint-disable-next-line no-use-before-define
  buildPagination(block);
}

function buildPagination(block) {
  const breedFilteredData = dogData.filter((data) => !excludedTypes.includes(data.type));
  const paginationParent = block.querySelector('.pagination');
  paginationParent.innerHTML = '';

  const paginationButtons = document.createElement('div');
  paginationButtons.classList.add('pagination-buttons');

  if (pageIndex > 0) {
    paginationButtons.innerHTML += '<button class="prev"></button>';
  }
  paginationButtons.innerHTML += `Page: ${pageIndex + 1} of ${Math.ceil(breedFilteredData.length / pageLimit)}`;

  if (pageIndex * pageLimit < breedFilteredData.length - pageLimit) {
    paginationButtons.innerHTML += '<button class="next"></button>';
  }

  paginationParent.append(paginationButtons);

  [...block.querySelectorAll('.pagination-buttons button')].forEach((elem) => {
    elem.addEventListener('click', (ev) => {
      if (ev.target.classList.contains('next')) {
        pageIndex += 1;
      } else {
        pageIndex -= 1;
      }
      buildCards(block);
    });
  });
}

export default async function decorate(block) {
  if (!dogData) {
    const res = await fetch('/article/query-index.json?sheet=breed');
    const queryData = await res.json();

    if (queryData?.data) {
      queryData.data.map((item) => {
        item.title = item.title.endsWith(' - PetPlace')
          ? item.title.substring(0, item.title.lastIndexOf(' - PetPlace'))
          : item.title;
        return item;
      });
    }
    dogData = queryData.data;
  }

  block.innerHTML = `
      <div class="type-filter">
        <div class="filter-btn"><span>Filters</span></div>
        <div class="category-filters">
          <h3>
            Type <span class="icon icon-chevron"></span>
          </h3>
          <div class="filter-type is-active">
            <div class="checkbox-wrapper"><input type="checkbox" checked="" name="Sporting"><span><label for="Sporting">Sporting</label></span></div>
            <div class="checkbox-wrapper"><input type="checkbox" checked="" name="Hound"><span><label for="Hound">Hound</label></span></div>
            <div class="checkbox-wrapper"><input type="checkbox" checked="" name="Terrier"><span><label for="Terrier">Terrier</label></span></div>
            <div class="checkbox-wrapper"><input type="checkbox" checked="" name="Non-Sporting"><span><label for="Non-Sporting">Non-Sporting</label></span></div>
            <div class="checkbox-wrapper"><input type="checkbox" checked="" name="Toy"><span><label for="Toy">Toy</label></span></div>
            <div class="checkbox-wrapper"><input type="checkbox" checked="" name="Herding"><span><label for="Herding">Herding</label></span></div>
            <div class="checkbox-wrapper"><input type="checkbox" checked="" name="Working"><span><label for="Working">Working</label></span></div>
            <div class="checkbox-wrapper"><input type="checkbox" checked="" name="N/A"><span><label for="N/A">N/A</label></span></div>
          </div>
        </div>
      </div>
      <div class="card-container">
        <div class="card-grid"></div>
        <div class="pagination"></div>
       </div>
      </div>

`;

  // Add click listener for the mobile filter button
  block.querySelector('.filter-btn').addEventListener('click', () => {
    const categoryFilters = block.querySelector('.category-filters');

    if (categoryFilters.classList.contains('is-active')) {
      categoryFilters.classList.remove('is-active');
    } else {
      categoryFilters.classList.add('is-active');
    }
  });

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
  [...block.querySelectorAll('.filter-type input')].forEach((elem) => {
    elem.addEventListener('click', (ev) => {
      const { target } = ev;
      const { name } = ev.target;
      if (target.checked) {
        const i = excludedTypes.indexOf(name);
        if (i > -1) {
          excludedTypes.splice(i, 1);
        }
      } else {
        excludedTypes.push(name);
      }

      buildCards(block);
    });
  });

  buildCards(block);
  decorateIcons(block);
}
