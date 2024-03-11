
/* eslint-disable indent */
import { fetchPlaceholders } from '../../scripts/lib-franklin.js';
import { isLoggedIn, acquireToken, login } from '../../scripts/lib/msal/msal-authentication.js';
import endPoints from '../../variables/endpoints.js';
import { createPresurvey, createSurveySteps, createSummaryForm, createSummaryScreen } from './survey-ui.js';

function toggleScreen(name, block, isShown = true) {
  let selector;
  switch(name) {
    case 'presurvey':
      selector = '.pet-survey__layout-container--presurvey';
      break;
    case 'survey':
      selector = '.pet-survey__layout-container--survey';
      break;
    case 'summary':
      selector = '.pet-survey__layout-container--summary';
      break;
  }
  if (selector) {
    const el = block.querySelector(selector);
    if (el && isShown) {
      el.classList.remove('hide');
    } else if (el && !isShown) {
      el.classList.add('hide');
    }
  }
}

async function bindPresurveyButtonEvents(block) {
  const cancelBtn = block.querySelector('#pet-survey-cancel');
  const startBtn = block.querySelector('#pet-survey-start');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      window.history.back();
    });
  }
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      toggleScreen('presurvey', block, false); 
      toggleScreen('survey', block); 
    });
  }
}
function setActiveQuestion(block, currentIndex, targetIndex) {
  const questionDivs = Array.from(block.querySelectorAll('.pet-survey__survey .pet-survey__question'));
  if (targetIndex >= 0 && targetIndex < questionDivs.length) {
    questionDivs[currentIndex].classList.remove('active');
    questionDivs[targetIndex].classList.add('active');
  }
  if (targetIndex === 0) {
    block.querySelector('#pet-survey-back').setAttribute('disabled', 'disabled');
  } else {
    block.querySelector('#pet-survey-back').removeAttribute('disabled');
  }
  if (targetIndex === questionDivs.length - 1) {
    toggleScreen('survey', block, false);
    toggleScreen('summary', block);
  }
}
async function bindSurveyButtonEvents(block) {
  const backBtn = block.querySelector('#pet-survey-back');
  const nextBtn = block.querySelector('#pet-survey-next');

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      const currentActiveIndex = parseInt(block.querySelector('.pet-survey .pet-survey__question.active').getAttribute('data-q-index'));
      setActiveQuestion(block, currentActiveIndex, currentActiveIndex - 1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const currentActiveIndex = parseInt(block.querySelector('.pet-survey .pet-survey__question.active').getAttribute('data-q-index'));
      setActiveQuestion(block, currentActiveIndex, currentActiveIndex + 1);
    });
  }

}

async function fetchSurveyQuestions(surveyId) {
  const questionsApi = `${endPoints.apiUrl}/adopt/api/SurveyQuestion/${surveyId}`;
  let result;
  try {
      const resp = await fetch(questionsApi);
      if (resp.status === 200) {
          result = await resp.json();
      }
  } catch (error) {
      console.error('Error:', error);
  }
  return result;
}
async function callSurveyResponse(surveyId, token, method = 'GET', payload = null) {
  const apiUrl = method === 'GET' ? `${endPoints.apiUrl}/adopt/api/SurveyResponse/survey/${surveyId}` : `${endPoints.apiUrl}/adopt/api/SurveyResponse`;
  const config = { 
    method: method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  };
  if (payload) {
    config.body = JSON.stringify(payload);
  }
  let result;
  try {
      const resp = await fetch(apiUrl, config);
      if (resp.status === 200) {
          result = await resp.json();
      }
  } catch (error) {
      console.error('Error:', error);
  }
  return result;
}

export default async function decorate(block) {
    block.textContent = '';
    const searchParams = new URLSearchParams(window.location.search);
    const animalType = searchParams.get('animalType');
    const animalId = searchParams.get('animalId');
    const clientId = searchParams.get('clientId');
    const surveyId = animalType === 'dog' ? 1 : animalType === 'cat' ? 2 : null;

    // fetch placeholders from the 'adopt' folder
    const placeholders = await fetchPlaceholders('/adopt');
    // retrieve the value for Pet Survey
    const {
        preSurveyHeading,
        preSurveySubheading,
        preSurveySignInLabel,
        surveyCancelLabel,
        surveyStartLabel,
        surveyHeading,
        surveySummaryHeading,
        surveySummarySubheading,
    } = placeholders;

    const state = {
      activeQuestionIndex: 0,
      surveyAnswers: {},
    }
    let isLoggedInUser = await isLoggedIn();
    let token;
    const questions = await fetchSurveyQuestions(surveyId);
    console.log(questions);

    async function renderAsUser() {
      token = await acquireToken();
      const result = await callSurveyResponse(surveyId, token);
      if (result && result.Completed) {
        if (!block.querySelector('.pet-survey__layout-container--summary')) {
          block.append(await createSummaryScreen(surveySummaryHeading, surveySummarySubheading, await createSummaryForm(animalType, questions, animalId, clientId)));
        }
        toggleScreen('summary', block);
      } else {
        if (!block.querySelector('.pet-survey__layout-container--survey')) {
          block.append(await createSurveySteps(surveyHeading, questions));
          bindSurveyButtonEvents(block)
        }
        toggleScreen('survey', block);
        if (!block.querySelector('.pet-survey__layout-container--summary')) {
          block.append(await createSummaryScreen(surveySummaryHeading,surveySummarySubheading, await createSummaryForm(animalType, questions, animalId, clientId)));
        }
      }
    }
    async function renderAsNonUser() {
      block.append(await createPresurvey(preSurveyHeading, preSurveySubheading, preSurveySignInLabel, surveyCancelLabel, surveyStartLabel));
      await bindPresurveyButtonEvents(block);
      toggleScreen('presurvey', block);
      block.append(await createSurveySteps(surveyHeading, questions));
      bindSurveyButtonEvents(block)
      block.append(await createSummaryScreen(surveySummaryHeading, surveySummarySubheading, await createSummaryForm(animalType, questions, animalId, clientId)));

    }

    if (isLoggedInUser) {
      await renderAsUser();
    } else {
      await renderAsNonUser();
      const signinBtn = block.querySelector('#pet-survey-signin');
      if (signinBtn) {
        signinBtn.addEventListener('click', async () => {
          toggleScreen('presurvey', block, false);
          await renderAsUser();
        });
      }
    }

}