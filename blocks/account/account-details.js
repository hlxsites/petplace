/* eslint-disable indent */
import { changePassword } from '../../scripts/lib/msal/msal-authentication.js';
import { callUserApi } from './account.js';

function serialize(data) {
    const obj = {};
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
            <form class='account-form account-form--personal' id='personal-info-form'>
                <div class='form-control form-control--text half-width'>
                    <label for='fname'>First Name</label>
                    <input type='text' id='FirstName' name='FirstName' value=${FirstName} required>
                    <span class="error-message" id="FirstName-error">Please enter your first name.</span>
                </div>
                <div class='form-control form-control--text half-width'>
                    <label for='lname'>Last Name</label>
                    <input type='text' id='LastName' name='LastName' value=${LastName} required>
                    <span class="error-message" id="LastName-error">Please enter your last name.</span>
                </div>
                <div class='form-control form-control--text'>
                    <label for='email'>Email</label>
                    <input type='text' id='Email' name='email' value=${Email} disabled>
                </div>
                <div class='form-control form-control--text half-width'>
                    <label for='phone'>Phone Number</label>
                    <input type='text' id='PhoneNumber' name='PhoneNumber' placeholder='Enter your phone number' value=${PhoneNumber || ''}>
                </div>
                <div class='form-control form-control--text half-width'>
                    <label for='zip'>Zip/Postal Code</label>
                    <input type='text' id='ZipCode' name='ZipCode' value=${ZipCode} required pattern='^[0-9]{5}(?:-[0-9]{4})?$'>
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
    return panelDiv;
}

export async function bindAccountDetailsEvents(block, token, initialUserData) {
    const personalInfoForm = block.querySelector('#personal-info-form');
    const preferencesForm = block.querySelector('#preferences-form');
    const textInputs = block.querySelectorAll('input[type=\'text\']:not(:disabled)');
    const checkboxes = block.querySelectorAll('input[type=\'checkbox\']');
    const submitButtons = block.querySelectorAll('button[type=\'submit\']');
    const changePwdButton = block.querySelector('#change-pwd');
    textInputs.forEach((input) => {
        input.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
            } 
        });
        input.addEventListener('input', () => {
            if (input.validity.valid && input.value.trim() !== '' && input.value.trim() !== initialUserData[input.name]) {
                disableButtons(submitButtons, false);
            } else {
                disableButtons(submitButtons, true);
            }
        });
    });
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
            if(checkbox.checked !== initialUserData[checkbox.name]) {
                disableButtons(submitButtons, false);
            } else {
                disableButtons(submitButtons, true);
            }
        });
    });
    submitButtons.forEach((button) => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();
            const payLoad = {...serialize(new FormData(personalInfoForm)), ...refactorPreferenceForm(serialize(new FormData(preferencesForm)))};
            await callUserApi(token, 'PUT', payLoad);
            disableButtons(submitButtons, true);
        });
    });
    changePwdButton.addEventListener('click', () => {
        changePassword();
    })
}