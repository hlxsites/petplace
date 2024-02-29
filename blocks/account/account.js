import TabsManual from "./tabs-manual.js";
import endPoints from '../../variables/endpoints.js';
import { acquireToken } from '../../scripts/lib/msal/msal-authentication.js';

function serialize(data) {
	let obj = {};
	for (let [key, value] of data) {
		if (obj[key] !== undefined) {
			if (!Array.isArray(obj[key])) {
				obj[key] = [obj[key]];
			}
			obj[key].push(value);
		} else {
			obj[key] = value;
		}
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
    }
    for (const property in formObj){
        if (formObj[property] === 'on') {
            formatted[property] = true;
        }
    }
    return formatted;
}
function toggleButtonStates(buttons, disabled = true) {
    buttons.forEach(button => {
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

async function createAccountDetailsPanel(userData) {
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
                    <input type='text' id='FirstName' name='FirstName' value=${FirstName}>
                </div>
                <div class='form-control form-control--text half-width'>
                    <label for='lname'>Last Name</label>
                    <input type='text' id='LastName' name='LastName' value=${LastName}>
                </div>
                <div class='form-control form-control--text'>
                    <label for='email'>Email</label>
                    <input type='text' id='Email' name='email' value=${Email} disabled>
                </div>
                <div class='form-control form-control--text half-width'>
                    <label for='phone'>Phone Number</label>
                    <input type='text' id='PhoneNumber' name='PhoneNumber' placeholder="Enter your phone number" value=${PhoneNumber || ''}>
                </div>
                <div class='form-control form-control--text half-width'>
                    <label for='zip'>Zip/Postal Code</label>
                    <input type='text' id='ZipCode' name='ZipCode' value=${ZipCode}>
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
                <a class='change-password-link account-button' href=''>Change Password</a>
            </div>
        </div>
        <h3>Communication Preferences</h3>
        <div class='account-layout-container'>
            <form class='account-form account-form--preferences' id='preferences-form'>
                <h3>Offers and Resources</h3>
                <div class='account-layout-row'>
                    <div class='account-layout-column'>
                        <h4>Newsletter</h4>
                        <p class="text-supporting">Receive our PetPlace Newsletter</p>
                    </div>
                    <div class='account-layout-column account-layout-column--form-controls'>
                        <div class='form-control form-control--checkbox'>
                            <label class='checkbox-container'>Dog
                                <input type='checkbox' id='DogNewsletterOptIn' name='DogNewsletterOptIn' ${DogNewsletterOptIn ? 'checked' :''}>
                                <span class='checkmark'></span>
                            </label>
                        </div>
                        <div class='form-control form-control--checkbox'>
                            <label class='checkbox-container'>Cat
                                <input type='checkbox' id='CatNewsletterOptIn' name='CatNewsletterOptIn' ${CatNewsletterOptIn ? 'checked' :''}>
                                <span class='checkmark'></span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class='account-layout-row'>
                    <div class='account-layout-column'>
                        <h4>PetPlace Offers</h4>
                        <p class="text-supporting">Get updates on the latest PetPlace happenings</p>
                    </div>
                    <div class='account-layout-column'>
                        ${createSwitch('PetPlaceOffer', 'PetPlace Offers', PetPlaceOffer).outerHTML}
                    </div>
                </div>
                <div class='account-layout-row'>
                    <div class='account-layout-column'>
                        <h4 id='partner-offers-label'>Partner Offers</h4>
                        <p class="text-supporting">Receive updates from PetPlace and our trusted partners</p>
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
                        <p class="text-supporting">Receive adoption related updates</p>
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

async function createSearchAlertsPanel() {
    const panelDiv = document.createElement('div');
    panelDiv.className = 'account-tabpanel-inner';
    return panelDiv;
}

async function createFavoritesPanel() {
    const panelDiv = document.createElement('div');
    panelDiv.className = 'account-tabpanel-inner';
    return panelDiv;
}
async function createSurveyPanel() {
    const panelDiv = document.createElement('div');
    panelDiv.className = 'account-tabpanel-inner';
    return panelDiv;
}

async function createTabComponent(accountDetails) {
    const tabArray = [
        {title: 'Account Details', hash: 'details'},
        {title: 'Search Alerts', hash: 'searchalerts'},
        {title: 'Favorites', hash: 'favorites'},
        {title: 'Pet Match Survey', hash: 'survey'},
    ];
    const tabPanels = [await createAccountDetailsPanel(accountDetails), await createSearchAlertsPanel(), await createFavoritesPanel(), await createSurveyPanel()];
    const tabs = document.createElement('div');
    tabs.className = 'account-tabs';
    const title = document.createElement('h2');
    title.className = 'account-tabs-title';
    title.textContent = 'My Account';
    tabs.append(title);
    // create tab list for desktop display
    const tablist =  document.createElement('ul');
    tablist.className = 'account-tablist';
    tablist.setAttribute('role', 'tablist');
    tabArray.forEach((tab, index) => {
        const listItem = document.createElement('li');
        listItem.setAttribute('role', 'presentation');
        const link  = document.createElement('a');
        link.className = `account-tab account-tab--${tab.hash}`;
        link.setAttribute('role', 'tab');
        link.setAttribute('href', `#${tab.hash}`);
        link.setAttribute('id', `account-tab-${index}`);
        link.setAttribute('data-tab-index', index);
        link.setAttribute('aria-selected', `${index === 0 ? 'true' : 'false'}`);
        link.setAttribute('aria-controls', tab.hash);
        const iconEl = document.createElement('span');
        iconEl.className = 'account-tab-icon';
        const textEl = document.createElement('span');
        textEl.className = 'account-tab-text';
        textEl.textContent = tab.title;
        link.append(iconEl, textEl);
        listItem.append(link);
        tablist.append(listItem);
    });
    tabs.append(tablist);

    // create select dropdown for mobile display
    const selectDiv = document.createElement('div');
    selectDiv.className = 'account-select-container';
    const selectEl = document.createElement('select');
    selectEl.className = 'account-select';
    selectEl.id = 'account-select';
    tabArray.forEach((tab, index) => {
        const option = document.createElement('option');
        option.textContent = tab.title;
        option.value = index;
        selectEl.append(option);
    });
    selectDiv.append(selectEl);
    tabs.append(selectDiv);
    // create tab panels
    const tabContents = document.createElement('div');
    tabContents.className = 'account-tab-contents';
    tabPanels.forEach((panel, index) => {
        const panelWrapper = document.createElement('div');
        panelWrapper.className = `account-tabpanel account-tabpanel--${tabArray[index].hash}${index === 0 ? '' : ' is-hidden'}`
        panelWrapper.setAttribute('id', tabArray[index].hash);
        panelWrapper.setAttribute('role', 'tabpanel');
        panelWrapper.setAttribute('aria-labelledby', `account-tab-${index}`);
        panelWrapper.append(panel);
        tabContents.append(panelWrapper);
    });
    tabs.append(tabContents);
    const tabListEl = tabs.querySelector('[role=\'tablist\']');
    const dropdownEl = tabs.querySelector('select.account-select');
    const tabPanelEls = tabs.querySelectorAll('[role=\'tabpanel\']');
    new TabsManual(tabListEl, dropdownEl, tabPanelEls);
    return tabs;


}
async function callUserApi(token, apiUrl, method = 'GET', payload = null) {
    let result = null;
    const config = {
        method: method,
        headers: {Authorization: `Bearer ${token}`},
    };
    if (method !== 'GET') {
        config.body = JSON.stringify(payload);
    }
    try {
        const resp = await fetch(apiUrl, config);
        if (resp.ok) {
            result = await resp.json();
        }
    } catch (error) {
        console.error('Error:', error);
    }
    return result;
}

export default async function decorate(block) {
    block.innerHTML = '';
    let initialUserData = {};
    const token = await acquireToken();
    const baseUrl = endPoints.apiUrl;
    const userApi = `${baseUrl}/adopt/api/User`;
    if (token) {
        initialUserData = await callUserApi(token, userApi);
        console.log('initialUserData:', initialUserData)
        block.append(await createTabComponent(initialUserData));
        const personalInfoForm = block.querySelector('#personal-info-form');
        const preferencesForm = block.querySelector('#preferences-form');
        const textInputs = block.querySelectorAll('input[type=\'text\']:not(:disabled)');
        const checkboxes = block.querySelectorAll('input[type=\'checkbox\']');
        const submitButtons = block.querySelectorAll('button[type=\'submit\']');
        textInputs.forEach(input => {
            input.addEventListener('keypress', (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                } 
            });
            input.addEventListener('input', (event) => {
                if (event.target.value !== initialUserData[event.target.name]) {
                    submitButtons.forEach(button => {button.removeAttribute('disabled')});
                } else {
                    submitButtons.forEach(button => {button.setAttribute('disabled', 'disabled')});
                }
            });
        });
        submitButtons.forEach(button => {
            button.addEventListener('click', async (event) => {
                event.preventDefault();
                const payLoad = {...serialize(new FormData(personalInfoForm)), ...refactorPreferenceForm(serialize(new FormData(preferencesForm)))};
                const response = await callUserApi(token, userApi, 'PUT', payLoad);
            });
        })

    }




}