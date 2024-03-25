/* eslint-disable indent */
import { fetchPlaceholders, getMetadata } from '../../scripts/lib-franklin.js';
import { ImageCarousel } from './image-carousel.js';
import {
  getRandomItems,
  extractName,
  formatPhoneNumber,
} from '../../templates/adopt/adopt.js';
import endPoints from '../../variables/endpoints.js';
import { buildPetCard } from '../../scripts/adoption/buildPetCard.js';
import { setFavorite } from '../../scripts/adoption/favorite.js';
import { acquireToken, isLoggedIn } from '../../scripts/lib/msal/msal-authentication.js';

/* const placeholders = await fetchPlaceholders('/pet-adoption');
const {
  inquiryNotificationTitle,
  inquiryNotificationText,
  inquiryNotificationPrimaryCtaLabel,
  inquiryNotificationSecondaryCtaLabel,
} = placeholders; */

function isEmptyObject(obj) {
  return typeof obj === 'object' && Object.keys(obj).length === 0;
}
function formatAnimalData(apiData) {
  const { imageURL, ppRequired, animalDetail } = apiData;
  const {
    AnimalId: animalId,
    ClientId: clientId,
    'Animal Type': animalType,
    'Pet Name': petName,
    'Primary Breed': primaryBreed,
    'Secondary Breed': secondaryBreed,
    Age: age,
    Gender: gender,
    'Size Category': size,
    Description: description,
    'Shelter Name': shelterName,
    'Phone Number': shelterPhone,
    'Pet Location': petLocation,
    'Pet Location Address': petLocationAddress,
    'Shelter Address': shelterAddress,
    City: city,
    State: state,
    Zip: zip,
    Email: email,
  } = ppRequired ? ppRequired[0] : {};

  const {
    'Located At': locatedAt,
    Age: ageDescription,
    'More Info': moreInfo,
    'Data Updated': dataUpdated,
  } = animalDetail ? animalDetail[0] : {};

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
    dataUpdated,
  };
  return formattedData;
}
async function formatSimilarPetData(apiData) {
  if (apiData && apiData.length > 4) {
    const { animalId } = await getParametersFromUrl();
    let animalArray = [];
    apiData.forEach((pet) => {
      if (pet.animalId !== animalId) {
        animalArray.push(pet);
      }
    })
    return getRandomItems(animalArray, 4);
  }
  return apiData;
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
        <span class='checklist-item-label-index'>${index}</span>
        <span class='checklist-item-label-text'>${label}</span>
        `;
    checklistItemContainer.append(checklistItemLabelEl);
  }
  if (text) {
    const textArr = text.split(',');
    const textList = document.createElement('ul');
    textArr.forEach((str) => {
      const listItem = document.createElement('li');
      listItem.textContent = str;
      textList.append(listItem);
    });
    checklistItemContainer.append(textList);
  }
  return checklistItemContainer;
}
async function getParametersFromUrl() {
  const { pathname } = window.location;
  const pathArr = pathname.split('/');
  const pagePathString = getMetadata('pet-profile-page-paths') || '/pet-adoption/dogs/,/pet-adoption/cats/,/pet-adoption/others/';
  const pagePaths = pagePathString.split(',');
  if (pagePaths.some((el) => pathname.startsWith(el)) && pathArr.length >= 4) {
    const [animalId, clientId] = pathname.endsWith('/')
      ? pathArr.slice(pathArr.length - 3, pathArr.length - 1)
      : pathArr.slice(-2);
    return { animalId, clientId };
  }
  return {};
}
async function fetchAnimalData(animalApi) {
  let result = {};
  try {
    const resp = await fetch(animalApi);
    if (resp.ok) {
      const json = await resp.json();
      result = formatAnimalData(json);
    }
  } catch (error) {
    // console.error('Error:', error);
  }
  return result;
}
async function fetchSimilarPets(zip, animalType, animalListApi) {
  const payload = {
    locationInformation: {
      clientId: null,
      zipPostal: zip,
      milesRadius: 25,
    },
    animalFilters: {
      startIndex: 0,
      numResults: 100,
      filterAnimalType: animalType,
    },
  };
  let result = [];
  try {
    const resp = await fetch(animalListApi, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (resp.ok) {
      const json = await resp.json();
      result = await formatSimilarPetData(json.animal);
    }
  } catch (error) {
    // console.error('Error:', error);
  }
  return result;
}

async function createCarouselSection(petName, images) {
  const imageArr = images;
  const sectionContainer = document.createElement('div');
  if (imageArr.length < 2) {
    sectionContainer.className = 'image-section';
    const imageDiv = document.createElement('div');
    imageDiv.className = 'image-div';
    imageDiv.innerHTML = '<div></div>';
    imageDiv.firstElementChild.append(
      createImageObject(
        imageArr[0] || '',
        getMetadata('carousel-image-fall-back'),
        null,
        700,
        575,
      ),
    );
    sectionContainer.append(imageDiv);
  } else {
    sectionContainer.className = imageArr.length === 2 ? 'carousel-section two-slides' : 'carousel-section';
    if (imageArr.length === 2) {
      const imageDiv = document.createElement('div');
      imageDiv.className = 'image-div';
      imageArr.forEach((image) => {
        const imageBlock = document.createElement('div');
        imageBlock.className = 'image-div';
        imageBlock.innerHTML = '<div></div>';
        imageBlock.firstElementChild.append(
          createImageObject(
            image || '',
            getMetadata('carousel-image-fall-back'),
            null,
            700,
            575,
          ),
        );
        imageDiv.append(imageBlock);
      });
      sectionContainer.append(imageDiv);
    }

    const carouselDiv = document.createElement('div');
    carouselDiv.className = 'carousel-div';
    let slidesHtml = '';
    let navigationHtml = '';
    imageArr.forEach((image, index) => {
      slidesHtml += `
            <div class='image-carousel-slide' data-slide-index=${index} role='group' aria-label=${`slide ${index}`}>
                <div class='image-carousel-slide-inner'>
                    <div class='image-carousel-slide-image'>
                        ${
                          createImageObject(
                            image || '',
                            getMetadata('carousel-image-fall-back'),
                            null,
                            700,
                            575,
                          ).outerHTML
                        }
                    </div>
                </div>
            </div>`;
    });
    imageArr.forEach((image, index) => {
      navigationHtml += `
            <button aria-disabled=${
              index === 0 ? 'true' : 'false'
            } class='image-carousel-navigator' data-slide-to-index=${index}>
                <span class='sr-only'>Show slide ${index + 1} of ${
        imageArr.length
      }</span>
            </button>
            `;
    });
    carouselDiv.innerHTML = `
        <div role='region' aria-roledescription='carousel' aria-label='Pet images' class='image-carousel'>
            <div class='image-carousel-controls-container' role='group' aria-label='Slide controls'>
                <div class='image-carousel-controls'>
                    <button aria-label='Previous slide' class='image-carousel-previous'></button>
                    ${navigationHtml}
                    <button aria-label='Next slide' class='image-carousel-next'></button>
                </div>
            </div>
            <div class='image-carousel-layout-container'>
                <div class='image-carousel-slider-container'>
                    <div class='image-carousel-slider'>
                        ${slidesHtml}
                    </div>
                </div>
            </div>
        </div>
        `;
    sectionContainer.append(carouselDiv);
  }
  return sectionContainer;
}
async function createAboutPetSection(aboutPet) {
  const {
    petName,
    animalId,
    primaryBreed,
    secondaryBreed,
    city,
    state,
    age,
    gender,
    size,
    // email,
    description,
    locatedAt,
    ageDescription,
    moreInfo,
    dataUpdated,
  } = aboutPet;
  const aboutPetContainer = document.createElement('div');
  aboutPetContainer.className = 'about-pet-container';
  aboutPetContainer.innerHTML = `
    <div class='about-pet-header'>
        <h1 class='about-pet-title'>${petName || animalId}</h1>
        <div class='about-pet-subtitle'>
            <div class='about-pet-subtitle-inner'>
                ${
                  primaryBreed || secondaryBreed
                    ? `
                    <span class='about-pet-breed'>
                        ${primaryBreed || ''}${
                        primaryBreed && secondaryBreed ? '/' : ''
                      }${secondaryBreed || ''}
                    </span>`
                    : '<span>Breed N/A</span>'
                }
                ${
                  city || state
                    ? `
                    <span class='about-pet-location'>
                        ${city || 'City N/A'}, ${state || 'State N/A'}
                    </span>`
                    : '<span>Location N/A</span>'
                }
            </div>
        </div>
        <div class='about-pet-details'>
            <div class='about-pet-details-inner'>
                ${
                  age
                    ? `<span class='about-pet-age'>${age}</span>`
                    : '<span>Age N/A</span>'
                }
                ${
                  gender
                    ? `<span class='about-pet-gender'>${gender}</span>`
                    : '<span>Gender N/A</span>'
                }
                ${
                  size
                    ? `<span class='about-pet-size'>${size}</span>`
                    : '<span>Size N/A</span>'
                }
                ${
                  animalId
                    ? `<span class='about-pet-id'>Animal ID: ${animalId}</span>`
                    : ''
                }
            </div>
        </div>
        <div class='about-pet-ctas'>
            <button class='about-pet-favorite pet-details-button secondary' id='${animalId}'>
                <span class='pet-details-button-icon-favorite'></span>
                Favorite
            </button>
        </div>
    </div>
    <div class='about-pet-body'>
        ${petName ? `<h3>About ${petName}</h3>` : '<h3>Description</h3>'}
        ${
          description
            ? `<div>${description}</div>`
            : '<div>Description N/A</div>'
        }
        ${locatedAt ? `<div>Located At: ${locatedAt}</div>` : ''}
        ${ageDescription ? `<div>Age: ${ageDescription}</div>` : ''}
        ${moreInfo ? `<div>More Info: ${moreInfo}</div>` : ''}
        ${dataUpdated ? `<div>Data Updated: ${dataUpdated}</div>` : ''}
    </div>
    `;
  return aboutPetContainer;
}
async function createShelterSection(aboutShelter) {
  const {
 shelterName, shelterAddress, shelterPhone, city, state, zip,
} = aboutShelter;
  const lastAddressLine = city && state && zip ? `${city}, ${state} ${zip}` : '';
  const shelterContainer = document.createElement('div');
  shelterContainer.className = 'shelter-container';
  shelterContainer.innerHTML = `
        <h2 class='shelter-name'>${shelterName || 'Shelter Name N/A'}</h2>
        ${
          city || state
            ? `<div class='shelter-location'>
           <span>${city || ''}${city && state ? ', ' : ''}${
                state || ''
              }</span></div>`
            : ''
        }
        <div class='shelter-address'>${
          shelterName && shelterAddress && lastAddressLine
            ? `
            <a href='https://maps.google.com/?q=${
              shelterAddress + lastAddressLine
            }'><span>${shelterName}</br>${shelterAddress}</br>${lastAddressLine}</span></a>
        `
            : 'Shelter Location N/A'
        }</div>
        <div class='shelter-phone'>${
          shelterPhone
            ? `<a href='tel:${shelterPhone}'><span>${shelterPhone}</span></a>`
            : 'Phone Number N/A'
        }</div>
    `;
  return shelterContainer;
}
async function createChecklistSection(inquiryStatus) {
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
    checklistItem3Text,
  } = placeholders;

  if (checklistLabel) {
    const checklistLabelEl = document.createElement('h2');
    checklistLabelEl.textContent = checklistLabel;
    checklistContainer.append(checklistLabelEl);
  }
  // disabling the survey flow from view until survey is ready for launch
  
  if (inquiryStatus === true) {
    if (checklistItem1Label) {
        checklistContainer.append(createChecklistItem(1, checklistItem1Label, checklistItem1Text));
        checklistContainer.append(createCta('', 'Start Pet Match Survey', 'pet-details-button button primary right-arrow', true));
    }
  }

  if (checklistItem2Label) {
    let itemContent = null;

    if (inquiryStatus === 'true') {
      itemContent = createChecklistItem(2, checklistItem2Label, checklistItem2Text);
    } else {
      itemContent = createChecklistItem(1, checklistItem2Label, checklistItem2Text);
    }

    checklistContainer.append(itemContent);
  }

  if (checklistItem3Label) {
    let itemContent = null;

    if (inquiryStatus === 'true') {
      itemContent = createChecklistItem(3, checklistItem3Label, checklistItem3Text);
    } else {
      itemContent = createChecklistItem(2, checklistItem3Label, checklistItem3Text);
    }

    checklistContainer.append(itemContent);
  }

  checklistContainer.append(
    createCta(
      '/pet-adoption/checklist',
      'View Full Checklist',
      'pet-details-button button primary right-arrow',
      false,
    ),
  );
  return checklistContainer;
}
async function createSimilarPetsSection(sectionTitle, petArr) {
  const listSection = document.createElement('div');
  listSection.className = 'list-section';
  const similarPetsContainer = document.createElement('div');
  similarPetsContainer.className = 'similar-pets-container';
  const title = document.createElement('h2');
  title.className = 'similar-pets-title';
  title.textContent = sectionTitle;
  similarPetsContainer.append(title);
  if (petArr && petArr.length > 0) {
    const galleryWrapper = document.createElement('div');
    galleryWrapper.className = 'similar-pets-gallery-wrapper';
    const gallery = document.createElement('div');
    gallery.className = 'similar-pets-gallery';
    petArr.forEach((pet) => {
      gallery.append(
        buildPetCard(pet, getMetadata('animal-card-image-fall-back')),
      );
    });
    galleryWrapper.appendChild(gallery);
    similarPetsContainer.append(galleryWrapper);
  } else {
    const noResults = document.createElement('div');
    noResults.className = 'similar-pets-no-results';
    noResults.textContent = 'There are no other similar pets available.';
    similarPetsContainer.append(noResults);
  }
  listSection.append(similarPetsContainer);
  return listSection;
}

/* async function buildShowModal() {
  // build and show success modal
  let modal = document.getElementById('inquiry-notification-modal');
  const petDetailsBlock = document.querySelector('.pet-details');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'inquiry-notification-modal';
    modal.className = 'inquiry-modal';
  } else {
    modal.innerHTML = '';
  }

  // create success icon
  const successIcon = document.createElement('div');
  successIcon.className = 'success-icon';
  successIcon.innerHTML = `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M0 32C0 14.3269 14.3269 0 32 0C49.6731 0 64 14.3269 64 32C64 49.6731 49.6731 64 32 64C14.3269 64 0 49.6731 0 32Z" fill="#EDFCF2"/>
  <path d="M47 16.9987L26.8773 45.744C26.6118 46.1255 26.2595 46.4384 25.8493 46.6571C25.4391 46.8757 24.9829 46.9937 24.5181 47.0014C24.0534 47.009 23.5935 46.9062 23.1763 46.7012C22.7591 46.4963 22.3966 46.1952 22.1187 45.8227L17 38.9987" stroke="#1A6132" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  const modalTitle = document.createElement('h3');
  modalTitle.innerText = inquiryNotificationTitle;
  modalTitle.className = 'modal-title';

  const modalSubtitle = document.createElement('div');
  modalSubtitle.innerText = inquiryNotificationText;
  modalSubtitle.className = 'modal-content';

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'button-container';

  const primaryButton = document.createElement('button');
  primaryButton.className = 'modal-cta-button button secondary';
  primaryButton.innerText = inquiryNotificationPrimaryCtaLabel;
  primaryButton.addEventListener('click', () => {
    window.location.href = '/pet-adoption/search';
  });

  const secondaryButton = document.createElement('button');
  secondaryButton.className = 'pet-details-button modal-cta-button button primary';
  secondaryButton.innerText = inquiryNotificationSecondaryCtaLabel;
  secondaryButton.addEventListener('click', () => {
    window.location.href = '/pet-adoption/checklist';
  });

  buttonContainer.append(primaryButton);
  buttonContainer.append(secondaryButton);

  modal.append(successIcon);
  modal.append(modalTitle);
  modal.append(modalSubtitle);
  modal.append(buttonContainer);
  petDetailsBlock.append(modal);

  // build overlay
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  petDetailsBlock.append(overlay);

  openModal();
}

function openModal() {
  const modal = document.querySelector('#inquiry-notification-modal');
  modal.classList.add('show');
  const overlay = document.querySelector('.overlay');
  overlay.classList.add('show');
}

function closeModal() {
  const modal = document.querySelector('#inquiry-notification-modal');
  modal.classList.remove('show');
  const overlay = document.querySelector('.overlay');
  overlay.classList.remove('show');
} */

function getSurveyStatus(token, animalType) {
  const surveyAnimalType = animalType === 'Dog' ? 1 : 2; // 1 for Dog, 2 for Cat

  return fetch(
    `${endPoints.apiUrl}/adopt/api/SurveyResponse/survey/${surveyAnimalType}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  )
    .then((response) => response.json())
    .then((data) => data);
}

export default async function decorate(block) {
  block.textContent = '';
  const token = null;
  const { animalId, clientId } = await getParametersFromUrl();
  if (animalId && clientId) {
    const baseUrl = endPoints.apiUrl;
    const animalApi = `${baseUrl}/animal/${animalId}/client/${clientId}`;
    const petListApi = `${baseUrl}/animal/`;
    const petData = await fetchAnimalData(animalApi);
    const similarPetsArr = await fetchSimilarPets(
      petData.zip,
      petData.animalType,
      petListApi,
    );
    // Create carousel section
    block.append(
      await createCarouselSection(
        petData.petName || '',
        petData?.imageUrl || [],
      ),
    );

    // Create containing div of 'about-pet', 'shelter', and 'checklist' sections
    const layoutContainer = document.createElement('div');
    layoutContainer.className = 'contents-section';

    layoutContainer.append(await createAboutPetSection(petData));
    layoutContainer.append(await createShelterSection(petData));
    block.append(layoutContainer);

    block.append(
      await createSimilarPetsSection('Similar Pets', similarPetsArr),
    );
    ImageCarousel.init({
      selectors: {
        self: '.image-carousel',
        sliderEl: '.image-carousel-slider',
        slideEl: '.image-carousel-slide',
        sliderPrev: 'button.image-carousel-previous',
        sliderNext: 'button.image-carousel-next',
        sliderNavigator: 'button.image-carousel-navigator',
        activeNavigator:
          "button.image-carousel-navigator[aria-disabled='false']",
      },
    });

    // add inquiry functionality
    const petCtaContaner = document.querySelector('.about-pet-ctas');
    petCtaContaner.innerHTML += '<button class=\'submit-inquiry-button button secondary\'>Submit An Inquiry</button>';
    const submitInquiryCta = document.querySelector('.submit-inquiry-button');

    if (petData.animalType === 'Dog' || petData.animalType === 'Cat') {
      if (petData.email !== null) {
        // if email is available, append createChecklistSection WITH survey content
        submitInquiryCta?.classList.add('visible');
        layoutContainer.append(await createChecklistSection(true));
        const checklistContainer = document.querySelector('.checklist-container');
        checklistContainer.classList.add('visible');

        submitInquiryCta?.addEventListener('click', () => {
          // if user is logged in, check if survey is completed
          if (token) {
            // check if survey is completed
            const surveyStatus = getSurveyStatus(token, petData.animalType);
            let surveyStatusCompleted = null;

            surveyStatus.then((data) => {
              surveyStatusCompleted = data.Completed;
            });

            // if survey IS NOT COMPLETED, set path to survey
            if (!surveyStatusCompleted) {
              window.location.href = `/pet-adoption/survey?animalId=${animalId}&clientId=${clientId}&animalType=${petData.animalType.toLowerCase()}`;
            } else {
              // if survey IS COMPLETED, set path to survey summary page aka inquiry confirmation
              window.location.href = `/pet-adoption/survey?animalId=${animalId}&clientId=${clientId}&animalType=${petData.animalType.toLowerCase()}`;
            }
          } else {
            // if user is NOT logged in, set path to survey
            window.location.href = `/pet-adoption/survey?animalId=${animalId}&clientId=${clientId}&animalType=${petData.animalType.toLowerCase()}`;
          }
        });
      } else {
        // if email is not available, append createChecklistSection W/OUT survey content
        layoutContainer.append(await createChecklistSection(false));
        const checklistContainer = document.querySelector('.checklist-container');
        checklistContainer.classList.add('visible');
      }
    } else {
      // if animal type isn't Dog/Cat, expand contents section to full width
      layoutContainer.classList.add('contents-section--no-inquiry');
    }

     // add favorite functionality
     const favoriteCta = document.getElementById(animalId);
     favoriteCta.addEventListener('click', (e) => { setFavorite(e, petData); });
  }

  function getFavorites(response) {
    fetch(`${endPoints.apiUrl}/adopt/api/Favorite`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${response}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // favorite Pet in the UI
        data.forEach((favorite) => {
          const favoriteButton = document.getElementById(
            favorite?.Animal.ReferenceNumber,
          );
          favoriteButton?.classList.add('favorited');
          favoriteButton?.setAttribute('data-favorite-id', favorite?.Id);
        });
      })
      .catch((error) => {
        // console.error('Error:', error);
      });
  }

  // check if user is logged in
  isLoggedIn().then((isLoggedIn) => {
     if (isLoggedIn) {
         // if logged in set pet as favorite
         acquireToken()
         .then((response) => {
             getFavorites(response);
         })
         .catch((error) => {
             // console.error('Error:', error);
         });
     } else {
       // not logged in or token is expired without ability to silently refresh its validity
     }
   });
}
