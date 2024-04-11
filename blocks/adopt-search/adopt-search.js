/* eslint-disable no-plusplus */
/* eslint-disable indent */
import { fetchPlaceholders } from '../../scripts/lib-franklin.js';
import endPoints from '../../variables/endpoints.js';
import MultiSelect from '../pet-survey/multi-select.js';

// fetch placeholders from the /pet-adoption folder currently, but placeholders should |
// be moved into the root' folder eventually
const placeholders = await fetchPlaceholders('/pet-adoption');
// eslint-disable-next-line import/first
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
    const breedSelect = document.querySelector('#breeds');

    if (petType !== 'Other') {
      breedSelect.disabled = false;

      const divAny = document.createElement('div');
      const inputOptionAny = document.createElement('input');
      inputOptionAny.type = 'checkbox';
      inputOptionAny.id = 'any';
      inputOptionAny.value = 'ANY';
      inputOptionAny.textContent = 'Any';
      divAny.classList.add('multi-select__input');
      const labelAny = document.createElement('label');
      labelAny.setAttribute('for', 'any');
      labelAny.innerText = 'Any';
      divAny.append(inputOptionAny, labelAny);

      breedSelect.append(divAny);

      options.forEach((item) => {
        const div = document.createElement('div');

        const inputOption = document.createElement('input');
        inputOption.type = 'checkbox';
        inputOption.id = `${item.breedValue.toLowerCase().replace(/\s/g, '')}`;
        inputOption.value = item.breedKey;
        inputOption.textContent = item.breedValue;
        div.classList.add('multi-select__input');
        const label = document.createElement('label');
        label.setAttribute('for', `${inputOption.id}`);
        label.innerText = item.breedValue;
        div.append(inputOption, label);

        breedSelect.append(div);
      });

      const groupDiv = document.querySelector('.multi-select__options');
      const containerDiv = document.querySelector('.multi-select.breed');
      const breedButton = document.querySelector('.multi-select__button');
      const checkboxArray = groupDiv.querySelectorAll('input');
      checkboxArray?.forEach((checkbox, index) => {
        checkbox.addEventListener('change', () => {
          if (checkbox.checked && index === 0) {
              checkboxArray.forEach((input) => {
                  input.checked = false;
                  input.dispatchEvent(new window.Event('change', { bubbles: true }));
              });
              checkboxArray[0].checked = true;
          } else if (checkbox.checked && index !== 0) {
              checkboxArray[0].checked = false;
              checkboxArray[0].dispatchEvent(new window.Event('change', { bubbles: true }));
          }
          // updating label
          const buttonText = containerDiv.querySelector('.multi-select__button-text');
          const selected = Array.from(groupDiv.querySelectorAll("input[type='checkbox']")).filter((node) => node.checked);
          const displayText = selected.length > 0
              ? `${selected.length} selected`
              : 'Select from menu...';
          buttonText.innerText = displayText;
        });
      });
      breedButton.removeAttribute('disabled');
    }
  }

  const radioBtns = radioContainer.querySelectorAll(
    'input[name="filterAnimalType"]',
  );

  radioBtns.forEach((radio) => {
    radio.addEventListener('change', () => {
      const selectedPetType = radio.value;
      const breedButton = document.querySelector('#breed-button');
      const updatedPath = `breed/${selectedPetType}`;

      if (selectedPetType === 'Other') {
        breedButton.setAttribute('disabled', '');
        breedButton.innerText = 'Any';
      } else {
        breedButton.innerText = 'Select from menu...';
      }

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

  const containerDiv = document.createElement('div');
  containerDiv.className = 'multi-select breed';
  containerDiv.id = 'breed';
  containerDiv.append(breedLabelElement);

  const breedButton = document.createElement('button');
  breedButton.id = 'breed-button';
  breedButton.classList.add('multi-select__button');
  breedButton.type = 'button';
  breedButton.setAttribute('aria-expanded', 'false');
  breedButton.setAttribute('aria-controls', 'breeds');
  breedButton.setAttribute('disabled', '');

  const text = document.createElement('span');
  text.className = 'multi-select__button-text';
  text.innerText = 'Select from menu...';

  const icon = document.createElement('span');
  icon.className = 'multi-select__button-icon';
  breedButton.append(text, icon);

  const groupDiv = document.createElement('div');
  groupDiv.setAttribute('role', 'group');
  groupDiv.setAttribute('aria-labelledby', 'breed-button');
  groupDiv.setAttribute('tabindex', '0');
  groupDiv.className = 'multi-select__options';
  groupDiv.id = 'breeds';

  containerDiv.append(breedButton, groupDiv);
  // eslint-disable-next-line
  new MultiSelect(containerDiv);

  const option = document.createElement('option');
  option.innerText = breedPlaceholder;
  option.value = '';

  breedContainer.append(containerDiv);

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
    const zipCode = zipInput.value;
    let selectedAnimalType = null;

    ev.preventDefault();
    const isValidZip = /^(\d{5}|[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d)$/.test(zipInput.value);
    if (!isValidZip) {
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

      const checkboxArray = groupDiv.querySelectorAll('input');

      let selectedBreedsString = '';

      checkboxArray?.forEach((input) => {
        if (input.checked) {
          selectedBreedsString += `${input.value}%2C`;
        }
      });
      searchParams.set('filterBreed', selectedBreedsString);

      const searchUrl = `/pet-adoption/search?${searchParams.toString()}`;
      console.log('searchUrl ', searchUrl);
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
      zipPostal: '90210',
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
