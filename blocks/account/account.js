import TabsManual from "./tabs-manual.js";

function createSwitch(inputId, ariaLabelledBy) {
    const switchDiv = document.createElement('div');
    switchDiv.className = 'switch-container';
    const inputEl = document.createElement('input');
    inputEl.id = inputId;
    inputEl.setAttribute('role', 'switch');
    inputEl.setAttribute('type', 'checkbox');
    inputEl.setAttribute('aria-labelledby', ariaLabelledBy);
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

async function createAccountDetailsPanel() {
    const panelDiv = document.createElement('div');
    panelDiv.className = 'tab-pannel-inner';
    panelDiv.innerHTML = `
        <h3>Personal Information</h3>
        <div class='account-layout-container'>
            <form class='account-form account-form--personal' id='personal-info-form'>
                <div class='form-control form-control--text half-width'>
                    <label for='fname'>First Name</label>
                    <input type='text' id='fname' name='fname'>
                </div>
                <div class='form-control form-control--text half-width'>
                    <label for='lname'>Last Name</label>
                    <input type='text' id='lname' name='lname'>
                </div>
                <div class='form-control form-control--text'>
                    <label for='email'>Email</label>
                    <input type='text' id='email' name='email'>
                </div>
                <div class='form-control form-control--text half-width'>
                    <label for='phone'>Phone Number</label>
                    <input type='text' id='phone' name='phone'>
                </div>
                <div class='form-control form-control--text half-width'>
                    <label for='zip'>Zip/Postal Code</label>
                    <input type='text' id='zip' name='zip'>
                </div>
                <div class='form-control form-control--submit'>
                    <input type='submit' class='account-button' value='Save Changes'>
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
            <form class='account-form account-form--preferences' id='perferences-form'>
                <h3>Offers and Resources</h3>
                <div class='account-layout-row'>
                    <div class='account-layout-column'>
                        <h4>Newsletter</h4>
                        <p>Receive our PetPlace Newsletter</p>
                    </div>
                    <div class='account-layout-column account-layout-column--form-controls'>
                        <div class='form-control form-control--checkbox'>
                            <label class='checkbox-container'>Dog
                                <input type='checkbox' checked='checked' id='news-dog'>
                                <span class='checkmark'></span>
                            </label>
                        </div>
                        <div class='form-control form-control--checkbox'>
                            <label class='checkbox-container'>Cat
                                <input type='checkbox' id='news-cat'>
                                <span class='checkmark'></span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class='account-layout-row'>
                    <div class='account-layout-column'>
                        <h4 id='petplace-offers-label'>PetPlace Offers</h4>
                        <p>Get updates on the latest PetPlace happenings</p>
                    </div>
                    <div class='account-layout-column'>
                        ${createSwitch('petplace-offers-switch', 'petplace-offers-label').outerHTML}
                    </div>
                </div>
                <div class='account-layout-row'>
                    <div class='account-layout-column'>
                        <h4 id='partner-offers-label'>Partner Offers</h4>
                        <p>Receive updates from PetPlace and our trusted partners</p>
                    </div>
                    <div class='account-layout-column'>
                        <div class='form-control form-control--switch'>
                            ${createSwitch('partner-offers-switch', 'partner-offers-label').outerHTML}
                        </div>
                    </div>                
                </div>
                <h3>Notifications</h3>
                <div class='account-layout-row'>
                    <div class='account-layout-column'>
                        <h4>PetPlace Adopt Alerts</h4>
                        <p>Receive adoption related updates</p>
                    </div>
                    <div class='account-layout-column account-layout-column--form-controls'>
                        <div class='form-control form-control--checkbox'>
                            <label class='checkbox-container'>SMS
                                <input type='checkbox' checked='checked' id='alert-sms'>
                                <span class='checkmark'></span>
                            </label>
                        </div>
                        <div class='form-control form-control--checkbox'>
                            <label class='checkbox-container'>Email
                                <input type='checkbox' id='alert-email'>
                                <span class='checkmark'></span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class='account-layout-row'>
                    <div class='form-control form-control--submit'>
                        <input type='submit' class='account-button' value='Save Changes'>
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

async function createTabComponent() {
    const tabArray = [
        {title: 'Account Details', hash: 'details'},
        {title: 'Search Alerts', hash: 'searchalerts'},
        {title: 'Favorites', hash: 'favorites'},
        {title: 'Pet Match Survey', hash: 'survey'},
    ];
    const tabPanels = [await createAccountDetailsPanel(), await createSearchAlertsPanel(), await createFavoritesPanel(), await createSurveyPanel()];
    const tabs = document.createElement('div');
    tabs.className = 'account-tabs';
    const title = document.createElement('h2');
    title.className = 'account-tabs-title';
    title.textContent = 'My Account';
    tabs.append(title);
    const tablist =  document.createElement('ul');
    tablist.className = 'account-tablist';
    tablist.setAttribute('role', 'tablist');
    tabTitles.forEach((tab, index) => {
        const listItem = document.createElement('li');
        listItem.setAttribute('role', 'presentation');
        const link  = document.createElement('a');
        link.className = `account-tab account-tab--${tab.toLowerCase().split(' ').join('-')}`;
        link.setAttribute('role', 'tab');
        link.setAttribute('id', `account-tab-${index}`);
        link.setAttribute('aria-selected', `${index === 0 ? 'true' : 'false'}`);
        link.setAttribute('aria-controls', `account-tabpanel-${index}`);
        const iconEl = document.createElement('span');
        iconEl.className = 'account-tab-icon';
        const textEl = document.createElement('span');
        textEl.className = 'account-tab-text';
        textEl.textContent = tab;
        link.append(iconEl, textEl);
        tablist.append(btn);
    });
    tabs.append(tablist);
    tabPanels.forEach((panel, index) => {
        const panelWrapper = document.createElement('div');
        panelWrapper.className = `account-tabpanel account-tabpanel--${tabTitles[index].toLowerCase().split(' ').join('-')}${index === 0 ? '' : ' is-hidden'}`
        panelWrapper.setAttribute('id', `account-tabpanel-${index}`);
        panelWrapper.setAttribute('role', 'tabpanel');
        panelWrapper.setAttribute('aria-labelledby', `account-tab-${index}`);
        panelWrapper.append(panel);
        tabs.append(panelWrapper);
    });
    const tabListEl = tabs.querySelector('[role=\'tablist\']');
    const tabPanelEls = tabs.querySelectorAll('[role=\'tabpanel\']')
    new TabsManual(tabListEl, tabPanelEls);
    return tabs;


}
export default async function decorate(block) {
    block.innerHTML = '';
    block.append(await createTabComponent());

}