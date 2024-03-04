import { saveFavorite, STORAGE_KEY_SAVE_FAVORITE } from './../../adoption/favorite.js';

export function initRedirectHandlers(response) {
    handleFavorite(response.accessToken);
}

function handleFavorite(token) {
    if (localStorage.getItem(STORAGE_KEY_SAVE_FAVORITE)) {
        const animal = JSON.parse(localStorage.getItem(STORAGE_KEY_SAVE_FAVORITE));
        saveFavorite(token, animal);
    }
}
