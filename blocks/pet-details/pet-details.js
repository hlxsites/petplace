/* eslint-disable indent */
import { fetchPlaceholders, createOptimizedPicture } from '../../scripts/lib-franklin.js';
import { ImageCarousel } from './image-carousel.js';

async function getParametersFromUrl() {
    const { pathname } = window.location;
    const [clientId, animalId] = pathname.split('/').splice(pathname.endsWith('/') ? -2 : -1, 2);
    //return {clientId, animalId}
    return {clientId: 'PP1008', animalId: '40596030'}
}
async function fetchAnimalData(clientId, animalId) {
    const animalApi = `https://api-stg-petplace.azure-api.net/animal/${animalId}/client/${clientId}`;
    try {
        const resp = await fetch(animalApi);
        if(resp.ok) {
            const json = await resp.json();
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
    const { imageURL, ppRequired } = apiData;
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
        Zip: zip
    } = ppRequired ? ppRequired[0] : {};

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
        city,
        state,
        zip,
        shelterName,
        shelterPhone
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

async function createCarouselSection(name, images){
    const imageArr = [
        'https://www.petplace.com/article/breed/media_18690a7f17637edc779b59ac94cd3303b3c46d597.jpeg',
        'https://www.petplace.com/article/dogs/just-for-fun/media_12c574158c76b42b855fdb1b3c983a546ccf22637.jpeg',
        'https://www.petplace.com/media_1d9f7b0e1110611b194d15f3f414400d61f753114.png'
    ]
    const carouselContainer = document.createElement('div');
    carouselContainer.className = 'carousel-container';
    if(imageArr.length <= 1 ) {
        const imageContainer = document.createElement('div');
        imageContainer.className = 'image-div';
        imageContainer.innerHTML = `
            <img src=${imageArr[0] || 'https://24petconnect.com/Content/Images/No_pic_t.jpg'} alt=${imageArr[0] ? name : 'no image available'} />
            `;
        carouselContainer.append(imageContainer);
    } else {
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
            <button aria-disabled=${index === 0 ? "true": "false"} class=${index === 0 ? `image-carousel-navigator active` : "image-carousel-navigator"} data-slide-to-index=${index}>
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
            <div class="image-carousel-slider-layout">
                <div class="image-carousel-slider-container">
                    <div class="image-carousel-slider">
                        ${slidesHtml}
                    </div>
                </div>
            </div>
        </div>
        `
        carouselContainer.append(carouselDiv);
    }

    return carouselContainer;
}
async function createAboutPetSection(aboutPet){
    const {petName, animalId, primaryBreed, secondaryBreed, city, state, age, gender, size, shelterName, description, ageDescription, moreInfo, dataUpdated} = aboutPet
    const aboutPetContainer = document.createElement('div');
    aboutPetContainer.className = 'about-pet-container';
    aboutPetContainer.innerHTML = `
    <div class="about-pet-header">
        <h1 class="about-pet-title">${petName || animalId}</h1>
        <div class="about-pet-subtitle">
            <div class="about-pet-subtitle-inner">
                ${(primaryBreed || secondaryBreed) ? `<span class="about-pet-breed">${primaryBreed && secondaryBreed ? primaryBreed + '/' + secondaryBreed : primaryBreed ? primaryBreed : secondaryBreed}</span>` : ''}
                ${(city || state) ? `<span class="about-pet-location">${city && state ? city + ', ' + state : city ? city : state}</span>` : ''}
            </div>
        </div>
        <div class="about-pet-details">
            <div class="about-pet-details-inner">
                ${age ? `<span class="about-pet-age">${age}</span>`: ''}
                ${gender ? `<span class="about-pet-gender">${gender}</span>` :''}
                ${size ? `<span class="about-pet-size">${size}</span>` : ''}
                ${animalId ? `<span class="about-pet-id">Animal ID: ${animalId}</span>` : ''}
            </div>
        </div>
        <div class="about-pet-ctas">
            <button class="about-pet-favorite pet-details-button secondary">
                <span class="pet-details-button-icon-favorite"></span>
                Favorite
            </button>
            <button class="about-pet-inquiry pet-details-button primary">
                Submit An Inquiry
            </button>
        </div>
    </div>
    <div class="about-pet-body">
        <h3>About ${petName || animalId}</h3>
        ${shelterName ? `<p>Located At: ${shelterName}</p>` : ''}
        ${description ? `<p>Description: ${description}</p>` : ''}
        ${ageDescription ? `<p>Age: ${ageDescription}</p>` : ''}
        ${moreInfo ? `<p>More Info: ${moreInfo}</p>` : ''}
        ${dataUpdated ? `<p>Data Updated: ${dataUpdated}</p>` :''}
    </div>
    `;
    return aboutPetContainer;
}
async function createShelterSection(aboutShelter) {
    const {shelterName, city, state, petLocationAddress, shelterPhone} = aboutShelter
    const shelterContainer = document.createElement('div');
    shelterContainer.className = 'shelter-container';
    shelterContainer.innerHTML = `
        <h2 class="shelter-name">${shelterName || 'Shelter Information'}</h2>
        ${(city || state) ? `<div class="shelter-location">
            <span>${city && state ? city + ', ' + state : city ? city : state}</span></div>` : ''
        }
        ${ petLocationAddress ? `<div class="shelter-address">
            <a href="https://maps.google.com/?q=${htmlToString(petLocationAddress)}">${shelterName ? `${shelterName}</br>${petLocationAddress}`: petLocationAddress}</a></div>` : ''
        }
        ${shelterPhone ? `<div class="shelter-phone"><a href="tel:${shelterPhone}">${shelterPhone}</a></div>`: ''}
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

    return similarPetsContainer;
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
    const {
        imageUrl,
        petName,
        animalType,
        age,
        gender,
        primaryBreed,
        secondaryBreed,
        size,
        description,
        ageDescription,
        moreInfo,
        dataUpdated,
        shelterAddress,
        petLocationAddress,
        city,
        state,
        zip,
        shelterName,
        shelterPhone
    } = petData

    const similarPetsArr = await fetchSimilarPets(zip, animalType)

    block.textContent = '';
    block.append(await createCarouselSection('', imageUrl || []));


    // Create containing div of 'about-pet', 'shelter', and 'checklist' sections
    const layoutContainer = document.createElement('div');
    layoutContainer.className = 'layout-container';
    layoutContainer.append(await createAboutPetSection({petName, animalId, primaryBreed, secondaryBreed, city, state, age, gender, size, shelterName, description, ageDescription, moreInfo, dataUpdated}));
    layoutContainer.append(await createShelterSection({shelterName, city, state, petLocationAddress, shelterPhone}));
    layoutContainer.append(await createChecklistSection());
    block.append(layoutContainer);

    block.append(await createSimilarPetsSection('Similar Pets', similarPetsArr));
    ImageCarousel.init({selectors: {
        self: '.image-carousel',
        sliderEl: '.image-carousel-slider',
        slideEl: '.image-carousel-slide',
        sliderPrev: 'button.image-carousel-previous',
        sliderNext: 'button.image-carousel-next',
        slideNavigator: 'button.image-carousel-navigator'
    }});
}