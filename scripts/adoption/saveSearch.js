import { acquireToken, isLoggedIn } from '../lib/msal/msal-authentication.js';
import endPoints from '../../variables/endpoints.js';
import { fetchPlaceholders } from '../lib-franklin.js';

const placeholders = await fetchPlaceholders('/pet-adoption');
const {
    searchAlertCreated,
    searchFilters,
    manageSearchAlerts,
    continueSearch,
    searchAlertFail,
    searchAlertFailDetail
} = placeholders;
// set a Saved Search for user
export function setSaveSearch(e) {
    e.preventDefault();

    acquireToken("Save Search").then(token => {
        saveSearch(token);
    });
}


function openModal() {
    const modal = document.querySelector('.save-search-modal');
    modal.classList.add('show');
    const overlay = document.querySelector('.overlay');
    overlay.classList.add('show');
}

function closeModal() {
    const modal = document.querySelector('.save-search-modal');
    modal.classList.remove('show');
    const overlay = document.querySelector('.overlay');
    overlay.classList.remove('show');
}

export async function saveSearch(token) {
    const petType = document.getElementById('pet-type')?.value;
    let animalType = null;
    if (petType !== 'null') {
        animalType = petType;
    }
    const breedType = document.getElementById('breed')?.value;
    const breeds = [];
    if (breedType !== '') {
        breeds.push(breedType);
    }
    let zip = document.getElementById('zip')?.value;
    if (!zip) {
        zip = null;
    }
    let radius = document.getElementById('radius')?.value;
    if (!radius || radius === 'null') {
        radius = 10;
    }
    const genderElements = document.querySelectorAll('input[name="gender"]:checked');
    let gender = "";
        if (genderElements.length === 1) {
            gender = genderElements[0]?.value;
        }
    const age = document.querySelectorAll('input[name="age"]:checked');
    let ageList = [];
    if (age && age?.length === 0) {
        ageList = null;
    } else {
        age?.forEach((item) => {
            ageList.push(item.value)
        })
    }
    const size = document.querySelectorAll('input[name="size"]:checked');
    let sizeList = [];
    if (size && size?.length === 0) {
        sizeList = null;
    } else {
        size?.forEach((item) => {
            sizeList.push(item.value);
        })
    }

    const response = await fetch(`${endPoints.apiUrl}/adopt/api/UserSearch`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            Name: `${animalType}s near ${zip}`,
            SearchParameters: {
                locationInformation: {
                    clientId: null,
                    zipPostal: zip,
                    milesRadius: radius,
                },
                animalFilters: {
                    startIndex: 0,
                    filterAnimalType: animalType,
                    filterBreed: breeds,
                    filterGender: gender,
                    filterAge: ageList,
                    filterSize: sizeList,
                },
            }
        }),
    });
    if (response.status === 204 || response.status === 400 || response.status === 500) {
        //build and show error modal
        let modal = document.getElementById('saved-search-modal');
        const resultsContainer = document.getElementById('results-container');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'saved-search-modal'
            modal.className = 'save-search-modal';
        } else {
            modal.innerHTML= '';
        }

        const modalTitle = document.createElement('h3');
        modalTitle.innerText = searchAlertFail;
        modalTitle.className = 'modal-title';

        const modalSubtitle = document.createElement('div');
        modalSubtitle.innerText = searchAlertFailDetail;
        modalSubtitle.className = 'modal-subtitle';

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';

        const manageButton = document.createElement('button');
        manageButton.className = 'manage-button';
        manageButton.innerText = manageSearchAlerts;
        manageButton.addEventListener('click', () => {
            window.location.href = 'account';
        });

        const continueButton = document.createElement('button');
        continueButton.className = 'continue-button';
        continueButton.innerText = continueSearch;
        continueButton.addEventListener('click', closeModal);

        buttonContainer.append(manageButton);
        buttonContainer.append(continueButton);

        modal.append(modalTitle);
        modal.append(modalSubtitle);
        modal.append(buttonContainer);
        resultsContainer.append(modal);
        openModal();
    } else {
        //build and show success modal
        let modal = document.getElementById('saved-search-modal');
        const resultsContainer = document.getElementById('results-container');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'saved-search-modal'
            modal.className = 'save-search-modal';
        } else {
            modal.innerHTML= '';
        }

        // create success icon
        const successIcon = document.createElement('div');
        successIcon.className = 'success-icon';
        successIcon.innerHTML = `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 32C0 14.3269 14.3269 0 32 0C49.6731 0 64 14.3269 64 32C64 49.6731 49.6731 64 32 64C14.3269 64 0 49.6731 0 32Z" fill="#EDFCF2"/>
        <path d="M47 16.9987L26.8773 45.744C26.6118 46.1255 26.2595 46.4384 25.8493 46.6571C25.4391 46.8757 24.9829 46.9937 24.5181 47.0014C24.0534 47.009 23.5935 46.9062 23.1763 46.7012C22.7591 46.4963 22.3966 46.1952 22.1187 45.8227L17 38.9987" stroke="#1A6132" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`

        const modalTitle = document.createElement('h3');
        modalTitle.innerText = searchAlertCreated;
        modalTitle.className = 'modal-title';

        const modalSubtitle = document.createElement('div');
        modalSubtitle.innerText = searchFilters;
        modalSubtitle.className = 'modal-subtitle';

        // build filter string

        const filterArray = [];
        const breedSelect = document.getElementById('breed');
        const breedText = breedSelect.options[breedSelect.selectedIndex].text;
        const ageFilters = document.querySelectorAll('input:checked');
        filterArray.push(breedText);
        ageFilters.forEach((filter) => {
            filterArray.push(filter.parentElement.innerText);
        })
        let filterString = '';
        if (filterArray.length > 0) {
            filterString += ' including ';
            filterArray.forEach((filter) => {
                filterString += `${filter}, `
            })
            filterString = filterString.slice(0, -2);
        }

        const filters = document.createElement('div');
        filters.className = 'saved-filters';
        filters.innerText = `${petType !== 'null' ? petType + 's' : 'Pets'} near ${zip} ${filterString}`;

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';

        const manageButton = document.createElement('button');
        manageButton.className = 'manage-button';
        manageButton.innerText = manageSearchAlerts;
        manageButton.addEventListener('click', () => {
            window.location.href = '/pet-adoption/account#searchalerts';
        });

        const continueButton = document.createElement('button');
        continueButton.className = 'continue-button';
        continueButton.innerText = continueSearch;
        continueButton.addEventListener('click', closeModal);

        buttonContainer.append(manageButton);
        buttonContainer.append(continueButton);

        modal.append(successIcon);
        modal.append(modalTitle);
        modal.append(modalSubtitle);
        modal.append(filters);
        modal.append(buttonContainer);
        resultsContainer.append(modal);
        openModal();
    }
}

export function deleteSearch(token, animal, favoriteId) {
    fetch(`${endPoints.apiUrl}/adopt/api/Favorite/${favoriteId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }
    })
    .then(response => {
        const favoriteButton = document.getElementById(animal.animalId);
        favoriteButton?.classList.remove('favorited');
    })
    .catch((error) => {
        console.error('Error deleting favorite', error);
    });
}
