
/* eslint-disable indent */
import { fetchPlaceholders } from '../../scripts/lib-franklin.js';
import { isLoggedIn, acquireToken, login } from '../../scripts/lib/msal/msal-authentication.js';
import endPoints from '../../variables/endpoints.js';
import { createPresurvey, createSurveySteps, createSummaryForm, createSummaryScreen } from './survey-ui.js';


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
      surveyAnswers: {},
    }
    let isLoggedInUser = await isLoggedIn();
    let token;
    const questions = await fetchSurveyQuestions(surveyId);
    console.log(questions);

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
      if (targetIndex === questionDivs.length) {
        toggleScreen('survey', block, false);
        updateSummaryForm(block, state.surveyAnswers);
        toggleScreen('summary', block);
      }
    }
    function bindSurveyChangeEvents() {
      const surveyInputs = block.querySelectorAll('.pet-survey__survey .pet-survey__question input');
      surveyInputs.forEach((inputEl) => {
        inputEl.addEventListener('change', ()=> {
          state.surveyAnswers = updateSurveyProgress(block);
        });
      })
    }
    
    function bindPresurveyButtonEvents(block) {
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
    
    function bindSurveyButtonEvents(block) {
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
    
    function bindSummaryBackButtonEvents(block, hasCompletedSurvey) {
      const backBtn = block.querySelector('#pet-survey-summary-back');
      if (backBtn) {
        backBtn.addEventListener('click', (event) => {
          event.preventDefault();
          if (!hasCompletedSurvey) {
            toggleScreen('summary', block, false);
            toggleScreen('survey', block);
          } else {
            window.history.back();
          }
        });
      }
    }
    
    function bindSummaryInquiryEvent(block) {
      const inquiryBtn = block.querySelector('#pet-survey-summary-inquiry');
      if (inquiryBtn) {
        inquiryBtn.addEventListener('click', (event) => {
          event.preventDefault();
          // need add logic to validate form, save survey and submit inquiry 
        });
      }
    }
    function updateSummaryForm(block, answers) {
      console.log(answers);
      const form = block.querySelector('.pet-survey__layout-container--summary form');
      answers.forEach((answer) => {
        const selectId = `summary-question-${answer.QuestionId}`;
        const checkboxId = `summary-question-${answer.QuestionId}-option-${answer.QuestionOptionId || answer.ExternalAnswerKey}`;
        const selectEl = form.querySelector(`#${selectId}`);
        const checkboxEl = form.querySelector(`#${checkboxId}`);
        if (selectEl) {
          selectEl.value = answer.QuestionOptionId;
        } else if (checkboxEl) {
          checkboxEl.checked = true;
        }
      });
      const multiSelects = form.querySelectorAll('.multi-select');
      multiSelects.forEach((el) => {
        const button = el.querySelector('.multi-select__button');
        const selected = Array.from(el.querySelectorAll('input[type=\'checkbox\']')).filter((node) => node.checked)
        const displayText = selected.length > 0 ? `${selected.length} selected` : 'Select from menu...';
        button.innerText = displayText;
      });
    }
    function updateSurveyProgress(block) {
      const surveyQuestions = block.querySelectorAll('.pet-survey__survey .pet-survey__question');
      const progressBar = block.querySelector('#pet-survey-progress');
      let progress = 0;
      let surveyAnswers = [];
      surveyQuestions.forEach((question) => {
        const checked = Array.from(question.querySelectorAll('input:checked'));
        if (checked.length > 0) {
          progress += 1;
          checked.forEach((el) => {
            const isExternal = el.getAttribute('data-is-external');
            const data = {
              QuestionId: el.getAttribute('data-question-id'),
              QuestionOptionId: isExternal ? null : el.getAttribute('data-option-id'),
            }
            if (isExternal) {
              data['ExternalAnswerKey'] = el.getAttribute('data-option-id');
              data['UserResponseText'] = el.getAttribute('data-option-text');
            }
            surveyAnswers.push(data);
          });
        }
    
      });
      if (progressBar) {
        progressBar.value = progress;
        progressBar.innerText = Math.ceil((progress / progressBar.max) * 100);
      }
      return surveyAnswers;
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

    async function renderAsUser() {
      token = await acquireToken();
      const result = await callSurveyResponse(surveyId, token);
      if (result && result.Completed) {
        const answers = result.SurveyResponseAnswers.map((answer) => ({
          QuestionId : answer.QuestionId, 
          QuestionOptionId : answer.QuestionOptionId,
          ExternalAnswerKey: answer.ExternalAnswerKey,
          UserResponseText: answer.UserResponseText,
        }));
        if (!block.querySelector('.pet-survey__layout-container--summary')) {
          // replace 'questions' in 'createSummaryForm()' with 'result.SurveyResponseAnswers'
          block.append(await createSummaryScreen(surveySummaryHeading, surveySummarySubheading, await createSummaryForm(animalType, questions, animalId, clientId)));
          updateSummaryForm(block, answers); 
          bindSummaryBackButtonEvents(block, true);
        }
        toggleScreen('summary', block);
      } else {
        if (block.querySelector('.pet-survey__layout-container--presurvey')) {
          block.querySelector('.pet-survey__layout-container--presurvey').remove();
        }
        if (!block.querySelector('.pet-survey__layout-container--survey')) {
           // Add survey steps
          block.append(await createSurveySteps(surveyHeading, questions));
          bindSurveyButtonEvents(block);
          bindSurveyChangeEvents(block);
        }
        toggleScreen('survey', block);
        if (!block.querySelector('.pet-survey__layout-container--summary')) {
          // Add summary
          block.append(await createSummaryScreen(surveySummaryHeading,surveySummarySubheading, await createSummaryForm(animalType, questions, animalId, clientId)));
          bindSummaryBackButtonEvents(block, false);
        }
      }
    }
    async function renderAsNonUser() {
      block.append(await createPresurvey(preSurveyHeading, preSurveySubheading, preSurveySignInLabel, surveyCancelLabel, surveyStartLabel));
      bindPresurveyButtonEvents(block);
      toggleScreen('presurvey', block);
      // Add survey steps
      block.append(await createSurveySteps(surveyHeading, questions));
      bindSurveyButtonEvents(block);
      bindSurveyChangeEvents(block);
      // Add summary
      block.append(await createSummaryScreen(surveySummaryHeading, surveySummarySubheading, await createSummaryForm(animalType, questions, animalId, clientId)));
      bindSummaryBackButtonEvents(block, false);

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