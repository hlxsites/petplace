import { saveFavorite, STORAGE_KEY_SAVE_FAVORITE } from '../../adoption/favorite.js';
import { callUserApi } from '../../../blocks/account/account.js';
import { setSaveSearch } from '../../adoption/saveSearch.js';
import { openOptInModal } from '../../../blocks/adopt-search-results/adopt-search-results.js';

function handleFavorite(token) {
  if (localStorage.getItem(STORAGE_KEY_SAVE_FAVORITE)) {
    const animal = JSON.parse(localStorage.getItem(STORAGE_KEY_SAVE_FAVORITE));
    saveFavorite(token, animal);
  }
}

async function handleSavedSearchsPopup(token, event) {
  const initialUserData = await callUserApi(token);

  if (localStorage.getItem('featureName2') === 'openSavedSearchesPopUp') {
    localStorage.removeItem('featureName2');
    (async () => {
      if (initialUserData && initialUserData.EmailOptIn) {
        setSaveSearch(event);
      } else {
        openOptInModal(token, initialUserData, event);
      }
    })();
  }
}

export function initRedirectHandlers(response, event) {
  handleSavedSearchsPopup(response.accessToken, event);
  handleFavorite(response.accessToken);
}
