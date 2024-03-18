import { getMetadata } from '../../scripts/lib-franklin.js';
import endPoints from '../../variables/endpoints.js';
import { extractName } from '../../templates/adopt/adopt.js';
import { buildBlock, decorateBlock, loadBlock } from '../../scripts/lib-franklin.js';
import { callUserApi } from './account.js';

// Get the survey status for the user
function getSurveyStatus(token, animalType) {
  const surveyAnimalType = animalType === 'Dog' ? 1 : 2; // 1 for Dog, 2 for Cat

  return fetch(
    `${endPoints.apiUrl}/adopt/api/SurveyResponse/survey/${surveyAnimalType}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  )
    .then((response) => response.json())
    .then((data) => data);
}

// Bind the survey events to the account survey panel
async function bindAccountSurveyEvents(block, token) {
  const panelDiv = document.createElement('div');
  panelDiv.className = 'tab-panel-inner';
  panelDiv.innerHTML = `
    <h3>Pet Match Survey</h3>
    <div class="survey-container">
      <div class="survey-animal-type__btn-container">
        <button class="survey-animal-type__btn survey-animal-type__btn--dog">Dog</button>
        <button class="survey-animal-type__btn survey-animal-type__btn--cat">Cat</button>
      </div>
    </div>
  `;

  const surveyAnimalTypeBtns = panelDiv.querySelectorAll('.survey-animal-type__btn');

  surveyAnimalTypeBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const animalType = e.target.classList.contains('survey-animal-type__btn--dog') ? 'dog' : 'cat';
      routeSurvey(block, token, animalType);
    });
  });

  return panelDiv;
}

// Route the user to the survey or the survey results
function routeSurvey(block, token, animalType) {
  const surveyContainer = block.querySelector('.survey-container');
  const surveyStatus = getSurveyStatus(token, animalType);
  let surveyStatusCompleted = null;

  surveyStatus.then((data) => {
    surveyStatusCompleted = data.Completed;
  });

  // if survey IS NOT COMPLETED, set path to survey
  if (!surveyStatusCompleted) {
    window.location.href = `/pet-adoption/survey?animalType=${animalType}`;
  } else {
    const surveyBlock = buildBlock('pet-survey', '');
    surveyContainer.append(surveyBlock);
    decorateBlock(surveyBlock);
    loadBlock(surveyBlock);
  }
}

// Get the initial status of the survey
function initialStatus(block, token) {
  // check url for ?saved=dog or ?saved=cat
  const hash = window.location.hash;

  if (hash.includes('saved')) {
    const animalType = hash.split('=')[1];

    routeSurvey(block, token, animalType);
  }
}

export async function createAccountSurveyPanel(block, token) {
  initialStatus(block, token);
  return bindAccountSurveyEvents(block, token);
}
