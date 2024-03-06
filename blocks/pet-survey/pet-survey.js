
/* eslint-disable indent */
import { fetchPlaceholders, getMetadata } from '../../scripts/lib-franklin.js';
import { isLoggedIn } from '../../scripts/lib/msal/msal-authentication.js';
import endPoints from '../../variables/endpoints.js';

function createControlGroup(Id, IsMultiAnswer, Label, options) {
    const type = IsMultiAnswer ? 'checkbox' : 'radio';
    const container = document.createElement('fieldset');
    const legend = document.createElement('legend');
    legend.innerText = Label;
    legend.className = 'sr-only';
    container.append(legend);
    options.forEach((option) => {
        const label = document.createElement('label');
        label.className = `custom-input custom-input--${type}`
        label.innerText = option.AnswerText;
        const input = document.createElement('input');
        input.type = type;
        input.value = option.AnswerText;
        input.id = `question-${Id}-option-${option.Id}`;
        input.name = IsMultiAnswer ? `question-${Id}-option-${option.Id}` :`question-${Id}`;
        const checkmark = document.createElement('span');
        checkmark.className = 'checkmark';
        label.append(input, checkmark);
        container.append(label);
    });
    return container;
}
function createSelect(Id, IsMultiAnswer, Label, options) {
        const select = document.createElement('select');
        select.setAttribute('aria-label', Label);
        select.name = `question-${Id}`;
        select.id = `question-${Id}`;
        if (IsMultiAnswer) {
            select.setAttribute('multiple', true);
        }
        options.forEach((option) => {
            const op = document.createElement('option');
            op.innerText = option.AnswerText;
            op.value = option.AnswerText;
            select.append(op);
        });
        return select;
}
function createQuestion(item, index) {
    const { ExternalAnswerSource, Id, IsMultiAnswer, Label, QuestionText, QuestionOptions } = item.Question;
    const itemDiv = document.createElement('div');
    itemDiv.className = `pet-survey__question${index === 0 ? ' active' : ''}`;
    itemDiv.setAttribute('data-question-id', Id);
    const question = document.createElement('h2');
    question.textContent = QuestionText;
    itemDiv.append(question);
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'pet-survey__options';
    if (ExternalAnswerSource) {
        optionsDiv.append(createSelect(Id, IsMultiAnswer, Label, QuestionOptions));
    } else {
        optionsDiv.append(createControlGroup(Id, IsMultiAnswer, Label, QuestionOptions));
    }
    itemDiv.append(optionsDiv);
    return itemDiv;
}
function hidePresurvey() {
    const preSurvey = document.querySelector('.pet-survey__layout-container--presurvey');
    if (preSurvey) {
        preSurvey.classList.add('hide');
    }
}
async function fetchSurveyQuestions(surveyId) {
    const questionsApi = `${endPoints.apiUrl}/adopt/api/SurveyQuestion/${surveyId}`;
    let result = [];
    try {
        const resp = await fetch(questionsApi);
        if (resp.ok) {
            result = await resp.json();
            console.log(result);
        }
    } catch (error) {
        console.error('Error:', error);
    }
    return result;
}
async function getSavedSurvey() {

}
async function createPresurveyInterface(preSurveyHeading, preSurveySubheading, preSurveySignInLabel, surveyCancelLabel, surveyStartLabel) {
    const containerDiv = document.createElement('div');
    containerDiv.className = 'pet-survey__layout-container pet-survey__layout-container--presurvey';
    const presurveyDiv = document.createElement('div');
    presurveyDiv.className = 'pet-survey__presurvey';
    presurveyDiv.innerHTML = `
        <h2 class='pet-survey__presurvey-heading'>${preSurveyHeading || 'Ready to adopt a pet?'}</h2>
        <p class='pet-survey__presurvey-subheading'>
            ${preSurveySubheading || 'Fill out the following pet match survey to submit an inquiry to the shelter or rescue. Already have an account with a completed survey?'}
            <button id="pet-survey-signin">${preSurveySignInLabel || 'Sign in'}</button>
        </p>
    `;
    const ctaDiv = document.createElement('div');
    ctaDiv.className = 'pet-survey__cta-container';
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'button secondary pet-survey__button';
    cancelBtn.textContent = surveyCancelLabel || 'Cancel';
    cancelBtn.id = 'pet-survey-cancel';
    const startBtn = document.createElement('button');
    startBtn.className = 'button primary pet-survey__button';
    startBtn.id = 'pet-survey-start';
    startBtn.textContent = surveyStartLabel || 'Get Started';

    startBtn.addEventListener('click', () => {
        hidePresurvey();
    });

    cancelBtn.addEventListener('click', () => {
        window.history.back() 
    });

    ctaDiv.append(cancelBtn, startBtn);
    presurveyDiv.append(ctaDiv);
    containerDiv.append(presurveyDiv);
    return containerDiv;
}
async function createSurveyInterface(surveyHeading, questions) {
    const containerDiv = document.createElement('div');
    containerDiv.className = 'pet-survey__layout-container';
    const surveyDiv = document.createElement('div');
    surveyDiv.className = 'pet-survey__survey';
    // create title
    const title = document.createElement('h1');
    title.textContent = surveyHeading || 'Pet Match Survey';
    // create cta
    const ctaDiv = document.createElement('div');
    ctaDiv.className = 'pet-survey__cta-container';
    const backBtn = document.createElement('button');
    backBtn.className = 'button secondary pet-survey__button';
    backBtn.textContent = 'Back';
    backBtn.id = 'pet-survey-back';
    const nextBtn = document.createElement('button');
    nextBtn.className = 'button primary pet-survey__button';
    nextBtn.id = 'pet-survey-next';
    nextBtn.textContent = 'Next';
    ctaDiv.append(backBtn, nextBtn);
    // create progress bar
    const progressDiv = document.createElement('div');
    progressDiv.className = 'pet-survey__progress';
    const progressBar = document.createElement('progress');
    progressBar.id = 'pet-survey-progress';
    progressBar.setAttribute('aria-label', 'Survey progress');
    progressBar.textContent = '0%';
    progressBar.max = questions.length;
    progressBar.value = 0;
    progressDiv.append(progressBar);

    // create survey items
    const questionsDiv = document.createElement('div');
    questionsDiv.className = 'pet-survey__questions';
    questions.forEach((q, index) => {
        questionsDiv.append(createQuestion(q, index));
    });

    surveyDiv.append(title, progressDiv, questionsDiv, ctaDiv);
    containerDiv.append(surveyDiv);
    return containerDiv;
}


export default async function decorate(block) {
    block.textContent = '';
    const IS_LOGGED_IN = await isLoggedIn();
    const searchParams = new URLSearchParams(window.location.search);
    const animalType = searchParams.get('animalType');
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

    if (IS_LOGGED_IN) {

    } else {
        block.append(await createPresurveyInterface(preSurveyHeading, preSurveySubheading, preSurveySignInLabel, surveyCancelLabel, surveyStartLabel));
        const questions = await fetchSurveyQuestions(surveyId);
        block.append(await createSurveyInterface(surveyHeading, questions));
    }

}