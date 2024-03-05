/* eslint-disable indent */
import { getMetadata } from '../../scripts/lib-franklin.js';
import endPoints from '../../variables/endpoints.js';
import { extractName } from '../../templates/adopt/adopt.js';

const arrFavList = [];

function orderByAvailability(a, b) {
    if (a.availability && !b.availability) {
        return -1;
    }
    if (!a.availability && b.availability) {
        return 1;
    }
    return 0;
}

function getFavorites(animalData) {
    fetch(`${endPoints.apiUrl}/adopt/api/Favorite`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${animalData}`,
        }
    }).then((response) => response.json()).then((data) => {
        // build favorites list
        data.forEach((favorite) => {
            arrFavList.push(favorite);
        });

        const elFavList = document.querySelector('.favorites-list');

        if (arrFavList.length > 0) {
            let builtHtml = '';
            const favPetCardList = [];

            arrFavList.forEach((favorited) => {
                const favPetCard = {};
                const fallBackImg = getMetadata('animal-card-image-fall-back');
                // const petName = favorited.Animal.Name.toUpperCase()
                //     + favorited.Animal.Name.slice(1);
                console.log('favorited', favorited);

                //Ask EVG to add AnimalType to the Animal object
                // const petDetailPageUrl = `/pet-adoption/${favorited.AnimalType.toLowerCase()}s/${favorited.Animal.ReferenceNumber}/${favorited.Animal.ClientId}`;
                const petDetailPageUrl = `/pet-adoption/cats/${favorited.Animal.ReferenceNumber}/${favorited.Animal.ClientId}`;
                favPetCard.availability = favorited.Animal.IsAvailable;
                favPetCard.card = `
                <div class="fav-pet-card ${favorited.Animal.IsAvailable ? '' : 'unavailable'} ${favorited.Animal.ImageUrl !== '' ? '' : 'no-image'}">
                    <div class="fp-img">
                        <img src="${favorited.Animal.ImageUrl !== '' ? favorited.Animal.ImageUrl : fallBackImg}" />
                    </div>
                    <div class="fp-info">
                        <div class="fp-info-header">
                            <div>
                                <p class="fp-name"><a class="fp-url" href="${petDetailPageUrl}">${favorited.Animal.Name ? extractName(favorited.Animal.Name) : favorited.Animal.Id}</a> <span class="unavailable-tag">No Longer available</span></p>
                                <p class="fp-details">${favorited.Animal.Breed ? favorited.Animal.Breed : ''} ${favorited.Animal.Breed && favorited.Animal.Sex ? '<span class="fp-separator"></span>' : ''} ${favorited.Animal.Sex ? favorited.Animal.Sex : ''}</p>
                            </div>
                            <button class="remove-fav">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M4.5 19.5L19.5 4.5" stroke="#6E6D73" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M4.5 4.5L19.5 19.5" stroke="#6E6D73" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>
                        <div>
                            <p class="fp-shelter">${favorited.Animal.ShelterName ? favorited.Animal.ShelterName : ''}</p>
                            <p class="fp-shelter-address">${favorited.Animal.Street ? favorited.Animal.Street : ''}</p>
                            <p class="fp-shelter-address">${favorited.Animal.City + ', ' + favorited.Animal.State + ' ' + favorited.Animal.PostalCode}</p>
                        </div>
                    </div>
                </div>
                `;

                favPetCardList.push(favPetCard);
            });

            favPetCardList.sort(orderByAvailability);

            favPetCardList.forEach((petCard) => {
                builtHtml += petCard.card;
            });

            elFavList.innerHTML = builtHtml;

            if (arrFavList.length > 5) {
                const showMoreBtn = document.createElement('button');
                showMoreBtn.innerHTML = 'View More';
                showMoreBtn.classList.add('view-more-btn','secondary');
                document.querySelector('.favorites-list').append(showMoreBtn);
            }
        } else {
            const emptyFavList = `
            <div class='account-layout-container no-fav-pets'>
                You don’t currently have any favorited pets.
            </div>
            <div class="new-search-btn-wrapper">
                <a href="/pet-adoption/search" class='account-button account-button--new-search' id='new-search'>
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
            elFavList.innerHTML = emptyFavList;
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

export async function createAccountFavoritesPanel(animalData) {
    const panelDiv = document.createElement('div');
    panelDiv.className = 'tab-pannel-inner';
    panelDiv.innerHTML = `
        <h3>Favorites</h3>
        <div class="favorites-list"></div>
    `;

    getFavorites(animalData);

    return panelDiv;
}
