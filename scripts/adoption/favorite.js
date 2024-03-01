import { acquireToken, isLoggedIn } from '../lib/msal/msal-authentication.js';
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

    acquireToken("Favorite").then(token => {
        setAsFavorite(token);
    });
}
