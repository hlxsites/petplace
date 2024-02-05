/* eslint-disable indent */
import { fetchPlaceholders } from '../../scripts/lib-franklin.js';

// fetch placeholders from the /adopt folder currently, but placeholders should |
// be moved into the root' folder eventually
const placeholders = await fetchPlaceholders('/adopt');
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
console.log('placeholders', petTypeLabel, petTypeValues, breedLabel, breedPlaceholder, zipLabel, zipPlaceholder, zipErrorMessage, searchButtonText);

async function callAnimalList() {
    const response = await fetch('https://api-stg-petplace.azure-api.net/adopt/animals', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            locationInformation: {
                clientId: null,
                latLon: {
                    lat: 26.7474188,
                    lon: -80.2890581,
                },
                zipPostal: null,
                milesRadius: 10,
            },
            animalFilters: {
                startIndex: 0,
                numResults: 100,
            },
        }),
    });
    return response.json();
}

export default async function decorate(block) {
    const form = document.createElement('form');
    form.setAttribute('role', 'search');
    form.className = 'adopt-search-box-wrapper';
    form.action = ' ';
    form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        // should detect if the user is on the /adopt/search page before showing results
        // if on /adopt/ the form should direct to /adopt/search?[queryparameters]
        callAnimalList().then((data) => {
            console.log('data', data);

            // temporarily inserting results into empty section on page
            const tempResultsContainer = block.closest('.section').nextElementSibling;
            tempResultsContainer.classList.add('adopt-search-results');
            const tempResultsBlock = tempResultsContainer.firstElementChild;
            tempResultsBlock.classList.add('results');
            tempResultsBlock.innerHTML = '';
            const animalArray = data.animal;

            animalArray.forEach((animal) => {
                const div = document.createElement('div');
                div.className = 'animal';
                const img = document.createElement('img');
                img.src = animal.coverImagePath;
                const anchor = document.createElement('a');
                anchor.href = `/adopt/pet/${animal.animalId}/${animal.clientId}`;

                anchor.append(img);
                const animalName = document.createElement('h3');
                animalName.innerText = animal.Name;
                const p = document.createElement('p');
                p.innerText = `${animal.Gender} - ${animal.Breed}`;
                const animalLocation = document.createElement('p');
                animalLocation.innerHTML = `${animal.City}`;
                div.append(anchor);
                div.append(animalName);
                div.append(p);
                div.append(animalLocation);
                tempResultsBlock.append(div);
            });
        });
    });

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

    const breedContainer = document.createElement('div');
    const breedLabelElement = document.createElement('label');
    breedLabelElement.for = 'breed';
    breedLabelElement.innerText = breedLabel;

    const breedSelect = document.createElement('select');
    breedSelect.name = 'breed';
    breedSelect.id = 'breed';
    breedSelect.className = 'form-select-wrapper';
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
    // zipInput.pattern = `^\\d{5}(?:[-\\s]\\d{4})?$`;
    // zipInput.required = true;
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
    zipContainer.append(clearButton);
    //   form.append(clearButton);

    const button = document.createElement('button');
    button.type = 'submit';
    button.className = 'adopt-search-button';
    button.textContent = searchButtonText;
    //   const xhr = new XMLHttpRequest();
    //   xhr.open('GET', `${window.hlx.codeBasePath}/icons/send.svg`, true);
    //   xhr.onreadystatechange = function () {
    //     if (xhr.readyState === 4 && xhr.status === 200) {
    //       // On successful response, create and append the SVG element
    //       const svgElement = document.createElement('svg');
    //       svgElement.className = 'icon-search';
    //       svgElement.innerHTML = xhr.responseText;
    //       button.appendChild(svgElement);
    //     }
    //   };
    //   xhr.send();
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

    //   const usp = new URLSearchParams(window.location.search);
    //   block.querySelector('.search-input').value = usp.get('q') || '';
}
