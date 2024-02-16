/* eslint-disable indent */
import { fetchPlaceholders, createOptimizedPicture } from '../../scripts/lib-franklin.js';
import { ImageCarousel } from './image-carousel.js';

async function getParametersFromUrl() {
    const { pathname } = window.location;
    const [animalId, clientId] = pathname.split('/').splice(pathname.endsWith('/') ? -2 : -1, 2);
    //return {clientId, animalId}
    return {animalId: '40596030', clientId: 'PP1008'}
}
async function fetchAnimalData(clientId, animalId) {
    const animalApi = `https://api-stg-petplace.azure-api.net/animal/${animalId}/client/${clientId}`;
    try {
        const resp = await fetch(animalApi);
        if(resp.ok) {
            const json = await resp.json();
            console.log('api data', json)
            return formatAnimalData(json);
        } else {
            return {};
        }
    } catch (error) {
        console.error('Error:', error);
    }

}
async function fetchSimilarPets(zip, animalType) {
    const animalApi = 'https://api-stg-petplace.azure-api.net/animal/';
    const payload = {
        locationInformation: {
          clientId: null,
          zipPostal: zip, 
          milesRadius: 25
        },
        animalFilters: {
          startIndex: 0,
          numResults: 100,
          filterAnimalType: animalType 
        }
    }
    try {
        const resp = await fetch(animalApi, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        if(resp.ok) {
            const json = await resp.json();
            return formatSimilarPetData(json.animal)
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
function formatAnimalData(apiData) {
    const { imageURL, ppRequired, animalDetail } = apiData;
    const {
        AnimalId: animalId,
        ClientId: clientId,
        ['Animal Type']: animalType,
        ['Pet Name']: petName,
        ['Primary Breed']: primaryBreed,
        ['Secondary Breed']: secondaryBreed,
        Age: age, 
        Gender: gender,
        ['Size Category']: size,
        Description: description,
        ['Shelter Name']: shelterName,
        ['Phone Number']: shelterPhone,
        ['Pet Location']: petLocation,
        ['Pet Location Address']: petLocationAddress,
        ['Shelter Address']: shelterAddress,
        City: city,
        State: state,
        Zip: zip,
        Email: email
    } = ppRequired ? ppRequired[0] : {};

    const {
        ['Located At']: locatedAt,
        Age: ageDescription,
        ['More Info']: moreInfo,
        ['Data Updated']: dataUpdated
    } = animalDetail ? animalDetail[0] : {}


    const formattedData = {
        imageUrl: imageURL || [],
        animalId,
        clientId,
        animalType,
        petName,
        age,
        gender,
        primaryBreed,
        secondaryBreed,
        size,
        description,
        petLocation,
        petLocationAddress,
        shelterAddress,
        shelterName,
        shelterPhone,
        city,
        state,
        zip,
        email,
        locatedAt,
        ageDescription,
        moreInfo,
        dataUpdated
    }
    console.log('formatted animal data', formattedData)
    return formattedData
}
function formatSimilarPetData(apiData) {
    if(apiData && apiData.length > 4) {
        const filteredData = apiData.filter(animal => animal && typeof animal.coverImagePath === 'string');
        if (filteredData.length > 4) {
            const size = 4;
            let randomNumbers = new Set();
            let indexArr;
            while (randomNumbers.size < size) {
                randomNumbers.add(Math.floor(Math.random() * filteredData.length));
            }
            indexArr = [...randomNumbers];
            return filteredData.filter((data, index) => indexArr.includes(index));
        } else {
            return filteredData;
        }
    } else {
        return apiData;
    }
}

async function createCarouselSection(petName, images){
    // const imageArr = [
    //     'https://www.petplace.com/article/breed/media_18690a7f17637edc779b59ac94cd3303b3c46d597.jpeg',
    //     'https://www.petplace.com/article/dogs/just-for-fun/media_12c574158c76b42b855fdb1b3c983a546ccf22637.jpeg',
    //     'https://www.petplace.com/article/drug-library/drug-library/library/media_1f51af83c0034c69ffa46deb71514a1574a44a9a3.png',
    //     'https://www.petplace.com/article/dogs/pet-behavior-training/media_14291138c30db350c8f97c5fa84a387124ee9eb61.jpeg',
    //     'https://www.petplace.com/article/cats/just-for-fun/media_119b46f6ce6a55a154c58cd58f79020ac4b1cdff2.jpeg'
    // ]
    const imageArr = [
        'https://www.petplace.com/article/breed/media_18690a7f17637edc779b59ac94cd3303b3c46d597.jpeg',
        'https://www.petplace.com/article/dogs/just-for-fun/media_12c574158c76b42b855fdb1b3c983a546ccf22637.jpeg'
    ]

    if(imageArr.length < 2 ) {
        const imageSectionContainer = document.createElement('div');
        imageSectionContainer.className = 'image-section';
        const imageDiv = document.createElement('div');
        imageDiv.className = 'image-div';
        imageDiv.innerHTML = `<div><img src=${imageArr.length === 0 ? "/images/pet_profile_placeholder.png" : imageArr[0]} alt=${ imageArr.length === 0 ? "no image available" : petName } /><div>`;
        imageSectionContainer.append(imageDiv);
        return imageSectionContainer
    } else {
        const carouselSectionContainer = document.createElement('div');
        carouselSectionContainer.className = imageArr.length === 2 ? 'carousel-section two-slides' : 'carousel-section';
        if(imageArr.length === 2) {
            const imageDiv = document.createElement('div');
            imageDiv.className = 'image-div';
            imageDiv.innerHTML = `
                <div><img src=${imageArr[0]} alt=${petName} /></div>
                <div><img src=${imageArr[1]} alt=${petName} /></div>
                `;
            carouselSectionContainer.append(imageDiv);
        }

        const carouselDiv = document.createElement('div');
        carouselDiv.className = 'carousel-div';
        let slidesHtml = ''
        let navigationHtml = ''
        imageArr.forEach((image, index) => {
            slidesHtml += `
            <div class="image-carousel-slide" data-slide-index=${index} role="group" aria-label=${"slide" + index}>
                <div class="image-carousel-slide-inner">
                    <div class="image-carousel-slide-image">
                        <img src=${image} alt="image description text">
                    </div>
                </div>
            </div>`
        })
        imageArr.forEach((image, index) => {
            navigationHtml += `
            <button aria-disabled=${index === 0 ? "true": "false"} class="image-carousel-navigator" data-slide-to-index=${index}>
                <span class="sr-only">Show slide ${index + 1} of ${imageArr.length}</span>
            </button>
            `
        })
        carouselDiv.innerHTML = `
        <div role="region" aria-roledescription="carousel" aria-label="Pet images" class="image-carousel">
            <div class="image-carousel-controls-container" role="group" aria-label="Slide controls">
                <div class="image-carousel-controls">
                    <button aria-label="Previous slide" class="image-carousel-previous"></button>
                    ${navigationHtml}
                    <button aria-label="Next slide" class="image-carousel-next"></button>
                </div>
            </div>
            <div class="image-carousel-layout-container">
                <div class="image-carousel-slider-container">
                    <div class="image-carousel-slider">
                        ${slidesHtml}
                    </div>
                </div>
            </div>
        </div>
        `
        carouselSectionContainer.append(carouselDiv);
        return carouselSectionContainer;
    }


}
async function createAboutPetSection(aboutPet){
    const {petName, animalId, primaryBreed, secondaryBreed, city, state, age, gender, size, email, description, locatedAt, ageDescription, moreInfo, dataUpdated} = aboutPet
    const aboutPetContainer = document.createElement('div');
    aboutPetContainer.className = 'about-pet-container';
    aboutPetContainer.innerHTML = `
    <div class="about-pet-header">
        <h1 class="about-pet-title">${petName || animalId}</h1>
        <div class="about-pet-subtitle">
            <div class="about-pet-subtitle-inner">
                ${(primaryBreed || secondaryBreed) ? `
                    <span class="about-pet-breed">${primaryBreed && secondaryBreed ? primaryBreed + '/' + secondaryBreed : primaryBreed ? primaryBreed : secondaryBreed}</span>` 
                    : 'Breed N/A'}
                ${(city || state) ? `<span class="about-pet-location">${city && state ? city + ', ' + state : city ? city + ', State N/A' : 'City N/A, ' + state}</span>` : 'Location N/A'}
            </div>
        </div>
        <div class="about-pet-details">
            <div class="about-pet-details-inner">
                ${age ? `<span class="about-pet-age">${age}</span>`: 'Age N/A'}
                ${gender ? `<span class="about-pet-gender">${gender}</span>` :'Gender N/A'}
                ${size ? `<span class="about-pet-size">${size}</span>` : 'Size N/A'}
                ${animalId ? `<span class="about-pet-id">Animal ID: ${animalId}</span>` : ''}
            </div>
        </div>
        <div class="about-pet-ctas">
            <button class="about-pet-favorite pet-details-button secondary">
                <span class="pet-details-button-icon-favorite"></span>
                Favorite
            </button>
            ${ email ? `<button class="about-pet-inquiry pet-details-button primary">
                Submit An Inquiry
            </button>` : ''}
        </div>
    </div>
    <div class="about-pet-body">
        ${petName ? `<h3>About ${petName}</h3>`: `<h3>Description</h3>`}
        ${description ? `<div>${description}</div>` : ''}
        ${locatedAt ? `<div>Located At: ${locatedAt}</div>` : ''}
        ${ageDescription ? `<div>Age: ${ageDescription}</div>` : ''}
        ${moreInfo ? `<div>More Info: ${moreInfo}</div>` : ''}
        ${dataUpdated ? `<div>Data Updated: ${dataUpdated}</div>` :''}
    </div>
    `;
    return aboutPetContainer;
}
async function createShelterSection(aboutShelter) {
    const {shelterName, shelterAddress, shelterPhone, city, state, zip} = aboutShelter
    const lastAddressLine = city && state && zip ? `${city}, ${state} ${zip}` : '';
    const shelterContainer = document.createElement('div');
    shelterContainer.className = 'shelter-container';
    shelterContainer.innerHTML = `
        <h2 class="shelter-name">${shelterName || 'Shelter Name N/A'}</h2>
        ${(city || state) ? `<div class="shelter-location">
            <span>${city && state ? city + ', ' + state : city ? city : state}</span></div>` : ''
        }
        <div class="shelter-address">${shelterName && shelterAddress && lastAddressLine ? `
            <a href="https://maps.google.com/?q=${shelterAddress + lastAddressLine}"><span>${shelterName}</br>${shelterAddress}</br>${lastAddressLine}</span></a>
        `: `Shelter Location N/A`}</div>
        <div class="shelter-phone">${shelterPhone ? `<a href="tel:${shelterPhone}"><span>${shelterPhone}</span></a>`: `Phone Number N/A`}</div>
    `;
    return shelterContainer
}
async function createChecklistSection() {
    const checklistContainer = document.createElement('div');
    checklistContainer.className = 'checklist-container';
    // fetch placeholders from the 'adopt' folder
    const placeholders = await fetchPlaceholders('/adopt');
    // retrieve the value for key 'Checklist Label'
    const { 
        checklistLabel,
        checklistItem1Label,
        checklistItem1Text,
        checklistItem2Label,
        checklistItem2Text,
        checklistItem3Label,
        checklistItem3Text
    } = placeholders;
    if (checklistLabel) {
        const checklistLabelEl = document.createElement('h2');
        checklistLabelEl.textContent = checklistLabel;
        checklistContainer.append(checklistLabelEl)
    }
    if (checklistItem1Label) {
        checklistContainer.append(createChecklistItem(1, checklistItem1Label, checklistItem1Text));
        checklistContainer.append(createCta('', 'Start Pet Match Survey', 'pet-details-button button primary', true));
    }
    if (checklistItem2Label) {
        checklistContainer.append(createChecklistItem(2, checklistItem2Label, checklistItem2Text));
    }
    if (checklistItem3Label) {
        checklistContainer.append(createChecklistItem(3, checklistItem3Label, checklistItem3Text));
    }
    checklistContainer.append(createCta('', 'View Full Checklist', 'pet-details-button button primary', true));
    return checklistContainer;
}
async function createSimilarPetsSection(sectionTitle, petArr){
    const listSection = document.createElement('div');
    listSection.className = 'list-section';
    const similarPetsContainer = document.createElement('div');
    similarPetsContainer.className = 'similar-pets-container';
    const title = document.createElement('h2');
    title.className = 'similar-pets-title';
    title.textContent = sectionTitle;
    similarPetsContainer.append(title);
    if(petArr && petArr.length > 0 ) {
        const galleryWrapper = document.createElement('div');
        galleryWrapper.className = 'similar-pets-gallery-wrapper';
        const gallery = document.createElement('div');
        gallery.className = 'similar-pets-gallery';
        petArr.forEach(pet => {
            gallery.append(createPetCard(pet));
        })
        galleryWrapper.appendChild(gallery)
        similarPetsContainer.append(galleryWrapper);
    } else {
        const noResults = document.createElement('div');
        noResults.className = 'similar-pets-no-results';
        noResults.textContent = 'There are no other similar pets available.';
        similarPetsContainer.append(noResults);
    }
    listSection.append(similarPetsContainer)
    return listSection;
}
function createCta(url, text, className, openNew) {
    const cta = document.createElement('a');
    cta.textContent = text;
    if (className) {
        cta.className = className;
    }
    cta.setAttribute('href', url);
    if (openNew) {
        cta.setAttribute('target', '_blank');
    }
    return cta;
}
function createChecklistItem(index, label, text) {
    const checklistItemContainer = document.createElement('div');
    checklistItemContainer.className = 'checklist-item';
    if (label) {
        const checklistItemLabelEl = document.createElement('h3');
        checklistItemLabelEl.className = 'checklist-item-label';
        checklistItemLabelEl.innerHTML = `
        <span class="checklist-item-label-index">${index}</span>
        <span class="checklist-item-label-text">${label}</span>
        `;
        checklistItemContainer.append(checklistItemLabelEl);
    }
    if (text) {
        const textArr = text.split(',')
        const textList = document.createElement('ul');
        textArr.forEach(str => {
            const listItem = document.createElement('li');
            listItem.textContent = str;
            textList.append(listItem);
        })
        checklistItemContainer.append(textList);
    }
    return checklistItemContainer;
}
function createPetCard(petData) {
    const {Name: petName, ['Animal type']: animalType, Gender: gender, Breed: breed, City: city, State: state, coverImagePath: image, animalId, clientId} = petData
    const petDetailPageUrl = `/pet-adoption/${animalType}/${animalId}/${clientId}`
    const petCard = document.createElement('div');
    petCard.className = 'pet-card';
    const pictureContainer = document.createElement('div');
    pictureContainer.className = 'pet-card-image';
    pictureContainer.append(createOptimizedPicture(image, petName, false, [
        { media: '(min-width: 1024px)', width: 300 },
        { width: 250 },
    ]));
    const cardBody = document.createElement('div');
    cardBody.className = 'pet-card-body';
    cardBody.innerHTML = `
        <h3 class="pet-card-name"><a href=${petDetailPageUrl} class="stretched-link">${petName}</a></h3>
        <div class="pet-card-info">
            ${gender ? `<span class="pet-card-gender">${gender}</span>` : ''}
            ${gender && breed ? `<span class="pet-card-dot"></span>`: ''}
            ${breed ? `<span class="pet-card-breed">${breed}</span>` :''}
        </div>
        <div class="pet-card-address">
            ${city || state ? city && state ? city + ', ' + state : city ? city : state : ''}
        </div>
    `;
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'pet-card-button-conainer';
    buttonContainer.innerHTML = `
    <button class="pet-card-favorite">
        <span class="pet-card-favorite-icon"></span>
        <span class="sr-only">Favorite</span>
    </button>
    `
    petCard.append(pictureContainer, cardBody, buttonContainer);
    return petCard;
}
function htmlToString(html) {
    const tempDivElement = document.createElement("div");
    tempDivElement.innerHTML = html;
    return tempDivElement.textContent || tempDivElement.innerText || "";
}
export default async function decorate(block) {
    const {clientId, animalId} = await getParametersFromUrl();
    const petData = await fetchAnimalData(clientId, animalId);
    const similarPetsArr = await fetchSimilarPets(petData.zip, petData.animalType)

    block.textContent = '';

    //Create carousel section
    block.append(await createCarouselSection('', petData?.imageUrl || []));

    // Create containing div of 'about-pet', 'shelter', and 'checklist' sections
    const layoutContainer = document.createElement('div');
    layoutContainer.className = 'contents-section';

    layoutContainer.append(await createAboutPetSection(petData));
    layoutContainer.append(await createShelterSection(petData));
    layoutContainer.append(await createChecklistSection());
    block.append(layoutContainer);

    block.append(await createSimilarPetsSection('Similar Pets', similarPetsArr));
    ImageCarousel.init({
        selectors: {
            self: '.image-carousel',
            sliderEl: '.image-carousel-slider',
            slideEl: '.image-carousel-slide',
            sliderPrev: 'button.image-carousel-previous',
            sliderNext: 'button.image-carousel-next',
            sliderNavigator: 'button.image-carousel-navigator',
            activeNavigator: 'button.image-carousel-navigator[aria-disabled="false"]'
        }
    });
}