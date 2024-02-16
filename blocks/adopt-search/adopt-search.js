/* eslint-disable indent */
import { fetchPlaceholders, getMetadata } from '../../scripts/lib-franklin.js';

// fetch placeholders from the /pet-adoption folder currently, but placeholders should |
// be moved into the root' folder eventually
const placeholders = await fetchPlaceholders('/pet-adoption');
const {
  petTypeLabel,
  petTypeValues,
  breedLabel,
  breedPlaceholder,
  zipLabel,
  zipPlaceholder,
  zipErrorMessage,
  searchButtonText,
} = placeholders;

async function callAnimalList(method, path, payload) {
  const baseUrl = 'https://api-stg-petplace.azure-api.net/';
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

export default async function decorate(block) {
  const form = document.createElement('form');
  form.setAttribute('role', 'search');
  form.className = 'adopt-search-box-wrapper';
  form.action = ' ';

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
    'input[name="filterAnimalType"]'
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
  zipLabelElem.setAttribute('for', 'zipCode');
  zipLabelElem.innerText = zipLabel;

  const zipInput = document.createElement('input');
  zipInput.setAttribute('aria-label', zipPlaceholder);
  zipInput.className = 'zipCode';
  zipInput.type = 'text';
  zipInput.name = 'zipPostal';
  zipInput.id = 'zip';
  zipInput.pattern = '^[0-9]{5}(?:-[0-9]{4})?$';
  zipInput.required = true;
  zipInput.title = zipErrorMessage;
  zipInput.placeholder = zipPlaceholder;
  zipContainer.append(zipLabelElem);
  zipContainer.append(zipInput);

  const clearButton = document.createElement('button');
  clearButton.setAttribute('id', 'clearButton');
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
    ev.preventDefault();
    // should detect if the user is on the /pet-adoption/search page before showing results
    // if on /pet-adoption/ the form should direct to /pet-adoption/search?[queryparameters]
    // zipPostal, filterBreed, filterAnimalType
    const selectedBreed = encodeURIComponent(breedSelect.value.toLowerCase());
    const selectedAnimalType = encodeURIComponent(
      radioContainer
        .querySelector('input[name="filterAnimalType"]:checked')
        .value.toLowerCase()
    );
    const zipCode = zipInput.value;

    const searchParams = new URLSearchParams();
    searchParams.set('zipPostal', zipCode);
    searchParams.set('filterBreed', selectedBreed);
    searchParams.set('filterAnimalType', selectedAnimalType);

    const searchUrl = `/pet-adoption/search?${searchParams.toString()}`;

    window.location.href = searchUrl;
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

  function createPetCard({
    Name,
    Gender,
    Breed,
    City,
    State,
    animalId,
    clientId,
    coverImagePath,
  }) {
    const petCard = document.createElement('div');
    petCard.className = 'pet-card';
    const img = document.createElement('object');
    img.data = coverImagePath;
    img.type = 'image/jpg';
    img.className = 'pet-card-image';
    const fallback = document.createElement('img');
    fallback.src = getMetadata('image-fallback');
    img.append(fallback);
    const cardBody = document.createElement('div');
    cardBody.className = 'pet-card-body';
    cardBody.innerHTML = `
        <h3 class='pet-card-name'><a href='/pet-adoption/pet/${clientId}/${animalId}' class='stretched-link'>${Name?.replace(
      / *\([^)]*\) */g,
      ''
    )}</a></h3>
        <div class='pet-card-info'>
            <span class='pet-card-gender'>${Gender}</span>
            <span class='pet-card-dot'></span>
            <span class='pet-card-breed'>${Breed}</span>
        </div>
        <div class='pet-card-address'>
            ${City}, ${State}
        </div>
    `;
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'pet-card-button-conainer';
    buttonContainer.innerHTML = `
    <button class='pet-card-favorite'>
        <span class='pet-card-favorite-icon'></span>
        <span class='sr-only'>Favorite</span>
    </button>
    `;
    petCard.append(img, cardBody, buttonContainer);
    return petCard;
  }

  async function createAdoptablePetsSection(sectionTitle, petArr) {
    const adoptablePetsContainer = document.createElement('div');
    adoptablePetsContainer.className = 'adoptable-pets-container';
    const title = document.createElement('h2');
    title.className = 'adoptable-pets-title';
    title.textContent = sectionTitle;
    adoptablePetsContainer.append(title);

    if (petArr && petArr.length > 0) {
      const galleryWrapper = document.createElement('div');
      galleryWrapper.className = 'adoptable-pets-gallery-wrapper';
      const gallery = document.createElement('div');
      gallery.className = 'adoptable-pets-gallery';
      petArr.forEach((pet) => {
        gallery.append(createPetCard(pet));
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

  callAnimalList('POST', 'animal', payload).then(async (data) => {
    const adoptablePetsContainer = document.querySelector(
      '.adoptable-pets-container'
    );

    if (adoptablePetsContainer.firstElementChild?.lastElementChild != null) {
      adoptablePetsContainer.firstElementChild.lastElementChild.append(
        await createAdoptablePetsSection('Adoptable Pets', data.animal)
      );
    }
  });

  const adoptSearchContainer = document.querySelector(
    '.adopt-search-container'
  );

  if (adoptSearchContainer?.nextElementSibling?.classList.contains('section')) {
    adoptSearchContainer.nextElementSibling.classList.add(
      'adopt-guide-container'
    );
    const adoptGuideContainer = adoptSearchContainer.nextElementSibling;

    const guideHeading = adoptGuideContainer.firstElementChild;
    const guideColumns = adoptGuideContainer.lastElementChild;

    guideColumns.prepend(guideHeading);
  }
}
