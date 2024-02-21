

async function createAccountDetailsPanel() {

    const panelDiv = document.createElement('div');
    panelDiv.className = 'tab-panel'
    panelDiv.innerHTML = `
        <div class="tab-pannel-inner">
            <h3>Personal Information</h3>
            <div class="account-form-container">
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
                        <input type="submit" value="Save Changes">
                    </div>
                </form>
            </div>
        </div>
    
    `;
    return panelDiv;

}

export default async function decorate(block) {
    block.innerHTML = '';
    block.append(await createAccountDetailsPanel());

}