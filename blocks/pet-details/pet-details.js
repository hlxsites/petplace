/* eslint-disable indent */
import { fetchPlaceholders, createOptimizedPicture } from '../../scripts/lib-franklin.js';

async function getParametersFromUrl() {
    const { pathname } = window.location;
    const [clientId, animalId] = pathname.split('/').splice(pathname.endsWith('/') ? -2 : -1, 2);
    //return {clientId, animalId}
    return {clientId: 'PP1008', animalId: '40596030'}
}
async function fetchAnimalData(clientId, animalId) {
    const animalApi = `https://api-stg-petplace.azure-api.net/animal/${animalId}/client/${clientId}`
    const resp = await fetch(animalApi);
    if (resp.ok) {
        const json = await resp.json();
        console.log(json)
        return json;
    } else {
        return null;
    }
}
async function getSimilarPets(clientId, animalId){

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
async function createAboutPetSection({name, animalId, clientId, breed, secBreed, city, state, age, gender, size, locatedAt, description, ageDescription, moreInfo, dataUpdated}){

    const aboutPetContainer = document.createElement('div');
    aboutPetContainer.className = 'about-pet-container';
    aboutPetContainer.innerHTML = `
    <div class="about-pet-header">
        <h1 class="about-pet-title">${name}</h1>
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
        <h3>About ${name}</h3>
        ${locatedAt && `<p>Located At: ${locatedAt}</p>`}
        ${description && `<p>Description: ${description}</p>`}
        ${ageDescription && `<p>Age: ${ageDescription}</p>`}
        ${moreInfo && `<p>More Info: ${moreInfo}</p>`}
        ${dataUpdated && `<p>Data Updated: ${dataUpdated}</p>`}
    </div>

    
    `
    return aboutPetContainer;
}
async function createShelterSection({name, city, state, address, phoneNumber}){
    const shelterContainer = document.createElement('div');
    shelterContainer.className = 'shelter-container';
    shelterContainer.innerHTML = `
    <h2 class="shelter-name">${name}</h2>
    <div class="shelter-location">${city}, ${state}</div>
    <div class="shelter-address">
        <a href="https://maps.google.com/?q=${htmlToString(address)}">${address}</a>
    </div>
    <div class="shelter-phone">
        <a href="tel:${phoneNumber}">${phoneNumber}</a>
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
function createPetCard({name, gender, breed, city, state, image, animalId, clientId}) {
    const petCard = document.createElement('div');
    petCard.className = 'pet-card';
    const pictureContainer = document.createElement('div');
    pictureContainer.className = 'pet-card-image';
    pictureContainer.append(createOptimizedPicture(image, name, false, [
        { media: '(min-width: 1024px)', width: 300 },
        { width: 250 },
    ]));
    const cardBody = document.createElement('div');
    cardBody.className = 'pet-card-body';
    cardBody.innerHTML = `
        <h3 class="pet-card-name"><a href="/adopt/pet/${clientId}/${animalId}" class="stretched-link">${name}</a></h3>
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
    const petData = await fetchAnimalData(clientId, animalId);
    const {
        Age: age, 
        ['Age Description']: ageDescription,
        ['Animal Type']: animalType,
        ['Data Updated']: dataUpdated,
        Description: description,
        Gender: gender,
        ['Located At']: locatedAt,
        ['More Info']: moreInfo,
        ['Primary Breed']: primaryBreed,
        ['Secondary Breed']: secondaryBreed,
        Size: size
    } = petData.animalDetail[0];

    const {
        Address: address,
        City: city,
        State: state,
        Location: clientName,
        ['Phone Number']: clientPhone,
        Street: street,
        Website: clientWebsite,
        Zip: zip,
        adoptMeState,
        clientEmail
    } = petData.clientDetail[0];

    block.textContent = '';
    block.append(await createCarouselSection('', petData.imageURL));

    // Create containing div of 'about-pet', 'shelter', and 'checklist' sections
    const layoutContainer = document.createElement('div');
    layoutContainer.className = 'layout-container';
    layoutContainer.append(await createAboutPetSection({
        name: 'Dakota', 
        animalId: '40596030', 
        clientId: '40596030',
        breed: 'American Staffordshire Terrier', 
        secBreed: 'Crossbreed', 
        city: 'Watertown', 
        state: 'WI', 
        age: 'Adult', 
        gender: 'Male', 
        size: 'Large', 
        locatedAt: 'Watertown Humane Society', 
        description: 'My name is Dakota.<br >I am a male, black American Staffordshire Terrier mix.', 
        ageDescription: 'The shelter staff think I am about 5 years old.', 
        moreInfo: 'I have been at the shelter since Aug 23, 2022.', 
        dataUpdated: 'This information was refreshed 100 days ago.'
    }))
    layoutContainer.append(await createShelterSection(
        {
            name: 'Watertown Humane Society',
            city: 'Watertown',
            state: 'WI',
            address: '418 Water Tower Court  <br/>Watertown, WI 53094',
            phoneNumber: '9202611270'
        }
    ))
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