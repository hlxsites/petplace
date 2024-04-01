import { saveFavorite, STORAGE_KEY_SAVE_FAVORITE } from '../../adoption/favorite.js';

function handleFavorite(token) {
  if (localStorage.getItem(STORAGE_KEY_SAVE_FAVORITE)) {
    const animal = JSON.parse(localStorage.getItem(STORAGE_KEY_SAVE_FAVORITE));
    saveFavorite(token, animal);
  }
}

export function initRedirectHandlers(response) {
  handleFavorite(response.accessToken);
}
