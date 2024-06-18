/* eslint-disable indent */
// eslint-disable-next-line
import { changePassword, isLoggedIn, logout } from '../../scripts/lib/msal/msal-authentication.js';
import { callUserApi } from './account.js';
import endPoints from '../../variables/endpoints.js';
import errorPage from '../../scripts/adoption/errorPage.js';

function serialize(data) {
    const obj = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of data) {
        obj[key] = value;
    }
    return obj;
}

function refactorPreferenceForm(formObj) {
    const formatted = {
        EmailOptIn: false,
        SmsOptIn: false,
        PetPlaceOffer: false,
        PartnerOffer: false,
        CatNewsletterOptIn: false,
        DogNewsletterOptIn: false,
    };
    Object.keys(formObj).forEach((key) => {
        if (formObj[key] === 'on') {
            formatted[key] = true;
        }
    });
    return formatted;
}

function disableButtons(buttons, disabled = true) {
    buttons.forEach((button) => {
        if (disabled) {
            button.setAttribute('disabled', 'disabled');
        } else {
            button.removeAttribute('disabled');
        }
    });
}

function createSwitch(inputId, accessibilityLabel, isOn = false) {
    const switchDiv = document.createElement('div');
    switchDiv.className = 'switch-container';
    const inputEl = document.createElement('input');
    inputEl.id = inputId;
    inputEl.name = inputId;
    inputEl.setAttribute('role', 'switch');
    inputEl.setAttribute('type', 'checkbox');
    inputEl.setAttribute('aria-label', accessibilityLabel);
    if (isOn) {
        inputEl.setAttribute('checked', 'checked');
    }
    switchDiv.append(inputEl);
    const stateSpan = document.createElement('span');
    stateSpan.className = 'switch-state';
    stateSpan.innerHTML = `
    <span class='on' aria-hidden='true'>On</span>
    <span class='off' aria-hidden='true'>Off</span>
    <span class='switch-slider'>
        <span class='switch-slider-position'></span>
    </span>
    `;
    switchDiv.append(stateSpan);
    const checkboxSwitch = switchDiv.querySelector('input[role=\'switch\']');
    if (checkboxSwitch) {
        checkboxSwitch.addEventListener('focus', (event) => {
            event.currentTarget.parentNode.classList.add('focus');
        });
        checkboxSwitch.addEventListener('blur', (event) => {
            event.currentTarget.parentNode.classList.remove('focus');
        });
    }
    return switchDiv;
}

function removeAllSearchAlerts(token) {
    const savedSearchesList = document.querySelectorAll('button[data-save-id]');

    savedSearchesList.forEach((savedSearch) => {
        const savedSearchId = savedSearch.getAttribute('data-save-id');

        return fetch(`${endPoints.apiUrl}/adopt/api/UserSearch/${savedSearchId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
        .catch((error) => {
            errorPage();
            // eslint-disable-next-line no-console
            console.error('Error deleting favorite', error);
            throw error;
        });
    });

    const searchAlertsTab = document.querySelector('#searchalerts');
    searchAlertsTab.innerHTML = `
        <h3>Search Alerts</h3>
        <div class='saved-search-layout-container'>
            <div class='account-layout-container no-fav-pets'>
                You don’t currently have any saved searches.
            </div>
        </div>

        <a class="saved-search__cta-new-search" href="/pet-adoption/">Start New Search</a>
    `;
}

function emailOptOutConfirmModal() {
    const optOutModalStructure = `
        <div class="modal optout-email-modal hidden">
            <div class="modal-header">
            <h3 class="modal-title">Remove Email Notifications?</h3>
            </div>
            <div class="modal-body">
                <p>By opting out of email communications you will not be able to receive any search alerts.</p>
                <p>Are you sure you want to remove your email notifications?</p>
                <div class="modal-action-btns">
                    <button class="cancel">Cancel</button>
                    <button class="confirm">Opt-out and delete all search alerts</button>
                </div>
            </div>
        </div>
        <div class="overlay"></div>
    `;

    return optOutModalStructure;
}

export async function createAccountDetailsPanel(userData) {
    const {
        FirstName,
        LastName,
        Email,
        ZipCode,
        PhoneNumber,
        CatNewsletterOptIn,
        DogNewsletterOptIn,
        EmailOptIn,
        PartnerOffer,
        PetPlaceOffer,
        SmsOptIn,
    } = userData;
    const panelDiv = document.createElement('div');
    panelDiv.className = 'tab-pannel-inner';
    panelDiv.innerHTML = `
        <h3>Personal Information</h3>
        <div class='account-layout-container'>
        <div class='account__summary-header'></div>
            <form class='account-form account-form--personal' id='personal-info-form'>
                <div class='form-control form-control--text half-width'>
                    <label for='fname'>First Name</label>
                    <input type='text' id='FirstName' name='FirstName' value="${FirstName}" required>
                    <span class="error-message" id="FirstName-error">Please enter your first name.</span>
                </div>
                <div class='form-control form-control--text half-width'>
                    <label for='lname'>Last Name</label>
                    <input type='text' id='LastName' name='LastName' value="${LastName}" required>
                    <span class="error-message" id="LastName-error">Please enter your last name.</span>
                </div>
                <div class='form-control form-control--text'>
                    <label for='email'>Email</label>
                    <input type='text' id='Email' name='email' value="${Email}" disabled>
                </div>
                <div class='form-control form-control--text half-width'>
                    <label for='phone'>Phone Number</label>
                    <input type='text' id='PhoneNumber' name='PhoneNumber' placeholder='Enter your phone number' value="${PhoneNumber || ''}">
                </div>
                <div class='form-control form-control--text half-width'>
                    <label for='zip'>Zip/Postal Code</label>
                    <input type='text' id='ZipCode' name='ZipCode' value="${ZipCode}" required pattern='^[0-9]{5}$|^[A-Za-z][0-9][A-Za-z] ?[0-9][A-Za-z][0-9]$'>
                    <span class="error-message" id="ZipCode-error">Please enter your zip/postal code.</span>
                </div>
                <div class='form-control form-control--submit'>
                    <button type='submit' class='account-button' value='Save Changes' disabled>Save Changes</button>
                </div>
            </form>
        </div>
        <h3>Change Password</h3>
        <div class='account-layout-container'>
            <div class='account-layout-row account-layout-row--change-pwd'>
                <p>Create a new account password</p>
                <button class='account-button account-button--change-pwd' id='change-pwd'>Change Password</button>
            </div>
        </div>
        <h3>Communication Preferences</h3>
        <div class='account-layout-container'>
            <form class='account-form account-form--preferences' id='preferences-form'>
                <h3>Offers and Resources</h3>
                <div class='account-layout-row'>
                    <div class='account-layout-column'>
                        <h4>Newsletter</h4>
                        <p class='text-supporting'>Receive our PetPlace Newsletter</p>
                    </div>
                    <div class='account-layout-column account-layout-column--form-controls'>
                        <div class='form-control form-control--checkbox'>
                            <label class='checkbox-container'>Dog
                                <input type='checkbox' id='DogNewsletterOptIn' name='DogNewsletterOptIn' ${DogNewsletterOptIn ? 'checked' : ''}>
                                <span class='checkmark'></span>
                            </label>
                        </div>
                        <div class='form-control form-control--checkbox'>
                            <label class='checkbox-container'>Cat
                                <input type='checkbox' id='CatNewsletterOptIn' name='CatNewsletterOptIn' ${CatNewsletterOptIn ? 'checked' : ''}>
                                <span class='checkmark'></span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class='account-layout-row'>
                    <div class='account-layout-column'>
                        <h4>PetPlace Offers</h4>
                        <p class='text-supporting'>Get updates on the latest PetPlace happenings</p>
                    </div>
                    <div class='account-layout-column'>
                        ${createSwitch('PetPlaceOffer', 'PetPlace Offers', PetPlaceOffer).outerHTML}
                    </div>
                </div>
                <div class='account-layout-row'>
                    <div class='account-layout-column'>
                        <h4 id='partner-offers-label'>Partner Offers</h4>
                        <p class='text-supporting'>Receive updates from PetPlace and our trusted partners</p>
                    </div>
                    <div class='account-layout-column'>
                        <div class='form-control form-control--switch'>
                            ${createSwitch('PartnerOffer', 'Partner Offers', PartnerOffer).outerHTML}
                        </div>
                    </div>
                </div>
                <h3>Notifications</h3>
                <div class='account-layout-row'>
                    <div class='account-layout-column'>
                        <h4>PetPlace Adopt Alerts</h4>
                        <p class='text-supporting'>Receive adoption related updates</p>
                    </div>
                    <div class='account-layout-column account-layout-column--form-controls'>
                        <div class='form-control form-control--checkbox'>
                            <label class='checkbox-container'>SMS
                                <input type='checkbox' id='SmsOptIn' name='SmsOptIn' ${SmsOptIn ? 'checked' : ''}>
                                <span class='checkmark'></span>
                            </label>
                        </div>
                        <div class='form-control form-control--checkbox'>
                            <label class='checkbox-container'>Email
                                <input type='checkbox' id='EmailOptIn' name='EmailOptIn' ${EmailOptIn ? 'checked' : ''}>
                                <span class='checkmark'></span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class='account-layout-row'>
                    <div class='form-control form-control--submit'>
                        <button type='submit' class='account-button' value='Save Changes' disabled>Save Changes</button>
                    </div>
                </div>
            </form>
        </div>
    `;
    panelDiv.innerHTML += emailOptOutConfirmModal();
    return panelDiv;
}

export async function bindAccountDetailsEvents(block, token, initialUserData) {
    const personalInfoForm = block.querySelector('#personal-info-form');
    const preferencesForm = block.querySelector('#preferences-form');
    const textInputs = block.querySelectorAll('input[type=\'text\']:not(:disabled)');
    const checkboxes = block.querySelectorAll('input[type=\'checkbox\']');
    const submitButtons = block.querySelectorAll('button[type=\'submit\']');
    const changePwdButton = block.querySelector('#change-pwd');
    // eslint-disable-next-line no-unused-vars
    let hasEventSet = false;

    function openOptOutModal(tokenInfo) {
        const modal = document.querySelector('.optout-email-modal');
        const confirmBtn = document.querySelector('.optout-email-modal .confirm');
        const cancelBtn = document.querySelector('.optout-email-modal .cancel');
        modal.classList.remove('hidden');
        const overlay = document.querySelector('.overlay');
        overlay.classList.add('show');
        if (!hasEventSet) {
            hasEventSet = true;
            confirmBtn.addEventListener('click', () => {
                isLoggedIn().then(async (isLoggedInParam) => {
                    if (isLoggedInParam) {
                        removeAllSearchAlerts(tokenInfo);
                        modal.classList.add('hidden');
                        overlay.classList.remove('show');

                        const payLoad = {
                            ...serialize(new FormData(personalInfoForm)),
                            ...refactorPreferenceForm(serialize(new FormData(preferencesForm))),
                        };
                        await callUserApi(tokenInfo, 'PUT', payLoad);
                        disableButtons(submitButtons, true);
                        // eslint-disable-next-line no-param-reassign
                        initialUserData = payLoad;
                    } else {
                        logout();
                    }
                });
            });

            cancelBtn.addEventListener('click', () => {
                modal.classList.add('hidden');
                overlay.classList.remove('show');
                document.querySelector('#EmailOptIn').checked = true;
                disableButtons(submitButtons, true);
            });
        }
    }

    function searchAlertsCheck(tokenPassed) {
        fetch(`${endPoints.apiUrl}/adopt/api/UserSearch`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${tokenPassed}`,
            },
        }).then((response) => response.json()).then(async (data) => {
            if (data.length > 0) {
                openOptOutModal(tokenPassed);
            } else {
                const payLoad = {
                    ...serialize(new FormData(personalInfoForm)),
                    ...refactorPreferenceForm(serialize(new FormData(preferencesForm))),
                };
                await callUserApi(tokenPassed, 'PUT', payLoad);
                disableButtons(submitButtons, true);
                // eslint-disable-next-line no-param-reassign
                initialUserData = payLoad;
            }
        })
        .catch((error) => {
            errorPage();
            // eslint-disable-next-line no-console
            console.error('Error:', error);
        });
    }

    textInputs.forEach((input) => {
        input.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
            }
        });
        input.addEventListener('input', () => {
            if (input.validity.valid && (input.value.trim() !== '' || input.id === 'PhoneNumber') && input.value.trim() !== initialUserData[input.name]) {
                disableButtons(submitButtons, false);
            } else {
                disableButtons(submitButtons, true);
            }
        });
    });
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
            if (checkbox.checked !== initialUserData[checkbox.name]) {
                disableButtons(submitButtons, false);
            } else {
                disableButtons(submitButtons, true);
            }
        });
    });
    submitButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            isLoggedIn().then((isLoggedInParam) => {
                if (!isLoggedInParam) {
                    logout();
                }
            });
        });
    });
    submitButtons.forEach((button) => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();

            const emailNotificationsCheckbox = document.querySelector('#EmailOptIn');

            if (button.form.id === 'preferences-form') {
                if (
                    initialUserData[emailNotificationsCheckbox.name] === true
                    && emailNotificationsCheckbox.checked === false
                ) {
                    searchAlertsCheck(token);
                } else {
                    const payLoad = {
                        ...serialize(new FormData(personalInfoForm)),
                        ...refactorPreferenceForm(serialize(new FormData(preferencesForm))),
                    };
                    await callUserApi(token, 'PUT', payLoad);
                    disableButtons(submitButtons, true);
                    // eslint-disable-next-line no-param-reassign
                    initialUserData = payLoad;
                }
            } else {
                const payLoad = {
                    ...serialize(new FormData(personalInfoForm)),
                    ...refactorPreferenceForm(serialize(new FormData(preferencesForm))),
                };
                await callUserApi(token, 'PUT', payLoad);
                disableButtons(submitButtons, true);
                // eslint-disable-next-line no-param-reassign
                initialUserData = payLoad;
            }

            const accountSummaryHeader = block.querySelector('.account__summary-header');
            accountSummaryHeader.innerHTML = '<div class="account__success-message show">Your changes have been saved. <button class="account__success-message-close" aria-label="close message"></div><h3 class="account__summary-header-title">Pet Preferences</h3>';
            // eslint-disable-next-line
            const headerOffset = 150;
            // eslint-disable-next-line
            const elementPosition = accountSummaryHeader.getBoundingClientRect().top;
            // eslint-disable-next-line
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
            const closeBtn = accountSummaryHeader.querySelector('.account__success-message-close');

            closeBtn.addEventListener('click', () => {
                accountSummaryHeader.querySelector('.account__success-message').style.display = 'none';
            });
        });
    });
    changePwdButton.addEventListener('click', async () => {
        await changePassword();
    });
}
