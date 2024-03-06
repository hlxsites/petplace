/* eslint-disable indent */
import { fetchPlaceholders, getMetadata } from '../../scripts/lib-franklin.js';
import endPoints from '../../variables/endpoints.js';

// fetch placeholders from the /pet-adoption folder currently, but placeholders should |
// be moved into the root' folder eventually
const placeholders = await fetchPlaceholders('/pet-adoption');
import { buildPetCard } from '../../scripts/adoption/buildPetCard.js';

const {
  petTypeLabel,
  petTypeValues,
  breedLabel,
  breedPlaceholder,
  zipLabel,
  zipPlaceholder,
  zipErrorMessage,
  searchButtonText,
  adoptablePetsTitle,
} = placeholders;

function getRandomItems(array, count) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function callAnimalList(method, path, payload) {
  const baseUrl = endPoints.apiUrl;
  const url = `${baseUrl}${path ? `/${path}` : ''}`;

  const response = await fetch(url, {
    method: method || 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: method !== 'GET' ? JSON.stringify(payload) : null,
  });
  return response.json();
}

async function createSearchForm(block) {
  const form = document.createElement('form');
  form.setAttribute('role', 'search');
  form.className = 'adopt-search-box-wrapper';
  form.action = ' ';
  form.noValidate = true;

  const radioContainer = document.createElement('fieldset');
  if (petTypeValues) {
    const legend = document.createElement('legend');
    legend.innerText = petTypeLabel;
    radioContainer.append(legend);
    const petTypes = petTypeValues.split(',');
    petTypes.forEach((petType) => {
      const p = document.createElement('div');
      const label = document.createElement('label');
      label.setAttribute('for', `radio-${petType}`);
      label.innerText = petType;
      const radio = document.createElement('input');
      //   input.setAttribute('aria-label', )
      radio.type = 'radio';
      radio.name = 'filterAnimalType';
      radio.id = `radio-${petType}`;
      radio.value = petType;
      p.append(radio);
      p.append(label);
      radioContainer.append(p);
    });
  }

  function updateBreedOptions(petType, options) {
    const breedSelect = document.querySelector('#breed');

    breedSelect.innerHTML = '<option value>Any</option>';

    if (petType !== 'Other') {
      breedSelect.disabled = false;
      options.forEach((item) => {
        const optionEl = document.createElement('option');
        optionEl.value = item.breedKey;
        optionEl.textContent = item.breedValue;

        breedSelect.append(optionEl);
      });
    }
  }

  const radioBtns = radioContainer.querySelectorAll(
    'input[name="filterAnimalType"]',
  );

  radioBtns.forEach((radio) => {
    radio.addEventListener('change', () => {
      const selectedPetType = radio.value;
      const breedSelect = document.querySelector('#breed');
      const updatedPath = `breed/${selectedPetType}`;

      breedSelect.disabled = true;

      callAnimalList('GET', updatedPath).then((data) => {
        updateBreedOptions(selectedPetType, data);
      });
    });
  });

  const breedContainer = document.createElement('div');
  const breedLabelElement = document.createElement('label');
  breedLabelElement.for = 'breed';
  breedLabelElement.innerText = breedLabel;
  breedLabelElement.setAttribute('for', 'breed');

  const breedSelect = document.createElement('select');
  breedSelect.name = 'breed';
  breedSelect.id = 'breed';
  breedSelect.className = 'form-select-wrapper';
  breedSelect.disabled = true;
  const option = document.createElement('option');
  option.innerText = breedPlaceholder;
  option.value = '';

  breedSelect.append(option);
  breedContainer.append(breedLabelElement);
  breedContainer.append(breedSelect);

  const zipContainer = document.createElement('div');
  const zipLabelElem = document.createElement('label');
  zipLabelElem.setAttribute('for', 'zip-code');
  zipLabelElem.innerText = zipLabel;

  const zipInput = document.createElement('input');
  zipInput.setAttribute('aria-label', zipPlaceholder);
  zipInput.setAttribute('aria-describedby', '');
  zipInput.ariaInvalid = 'false';
  zipInput.className = 'zip-code';
  zipInput.type = 'text';
  zipInput.name = 'zipPostal';
  zipInput.id = 'zip';
  zipInput.pattern = '^[0-9]{5}(?:-[0-9]{4})?$';
  zipInput.required = true;
  zipInput.title = zipErrorMessage;
  zipInput.placeholder = zipPlaceholder;
  zipContainer.append(zipLabelElem);
  zipContainer.append(zipInput);

  const errorSpan = document.createElement('span');
  errorSpan.className = 'error-message';
  errorSpan.id = 'zip-error';
  errorSpan.textContent = zipErrorMessage;
  zipContainer.append(errorSpan);

  const clearButton = document.createElement('button');
  clearButton.setAttribute('id', 'clear-button');
  clearButton.setAttribute('type', 'button');
  clearButton.innerHTML = '&#10005;';

  zipInput.addEventListener('input', () => {
    if (zipInput.value.trim() !== '') {
      clearButton.classList.add('show');
    } else {
      clearButton.classList.remove('show');
    }
  });

  zipInput.addEventListener('focus', () => {
    if (zipInput.value.trim() !== '') {
      clearButton.classList.add('show');
    }
  });

  zipInput.addEventListener('focusout', () => {
    clearButton.classList.remove('show');
  });

  clearButton.addEventListener('click', () => {
    zipInput.value = '';
    zipInput.focus();
    clearButton.classList.remove('show');
  });

  form.addEventListener('submit', (ev) => {
    const selectedBreed = breedSelect.value;
    const zipCode = zipInput.value;
    let selectedAnimalType = null;

    ev.preventDefault();

    if (!zipInput.checkValidity()) {
      zipInput.classList.add('error');
      errorSpan.classList.add('active');
      zipInput.setAttribute('aria-describedby', 'zip-error');
      zipInput.ariaInvalid = 'true';
      zipInput.focus();
    } else {
      zipInput.classList.remove('error');
      errorSpan.classList.remove('active');
      zipInput.setAttribute('aria-describedby', '');
      zipInput.ariaInvalid = 'false';

      if (radioContainer
        .querySelector('input[name="filterAnimalType"]:checked')) {
          selectedAnimalType = encodeURIComponent(
            radioContainer
              .querySelector('input[name="filterAnimalType"]:checked')
              .value,
          );
      } else {
        selectedAnimalType = '';
      }

      const searchParams = new URLSearchParams();
      searchParams.set('zipPostal', zipCode);

      if (selectedAnimalType !== '') {
        searchParams.set('filterAnimalType', selectedAnimalType);
      }

      if (selectedBreed !== '') {
        searchParams.set('filterBreed', selectedBreed);
      }

      const searchUrl = `/pet-adoption/search?${searchParams.toString()}`;
      window.location.href = searchUrl;
    }
  });

  zipContainer.append(clearButton);
  // form.append(clearButton);

  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'adopt-search-button';
  button.textContent = searchButtonText;
  form.append(radioContainer);

  form.append(breedContainer);

  form.append(zipContainer);
  form.append(button);

  const heroContainer = document.querySelector('.columns.hero');

  if (heroContainer?.firstElementChild?.lastElementChild != null) {
    const formWrapper = document.createElement('div');
    formWrapper.className = 'adopt-search-wrapper';
    formWrapper.append(form);
    block.innerHTML = '';

    heroContainer.firstElementChild.lastElementChild.append(formWrapper);
  } else {
    block.innerHTML = '';
    block.append(form);
  }
}

async function createAdoptablePetsContent(petArr) {
  const adoptablePetsContainer = document.createElement('div');
  adoptablePetsContainer.className = 'adoptable-pets-container';
  const title = document.createElement('h2');
  title.className = 'adoptable-pets-title';
  title.textContent = adoptablePetsTitle;
  adoptablePetsContainer.append(title);

  if (petArr && petArr.length > 0) {
    const galleryWrapper = document.createElement('div');
    galleryWrapper.className = 'adoptable-pets-gallery-wrapper';
    const gallery = document.createElement('div');
    gallery.className = 'adoptable-pets-gallery';
    petArr.forEach((pet) => {
      gallery.append(buildPetCard(pet));
    });
    galleryWrapper.appendChild(gallery);
    adoptablePetsContainer.append(galleryWrapper);
  } else {
    const noResults = document.createElement('div');
    noResults.className = 'adoptable-pets-no-results';
    noResults.textContent = 'There are no other similar pets available.';
    adoptablePetsContainer.append(noResults);
  }

  return adoptablePetsContainer;
}

async function createAdoptablePetsSection(
  adoptablePetsContainer,
  adoptablePetsData,
) {
  const adoptablePetsSelected = getRandomItems(adoptablePetsData.animal, 4);

  if (adoptablePetsContainer.firstElementChild?.lastElementChild != null) {
    adoptablePetsContainer.firstElementChild.lastElementChild.append(
      await createAdoptablePetsContent(adoptablePetsSelected),
    );
  }
}

export default async function decorate(block) {
  const payload = {
    locationInformation: {
      clientId: null,
      zipPostal: '92102',
      milesRadius: 10,
    },
    animalFilters: {
      startIndex: 0,
      numResults: 50,
    },
  };

  const adoptablePetsData = await callAnimalList('POST', 'animal', payload);
  const adoptSearchContainer = document.querySelector(
    '.adopt-search-container',
  );
  const adoptablePetsContainer = document.querySelector(
    '.adoptable-pets-container',
  );
  createSearchForm(block);
  createAdoptablePetsSection(adoptablePetsContainer, adoptablePetsData);

  if (adoptSearchContainer?.nextElementSibling?.classList.contains('section')) {
    adoptSearchContainer.nextElementSibling.classList.add(
      'adopt-guide-container',
    );
    const adoptGuideContainer = adoptSearchContainer.nextElementSibling;

    const guideHeading = adoptGuideContainer.firstElementChild;
    const guideColumns = adoptGuideContainer.lastElementChild;

    guideColumns.prepend(guideHeading);
  }
}
