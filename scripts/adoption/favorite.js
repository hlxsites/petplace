// eslint-disable-next-line
import { acquireToken } from '../lib/msal/msal-authentication.js';
import endPoints from '../../variables/endpoints.js';

export const STORAGE_KEY_SAVE_FAVORITE = 'saveFavorite';

export function saveFavorite(token, animal) {
  return fetch(`${endPoints.apiUrl}/adopt/api/Favorite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      AnimalReferenceNumber: animal.animalId,
      ClientId: animal.clientId,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      localStorage.removeItem(STORAGE_KEY_SAVE_FAVORITE);

      const favoriteButton = document.getElementById(animal.animalId);
      favoriteButton?.classList.add('favorited');
      favoriteButton?.setAttribute('data-favorite-id', data);

      // display rest of favorites on the page
      fetch(`${endPoints.apiUrl}/adopt/api/Favorite`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        // eslint-disable-next-line no-console
        console.log('Success:', response.status);
        return response.json();
      }).then((outputData) => {
        // favorite Pet in the UI
        outputData.forEach((favorite) => {
          const favoriteBtn = document.getElementById(favorite?.Animal.ReferenceNumber);
          favoriteBtn?.classList.add('favorited');
          favoriteBtn?.setAttribute('data-favorite-id', favorite?.Id);
        });
      })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error('Error:', error);
        });

      return data;
    })

    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error saving favorite', error);
      throw error;
    });
}

export function deleteFavorite(token, animal, favoriteId) {
  return fetch(`${endPoints.apiUrl}/adopt/api/Favorite/${favoriteId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    const favoriteButton = document.getElementById(animal.animalId);
    favoriteButton?.classList.remove('favorited');
    return response;
  })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error deleting favorite', error);
      throw error;
    });
}

// set a favorite pet for user
export function setFavorite(e, animal) {
  e?.preventDefault();
  const isFavorite = document.getElementById(animal.animalId).classList.contains('favorited');

  // save in localStorage for loginRedirect() scenarios
  localStorage.setItem(STORAGE_KEY_SAVE_FAVORITE, JSON.stringify({
    animalId: animal.animalId,
    clientId: animal.clientId,
  }));

  acquireToken('Favorite').then((token) => {
    if (!isFavorite) {
      saveFavorite(token, animal);
    } else {
      const favoriteId = document.getElementById(animal.animalId).dataset?.favoriteId;
      deleteFavorite(token, animal, favoriteId);
    }
  });
}
