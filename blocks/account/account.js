

async function createAccountDetailsPanel() {

    const panelDiv = document.createElement('div');
    panelDiv.className = 'tab-panel'
    panelDiv.innerHTML = `
        <div class="tab-pannel-inner">
            <h3>Personal Information</h3>
            <div class="account-layout-container">
                <form class="account-form account-form--personal" id="personal-info-form">
                    <div class="form-control form-control--text half-width">
                        <label for="fname">First Name</label>
                        <input type="text" id="fname" name="fname">
                    </div>
                    <div class="form-control form-control--text half-width">
                        <label for="lname">Last Name</label>
                        <input type="text" id="lname" name="lname">
                    </div>
                    <div class="form-control form-control--text">
                        <label for="email">Email</label>
                        <input type="text" id="email" name="email">
                    </div>
                    <div class="form-control form-control--text half-width">
                        <label for="phone">Phone Number</label>
                        <input type="text" id="phone" name="phone">
                    </div>
                    <div class="form-control form-control--text half-width">
                        <label for="zip">Zip/Postal Code</label>
                        <input type="text" id="zip" name="zip">
                    </div>
                    <div class="form-control form-control--submit">
                        <input type="submit" class="account-button" value="Save Changes">
                    </div>
                </form>
            </div>
            <h3>Change Password</h3>
            <div class="account-layout-container">
                <div class="account-layout-row account-layout-row--change-pwd">
                    <p>Create a new account password</p>
                    <a class="change-password-link account-button" href="">Change Password</a>
                </div>
            </div>
            <h3>Communication Preferences</h3>
            <div class="account-layout-container">
                <form class="account-form account-form--preferences" id="perferences-form">
                    <h3>Offers and Resources</h3>
                    <div class="account-layout-row">
                        <div class="account-layout-column">
                            <h4>Newsletter</h4>
                            <p>Receive our PetPlace Newsletter</p>
                        </div>
                        <div class="account-layout-column account-layout-column--form-controls">
                            <div class="form-control form-control--checkbox">
                                <label class="checkbox-container">Dog
                                    <input type="checkbox" checked="checked" id="news-dog">
                                    <span class="checkmark"></span>
                                </label>
                            </div>
                            <div class="form-control form-control--checkbox">
                                <label class="checkbox-container">Cat
                                    <input type="checkbox" id="news-cat">
                                    <span class="checkmark"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="account-layout-row">
                        <div class="account-layout-column">
                            <h4>PetPlace Offers</h4>
                            <p>Get updates on the latest PetPlace happenings</p>
                        </div>
                        <div class="account-layout-column">
                        </div>
                    </div>
                    <div class="account-layout-row">
                        <div class="account-layout-column">
                            <h4 id="partner-offers-label">Partner Offers</h4>
                            <p>Receive updates from PetPlace and our trusted partners</p>
                        </div>
                        <div class="account-layout-column">
                            <div class="form-control form-control--switch">
                                ${createSwitch('partner-offers-switch', null, 'partner-offers-label').outerHTML}
                            </div>
                        </div>                
                    </div>
                    <h3>Notifications</h3>
                    <div class="account-layout-row">
                        <div class="account-layout-column">
                            <h4>PetPlace Adopt Alerts</h4>
                            <p>Receive adoption related updates</p>
                        </div>
                        <div class="account-layout-column account-layout-column--form-controls">
                            <div class="form-control form-control--checkbox">
                                <label class="checkbox-container">SMS
                                    <input type="checkbox" checked="checked" id="alert-sms">
                                    <span class="checkmark"></span>
                                </label>
                            </div>
                            <div class="form-control form-control--checkbox">
                                <label class="checkbox-container">Email
                                    <input type="checkbox" id="alert-email">
                                    <span class="checkmark"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

        </div>
    
    `;
    return panelDiv;

}
function createSwitch(inputId, label, ariaLabelledBy) {
    const switchDiv = document.createElement('div');
    switchDiv.className = 'switch-container';
    switchDiv.innerHTML = `
        ${label ? `<label><span class="switch-label">${label}</span>` : ''}
        <input id=${inputId || ''} type="checkbox" role="switch"${!label && ariaLabelledBy ? ` aria-labelledby = ${ariaLabelledBy}`: ''}>
        <span class="switch-state">
            <span class="switch-state-container">
                <span class="switch-state-position"> </span>
            </span>
            <span class="switch-on" aria-hidden="true">On</span>
            <span class="switch-off" aria-hidden="true">Off</span>
        </span>
        ${label ? `</label>` : ''}
    `
    return switchDiv;
}

export default async function decorate(block) {
    block.innerHTML = '';
    block.append(await createAccountDetailsPanel());

}