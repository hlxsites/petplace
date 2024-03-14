/* eslint-disable indent */
import { getMetadata } from '../../scripts/lib-franklin.js';
import endPoints from '../../variables/endpoints.js';
import { extractName } from '../../templates/adopt/adopt.js';

const arrInquiryList = [];

function orderByAvailability(a, b) {
  if (a.Animal.IsAvailable && !b.Animal.IsAvailable) {
      return -1;
  }
  if (!a.Animal.IsAvailable && b.Animal.IsAvailable) {
      return 1;
  }
  return 0;
}

function removeInquiryPet(id, token, btn) {
  return fetch(`${endPoints.apiUrl}/adopt/api/Inquiry/${id}`, {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
      },
  })
  .then(() => {
      btn.closest('.inquiry-pet-card').remove();
  })
  .catch((error) => {
      // console.error('Error deleting inquiry', error);
      throw error;
  });
}

function openRemoveConfirmModal(petName, element, id, token, btn) {
  const modal = document.querySelector('.confirm-remove-inquiry-modal');
  const confirmBtn = document.querySelector('.confirm-remove-inquiry-modal .confirm');
  const cancelBtn = document.querySelector('.confirm-remove-inquiry-modal .cancel');
  modal.classList.remove('hidden');
  const overlay = document.querySelector('.account-tabpanel--inquiries .overlay');
  overlay.classList.add('show');
  confirmBtn.addEventListener('click', () => {
      removeInquiryPet(id, token, btn);
      element.remove();
      modal.classList.add('hidden');
      overlay.classList.remove('show');
  });

  cancelBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
      overlay.classList.remove('show');
  });
}

function isEmptyObject(obj) {
  return typeof obj === 'object' && Object.keys(obj).length === 0;
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

function createRemoveConfirmModal() {
    const removeConfirmModal = `
        <div class="modal confirm-remove-inquiry-modal hidden">
            <div class="modal-header">
            <h3 class="modal-title">Remove Inquiry</h3>
            </div>
            <div class="modal-body">
                <p>Are you sure you want to remove this inquiry from your account?</p>
                <div class="modal-action-btns">
                    <button class="cancel">Cancel</button>
                    <button class="confirm">Remove Inquiry</button>
                </div>
            </div>
        </div>
        <div class="overlay"></div>
    `;

    return removeConfirmModal;
}

async function bindAccountInquiryEvents(block, token, inquiryList) {
  const viewMoreBtn = block.querySelector('.inquiries-list #view-more-btn');
  const removeBtns = block.querySelectorAll('button.remove-inquiry');

  if (viewMoreBtn) {
      viewMoreBtn.addEventListener('click', () => {
          let currentHiddenCards = block.querySelectorAll('.inquiry-pet-card.fp-hidden');
          currentHiddenCards.forEach((card, index) => {
              if (index < 5) {
                  card.classList.remove('fp-hidden');
              }
          });
          currentHiddenCards = block.querySelectorAll('.inquiry-pet-card.fp-hidden');

          if (currentHiddenCards.length < 1) {
              viewMoreBtn.classList.add('hidden');
          }
      });
  }

  removeBtns.forEach((button, index) => {
      button.addEventListener('click', async (event) => {
          event.preventDefault();

          if (inquiryList[index].Animal.IsAvailable) {
              openRemoveConfirmModal(extractName(inquiryList[index].Animal.Name), button.closest('.inquiry-pet-card'), inquiryList[index].Id, token, button);
          } else {
              removeInquiryPet(inquiryList[index].Id, token, button);
          }
      });
  });
}

function getInquiries(animalData) {
  const emptyInquiryList = `
      <div class='account-layout-container no-inquiry-pets'>
          You don’t currently have any inquiries.
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

  fetch(`${endPoints.apiUrl}/adopt/api/Inquiry`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${animalData}`,
    },
}).then((response) => response.json()).then(async (data) => {
    // build inquiries list
    data.forEach((inquiry) => {
        arrInquiryList.push(inquiry);
    });

    arrInquiryList.sort(orderByAvailability);

    const elInquiryList = document.querySelector('.inquiries-list');

    if (arrInquiryList.length > 0) {
        let builtHtml = '';

        arrInquiryList.forEach((inquired, index) => {
            const {
                Animal,
                DateCreated,
                Id,
            } = inquired;

            const {
                Breed,
                City,
                ClientId,
                ImageUrl,
                IsAvailable,
                Name,
                PostalCode,
                ReferenceNumber,
                Sex,
                Species,
                ShelterName,
                State,
                Street,
            } = Animal;

            let formattedDate = '';

            if (DateCreated !== null) {
              const date = new Date(DateCreated);

              const month = date.getMonth() + 1;
              const day = date.getDate();
              const year = date.getFullYear();

              formattedDate = `${month}/${day}/${year}`;
            }

            const inquiryPetCard = {};
            const fallBackImg = getMetadata('animal-card-image-fall-back');

            let petDetailPageUrl = '';
            if (Species !== null && ReferenceNumber !== null && ClientId !== null) {
                petDetailPageUrl = `/pet-adoption/${Species.toLowerCase()}s/${ReferenceNumber}/${ClientId}`;
            } else {
                petDetailPageUrl = null;
            }

            inquiryPetCard.availability = IsAvailable;
            inquiryPetCard.card = `
            <div class="inquiry-pet-card ${IsAvailable ? 'available' : 'unavailable'} ${ImageUrl !== '' ? '' : 'no-image'} ${index > 4 ? 'fp-hidden' : ''}">
                <div class="fp-img">
                ${createImageObject(ImageUrl, fallBackImg, '').outerHTML}                        
                </div>
                <div class="fp-info">
                    <div class="fp-info-header">
                        <div>
                            <p class="fp-name">
                              <a class="${petDetailPageUrl ? '' : 'prevent-click'} ${IsAvailable ? '' : 'prevent-click'}" href="${petDetailPageUrl || ''}">
                                ${Name ? extractName(Name) : Id}
                              </a> 
                              <span class="available-tag">Inquired ${formattedDate}</span></p>
                              <span class="unavailable-tag">No Longer available</span></p>
                            <p class="fp-details">${Breed || ''} ${Breed && Sex ? '<span class="fp-separator"></span>' : ''} ${Sex || ''}</p>
                        </div>
                        <button class="remove-inquiry">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M4.5 19.5L19.5 4.5" stroke="#6E6D73" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M4.5 4.5L19.5 19.5" stroke="#6E6D73" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                    <div>
                        <p class="fp-shelter">${ShelterName || ''}</p>
                        <p class="fp-shelter-address">${Street || ''}</p>
                        <p class="fp-shelter-address">${City || ''}, ${State || ''} ${PostalCode || ''}</p>
                    </div>
                </div>
            </div>
            `;

            builtHtml += inquiryPetCard.card;
        });

        elInquiryList.innerHTML = builtHtml;

        if (arrInquiryList.length > 5) {
            const viewMoreBtn = document.createElement('button');
            viewMoreBtn.innerHTML = 'View More';
            viewMoreBtn.setAttribute('id', 'view-more-btn');
            viewMoreBtn.classList.add('secondary');
            elInquiryList.append(viewMoreBtn);
        }
    } else {
        elInquiryList.innerHTML = emptyInquiryList;
    }

    await bindAccountInquiryEvents(elInquiryList, animalData, arrInquiryList);
})
.catch((error) => {
    console.error('Error:', error);
    const elInquiryList = document.querySelector('.inquiry-list');

    elInquiryList.innerHTML = emptyInquiryList;
});
}

export async function createAccountInquiriesPanel(animalData) {
  const panelDiv = document.createElement('div');
  panelDiv.className = 'tab-panel-inner';
  panelDiv.innerHTML = `
    <h3>Inquiries</h3>
    <div class="inquiries-list"></div>
  `;

  getInquiries(animalData);

  panelDiv.innerHTML += createRemoveConfirmModal();

  return panelDiv;
}
