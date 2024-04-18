import { getMetadata } from '../lib-franklin.js';
import { extractName } from '../../templates/adopt/adopt.js';
// eslint-disable-next-line
import { setFavorite } from './favorite.js';

export function buildPetCard(animal) {
  const {
    Name: petName,
    'Animal type': animalType,
    Gender: gender,
    Breed: breed,
    City: city,
    State: state,
    coverImagePath,
    animalId,
    clientId,
  } = animal;

  function isEmptyObject(obj) {
    return typeof obj === 'object' && Object.keys(obj).length === 0;
  }

  function createImageObject(imagePath, fallBackAlt) {
    const fallBack = getMetadata('animal-card-image-fall-back');
    let img;
    if (!imagePath || isEmptyObject(imagePath)) {
      img = document.createElement('img');
      img.src = fallBack;
      img.alt = fallBackAlt || '';
    } else {
      img = document.createElement('object');
      img.data = imagePath;
      img.type = 'image/jpg';
      const fallback = document.createElement('img');
      fallback.src = fallBack;
      fallback.alt = fallBackAlt || '';
      img.append(fallback);
    }
    return img;
  }

  const petDetailPageUrl = `/pet-adoption/${animalType.toLowerCase()}s/${animalId}/${clientId}`;
  const petCard = document.createElement('a');
  petCard.className = 'pet-card';
  petCard.setAttribute('href', petDetailPageUrl);
  const pictureContainer = document.createElement('div');
  pictureContainer.className = 'pet-card-image';
  pictureContainer.append(createImageObject(coverImagePath, null));
  const cardBody = document.createElement('div');
  cardBody.className = 'pet-card-body';
  cardBody.innerHTML = `
        <h3 class='pet-card-name'><a href=${petDetailPageUrl} class='stretched-link'>${petName ? extractName(petName) : animalId}</a></h3>
        <div class='pet-card-info'>
            ${gender ? `<span class='pet-card-gender'>${gender}</span>` : ''}
            ${gender && breed ? '<span class=\'pet-card-dot\'></span>' : ''}
            ${breed ? `<span class='pet-card-breed'>${breed}</span>` : ''}
        </div>
        <div class='pet-card-address'>
            ${city || ''}${city && state ? ', ' : ''}${state || ''}
        </div>
    `;
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'like-button-conainer';
  buttonContainer.innerHTML = `
    <button class='like-button' aria-label='Like' id='${animal.animalId}'>
        <svg class='default' width='24' height='22' viewBox='0 0 24 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path d='M23.3 4.55114C22.8314 3.63452 22.154 2.84083 21.3223 2.2341C20.4906 1.62736 19.528 1.22455 18.5121 1.05815C17.4962 0.891748 16.4554 0.966411 15.4736 1.27612C14.4918 1.58583 13.5966 2.12191 12.86 2.84114L12 3.62114L11.17 2.86114C10.4344 2.13135 9.53545 1.58739 8.54766 1.27436C7.55987 0.961323 6.51169 0.888233 5.49002 1.06114C4.47076 1.21761 3.50388 1.61617 2.67044 2.22341C1.837 2.83066 1.16131 3.62888 0.700017 4.55114C0.0805959 5.76129 -0.13608 7.13766 0.0815777 8.47958C0.299236 9.82151 0.939848 11.0588 1.91002 12.0111L11.28 21.6711C11.3733 21.7679 11.4851 21.8449 11.6088 21.8975C11.7326 21.9501 11.8656 21.9772 12 21.9772C12.1344 21.9772 12.2675 21.9501 12.3912 21.8975C12.5149 21.8449 12.6267 21.7679 12.72 21.6711L22.08 12.0311C23.0535 11.0768 23.6968 9.8366 23.9163 8.49115C24.1357 7.1457 23.9198 5.76533 23.3 4.55114ZM20.66 10.6211L12.36 19.1711C12.2634 19.2651 12.1347 19.3187 12 19.3211C11.8657 19.3168 11.7377 19.2634 11.64 19.1711L3.33002 10.6111C2.66352 9.95404 2.22228 9.10271 2.06957 8.1793C1.91687 7.25589 2.06055 6.30784 2.48002 5.47114C2.80009 4.82822 3.26939 4.27124 3.84871 3.84675C4.42803 3.42227 5.10053 3.14261 5.81002 3.03114C6.53132 2.91042 7.27107 2.96456 7.96711 3.18903C8.66315 3.41351 9.29515 3.80175 9.81002 4.32114L11.34 5.71114C11.5238 5.87698 11.7625 5.96878 12.01 5.96878C12.2575 5.96878 12.4963 5.87698 12.68 5.71114L14.24 4.29114C14.7573 3.77638 15.3905 3.39328 16.0866 3.17402C16.7826 2.95477 17.5211 2.90577 18.24 3.03114C18.9406 3.15001 19.603 3.43308 20.1731 3.85719C20.7432 4.28129 21.2048 4.83436 21.52 5.47114C21.9391 6.31036 22.0815 7.26072 21.927 8.18592C21.7725 9.11112 21.329 9.96362 20.66 10.6211Z' fill='#464646'/>
        </svg>
        <svg class='favorite' width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_2771_20936)">
            <g clip-path="url(#clip1_2771_20936)">
            <path d="M22.986 5.57639C22.5304 4.68523 21.8718 3.91359 21.0632 3.32371C20.2547 2.73383 19.3188 2.34221 18.3311 2.18043C17.3434 2.01865 16.3315 2.09124 15.377 2.39234C14.4225 2.69345 13.5521 3.21464 12.836 3.91389L11.9999 4.67223L11.193 3.93334C10.4763 3.22301 9.60066 2.69374 8.63861 2.3894C7.67656 2.08506 6.65583 2.01442 5.66103 2.18334C4.67182 2.33691 3.73376 2.72507 2.92526 3.31537C2.11677 3.90567 1.46135 4.68095 1.0138 5.57639C0.411589 6.75292 0.200931 8.09106 0.412543 9.39571C0.624155 10.7004 1.24697 11.9033 2.19019 12.8292L11.2999 22.2208C11.3906 22.3149 11.4993 22.3898 11.6196 22.4409C11.7399 22.492 11.8692 22.5184 11.9999 22.5184C12.1306 22.5184 12.2599 22.492 12.3802 22.4409C12.5005 22.3898 12.6092 22.3149 12.6999 22.2208L21.7999 12.8486C22.7464 11.9208 23.3718 10.715 23.5852 9.40695C23.7985 8.09888 23.5886 6.75685 22.986 5.57639Z" fill="#D00000"/>
            </g>
            </g>
            <defs>
            <clipPath id="clip0_2771_20936">
            <rect width="24" height="24" fill="white" transform="translate(0 0.471191)"/>
            </clipPath>
            <clipPath id="clip1_2771_20936">
            <rect width="23.3333" height="23.3333" fill="white" transform="translate(0.333252 0.637695)"/>
            </clipPath>
            </defs>
        </svg>
    </button>
    `;
  buttonContainer.addEventListener('click', (e) => { setFavorite(e, animal); });
  petCard.append(pictureContainer, cardBody, buttonContainer);
  return petCard;
}
