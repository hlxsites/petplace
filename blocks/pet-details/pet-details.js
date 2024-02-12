/* eslint-disable indent */
import { fetchPlaceholders, createOptimizedPicture } from '../../scripts/lib-franklin.js';

async function getParametersFromUrl() {
    const { pathname } = window.location;
    const [clientId, animalId] = pathname.split('/').splice(pathname.endsWith('/') ? -2 : -1, 2);
    //return {clientId, animalId}
    console.log(clientId, animalId)
    return {clientId: 'PP1008', animalId: '40596030'}
}
async function fetchAnimalData(clientId, animalId) {
    const animalApi = `https://api-stg-petplace.azure-api.net/animal/${animalId}/client/${clientId}`
    const resp = await fetch(animalApi);
    if (resp.ok) {
        const json = await resp.json();
        console.log('api data: ', json)
        return json;
    } else {
        return null;
    }
}
function getPetDetailData(apiData) {
    const { imageURL, animalDetail, clientDetail } = apiData;
    const {
        AnimalId,
        name: petName,
        Age: age, 
        ['Age Description']: ageDescription,
        ['Animal Type']: animalType,
        ['Data Updated']: dataUpdated,
        Description: description,
        Gender: gender,
        ['More Info']: moreInfo,
        ['Primary Breed']: primaryBreed,
        ['Secondary Breed']: secondaryBreed,
        Size: size
    } = animalDetail[0];
    const {
        Address: address,
        Street: street,
        City: city,
        State: state,
        Zip: zip,
        Location: shelterName,
        ['Phone Number']: shelterPhone
    } = clientDetail[0];

    const formattedData = {
        imageUrl: imageURL || [],
        animalId: AnimalId,
        petName: petName || 'Name',
        animalType,
        age,
        gender,
        breed: primaryBreed || secondaryBreed || '',
        size,
        description,
        ageDescription,
        moreInfo,
        dataUpdated,
        address,
        street,
        city,
        state,
        zip,
        shelterName,
        shelterPhone
    }
    return formattedData
}
async function getSimilarPets(payLoad){

}
async function createCarouselSection(name, imageArr){
    const carouselContainer = document.createElement('div');
    carouselContainer.className = 'carousel-container';
    if(imageArr.length <= 1 ) {
        const imageContainer = document.createElement('div');
        imageContainer.className = 'image-div';
        imageContainer.innerHTML = `
            <img src=${imageArr[0] || "https://24petconnect.com/Content/Images/No_pic_t.jpg"} alt=${imageArr[0] ? name : "no image available"} />
            `;
        carouselContainer.append(imageContainer);
    } else {

    }

    return carouselContainer;
}
async function createAboutPetSection(aboutPet){
    const {petName, animalId, breed, city, state, age, gender, size, shelterName, description, ageDescription, moreInfo, dataUpdated} = aboutPet
    const aboutPetContainer = document.createElement('div');
    aboutPetContainer.className = 'about-pet-container';
    aboutPetContainer.innerHTML = `
    <div class="about-pet-header">
        <h1 class="about-pet-title">${petName}</h1>
        <div class="about-pet-subtitle">
            <span class="about-pet-breed">${breed}</span>
            <span class="dot dot-large"></span>
            <span class="about-pet-location">${city}, ${state}</span>
        </div>
        <div class="about-pet-details">
            <span class="about-pet-age">${age}</span>
            <span class="dot dot-medium"></span>
            <span class="about-pet-gender">${gender}</span>
            <span class="dot dot-medium"></span>
            <span class="about-pet-size">${size}</span>
            <span class="dot dot-medium"></span>
            <span class="about-pet-id">Animal ID: ${animalId}</span>
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
        <h3>About ${petName}</h3>
        ${shelterName && `<p>Located At: ${shelterName}</p>`}
        ${description && `<p>Description: ${description}</p>`}
        ${ageDescription && `<p>Age: ${ageDescription}</p>`}
        ${moreInfo && `<p>More Info: ${moreInfo}</p>`}
        ${dataUpdated && `<p>Data Updated: ${dataUpdated}</p>`}
    </div>
    `
    return aboutPetContainer;
}
async function createShelterSection(aboutShelter){
    const {shelterName, city, state, address, shelterPhone} = aboutShelter
    const shelterContainer = document.createElement('div');
    shelterContainer.className = 'shelter-container';
    shelterContainer.innerHTML = `
    <h2 class="shelter-name">${shelterName}</h2>
    <div class="shelter-location">${city}, ${state}</div>
    <div class="shelter-address">
        <a href="https://maps.google.com/?q=${htmlToString(address)}">${address}</a>
    </div>
    <div class="shelter-phone">
        <a href="tel:${shelterPhone}">${shelterPhone}</a>
    </div>
    `
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
    const {petName, gender, breed, city, state, image, animalId, clientId} = petData
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
        <h3 class="pet-card-name"><a href="/adopt/pet/${clientId}/${animalId}" class="stretched-link">${petName}</a></h3>
        <div class="pet-card-info">
            <span class="pet-card-gender">${gender}</span>
            <span class="dot"></span>
            <span class="pet-card-breed">${breed}</span>
        </div>
        <div class="pet-card-address">
            ${city}, ${state}
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
    const apiData = await fetchAnimalData(clientId, animalId);
    const petData = getPetDetailData(apiData);
    console.log(petData)
    const {
        imageUrl,
        petName,
        animalType,
        age,
        gender,
        breed,
        size,
        description,
        ageDescription,
        moreInfo,
        dataUpdated,
        address,
        street,
        city,
        state,
        zip,
        shelterName,
        shelterPhone
    } = petData

    block.textContent = '';
    block.append(await createCarouselSection('', imageUrl));

    // Create containing div of 'about-pet', 'shelter', and 'checklist' sections
    const layoutContainer = document.createElement('div');
    layoutContainer.className = 'layout-container';
    layoutContainer.append(await createAboutPetSection({petName, animalId, breed, city, state, age, gender, size, shelterName, description, ageDescription, moreInfo, dataUpdated}));
    layoutContainer.append(await createShelterSection({shelterName, city, state, address, shelterPhone}));
    layoutContainer.append(await createChecklistSection());
    block.append(layoutContainer);

    block.append(await createSimilarPetsSection('Similar Pets', [
        {
            name: 'Thaddeus Bumblefoot',
            gender: 'Male',
            breed: 'Cocker Spaniel',
            city: 'Golden Valley',
            state: 'MN',
            image: '/article/cats/pet-care/media_1eb856c86ea16a14c8740deab5ba5258a6bf02eaa.png',
            animalId: '',
            clientId: ''
        },
        {
            name: 'Thaddeus Bumblefoot',
            gender: 'Male',
            breed: 'Cocker Spaniel',
            city: 'Golden Valley',
            state: 'MN',
            image: '/article/cats/pet-care/media_1eb856c86ea16a14c8740deab5ba5258a6bf02eaa.png',
            animalId: '',
            clientId: ''
        },
        {
            name: 'Thaddeus Bumblefoot',
            gender: 'Male',
            breed: 'Cocker Spaniel',
            city: 'Golden Valley',
            state: 'MN',
            image: '/article/cats/pet-care/media_1eb856c86ea16a14c8740deab5ba5258a6bf02eaa.png',
            animalId: '',
            clientId: ''
        },
        {
            name: 'Thaddeus Bumblefoot',
            gender: 'Male',
            breed: 'Cocker Spaniel',
            city: 'Golden Valley',
            state: 'MN',
            image: '/article/cats/pet-care/media_1eb856c86ea16a14c8740deab5ba5258a6bf02eaa.png',
            animalId: '',
            clientId: ''
        }
    ]));
}