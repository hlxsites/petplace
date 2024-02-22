/* eslint-disable indent */
import { fetchPlaceholders, getMetadata } from '../../scripts/lib-franklin.js';
import { ImageCarousel } from './image-carousel.js';
import { getRandomItems, extractName, formatPhoneNumber } from '../../templates/adopt/adopt.js';

async function getParametersFromUrl() {
    const { pathname } = window.location;
    const pathArr = pathname.split('/')
    const [animalId, clientId] = pathname.endsWith('/') ? pathArr.slice(pathArr.length - 3, pathArr.length - 1): pathArr.slice(-2);
    console.log(animalId, clientId)
    //return {clientId, animalId}
    return {animalId: '40596030', clientId: 'PP1008'};
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
            console.log(json.animal)
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
        petName: extractName(petName),
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
        shelterPhone: formatPhoneNumber(shelterPhone),
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
        const imageArr = images;
    // example images for testing carousel
    // const imageArr = [
    //     'https://www.petplace.com/article/breed/media_18690a7f17637edc779b59ac94cd3303b3c46d597.jpeg',
    //     'https://www.petplace.com/article/dogs/just-for-fun/media_12c574158c76b42b855fdb1b3c983a546ccf22637.jpeg',
    //     'https://www.petplace.com/article/dogs/pet-care/media_1d7035030f35833989f5b2f765eeb04c3c3539c07.jpeg',
    //     'https://www.petplace.com/article/dogs/pet-care/media_13cb8037aa8ff514c96d9a08ced9d7773409c2947.jpeg'
    // ]

    if(imageArr.length < 2 ) {
        const imageSectionContainer = document.createElement('div');
        imageSectionContainer.className = 'image-section';
        const imageDiv = document.createElement('div');
        imageDiv.className = 'image-div';
        imageDiv.innerHTML = '<div></div>';
        imageDiv.firstElementChild.append(createImageObject(imageArr[0] ||'', getMetadata('carousel-image-fall-back'), null, 700, 575));
        imageSectionContainer.append(imageDiv);
        return imageSectionContainer;
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
            gallery.append(createPetCard(pet, getMetadata('animal-card-image-fall-back')));
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
function createPetCard(petData, fallBackImage) {
    const {Name: petName, ['Animal type']: animalType, Gender: gender, Breed: breed, City: city, State: state, coverImagePath, animalId, clientId} = petData
    const petDetailPageUrl = `/pet-adoption/${animalType}/${animalId}/${clientId}`
    const petCard = document.createElement('div');
    petCard.className = 'pet-card';
    const pictureContainer = document.createElement('div');
    pictureContainer.className = 'pet-card-image';
    pictureContainer.append(createImageObject(coverImagePath, fallBackImage, null, 300, 246))
    const cardBody = document.createElement('div');
    cardBody.className = 'pet-card-body';
    cardBody.innerHTML = `
        <h3 class="pet-card-name"><a href=${petDetailPageUrl} class="stretched-link">${petName ? extractName(petName) : animalId}</a></h3>
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
    buttonContainer.className = 'like-button-conainer';
    buttonContainer.innerHTML = `
    <button class="like-button" aria-label="Like">
        <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.3 4.55114C22.8314 3.63452 22.154 2.84083 21.3223 2.2341C20.4906 1.62736 19.528 1.22455 18.5121 1.05815C17.4962 0.891748 16.4554 0.966411 15.4736 1.27612C14.4918 1.58583 13.5966 2.12191 12.86 2.84114L12 3.62114L11.17 2.86114C10.4344 2.13135 9.53545 1.58739 8.54766 1.27436C7.55987 0.961323 6.51169 0.888233 5.49002 1.06114C4.47076 1.21761 3.50388 1.61617 2.67044 2.22341C1.837 2.83066 1.16131 3.62888 0.700017 4.55114C0.0805959 5.76129 -0.13608 7.13766 0.0815777 8.47958C0.299236 9.82151 0.939848 11.0588 1.91002 12.0111L11.28 21.6711C11.3733 21.7679 11.4851 21.8449 11.6088 21.8975C11.7326 21.9501 11.8656 21.9772 12 21.9772C12.1344 21.9772 12.2675 21.9501 12.3912 21.8975C12.5149 21.8449 12.6267 21.7679 12.72 21.6711L22.08 12.0311C23.0535 11.0768 23.6968 9.8366 23.9163 8.49115C24.1357 7.1457 23.9198 5.76533 23.3 4.55114ZM20.66 10.6211L12.36 19.1711C12.2634 19.2651 12.1347 19.3187 12 19.3211C11.8657 19.3168 11.7377 19.2634 11.64 19.1711L3.33002 10.6111C2.66352 9.95404 2.22228 9.10271 2.06957 8.1793C1.91687 7.25589 2.06055 6.30784 2.48002 5.47114C2.80009 4.82822 3.26939 4.27124 3.84871 3.84675C4.42803 3.42227 5.10053 3.14261 5.81002 3.03114C6.53132 2.91042 7.27107 2.96456 7.96711 3.18903C8.66315 3.41351 9.29515 3.80175 9.81002 4.32114L11.34 5.71114C11.5238 5.87698 11.7625 5.96878 12.01 5.96878C12.2575 5.96878 12.4963 5.87698 12.68 5.71114L14.24 4.29114C14.7573 3.77638 15.3905 3.39328 16.0866 3.17402C16.7826 2.95477 17.5211 2.90577 18.24 3.03114C18.9406 3.15001 19.603 3.43308 20.1731 3.85719C20.7432 4.28129 21.2048 4.83436 21.52 5.47114C21.9391 6.31036 22.0815 7.26072 21.927 8.18592C21.7725 9.11112 21.329 9.96362 20.66 10.6211Z" fill="#464646"/>
        </svg>
    </button>
    `
    petCard.append(pictureContainer, cardBody, buttonContainer);
    return petCard;
}

function createImageObject(imagePath, fallBackSrc, fallBackAlt, width, height) {
    const img = document.createElement('object');
    img.data = imagePath;
    img.type = "image/jpg";
    if(width) {
        img.width = width;
    }
    if(height) {
        img.height = height;
    }
    const fallback = document.createElement('img');
    fallback.src = fallBackSrc;
    fallback.alt = fallBackAlt || '';
    img.append(fallback);
    return img;
}
export default async function decorate(block) {
    const {clientId, animalId} = await getParametersFromUrl();
    const petData = await fetchAnimalData(clientId, animalId);
    const similarPetsArr = await fetchSimilarPets(petData.zip, petData.animalType)

    block.textContent = '';

    //Create carousel section
    block.append(await createCarouselSection(petData.petName || '', petData?.imageUrl || []));

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