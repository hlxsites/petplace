import { acquireToken, isLoggedIn } from '../lib/msal/msal-authentication.js';
import { msalConfig, loginRequest } from '../lib/msal/default-msal-config.js';
import endPoints from '../../variables/endpoints.js';

// set a favorite pet for user
export function setFavorite(e, animal) {
    e.preventDefault();
    const isFavorite = document.getElementById(animal.animalId).classList.contains('favorited');
    function setAsFavorite(token) {
        // Send POST request to create user in the database
        if (!isFavorite){
            fetch(`${endPoints.apiUrl}/adopt/api/Favorite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    "AnimalReferenceNumber": animal.animalId,
                    "ClientId": animal.clientId
                })
            })
            .then(response => {
                //console.log('Success:', response.status);
                // favorite Pet in the UI
                const favoriteButton = document.getElementById(animal.animalId);
                favoriteButton.classList.add('favorited');
                favoriteButton?.setAttribute('data-favorite-id', response);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        } else {
            const favoriteId = document.getElementById(animal.animalId).dataset?.favoriteId;
            fetch(`${endPoints.apiUrl}/adopt/api/Favorite/${favoriteId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            })
            .then(response => {
                //console.log('Success:', response.status);
                // favorite Pet in the UI
                const favoriteButton = document.getElementById(animal.animalId);
                favoriteButton.classList.remove('favorited');
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
    }
    // check if user is logged in
    if (isLoggedIn()){
        // if logged in set pet as favorite
        acquireToken()
        .then(response => {
            setAsFavorite(response);
        })
        .catch((error) => {
            console.error('Error:', error);
        });;
    } else {
        // log user in and redirect back to this page
       // initialize MSAL object on page
    const myMSALObj = new msal.PublicClientApplication(msalConfig);

    function myCustomCallback(azureResponse) {
    // individual features may define their own callback function to be invoked after prompting a user to log in. 
    // This custom callback is invoked by the handleResponse() function, if it's not null.
    
    // example: read the access token from the response, this token is needed for calling authenticated APIs such as Favorite API
    let accessToken = azureResponse.accessToken
        setAsFavorite(accessToken);
    }

myMSALObj.loginPopup(loginRequest)
    .then((response) => handleResponse(response, myCustomCallback)) // handleResponse() is a custom callback defined in our app, see below for function example
    .catch(error => {
        console.log(error);
    });
    
function handleResponse(response, customCallback) {
    /**
     * To see the full list of response object properties, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#response
     */

    if (response !== null) {
        // custom login success logic here
        // setAccount(response.account);
        // the 'newUser' flag is present for newly registered users that are logging in for the very first time.
        if (response.account.idTokenClaims.newUser) {
            console.log("PetPlace - New user detected. Sending POST request to create user in the database.");

            // Send POST request to create user in the database
            fetch(`${endPoints.apiUrl}/adopt/api/User`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${response.accessToken}`,
                },
                body: '"favorite"'
            })
            .then(response => {
                console.log('Success:', response.status);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        } else {
            console.log("PetPlace - Existing user has logged in.");
        }
        
        // invoke custom callback if one was provided
        if (customCallback) {
            customCallback(response);
        }
    } else {
        selectAccount();
    }
}
    }
}