/* eslint-disable indent */
import { fetchPlaceholders } from '../../scripts/lib-franklin.js';
import {
  isLoggedIn,
  acquireToken,
} from '../../scripts/lib/msal/msal-authentication.js';
import endPoints from '../../variables/endpoints.js';
import {
  createPresurvey,
  createSurveySteps,
  createSummaryForm,
  createSummaryScreen,
} from './survey-ui.js';

function previousInquirySubmittedModal() {
  const optInModalEl = document.createElement('div');
  const emailOptInModalStructure = `
      <div class="modal-header">
      <h3 class="modal-title">Previous Inquiry Submitted</h3>
      </div>
      <div class="modal-body">
          <p>It looks like you've already submitted an inquiry for this pet. Continue exploring adoptable pets or view your inquiries below.</p>
          <div class="modal-action-btns">
              <button class="cancel">View My Inquiries</button>
              <button class="confirm">Continue Browsing</button>
          </div>
      </div>
  `;
  optInModalEl.classList.add('modal', 'previous-inquiry-submitted-modal', 'hidden');

  optInModalEl.innerHTML = emailOptInModalStructure;

  return optInModalEl;
}

function previousInquirySubmittedOverlay() {
  const optInOverlaylEl = document.createElement('div');
  optInOverlaylEl.classList.add('overlay');

  return optInOverlaylEl;
}

function mountPreviousInquirySubmittedModal() {
  if (document.readyState === 'complete') {
    document.querySelector('body').append(previousInquirySubmittedModal());
    document.querySelector('body').append(previousInquirySubmittedOverlay());
}
}

export function openPreviousInquirySubmittedModal() {
  const modal = document.querySelector('.previous-inquiry-submitted-modal');
  if (modal) {
      const confirmBtn = document.querySelector('.previous-inquiry-submitted-modal .confirm');
      const cancelBtn = document.querySelector('.previous-inquiry-submitted-modal .cancel');
      modal.classList.remove('hidden');
      const overlay = document.querySelector('.overlay');
      overlay.classList.add('show');

      confirmBtn.addEventListener('click', async () => {
          modal.classList.add('hidden');
          overlay.classList.remove('show');
            window.history.back(-2);
      });

      cancelBtn.addEventListener('click', () => {
          modal.classList.add('hidden');
          overlay.classList.remove('show');
          window.location.href = '/pet-adoption/account#inquiries';
      });
  }
}

export default async function decorate(block) {
  mountPreviousInquirySubmittedModal();
  block.textContent = '';
  const searchParams = new URLSearchParams(window.location.search);
  const animalType = searchParams.get('animalType');
  const animalId = searchParams.get('animalId');
  const clientId = searchParams.get('clientId');
  // eslint-disable-next-line
  const surveyId = animalType?.toLowerCase() === 'dog' ? 1 : animalType?.toLowerCase() === 'cat' ? 2 : null; // need to update this to use the surveyId from the query string

  // fetch placeholders from the 'adopt' folder
  const placeholders = await fetchPlaceholders('/pet-adoption');
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
    surveyAnswers: [],
  };

  function pushSurveyAnswer(newAnswer) {
    // Since we can't be sure if the QuestionId will be a number or string,
    // we convert it to string to compare
    const isNotEqualAsNewAnswer = ({ QuestionId }) => `${QuestionId}` !== `${newAnswer.QuestionId}`;

    state.surveyAnswers = [
      // Remove any existing answers for the same question
      ...state.surveyAnswers.filter(isNotEqualAsNewAnswer),
      newAnswer,
    ];
  }

  const isLoggedInUser = await isLoggedIn();
  let token;
  let surveyParentId = null;
  // eslint-disable-next-line
  const questions = await fetchSurveyQuestions(surveyId);
  // eslint-disable-next-line
  function toggleScreen(name, block, isShown = true) {
    let selector;
    // eslint-disable-next-line
    switch (name) {
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
  // eslint-disable-next-line
  function setActiveQuestion(block, currentIndex, targetIndex) {
    const questionDivs = Array.from(
      block.querySelectorAll('.pet-survey__survey .pet-survey__question'),
    );
    if (targetIndex >= 0 && targetIndex < questionDivs.length) {
      questionDivs[currentIndex].classList.remove('active');
      questionDivs[targetIndex].classList.add('active');
    }
    if (targetIndex === 0) {
      block
        .querySelector('#pet-survey-back')
        .setAttribute('disabled', 'disabled');
    } else {
      block.querySelector('#pet-survey-back').removeAttribute('disabled');
    }
    if (targetIndex === questionDivs.length) {
      toggleScreen('survey', block, false);
      // eslint-disable-next-line
      updateSummaryForm(block, state.surveyAnswers);
      toggleScreen('summary', block);
    }
  }
  function bindSurveyChangeEvents() {
    const surveyInputs = block.querySelectorAll('.pet-survey__survey .pet-survey__question input');
    surveyInputs.forEach((inputEl) => {
      inputEl.addEventListener('change', () => {
        // eslint-disable-next-line
        state.surveyAnswers = updateSurveyProgress(block);
      });
    });
  }
  function enableSaveButton() {
    // Get save button
    const saveBtn = block.querySelector('#pet-survey-summary-save');
    if (saveBtn.disabled) saveBtn.disabled = false;
  }
  function bindSurveySummaryChangeEvents() {
    // Selects
    const surveyInputs = block.querySelectorAll(
      ' .pet-survey__form-control select',
    );
    surveyInputs.forEach((inputEl) => {
      inputEl.addEventListener('change', (el) => {
        const data = {
          QuestionId: parseInt(el.target.getAttribute('data-question-id'), 10),
          QuestionOptionId: parseInt(el.target.value, 10),
        };
        pushSurveyAnswer(data);
        enableSaveButton();
        const otherOptions = inputEl.querySelectorAll(`option:not([value="${el.target.value}"]):not([value=""])`);
        if (otherOptions.length > 0) {
          otherOptions.forEach((option) => {
            // remove the unchecked item from the state
            // If the answer exists, mark it as deleted
            state.surveyAnswers.forEach((answer) => {
              if (answer.QuestionOptionId?.toString() === option.value
                || answer.QuestionOption?.Id.toString() === option.value) {
                answer.Deleted = true;
                }
            });
          });
        }
      });
    });

    // Checkboxes
    const surveyMultiSelects = block.querySelectorAll(
      '.pet-survey__form-control.multi-select',
    );

    surveyMultiSelects.forEach((multiSelect) => {
      const multiSelectCheckboxes = Array.from(
        multiSelect.querySelectorAll("input[type='checkbox']"),
      );

      multiSelectCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', (el) => {
          const data = {
            QuestionId: parseInt(el.target.getAttribute('data-question-id'), 10),
            QuestionOptionId: parseInt(el.target.getAttribute('data-option-id'), 10),
            ExternalAnswerKey: el.target.getAttribute('data-option-id'),
            UserResponseText: el.target.getAttribute('data-option-text'),
          };
          enableSaveButton();
          // add the checked item to the state
          if (el.target.checked) {
            // check if data already exists in the state
            const existingAnswerIndex = state.surveyAnswers.findIndex(
              (answer) => (answer.QuestionOptionId === data.QuestionOptionId && !answer.Deleted)
              || (answer?.UserResponseText === data.UserResponseText && !answer.Deleted),
            );
            // only add if it doesn't exist already
            if (existingAnswerIndex === -1) {
              pushSurveyAnswer(data);
            }
          } else {
            // remove the unchecked item from the state
            // If the answer exists, mark it as deleted
            const existingAnswerIndex = state.surveyAnswers.findIndex(
              (answer) => answer.UserResponseText === data.UserResponseText
              || answer?.QuestionOption?.AnswerText === data.UserResponseText,
            );

            if (existingAnswerIndex > -1) {
              state.surveyAnswers[existingAnswerIndex].Deleted = true;
            }
          }
        });
      });
    });
  }
  // eslint-disable-next-line
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
  // eslint-disable-next-line
  function bindSurveyButtonEvents(block) {
    const backBtn = block.querySelector('#pet-survey-back');
    const nextBtn = block.querySelector('#pet-survey-next');

    if (backBtn) {
      backBtn.addEventListener('click', () => {
        const currentActiveIndex = parseInt(
          block
            .querySelector('.pet-survey .pet-survey__question.active')
            .getAttribute('data-q-index'),
        10,
        );
        setActiveQuestion(block, currentActiveIndex, currentActiveIndex - 1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const currentActiveIndex = parseInt(
          block
            .querySelector('.pet-survey .pet-survey__question.active')
            .getAttribute('data-q-index'),
         10,
        );
        // make sure a question has been checked before moving to the next
        if (
          block.querySelector('.pet-survey .pet-survey__question.active input:checked')
          || !block.querySelector('.pet-survey .pet-survey__question.active input')
        ) {
          setActiveQuestion(block, currentActiveIndex, currentActiveIndex + 1);
        }
      });
    }
  }
  // eslint-disable-next-line
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
  // eslint-disable-next-line
  function bindSummarySaveNewEvent(block) {
    const inquiryBtn = block.querySelector('#pet-survey-summary-save');
    if (inquiryBtn) {
      inquiryBtn.addEventListener('click', async (event) => {
        event.preventDefault();
        if (!token) {
          token = await acquireToken('Survey');
        }
        // eslint-disable-next-line
        const surveyResponse = await callSurveyResponse(surveyId, token);
        if (surveyResponse && !surveyResponse.Completed) {
          const payload = {
            SurveyId: surveyId,
            SurveyResponseAnswers: [...state.surveyAnswers],
          };
          // eslint-disable-next-line
          const result = await callSurveyResponse(
            surveyId,
            token,
            'POST',
            payload,
          );
          if (result) {
            window.location.href = '/pet-adoption/survey-confirmation';
          }
        } else {
          const payload = {
            Id: surveyResponse.Id,
            SurveyResponseAnswers: [...state.surveyAnswers],
          };
          // eslint-disable-next-line
          const result = await callSurveyResponse(
            surveyId,
            token,
            'PUT',
            payload,
          );

        const surveySummaryHeader = block.querySelector('.pet-survey__summary-header');
        surveySummaryHeader.innerHTML = '<div class="pet-survey__success-message show">Your changes have been saved. <button class="pet-survey__success-message-close" aria-label="close message"></div><h3 class="pet-survey__summary-header-title">Pet Preferences</h3>';
        surveySummaryHeader.scrollIntoView({
            behavior: 'smooth',
        });
          const closeBtn = surveySummaryHeader.querySelector('.pet-survey__success-message-close');

          closeBtn.addEventListener('click', () => {
            surveySummaryHeader.querySelector('.pet-survey__success-message').style.display = 'none';
          });
        }
      });
    }
  }
  // eslint-disable-next-line
  function bindSummaryInquiryEvent(block) {
    const inquiryBtn = block.querySelector('#pet-survey-summary-inquiry');
    if (inquiryBtn) {
      inquiryBtn.addEventListener('click', async (event) => {
        event.preventDefault();
        const consent = block.querySelector('#pet-survey-summary-agreement');
        if (!consent.checked) {
          // eslint-disable-next-line
          window.alert('Please agree to share your information with the shelter.');
          return;
        }
        if (!token) {
          token = await acquireToken('Inquiry');
        }
        // eslint-disable-next-line
        const surveyResponse = await callSurveyResponse(surveyId, token);
        let surveyNumber = '';
        if (surveyResponse && !surveyResponse.Completed) {
          const payload = {
            SurveyId: surveyId,
            SurveyResponseAnswers: [...state.surveyAnswers],
          };
          // eslint-disable-next-line
          const result = await callSurveyResponse(
            surveyId,
            token,
            'POST',
            payload,
          );
          // eslint-disable-next-line
          const survey = await callSurveyResponse(surveyId, token);
          surveyNumber = survey.Id;
        } else {
          surveyNumber = surveyResponse.Id;

          // delete all responses that aren't found in new survey
          const itemsToDelete = [];
          surveyResponse.SurveyResponseAnswers.forEach((answer) => {
            // only search through multiselects and non deleted answers
            if (answer.Question.IsMultiAnswer && !answer.Deleted) {
              let found = false;
              state.surveyAnswers.forEach((a) => {
                if ((answer.QuestionOptionId
                    && answer.QuestionOptionId?.toString() === a.QuestionOptionId)
                    || a.UserResponseText === answer.UserResponseText) {
                  found = true;
                }
              });
              if (!found) {
                itemsToDelete.push(answer);
              }
            }
          });
          itemsToDelete.forEach((item) => {
            item.Deleted = true;
            pushSurveyAnswer(item);
          });
          const payload = {
            Id: surveyResponse.Id,
            SurveyResponseAnswers: [...state.surveyAnswers],
          };
          // eslint-disable-next-line
          const result = await callSurveyResponse(
            surveyId,
            token,
            'PUT',
            payload,
          );
        }
        const response = await fetch(`${endPoints.apiUrl}/adopt/api/Inquiry`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            AnimalReferenceNumber: animalId,
            ClientId: clientId,
            SurveyResponseId: surveyNumber,
        }),
      });
      if (response.status === 200) {
        window.location.href = '/pet-adoption/inquiry-confirmation';
      } else {
        openPreviousInquirySubmittedModal();
      }
      });
    }

    const agreementCheckbox = block.querySelector('#pet-survey-summary-agreement');
    if (agreementCheckbox) {
      agreementCheckbox.addEventListener('change', (event) => {
        if (event.currentTarget.checked) {
          inquiryBtn.disabled = false;
        } else {
          inquiryBtn.disabled = true;
        }
      });
    }
  }
  // eslint-disable-next-line
  function bindSummarySaveEvent(block, surveyId) {
    const saveBtn = block.querySelector('#pet-survey-summary-save');
    if (saveBtn) {
      saveBtn.addEventListener('click', async (event) => {
        if (!token) {
          token = await acquireToken('Survey');
        }
        event.preventDefault();
        const payload = {
          Id: surveyId,
          SurveyResponseAnswers: [...state.surveyAnswers],
        };
        const surveySummaryHeader = block.querySelector('.pet-survey__summary-header');
        surveySummaryHeader.innerHTML = '<div class="pet-survey__success-message show">Your changes have been saved. <button class="pet-survey__success-message-close" aria-label="close message"></div><h3 class="pet-survey__summary-header-title">Pet Preferences</h3>';
        surveySummaryHeader.scrollIntoView({
          behavior: 'smooth',
      });
        const closeBtn = surveySummaryHeader.querySelector('.pet-survey__success-message-close');

        closeBtn.addEventListener('click', () => {
          surveySummaryHeader.querySelector('.pet-survey__success-message').style.display = 'none';
        });
        // eslint-disable-next-line
        const result = await callSurveyResponse(
          surveyId,
          token,
          'PUT',
          payload,
        );
      });
    }
  }
  // eslint-disable-next-line
  function updateSummaryForm(block, answers) {
    const form = block.querySelector('.pet-survey__layout-container--summary form');
    const multiSelectCheckboxes = Array.from(form.querySelectorAll(".multi-select input[type='checkbox']"));
    multiSelectCheckboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    answers.forEach((answer) => {
      const selectId = `summary-question-${answer.QuestionId}`;
      const checkboxId = `summary-question-${answer.QuestionId}-option-${
        answer.QuestionOptionId || answer.ExternalAnswerKey
      }`;
      const selectEl = block.querySelector(`[id='${selectId}']`);
      const checkboxEl = block.querySelector(`[id='${checkboxId}']`);
      if (selectEl) {
        selectEl.value = answer.QuestionOptionId;
      } else if (checkboxEl) {
        checkboxEl.checked = true;
      }
    });
    const multiSelects = form.querySelectorAll('.multi-select');
    multiSelects.forEach((el) => {
      const label = el.querySelector('.label');
      if (label.innerText === 'Other Requirements') {
        // this field cannot have all 3 selected at a time even though API will return 3
        const checkboxes = el.querySelectorAll("input[type='checkbox']");
        if (checkboxes[0].checked && (checkboxes[1].checked || checkboxes[2].checked)) {
          checkboxes[0].checked = false;
        }
      }

      const selected = Array.from(el.querySelectorAll("input[type='checkbox']")).filter((node) => node.checked);
      const buttonText = el.querySelector('.multi-select__button-text');
      const displayText = selected.length > 0
          ? `${selected.length} selected`
          : 'Select from menu...';
      buttonText.innerText = displayText;
    });
  }
  // eslint-disable-next-line
  function updateSurveyProgress(block) {
    const surveyQuestions = block.querySelectorAll(
      '.pet-survey__survey .pet-survey__question',
    );
    const progressBar = block.querySelector('#pet-survey-progress');
    let progress = 0;
    const surveyAnswers = [];
    surveyQuestions.forEach((question) => {
      const checked = Array.from(question.querySelectorAll('input:checked'));
      if (checked.length > 0) {
        progress += 1;
        checked.forEach((el) => {
          const isExternal = el.getAttribute('data-is-external');
          const data = {
            QuestionId: el.getAttribute('data-question-id'),
            QuestionOptionId: isExternal
              ? null
              : el.getAttribute('data-option-id'),
          };
          if (isExternal) {
            // eslint-disable-next-line
            data['ExternalAnswerKey'] = el.getAttribute('data-option-id');
            // eslint-disable-next-line
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

  async function fetchSurveyQuestions(surveyReponseId = null) {
    let surveyIdValue = surveyReponseId;
    if (!surveyIdValue && sessionStorage.getItem('surveyTabAnimalType') !== null) {
      surveyIdValue = sessionStorage.getItem('surveyTabAnimalType');
    }
    const questionsApi = `${endPoints.apiUrl}/adopt/api/SurveyQuestion/${surveyIdValue}`;
    let result;
    try {
      const resp = await fetch(questionsApi);
      if (resp.status === 200) {
        result = await resp.json();
      }
    } catch (error) {
      // eslint-disable-next-line
      console.error('Error:', error);
    }
    return result;
  }

  async function callSurveyResponse(
    surveyReponseId,
    tokenResponse,
    method = 'GET',
    payload = null,
  ) {
    let surveyIdValue = surveyReponseId;
    if (!surveyIdValue && sessionStorage.getItem('surveyTabAnimalType') !== null) {
      surveyIdValue = sessionStorage.getItem('surveyTabAnimalType');
    }
    const apiUrl = method === 'GET'
        ? `${endPoints.apiUrl}/adopt/api/SurveyResponse/survey/${surveyIdValue}`
        : `${endPoints.apiUrl}/adopt/api/SurveyResponse`;
    const config = {
      method,
      headers: {
        Authorization: `Bearer ${tokenResponse}`,
        'Content-Type': 'application/json',
      },
    };
    if (payload) {
      config.body = JSON.stringify(payload);
    }
    let result;
    try {
      const resp = await fetch(apiUrl, config);
      if (resp.status === 200) {
        result = await resp.json();
      } else if (resp.status === 204) {
        const accountWrapper = document.querySelector('.account-wrapper');

        if (accountWrapper) {
          const surveySuccessMessage = accountWrapper.querySelector('.pet-survey__success-message');
          surveySuccessMessage.classList.add('show');
        }
        const saveBtn = block.querySelector('#pet-survey-summary-save');
        if (saveBtn) saveBtn.disabled = true;
      }
    } catch (error) {
      // eslint-disable-next-line
      console.error('Error:', error);
    }
    return result;
  }

  async function renderAsUser() {
    token = await acquireToken();
    const result = await callSurveyResponse(surveyId, token);

    // populate state w/ survey answers
    state.surveyAnswers = result.SurveyResponseAnswers;

    surveyParentId = result.Id;
    if (result && result.Completed) {
      const answers = result.SurveyResponseAnswers.map((answer) => ({
        QuestionId: answer.QuestionId,
        QuestionOptionId: answer.QuestionOptionId,
        ExternalAnswerKey: answer.ExternalAnswerKey,
        UserResponseText: answer.UserResponseText,
      }));
      if (!block.querySelector('.pet-survey__layout-container--summary')) {
        // replace 'questions' in 'createSummaryForm()' with 'result.SurveyResponseAnswers'
        block.append(
          await createSummaryScreen(
            surveySummaryHeading,
            surveySummarySubheading,
            await createSummaryForm(animalType, questions, animalId, clientId),
          ),
        );
        updateSummaryForm(block, answers);
        bindSummaryBackButtonEvents(block, true);
        bindSurveySummaryChangeEvents(block);
      }
      toggleScreen('summary', block);
      updateSummaryForm(block, answers);
      bindSummaryBackButtonEvents(block, true);
      if (animalId && clientId) {
        bindSummaryInquiryEvent(block);
      } else {
        bindSummarySaveEvent(block, surveyParentId);
      }
    } else {
      if (block.querySelector('.pet-survey__layout-container--presurvey')) {
        block
          .querySelector('.pet-survey__layout-container--presurvey')
          .remove();
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
        block.append(
          await createSummaryScreen(
            surveySummaryHeading,
            surveySummarySubheading,
            await createSummaryForm(
              animalType,
              questions,
              animalId,
              clientId,
              'summary',
            ),
          ),
        );
        bindSummaryBackButtonEvents(block, false);
        block
          .querySelector('form.pet-survey__form')
          .addEventListener('submit', (event) => {
            event.preventDefault();
            event.stopPropagation();
          });
          if (animalId && clientId) {
            bindSummaryInquiryEvent(block);
          } else {
            bindSummarySaveNewEvent(block);
          }

          bindSurveySummaryChangeEvents(block);
      }
    }
  }

  async function renderAsNonUser() {
    block.append(
      await createPresurvey(
        preSurveyHeading,
        preSurveySubheading,
        preSurveySignInLabel,
        surveyCancelLabel,
        surveyStartLabel,
      ),
    );
    bindPresurveyButtonEvents(block);
    toggleScreen('presurvey', block);
    // Add survey steps
    block.append(await createSurveySteps(surveyHeading, questions));
    bindSurveyButtonEvents(block);
    bindSurveyChangeEvents(block);
    // Add summary
    block.append(
      await createSummaryScreen(
        surveySummaryHeading,
        surveySummarySubheading,
        await createSummaryForm(animalType, questions, animalId, clientId),
      ),
    );
    bindSurveySummaryChangeEvents();
    block
      .querySelector('form.pet-survey__form')
      .addEventListener('submit', (event) => {
        event.preventDefault();
      });
    bindSummaryBackButtonEvents(block, false);
    if (animalId && clientId) {
      bindSummaryInquiryEvent(block);
    } else {
      bindSummarySaveNewEvent(block);
    }
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
