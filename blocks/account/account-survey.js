import endPoints from '../../variables/endpoints.js';
import {
  buildBlock,
  decorateBlock,
  loadBlock,
} from '../../scripts/lib-franklin.js';

function disableButtons(button, disabled = true) {
  if (disabled) {
    button.setAttribute('disabled', 'disabled');
  } else {
    button.removeAttribute('disabled');
  }
}

// Get the survey status for the user
function getSurveyStatus(token, animalType) {
  const surveyAnimalType = animalType === 'dog' ? 1 : 2; // 1 for Dog, 2 for Cat
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

// Route the user to the survey or the survey results
function routeSurvey(block, token, animalType, initialUserData) {
  const surveyStatus = getSurveyStatus(token, animalType);
  let surveyStatusCompleted = null;

  surveyStatus.then((data) => {
    surveyStatusCompleted = data.Completed;

    const surveyTabPanel = block.querySelector('.account-tabpanel--survey');
    const surveyContainer = block.querySelector('.survey-container');
    const surveyTitle = block.querySelector('.survey-title');
    const surveyBtnContainer = block.querySelector(
      '.survey-animal-type__btn-container',
    );
    const survey = block.querySelector('.pet-survey');

    const backBtnDiv = document.createElement('div');
    backBtnDiv.className = 'survey-back-btn';
    backBtnDiv.innerHTML = '<a href="/pet-adoption/account#survey" class="survey-back-btn__link" aria-label="Back to Survey Selection">Back</a>';
    const backBtn = backBtnDiv.querySelector('.survey-back-btn__link');
    surveyTitle.textContent = `${animalType === 'dog' ? 'Dog' : 'Cat'} Survey`;

    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '/pet-adoption/account#survey';
      const currentSurvey = block.querySelector('.pet-survey');
      const startSurvey = block.querySelector('.survey-incomplete');
      surveyBtnContainer.style.display = 'flex';
      backBtnDiv.remove();
      currentSurvey?.remove();
      startSurvey?.remove();
      surveyTitle.textContent = 'Pet Match Survey';
    });

    surveyTabPanel.prepend(backBtnDiv);
    surveyBtnContainer.style.display = 'none';

    // if survey IS NOT COMPLETED, set path to survey
    if (!surveyStatusCompleted) {
      const surveyIncompleteDiv = document.createElement('div');
      surveyIncompleteDiv.className = 'survey-incomplete';
      surveyIncompleteDiv.innerHTML = `
        <p class="survey-incomplete__text">It looks like you haven't completed your pet matching survey. Click below to get started.</p>
        <button class="survey-incomplete__btn">Start Survey</button>
      `;

      surveyContainer.append(surveyIncompleteDiv);

      const surveyIncompleteBtn = surveyIncompleteDiv.querySelector('.survey-incomplete__btn');
      surveyIncompleteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `/pet-adoption/survey?animalType=${animalType}`;
      });
    } else {
      if (survey) {
        survey.remove();
      }
      const surveyBlock = buildBlock('pet-survey', '');

      surveyContainer.append(surveyBlock);
      decorateBlock(surveyBlock);
      loadBlock(surveyBlock);

      // use mutationObserve to know when the pet survey is loaded into the DOM
      // then set the save changes button to disabled
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length) {
            const surveySummaryHeader = block.querySelector('.pet-survey__summary-header');
            surveySummaryHeader.innerHTML = '<div class="pet-survey__success-message">Your changes have been saved. <button class="pet-survey__success-message-close" aria-label="close message"></div><h3 class="pet-survey__summary-header-title">Pet Preferences</h3>';

            const closeBtn = surveySummaryHeader.querySelector('.pet-survey__success-message-close');

            closeBtn.addEventListener('click', () => {
              surveySummaryHeader.querySelector('.pet-survey__success-message').style.display = 'none';
            });

            const saveBtn = block.querySelector('#pet-survey-summary-save');

            saveBtn.disabled = true;

            const textInputs = block.querySelectorAll("input[type='text']:not(:disabled)");
            const checkboxes = block.querySelectorAll("input[type='checkbox']");
            const selects = block.querySelectorAll('select');

            textInputs.forEach((input) => {
              input.addEventListener('input', () => {
                if (
                  input.validity.valid
                  && input.value.trim() !== ''
                  && input.value.trim() !== initialUserData[input.name]
                ) {
                  disableButtons(saveBtn, false);
                } else {
                  disableButtons(saveBtn, true);
                }
              });
            });

            checkboxes.forEach((checkbox) => {
              checkbox.addEventListener('change', () => {
                if (checkbox.checked !== initialUserData[checkbox.name]) {
                  disableButtons(saveBtn, false);
                } else {
                  disableButtons(saveBtn, true);
                }
              });
            });

            selects.forEach((select) => {
              select.addEventListener('change', () => {
                if (select.value !== initialUserData[select.name]) {
                  disableButtons(saveBtn, false);
                } else {
                  disableButtons(saveBtn, true);
                }
              });
            });
          }
        });
      });

      observer.observe(surveyBlock, {
        childList: true,
      });
    }
  });
}

// Bind the survey events to the account survey panel
async function bindAccountSurveyEvents(block, token, initialUserData) {
  const panelDiv = document.createElement('div');
  panelDiv.className = 'tab-panel-inner';
  panelDiv.innerHTML = `
    <h3 class="survey-title">Pet Match Survey</h3>
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
      e.preventDefault();

      const animalType = e.target.classList.contains('survey-animal-type__btn--dog')
        ? 'dog'
        : 'cat';

      // set sessionStorage to animalType, 1 for dog, 2 for cat
      sessionStorage.setItem('surveyTabAnimalType', animalType === 'dog' ? 1 : 2);

      routeSurvey(block, token, animalType, initialUserData);
    });
  });

  return panelDiv;
}

// Get the initial status of the survey
function initialStatus(block, token) {
  // check url for ?saved=dog or ?saved=cat
  const { hash } = window.location;

  if (hash.includes('saved')) {
    const animalType = hash.split('=')[1];

    routeSurvey(block, token, animalType);
  }
}

export async function createAccountSurveyPanel(block, token, initialUserData) {
  initialStatus(block, token);
  return bindAccountSurveyEvents(block, token, initialUserData);
}
