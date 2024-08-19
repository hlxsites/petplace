/* eslint-disable indent */
import { getMetadata } from '../../scripts/lib-franklin.js';
import endPoints from '../../variables/endpoints.js';
import { extractName } from '../../templates/adopt/adopt.js';
// eslint-disable-next-line
import { isLoggedIn, logout } from '../../scripts/lib/msal/msal-authentication.js';
import errorPage from '../../scripts/adoption/errorPage.js';

const arrFavList = [];

const emptyFavList = `
<div class='account-layout-container no-fav-pets'>
    You don’t currently have any favorited pets.
</div>
<div class="new-search-btn-wrapper">
    <a href="/pet-adoption/" class='account-button account-button--new-search' id='new-search'>
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
            <g clip-path="url(#clip0_2839_4223)">
                <path d="M12.5 23C18.5751 23 23.5 18.0751 23.5 11.9999C23.5 5.92481 18.5751 1 12.5 1C6.42484 1 1.5 5.92481 1.5 11.9999C1.5 18.0751 6.42484 23 12.5 23Z" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12.4512 6.47559V17.5245" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6.97559 11.9512H17.9267" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <defs>
                <clipPath id="clip0_2839_4223">
                    <rect width="24" height="24" fill="white" transform="translate(0.5)"/>
                </clipPath>
            </defs>
        </svg>
        Start New Search
    </a>
</div>`;

function orderByAvailability(a, b) {
    if (a.Animal.IsAvailable && !b.Animal.IsAvailable) {
        return -1;
    }
    if (!a.Animal.IsAvailable && b.Animal.IsAvailable) {
        return 1;
    }
    return 0;
}

function removeFavoritePet(id, token, btn) {
    return fetch(`${endPoints.apiUrl}/adopt/api/Favorite/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })
    .then(() => {
        btn.closest('.fav-pet-card').remove();
        const favoritePets = document.querySelectorAll('.fav-pet-card');
        if (favoritePets.length < 1) {
            const elFavList = document.querySelector('.favorites-list');
            elFavList.innerHTML = emptyFavList;
        }
    })
    .catch((error) => {
        errorPage();

        // eslint-disable-next-line no-console
        console.error('Error deleting favorite', error);
        throw error;
    });
}

function openRemoveConfirmModal(petName, element, id, token, btn) {
    const modal = document.querySelector('.confirm-remove-favorite-modal');
    const confirmBtn = document.querySelector('.confirm-remove-favorite-modal .confirm');
    const cancelBtn = document.querySelector('.confirm-remove-favorite-modal .cancel');
    modal.classList.remove('hidden');
    const overlay = document.querySelector('.account-tabpanel--favorites .overlay');
    overlay.classList.add('show');
    confirmBtn.addEventListener('click', () => {
        removeFavoritePet(id, token, btn);
        element.remove();
        modal.classList.add('hidden');
        overlay.classList.remove('show');
    });

    cancelBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        overlay.classList.remove('show');
    });
}
function isEmptyObject(obj) {
    return typeof obj === 'object' && Object.keys(obj).length === 0;
}

function createImageObject(imagePath, fallBackSrc, fallBackAlt, width, height) {
    let img;
    if (!imagePath || isEmptyObject(imagePath)) {
        img = document.createElement('img');
        img.src = fallBackSrc;
        img.alt = fallBackAlt || '';
    } else {
        img = document.createElement('object');
        img.data = imagePath;
        img.type = 'image/jpg';
        img.classList.add('image-object');
        if (width) {
            img.width = width;
        }
        if (height) {
            img.height = height;
        }
        const fallback = document.createElement('img');
        fallback.src = fallBackSrc;
        fallback.alt = fallBackAlt || '';
        img.append(fallback);
    }
    return img;
}

function createRemoveConfirmModal() {
    const removeConfirmModal = `
        <div class="modal confirm-remove-favorite-modal hidden">
            <div class="modal-header">
            <h3 class="modal-title">Delete Favorite</h3>
            </div>
            <div class="modal-body">
                <p>Are you sure you want to remove this pet from your favorites?</p>
                <div class="modal-action-btns">
                    <button class="cancel">Cancel</button>
                    <button class="confirm">Remove Pet</button>
                </div>
            </div>
        </div>
        <div class="overlay"></div>
    `;

    return removeConfirmModal;
}

async function bindAccountFavoritesEvents(block, token, favList) {
    const viewMoreBtn = block.querySelector('.favorites-list #view-more-btn');
    const removeBtns = block.querySelectorAll('button.remove-fav');

    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', () => {
            let currentHiddenCards = block.querySelectorAll('.fav-pet-card.fp-hidden');
            currentHiddenCards.forEach((card, index) => {
                if (index < 5) {
                    card.classList.remove('fp-hidden');
                }
            });
            currentHiddenCards = block.querySelectorAll('.fav-pet-card.fp-hidden');

            if (currentHiddenCards.length < 1) {
                viewMoreBtn.classList.add('hidden');
            }
        });
    }

    removeBtns.forEach((button, index) => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();
            isLoggedIn().then((isLoggedInParam) => {
                if (isLoggedInParam) {
                    if (favList[index].Animal.IsAvailable) {
                        openRemoveConfirmModal(extractName(favList[index].Animal.Name), button.closest('.fav-pet-card'), favList[index].Id, token, button);
                    } else {
                        removeFavoritePet(favList[index].Id, token, button);
                    }
                } else {
                    logout();
                }
            });
        });
    });
}

function getFavorites(animalData) {
    fetch(`${endPoints.apiUrl}/adopt/api/Favorite`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${animalData}`,
        },
    }).then((response) => response.json()).then(async (data) => {
        // build favorites list
        data.forEach((favorite) => {
            arrFavList.push(favorite);
        });

        arrFavList.sort(orderByAvailability);

        const elFavList = document.querySelector('.favorites-list');

        if (arrFavList.length > 0) {
            let builtHtml = '';

            arrFavList.forEach((favorited, index) => {
                const { Animal } = favorited;

                const {
                    Breed,
                    City,
                    ClientId,
                    Id,
                    ImageUrl,
                    IsAvailable,
                    Name,
                    PostalCode,
                    ReferenceNumber,
                    Sex,
                    Species,
                    ShelterName,
                    State,
                    Street,
                } = Animal;

                const favPetCard = {};
                const fallBackImg = getMetadata('animal-card-image-fall-back');

                let petDetailPageUrl = '';
                if (Species !== null && ReferenceNumber !== null && ClientId !== null) {
                    petDetailPageUrl = `/pet-adoption/${Species.toLowerCase()}s/${ReferenceNumber}/${ClientId}`;
                } else {
                    petDetailPageUrl = null;
                }

                favPetCard.availability = IsAvailable;
                favPetCard.card = `
                <div class="fav-pet-card ${IsAvailable ? '' : 'unavailable'} ${ImageUrl !== '' ? '' : 'no-image'} ${index > 4 ? 'fp-hidden' : ''}">
                    <div class="fp-img" data-rum-source=".fav-pet-card  .fp-img">
                    ${createImageObject(ImageUrl, fallBackImg, '').outerHTML}
                    </div>
                    <div class="fp-info" data-rum-source=".fav-pet-card .fp-info">
                        <div class="fp-info-header">
                            <div>
                                <p class="fp-name"><a class="${petDetailPageUrl ? '' : 'prevent-click'} ${IsAvailable ? '' : 'prevent-click'}" href="${petDetailPageUrl || ''}">${Name ? extractName(Name) : Id}</a> <span class="unavailable-tag">No Longer available</span></p>
                                <p class="fp-details">${Breed || ''} ${Breed && Sex ? '<span class="fp-separator"></span>' : ''} ${Sex || ''}</p>
                            </div>
                            <button class="remove-fav" data-rum-source=".fav-pet-card  .remove-fav">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M4.5 19.5L19.5 4.5" stroke="#6E6D73" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M4.5 4.5L19.5 19.5" stroke="#6E6D73" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>
                        <div>
                            <p class="fp-shelter">${ShelterName || ''}</p>
                            <p class="fp-shelter-address">${Street || ''}</p>
                            <p class="fp-shelter-address">${City || ''}, ${State || ''} ${PostalCode || ''}</p>
                        </div>
                    </div>
                </div>
                `;

                builtHtml += favPetCard.card;
            });

            elFavList.innerHTML = builtHtml;

            if (arrFavList.length > 5) {
                const viewMoreBtn = document.createElement('button');
                viewMoreBtn.innerHTML = 'View More';
                viewMoreBtn.setAttribute('id', 'view-more-btn');
                viewMoreBtn.classList.add('secondary');
                elFavList.append(viewMoreBtn);
            }
        } else {
            elFavList.innerHTML = emptyFavList;
        }

        await bindAccountFavoritesEvents(elFavList, animalData, arrFavList);
    })
    .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Error:', error);
        const elFavList = document.querySelector('.favorites-list');

        elFavList.innerHTML = emptyFavList;
    });
}

export async function createAccountFavoritesPanel(animalData) {
    const panelDiv = document.createElement('div');
    panelDiv.className = 'tab-panel-inner';
    panelDiv.innerHTML = `
        <h3>Favorites</h3>
        <div class="favorites-list"></div>
    `;
    getFavorites(animalData);

    panelDiv.innerHTML += createRemoveConfirmModal();

    return panelDiv;
}
