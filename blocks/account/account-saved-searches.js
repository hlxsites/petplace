/* eslint-disable indent */
import { fetchPlaceholders } from '../../scripts/lib-franklin.js';
import endPoints from '../../variables/endpoints.js';
// eslint-disable-next-line
import { isLoggedIn, logout } from '../../scripts/lib/msal/msal-authentication.js';
import errorPage from '../../scripts/adoption/errorPage.js';

const placeholders = await fetchPlaceholders('/pet-adoption');

function getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
}

const arrSaveList = [];

function removeFavoriteSearch(id, token, btn) {
    return fetch(`${endPoints.apiUrl}/adopt/api/UserSearch/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })
    .then(() => {
        btn.closest('.saved-search-layout-row').remove();
    })
    .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Error deleting favorite', error);
        errorPage();
        throw error;
    });
}

function openRemoveConfirmModal(e, token) {
    const modal = document.querySelector('.confirm-remove-modal');
    const confirmBtn = document.querySelector('.confirm-remove-modal .confirm');
    const cancelBtn = document.querySelector('.confirm-remove-modal .cancel');
    const modalDescription = document.querySelector('.confirm-remove-modal .modal-description');
    const description = decodeURIComponent(e.target.dataset?.description);
    const id = e.target.dataset?.saveId;
    modalDescription.innerText = description;
    modal.classList.remove('hidden');
    const overlay = document.querySelector('.overlay');
    overlay.classList.add('show');
    confirmBtn.addEventListener('click', () => {
        removeFavoriteSearch(id, token, e.target);
        modal.classList.add('hidden');
        overlay.classList.remove('show');
    });

    cancelBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        overlay.classList.remove('show');
    });
}

function createRemoveConfirmModal() {
    const removeConfirmModal = `
        <div class="modal confirm-remove-modal hidden">
            <div class="modal-header">
            <h3 class="modal-title">Delete Search Alert</h3>
            </div>
            <div class="modal-body">
                <p>Are you sure you want to remove your search alert for</p>
                <h4 class="modal-description"></h4>
                <div class="modal-action-btns">
                    <button class="cancel">Cancel</button>
                    <button class="confirm">Remove Search</button>
                </div>
            </div>
        </div>
        <div class="overlay"></div>
    `;

    return removeConfirmModal;
}

async function bindSaveEvents(token) {
    const removeBtns = document.querySelectorAll('button.saved-search__delete');

    removeBtns.forEach((button) => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();
            isLoggedIn().then((isLoggedInParam) => {
                if (isLoggedInParam) {
                    openRemoveConfirmModal(event, token);
                } else {
                    logout();
                }
            });
        });
    });
}

function getSearches(token) {
    let builtHml = '';
    const emptyFavList = `
        <div class='account-layout-container no-fav-pets'>
            You don’t currently have any saved searches.
        </div>`;

    fetch(`${endPoints.apiUrl}/adopt/api/UserSearch`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    }).then((response) => response.json()).then(async (data) => {
        // build saved search list
        data.forEach((favorite) => {
            arrSaveList.push(favorite);
        });

        const elFavList = document.querySelector('.saved-search-layout-container');

        if (arrSaveList.length > 0) {
            arrSaveList.forEach((saved) => {
                let searchUrl = '/pet-adoption/search?';
                let breedFilterCardInfo = '';
                let ageFilterCardInfo = '';
                const milesRadiusCardInfo = `${saved.SearchParameters.locationInformation.milesRadius} miles`;
                let sizeFilterCardInfo = '';
                // eslint-disable-next-line max-len
                const genderInfo = saved.SearchParameters.animalFilters.filterGender;
                const genderFilterCardInfo = getKeyByValue(placeholders, genderInfo);

                if (saved.SearchParameters.locationInformation.zipPostal) {
                    searchUrl += `zipPostal=${saved.SearchParameters.locationInformation.zipPostal.replace(' ', '+')}`;
                }
                if (saved.SearchParameters.locationInformation.milesRadius) {
                    searchUrl += `&milesRadius=${saved.SearchParameters.locationInformation.milesRadius}`;
                }
                if (saved.SearchParameters.animalFilters.filterAge?.length) {
                    let ageFilterList = '';
                    saved.SearchParameters.animalFilters.filterAge?.forEach((age) => {
                        if (ageFilterList !== '') {
                            ageFilterList += `,${age}`;
                            ageFilterCardInfo += ` | ${getKeyByValue(placeholders, age)
                                .toLowerCase()
                                .replace('-', ' - ')
                                .replace('years', ' years')
                                .replace('kitten', '/kitten')
                                .replace('small', '7+ years')
                            }`;
                        } else {
                            ageFilterList += age;
                            ageFilterCardInfo += `${getKeyByValue(placeholders, age)
                                .toLowerCase()
                                .replace('-', ' - ')
                                .replace('years', ' years')
                                .replace('kitten', '/kitten')
                                .replace('small', '7+ years')
                            }`;
                        }
                    });
                    searchUrl += `&filterAge=${ageFilterList}`;
                }
                if (saved.SearchParameters.animalFilters.filterAnimalType) {
                    searchUrl += `&filterAnimalType=${saved.SearchParameters.animalFilters.filterAnimalType}`;
                }
                if (saved.SearchParameters.animalFilters.filterBreed?.length) {
                    let breedFilterList = '';
                    saved.SearchParameters.animalFilters.filterBreed?.forEach((breed) => {
                        if (breedFilterList !== '') {
                            breedFilterList += `,${breed?.replace(' ', '+')}`;
                            breedFilterCardInfo += ` | ${breed?.toLowerCase()}`;
                        } else {
                            // eslint-disable-next-line no-unsafe-optional-chaining
                            breedFilterList += breed?.replace(' ', '+');
                            breedFilterCardInfo += `${breed?.toLowerCase()}`;
                        }
                    });
                    searchUrl += `&filterBreed=${breedFilterList}`;
                }
                if (saved.SearchParameters.animalFilters.filterGender !== '') {
                    searchUrl += `&filterGender=${saved.SearchParameters.animalFilters.filterGender}`;
                }
                if (saved.SearchParameters.animalFilters.filterSize?.length) {
                    let sizeFilterList = '';
                    saved.SearchParameters.animalFilters.filterSize?.forEach((size) => {
                        if (sizeFilterList !== '') {
                            sizeFilterList += `,${size}`;
                            sizeFilterCardInfo += ` | ${getKeyByValue(placeholders, size)
                                .replace('extraLarge', 'extra large')
                                .replace('male', 'medium')
                            }`;
                        } else {
                            sizeFilterList += size;
                            sizeFilterCardInfo += `${getKeyByValue(placeholders, size)
                                .replace('extraLarge', 'extra large')
                                .replace('male', 'medium')
                            }`;
                        }
                    });
                    searchUrl += `&filterSize=${sizeFilterList}`;
                }
                if (saved.SearchParameters.animalFilters.filterShelter?.length) {
                    let shelterFilterList = '';
                    saved.SearchParameters.animalFilters.filterShelter?.forEach((shelter) => {
                        if (shelterFilterList !== '') {
                            shelterFilterList += `,${shelter}`;
                        } else {
                            // eslint-disable-next-line no-unsafe-optional-chaining
                            shelterFilterList += shelter;
                        }
                    });
                    searchUrl += `&filterShelter=${shelterFilterList}`;
                }
                builtHml += `
                <div class='saved-search-layout-row'>
                    <div class='saved-search__content'>
                        <div class='saved-search__title'>${saved.SearchParameters.animalFilters.filterAnimalType ? saved.Name : (`Pets near ${saved.SearchParameters.locationInformation.zipPostal}`)}</div>
                        <div class='saved-search__info'>
                            <span class='saved-search__info-item saved-search__timestamp'>Created on ${new Date(saved.DateCreated).toLocaleDateString()}</span>
                            ${breedFilterCardInfo !== '' ? `<span class='saved-search__info-item'> ${breedFilterCardInfo}</span>` : ''}
                            ${milesRadiusCardInfo !== '' ? `<span class='saved-search__info-item'> ${milesRadiusCardInfo}</span>` : ''}
                            ${ageFilterCardInfo !== '' ? `<span class='saved-search__info-item'> ${ageFilterCardInfo}</span>` : ''}
                            ${sizeFilterCardInfo !== '' ? `<span class='saved-search__info-item'> ${sizeFilterCardInfo}</span>` : ''}
                            ${genderInfo !== '' ? `<span class='saved-search__info-item'> ${genderFilterCardInfo}</span>` : ''}
                        </div>
                    </div>
                    <a class='saved-search__cta account-button' href=${searchUrl}>Launch Search</a>
                    <button class='saved-search__delete' data-save-id=${saved.Id} data-description=${saved.SearchParameters.animalFilters.filterAnimalType ? encodeURIComponent(saved.Name) : encodeURIComponent((`Pets near ${saved.SearchParameters.locationInformation.zipPostal}`))} aria-label='Delete this search item'></button>
                </div>
                `;
            });
            elFavList.innerHTML = builtHml;
        } else {
            elFavList.innerHTML = emptyFavList;
        }

        await bindSaveEvents(token);
    })
    .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Error:', error);
        const elFavList = document.querySelector('.saved-search-layout-container');

        elFavList.innerHTML = emptyFavList;
    });
}

export async function createSavedSearchPanel(token) {
    const panelDiv = document.createElement('div');
    panelDiv.className = 'account-tabpanel-inner';
    panelDiv.innerHTML = `
      <h3>Search Alerts</h3>
      <div class='saved-search-layout-container'>
      </div>

      <a class="saved-search__cta-new-search" href="/pet-adoption/">Start New Search</a>
    `;
    getSearches(token);
    panelDiv.innerHTML += createRemoveConfirmModal();
    return panelDiv;
}
