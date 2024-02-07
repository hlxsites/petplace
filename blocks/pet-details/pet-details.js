/* eslint-disable indent */
import { fetchPlaceholders } from '../../scripts/lib-franklin.js';

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
        checklistContainer.appendChild(checklistLabelEl)
    }
    if (checklistItem1Label) {
        checklistContainer.appendChild(createChecklistItem(1, checklistItem1Label, checklistItem1Text));
        checklistContainer.appendChild(createCta('', 'Start Pet Match Survey', 'button primary', true));
    }
    if (checklistItem2Label) {
        checklistContainer.appendChild(createChecklistItem(2, checklistItem2Label, checklistItem2Text));
    }
    if (checklistItem3Label) {
        checklistContainer.appendChild(createChecklistItem(3, checklistItem3Label, checklistItem3Text));
    }
    checklistContainer.appendChild(createCta('', 'View Full Checklist', 'button primary', true));
    return checklistContainer;
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
function createChecklistItem (index, label, text) {
    const checklistItemContainer = document.createElement('div');
    checklistItemContainer.className = 'checklist-item';
    if (label) {
        const checklistItemLabelEl = document.createElement('h3');
        checklistItemLabelEl.className = 'checklist-item-label';
        checklistItemLabelEl.innerHTML = `
        <span class="checklist-item-label-index">${index}</span>
        <span class="checklist-item-label-text">${label}</span>
        `;
        checklistItemContainer.appendChild(checklistItemLabelEl);
    }
    if (text) {
        const textArr = text.split(',')
        const textList = document.createElement('ul');
        textArr.forEach(str => {
            const listItem = document.createElement('li');
            listItem.textContent = str;
            textList.appendChild(listItem);
        })
        checklistItemContainer.appendChild(textList);
    }
    return checklistItemContainer;
}
async function createSimilarPetsSection(){
    const similarPetsContainer = document.createElement('div');
    similarPetsContainer.className = 'similar-pets-container';
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
    block.appendChild(layoutContainer)

}