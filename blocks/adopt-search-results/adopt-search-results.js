/* eslint-disable indent */
import { fetchPlaceholders, getMetadata } from '../../scripts/lib-franklin.js';

// fetch placeholders from the /adopt folder currently, but placeholders should |
// be moved into the root' folder eventually
const placeholders = await fetchPlaceholders('/pet-adoption');
const {
    petTypeLabel,
    petTypeValues,
    breedLabel,
    breedPlaceholder,
    zipLabel,
    zipPlaceholder,
    searchAlertText,
    genderOptions,
    sizeOptions,
    radiusOptions,
    ageOptions,
    filtersLabel,
    radiusLabel,
    genderLabel,
    sizeLabel,
    ageLabel,
    clearLabel
} = placeholders;
// console.log('placeholders', petTypeLabel, petTypeValues, breedLabel, breedPlaceholder, zipLabel, zipPlaceholder, zipErrorMessage, searchButtonText);
// console.log(placeholders);
let breedList = [];
let current_page = 1;
let records_per_page = 16;
let animalArray = []


async function callAnimalList() {
    applyFilters();
    const petType = document.getElementById("pet-type")?.value;
    let animalType = null
    if (petType !== 'null') {
        animalType = petType
    }
    const breedType = document.getElementById("breed")?.value;
    let breed = null
    if (breedType !== '') {
        breed = breedType
    }
    let zip = document.getElementById("zip")?.value;
    if (!zip) {
        zip = null;
    }
    let radius = document.getElementById("radius")?.value;
    if (!radius || radius === "null") {
        radius = 10;
    }
    let gender = document.querySelector('input[name="gender"]:checked')?.value;
    if (!gender) {
        gender = null;
    }
    let age = document.querySelector('input[name="age"]:checked')?.value;
    
    let ageList = [];
    if (!age) {
        ageList = null
    } else {
        ageList.push(age);
    }
    let size = document.querySelector('input[name="size"]:checked')?.value;
    let sizeList = [];
    if (!size) {
        size = null;
    } else {
        sizeList.push(size);
    }

    const response = await fetch('https://api-stg-petplace.azure-api.net/animal', {
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
                zipPostal: zip,
                milesRadius: radius,
            },
            animalFilters: {
                startIndex: 0,
                numResults: 100,
                filterAnimalType: animalType,
                filterBreedType: breed,
                filterGender: gender,
                filterAge: ageList,
                filterSize: sizeList
            },
        }),
    });
    return response.json();
}

async function callBreedList(petType) {
    const breedSelect = document.getElementById('breed');
    if (breedSelect && petType === "other") {
        breedSelect.setAttribute("disabled", "disabled");
        return
    }
    else {
        if (breedSelect) {
            breedSelect.removeAttribute("disabled");
        }
        let endpoint = "https://api-stg-petplace.azure-api.net/breed";
        if (petType !== "null") {
            endpoint = endpoint + "/" + petType
        }
        const response = await fetch(endpoint, {
            method: 'GET'
        });
        return response.json();
    }
}

function updateBreedListSelect() {
    const breedSelect = document.getElementById("breed")
    var i, L = breedSelect?.options.length - 1;
    for(i = L; i >= 0; i--) {
        breedSelect.remove(i);
    }

    const option = document.createElement('option');
    option.innerText = breedPlaceholder;
    option.value = '';
    breedSelect?.append(option);

    breedList.forEach((breed) => {
        const option = document.createElement('option');
        option.innerText = breed?.breedValue;
        option.value = breed?.breedKey;
    
        breedSelect?.append(option);
    })
}

function prevPage()
{
    if (current_page > 1) {
        current_page--;
        calculatePagination(current_page);
    }
}

function nextPage()
{
    if (current_page < numPages()) {
        current_page++;
        calculatePagination(current_page);
    }
}
function numPages()
{
    return Math.ceil(animalArray.length / records_per_page);
}
function clearFilters() {
    document.getElementById("radius").selectedIndex = 0;
    let radioButtons = document.querySelectorAll('input:checked');
    for(var i=0;i<radioButtons.length;i++) {
        radioButtons[i].checked = false;
    }
    
}

function calculatePagination(page) {
    if (page.currentTarget?.myParam) {
        page = page.currentTarget?.myParam;
        current_page = page;
    }
    let filteredArray = [];
    // Validate page
    if (page < 1) page = 1;
    if (page > numPages()) page = numPages();

    for (var i = (page-1) * records_per_page; i < (page * records_per_page) && i < animalArray.length; i++) {
        filteredArray.push(animalArray[i]);
    }
    const paginationNumbers = document.querySelector('.pagination-numbers');
    paginationNumbers.innerHTML = '';
    // add pagination numbers
    const maxPagesToShow = 2; // Adjust as needed
    for (let i = 1; i <= numPages(); i++) {
        if (i === 1 || i === numPages() || (i >= current_page - Math.floor(maxPagesToShow / 2) && i <= current_page + Math.floor(maxPagesToShow / 2))) {
            
            const button = document.createElement('button');
            if (i === current_page) {
                console.log(current_page, i)
                button.className = 'active';
            }
            button.addEventListener('click', calculatePagination);
            button.myParam = i;
            button.innerHTML = i;
            paginationNumbers.append(button);
        }
        // Add an ellipsis to indicate that there are more pages available
        else if (i === current_page - Math.floor(maxPagesToShow / 2) - 1 || i === current_page + Math.floor(maxPagesToShow / 2) + 1) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            paginationNumbers.appendChild(ellipsis);
        }
    }
    buildResultsList(filteredArray);
}

window.onload = callBreedList("null").then((data) => {
    breedList = data;
    updateBreedListSelect();
    const tempResultsContainer = document.querySelector('.section.adopt-search-results-container').closest('.section').nextElementSibling;
    const div = document.createElement('div');
    div.className = 'pagination hidden';

    // add pagination
    const previousButton = document.createElement('button');
    previousButton.id = ('btn_prev');
    previousButton.addEventListener('click', prevPage)
    previousButton.innerText = '<';
    const nextButton = document.createElement('button');
    nextButton.id = ('btn_next');
    nextButton.addEventListener('click', nextPage)
    nextButton.innerText = '>';
    div.append(previousButton);
    const paginationNumbers = document.createElement('div');
    paginationNumbers.className = 'pagination-numbers';
    div.append(paginationNumbers);
    div.append(nextButton);
    tempResultsContainer.append(div);

    // When the page loads, check if there are any query parameters in the URL
    let params = new URLSearchParams(window.location.search);

    // If there are, select the corresponding filters
    let filters = {};
    if (params.has('filterZip')) {
        console.log(params.get('filterZip'))
        document.getElementById('zip').value = params.get('filterZip');
    }
    
});

function buildResultsList(animalList) {
    const tempResultsBlock = document.getElementById('results-block');
    if (tempResultsBlock.offsetHeight !== 0) {
        tempResultsBlock.style.height = tempResultsBlock.offsetHeight.toString() + 'px';
    }
    tempResultsBlock.innerHTML = '';
    animalList.forEach((animal) => {
        const div = document.createElement('div');
        div.className = 'animal';
        const img = document.createElement('object');
        img.data = animal.coverImagePath;
        img.type = "image/jpg";
        const fallback = document.createElement('img');
        fallback.src = getMetadata('image-fallback');
        img.append(fallback);
        const anchor = document.createElement('a');
        anchor.href = `/adopt/pet/${animal.animalId}/${animal.clientId}`;
        anchor.append(img);
        const likeButton = document.createElement('button');
        likeButton.innerHTML = '<svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23.3 4.55114C22.8314 3.63452 22.154 2.84083 21.3223 2.2341C20.4906 1.62736 19.528 1.22455 18.5121 1.05815C17.4962 0.891748 16.4554 0.966411 15.4736 1.27612C14.4918 1.58583 13.5966 2.12191 12.86 2.84114L12 3.62114L11.17 2.86114C10.4344 2.13135 9.53545 1.58739 8.54766 1.27436C7.55987 0.961323 6.51169 0.888233 5.49002 1.06114C4.47076 1.21761 3.50388 1.61617 2.67044 2.22341C1.837 2.83066 1.16131 3.62888 0.700017 4.55114C0.0805959 5.76129 -0.13608 7.13766 0.0815777 8.47958C0.299236 9.82151 0.939848 11.0588 1.91002 12.0111L11.28 21.6711C11.3733 21.7679 11.4851 21.8449 11.6088 21.8975C11.7326 21.9501 11.8656 21.9772 12 21.9772C12.1344 21.9772 12.2675 21.9501 12.3912 21.8975C12.5149 21.8449 12.6267 21.7679 12.72 21.6711L22.08 12.0311C23.0535 11.0768 23.6968 9.8366 23.9163 8.49115C24.1357 7.1457 23.9198 5.76533 23.3 4.55114ZM20.66 10.6211L12.36 19.1711C12.2634 19.2651 12.1347 19.3187 12 19.3211C11.8657 19.3168 11.7377 19.2634 11.64 19.1711L3.33002 10.6111C2.66352 9.95404 2.22228 9.10271 2.06957 8.1793C1.91687 7.25589 2.06055 6.30784 2.48002 5.47114C2.80009 4.82822 3.26939 4.27124 3.84871 3.84675C4.42803 3.42227 5.10053 3.14261 5.81002 3.03114C6.53132 2.91042 7.27107 2.96456 7.96711 3.18903C8.66315 3.41351 9.29515 3.80175 9.81002 4.32114L11.34 5.71114C11.5238 5.87698 11.7625 5.96878 12.01 5.96878C12.2575 5.96878 12.4963 5.87698 12.68 5.71114L14.24 4.29114C14.7573 3.77638 15.3905 3.39328 16.0866 3.17402C16.7826 2.95477 17.5211 2.90577 18.24 3.03114C18.9406 3.15001 19.603 3.43308 20.1731 3.85719C20.7432 4.28129 21.2048 4.83436 21.52 5.47114C21.9391 6.31036 22.0815 7.26072 21.927 8.18592C21.7725 9.11112 21.329 9.96362 20.66 10.6211Z" fill="#464646"/></svg>'
        likeButton.className = 'favorite';
        const animalName = document.createElement('h3');
        animalName.innerText = animal.Name?.replace(/ *\([^)]*\) */g, "");
        const p = document.createElement('p');
        p.innerText = `${animal.Gender} • ${animal.Breed}`;
        const animalLocation = document.createElement('p');
        animalLocation.className = 'location';
        animalLocation.innerHTML = `${animal.City}`;
        div.append(anchor);
        div.append(animalName);
        div.append(p);
        div.append(animalLocation);
        div.append(likeButton);
        tempResultsBlock.append(div);
    });
    setTimeout(() => {
        tempResultsBlock.style.removeProperty('height');
      }, "400");
    
}

function buildFilterSidebar(sidebar)  {
    const filterLabel = document.createElement('h3');
    filterLabel.className = 'sidebar-label';
    filterLabel.innerHTML = filtersLabel;
    sidebar.append(filterLabel);

    // create clear button
    const clearButton = document.createElement('button');
    clearButton.className = 'sidebar-clear';
    clearButton.innerHTML = clearLabel;
    clearButton.addEventListener('click', clearFilters);
    sidebar.append(clearButton);

    // create search radius select
    const radiusLabelElement = document.createElement('label');
    radiusLabelElement.for = 'radius';
    radiusLabelElement.className = 'sidebar-header';
    radiusLabelElement.innerText = radiusLabel;

    const radiusSelect = document.createElement('select');
    radiusSelect.name = 'radius';
    radiusSelect.id = 'radius';
    radiusSelect.className = 'filter-select';
    radiusSelect.addEventListener('change', () => {
        callAnimalList().then((data) => {
            buildResultsContainer(data);
        });
    });
    const radiusOption = document.createElement('option');
    radiusOption.innerText = "Any";
    radiusOption.value = null;

    radiusSelect.append(radiusOption);
    const radiusList = radiusOptions.split(',');
        radiusList.forEach((radius) => {
            const radiusListOption = document.createElement('option');
            radiusListOption.innerText = radius;
            radiusListOption.value = radius;
        
            radiusSelect.append(radiusListOption);
        });
    sidebar.append(radiusLabelElement);
    sidebar.append(radiusSelect);

    // create gender radio buttons
    const genderBlock = document.createElement('div');
    genderBlock.className = 'radio-block';
    const genderLabelElement = document.createElement('div');
    genderLabelElement.className = 'sidebar-header';
    genderLabelElement.innerText = genderLabel;
    genderBlock.append(genderLabelElement);
    sidebar.append(genderBlock);

    const genderList = genderOptions.split(',');
    genderList.forEach((gender) => {
        const genderLabel = document.createElement('label');
        genderLabel.for = gender;
        genderLabel.className = 'radio-container';
        genderLabel.innerHTML = gender;
        const genderRadio = document.createElement('input');
        genderRadio.type = 'radio';
        genderRadio.name = 'gender';
        genderRadio.id = gender;
        genderRadio.value = placeholders[gender.toLowerCase()];
        genderRadio.addEventListener('click', () => {
            callAnimalList().then((data) => {
                buildResultsContainer(data);
            });
        });
        genderLabel.append(genderRadio);
        const checkmark = document.createElement('span');
        checkmark.className = 'checkmark';
        genderLabel.append(checkmark);
        genderBlock.append(genderLabel);
    })

    // create age radio buttons
    const ageBlock = document.createElement('div');
    ageBlock.className = 'radio-block';
    const ageLabelElement = document.createElement('div');
    ageLabelElement.className = 'sidebar-header';
    ageLabelElement.innerText = ageLabel;
    ageBlock.append(ageLabelElement);
    sidebar.append(ageBlock);

    const ageList = ageOptions.split(',');
    ageList.forEach((age) => {
        const ageLabel = document.createElement('label');
        ageLabel.for = age;
        ageLabel.className = 'radio-container';
        ageLabel.innerHTML = age;
        const ageRadio = document.createElement('input');
        ageRadio.type = 'radio';
        ageRadio.name = 'age';
        ageRadio.id = age;
        ageRadio.addEventListener('click', () => {
            callAnimalList().then((data) => {
                buildResultsContainer(data);
            });
        });
        let formattedAge = age[0].toLowerCase() + age.slice(1);
        console.log(formattedAge?.replace(/\s+/g, '')?.replace(/\+/g, '')?.replace(/\//g, ''), placeholders)
        ageRadio.value = placeholders[formattedAge?.replace(/\s+/g, '')?.replace(/\+/g, '')?.replace(/\//g, '')];
        ageLabel.append(ageRadio);
        const checkmark = document.createElement('span');
        checkmark.className = 'checkmark';
        ageLabel.append(checkmark);
        ageBlock.append(ageLabel);
    });

    // create size radio buttons
    const sizeBlock = document.createElement('div');
    sizeBlock.className = 'radio-block';
    const sizeLabelElement = document.createElement('div');
    sizeLabelElement.className = 'sidebar-header';
    sizeLabelElement.innerText = sizeLabel;
    sizeBlock.append(sizeLabelElement);
    sidebar.append(sizeBlock);

    const sizeList = sizeOptions.split(',');
    sizeList.forEach((size) => {
        const sizeLabel = document.createElement('label');
        sizeLabel.for = size;
        sizeLabel.className = 'radio-container';
        sizeLabel.innerHTML = size;
        const sizeRadio = document.createElement('input');
        sizeRadio.type = 'radio';
        sizeRadio.name = 'size';
        sizeRadio.id = size;
        sizeRadio.value = placeholders[size.toLowerCase()];
        sizeRadio.addEventListener('click', () => {
            callAnimalList().then((data) => {
                buildResultsContainer(data);
            });
        });
        sizeLabel.append(sizeRadio);
        const checkmark = document.createElement('span');
        checkmark.className = 'checkmark';
        sizeLabel.append(checkmark);
        sizeBlock.append(sizeLabel);
    });
}
 // Get filters
function getFilters() {
    let filters = {
        filterRadius: document.getElementById('radius')?.value,
        filterGender: document.querySelector('input[name="gender"]:checked')?.value,
        filterAge: document.querySelector('input[name="age"]:checked')?.value,
        filterType: document.getElementById('pet-type')?.value,
        filterBreed: document.getElementById('breed')?.value,
        filterZip: document.getElementById('zip')?.value
        // Add more filters as needed
    };

    // Only include the size filter in the request filter object when 'Cat' is not selected
    if (document.getElementById('pet-type')?.value !== 'Cat') {
        filters.filterSize = document.querySelector('input[name="size"]:checked')?.value
    }

    return filters;
}

// Apply filters
    const applyFilters = function() {
    const filters = getFilters();
    console.log(filters)
    // Update the URL with the selected filters as query parameters
    let params = new URLSearchParams(filters);
    window.history.replaceState({}, '', '?' + params.toString());
};

function buildResultsContainer(data) {
    // clear any previous results
    const block = document.querySelector('.adopt-search-results.block');
    let resultsContainer = document.querySelector('.default-content-wrapper.results');
    let sidebarElement = document.querySelector('.sidebar');
    if (resultsContainer) {
        resultsContainer.innerHTML = '';
    }
    // show pagination
    const pagination = document.querySelector('.pagination.hidden');
    pagination?.classList.remove('hidden');
    
    // temporarily inserting results into empty section on page
    let tempResultsContainer = document.getElementById('results-container');
    if (!tempResultsContainer) {
        tempResultsContainer = block.closest('.section').nextElementSibling;
        tempResultsContainer.id = 'results-container';
    }
    
    tempResultsContainer.classList.add('adopt-search-results');
    tempResultsContainer.classList.add('list');
    let tempResultsBlock = document.getElementById('results-block');
    if (!tempResultsBlock) {
        tempResultsBlock = tempResultsContainer.firstElementChild;
    }
    tempResultsBlock.classList.add('results');
    tempResultsBlock.innerHTML = '';
    tempResultsBlock.id = 'results-block'
    animalArray = data.animal;

    // adding filter sidebar
    
    if (!sidebarElement) {
        const sidebar = document.createElement('div');
        sidebar.classList.add('sidebar');
        buildFilterSidebar(sidebar);
        tempResultsContainer.prepend(sidebar);
    }

    current_page = 1;
    calculatePagination(1);
}

export default async function decorate(block) {
    const form = document.createElement('form');
    form.setAttribute('role', 'search');
    form.className = 'adopt-search-results-box-wrapper';
    form.action = ' ';
    form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        // should detect if the user is on the /adopt/search page before showing results
        // if on /adopt/ the form should direct to /adopt/search?[queryparameters]
        callAnimalList().then((data) => {
            buildResultsContainer(data);
        });
    });

    // Building Pet Type select element
    const petTypeContainer = document.createElement('div');
    const petTypeLabelElement = document.createElement('label');
    petTypeLabelElement.for = 'pet-type';
    petTypeLabelElement.innerText = petTypeLabel;

    const petTypeSelect = document.createElement('select');
    petTypeSelect.name = 'pet-type';
    petTypeSelect.id = 'pet-type';
    petTypeSelect.className = 'form-select-wrapper';
    const petOption = document.createElement('option');
    petOption.innerText = "Any";
    petOption.value = null;

    petTypeSelect.append(petOption);
    const petTypes = petTypeValues.split(',');
        petTypes.forEach((petType) => {
            const petTypeOption = document.createElement('option');
            petTypeOption.innerText = petType;
            petTypeOption.value = petType;
        
            petTypeSelect.append(petTypeOption);
        });
    petTypeContainer.append(petTypeLabelElement);
    petTypeContainer.append(petTypeSelect);
    petTypeSelect.addEventListener('change', () => {
        callBreedList(petTypeSelect.value.toLowerCase()).then((data) => {
            breedList = data;
            updateBreedListSelect();
        });
    })

    // Building Breed List select element
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
    zipInput.pattern = `^\\d{5}(?:[-\\s]\\d{4})?$`;
    zipInput.required = true;
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
    button.textContent = searchAlertText;

    form.append(petTypeContainer);

    form.append(breedContainer);

    form.append(zipContainer);
    form.append(button);


    const heroContainer = document.querySelector('.columns.hero');

    if (heroContainer?.firstElementChild?.lastElementChild != null) {
        const formWrapper = document.createElement('div');
        formWrapper.className = 'adopt-search-results-wrapper';
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
