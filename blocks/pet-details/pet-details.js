/* eslint-disable indent */
import { fetchPlaceholders, createOptimizedPicture } from '../../scripts/lib-franklin.js';

async function getParametersFromUrl() {
    const { pathname } = window.location;
    const [clientId, animalId] = pathname.split('/').splice(pathname.endsWith('/') ? -2 : -1, 2);
    return {clientId, animalId}
}
async function getPetDetail(clientId, animalId) {

}
async function getSimilarPets(clientId, animalId){

}
async function createCarouselSection(){
    const carouselContainer = document.createElement('div');
    carouselContainer.className = 'carousel-container';
    return carouselContainer;
}
async function createAboutPetSection(){
    const aboutPetContainer = document.createElement('div');
    aboutPetContainer.className = 'about-pet-container';
}
async function createShelterSection(shelterInfo){
    const shelterContainer = document.createElement('div');
    shelterContainer.className = 'shelter-container';

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
        checklistContainer.append(createCta('', 'Start Pet Match Survey', 'button primary', true));
    }
    if (checklistItem2Label) {
        checklistContainer.append(createChecklistItem(2, checklistItem2Label, checklistItem2Text));
    }
    if (checklistItem3Label) {
        checklistContainer.append(createChecklistItem(3, checklistItem3Label, checklistItem3Text));
    }
    checklistContainer.append(createCta('', 'View Full Checklist', 'button primary', true));
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
            <span class="pet-card-separator"></span>
            <span class="pet-card-breed">${breed}</span>
        </div>
        <div class="pet-card-address">
            ${city}, ${state}
        </div>
    `;
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'pet-card-button-conainer';
    buttonContainer.innerHTML = `
    <button class="pet-card-favorite"><span>Favorite</span></button>
    `
    petCard.append(pictureContainer, cardBody, buttonContainer);
    return petCard;
}
export default async function decorate(block) {
    console.log(await getParametersFromUrl());
    const {clientId, animalId} = await getParametersFromUrl();

    block.textContent = '';
    block.append(await createCarouselSection());

    // Create containing div of 'about-pet', 'shelter', and 'checklist' sections
    const layoutContainer = document.createElement('div');
    layoutContainer.className = 'layout-container';
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