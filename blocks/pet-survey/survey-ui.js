import MultiSelect from './multi-select.js';

export function createInput(type, questionId, option, isExternal, prefix = null, wrapperClass = '') {
  const div = document.createElement('div');
  if (wrapperClass) {
    div.className = wrapperClass;
  }
  const input = document.createElement('input');
  input.type = type;
  if (type === 'radio') {
    input.name = `${prefix ? `${prefix}-` : ''}question-${questionId}`;
  }
  input.id = `${prefix ? `${prefix}-` : ''}question-${questionId}-option-${option.Id}`;
  input.setAttribute('data-question-id', questionId);
  input.setAttribute('data-option-id', option.Id);
  input.setAttribute('data-option-text', option.AnswerText);
  if (isExternal) {
    input.setAttribute('data-is-external', 'true');
  }
  const label = document.createElement('label');
  label.setAttribute('for', `${prefix ? `${prefix}-` : ''}question-${questionId}-option-${option.Id}`);
  label.innerText = option.AnswerText;
  div.append(input, label);
  return div;
}
export function createControlGroup(Id, isMultiAnswer, isExternal, Label, options) {
  const type = isMultiAnswer ? 'checkbox' : 'radio';
  const container = document.createElement('div');
  container.setAttribute('role', 'group');
  container.setAttribute('aria-label', Label);
  container.setAttribute('tabindex', '0');
  options.forEach((option) => {
    const input = createInput('custom-input', type, Id, option, isExternal, 'survey');
    container.append(input);
  });
  return container;
}

export function createSingleSelect(
  questionId,
  options,
  defaultValue = null,
  label = null,
  className = null,
  attributes = null,
  prefix = null,
  errorMessage = null,
) {
  const containerDiv = document.createElement('div');
  containerDiv.className = `single-select ${className || ''}`;
  if (label) {
    const labelEl = document.createElement('label');
    labelEl.setAttribute('for', `${prefix ? `${prefix}-` : ''}question-${questionId}`);
    labelEl.innerText = label;
    containerDiv.append(labelEl);
  }
  const select = document.createElement('select');
  select.name = `${prefix ? `${prefix}-` : ''}question-${questionId}`;
  select.id = `${prefix ? `${prefix}-` : ''}question-${questionId}`;
  select.setAttribute('data-question-id', questionId);
  if (attributes) {
    const keys = Object.keys(attributes);
    keys.forEach((key) => {
      select.setAttribute(key, attributes[key]);
    });
  }
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.innerText = 'Select from menu...';
  placeholder.setAttribute('disabled', 'disabled');
  placeholder.setAttribute('selected', true);
  select.append(placeholder);
  options.forEach((option) => {
    const op = document.createElement('option');
    op.innerText = option.AnswerText;
    op.value = option.Id;
    if (defaultValue && option.AnswerText.toLowerCase() === defaultValue.toLowerCase()) {
      op.setAttribute('selected', 'selected');
    }
    select.append(op);
  });
  containerDiv.append(select);
  if (errorMessage) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = errorMessage;
    containerDiv.append(errorDiv);
  }
  return containerDiv;
}
export function createMultiSelect(
  questionId,
  options,
  isExternal,
  label = null,
  className = null,
  prefix = null,
) {
  const containerDiv = document.createElement('div');
  containerDiv.className = `multi-select ${className || ''}`;
  containerDiv.id = `${prefix ? `${prefix}-` : ''}multi-select-question-${questionId}`;
  if (label) {
    const labelEl = document.createElement('div');
    labelEl.className = 'label';
    labelEl.innerText = label;
    containerDiv.append(labelEl);
  }
  const button = document.createElement('button');
  button.id = `${prefix ? `${prefix}-` : ''}multi-select-question-${questionId}-button`;
  button.className = 'multi-select__button';
  button.type = 'button';
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', `${prefix ? `${prefix}-` : ''}multi-select-question-${questionId}-options`);
  const text = document.createElement('span');
  text.className = 'multi-select__button-text';
  text.innerText = 'Select from menu...';
  const icon = document.createElement('span');
  icon.className = 'multi-select__button-icon';
  button.append(text, icon);
  const groupDiv = document.createElement('div');
  groupDiv.setAttribute('role', 'group');
  groupDiv.setAttribute('aria-labelledby', `${prefix ? `${prefix}-` : ''}multi-select-question-${questionId}-button`);
  groupDiv.setAttribute('tabindex', '0');
  groupDiv.className = 'multi-select__options';
  groupDiv.id = `${prefix ? `${prefix}-` : ''}multi-select-question-${questionId}-options`;
  options.forEach((option) => {
    groupDiv.append(createInput('multi-select__input', 'checkbox', questionId, option, isExternal, prefix));
  });
  containerDiv.append(button, groupDiv);
  // eslint-disable-next-line no-new
  new MultiSelect(containerDiv);
  return containerDiv;
}
export function createQuestion(item, index) {
  const {
    ExternalAnswerSource, Id, IsMultiAnswer, Label, QuestionText, QuestionOptions,
  } = item.Question;
  const itemDiv = document.createElement('div');
  itemDiv.className = `pet-survey__question${index === 0 ? ' active' : ''}`;
  itemDiv.setAttribute('data-q-index', index);
  const question = document.createElement('h2');
  question.textContent = QuestionText;
  itemDiv.append(question);
  const optionsDiv = document.createElement('div');
  optionsDiv.className = 'pet-survey__options';
  let isExternal = false;
  if (ExternalAnswerSource) {
    isExternal = true;
    if (IsMultiAnswer) {
      optionsDiv.append(createMultiSelect(Id, QuestionOptions, isExternal, null, null, 'survey'));
    } else {
      optionsDiv.append(
        createSingleSelect(Id, QuestionOptions, Label, null, isExternal ? { 'data-is-external': 'true' } : null, 'survey'),
      );
    }
  } else {
    optionsDiv.append(createControlGroup(Id, IsMultiAnswer, isExternal, Label, QuestionOptions));
  }
  itemDiv.append(optionsDiv);
  return itemDiv;
}
export async function createPresurvey(
  preSurveyHeading,
  preSurveySubheading,
  preSurveySignInLabel,
  surveyCancelLabel,
  surveyStartLabel,
) {
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
  ctaDiv.append(cancelBtn, startBtn);
  presurveyDiv.append(ctaDiv);
  containerDiv.append(presurveyDiv);
  return containerDiv;
}
export async function createSurveySteps(surveyHeading, questions) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'pet-survey__layout-container pet-survey__layout-container--survey hide';
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
  backBtn.setAttribute('disabled', 'disabled');
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
export async function createSummaryForm(
  animalType,
  questionArray,
  animalId = null,
  clientId = null,
  surveySummaryFlow = null,
) {
  const formDiv = document.createElement('div');
  formDiv.className = 'pet-survey__form-container';
  const form = document.createElement('form');
  form.id = `${animalType}-survey-form`;
  form.name = `${animalType}-survey-form`;
  form.className = 'pet-survey__form';
  questionArray.forEach((item) => {
    const { Question } = item;
    const isExternal = !!Question.ExternalAnswerSource;
    if (Question.IsMultiAnswer) {
      form.append(createMultiSelect(Question.Id, Question.QuestionOptions, isExternal, Question.Label, 'pet-survey__form-control', 'summary'));
    } else {
      const isPetTypeField = Question.Label === 'Desired Pet Type';
      const attributes = { required: true };
      if (isPetTypeField) {
        attributes.disabled = 'disabled';
      }
      if (isExternal) {
        attributes['data-is-external'] = 'true';
      }
      form.append(createSingleSelect(Question.Id, Question.QuestionOptions, isPetTypeField ? animalType : null, Question.Label, 'pet-survey__form-control', attributes, 'summary'));
    }
  });
  const ctaContainer = document.createElement('div');
  ctaContainer.className = 'pet-survey__cta-container';
  if (animalId && clientId) {
    // Add agreement checkbox
    const agreementDiv = document.createElement('div');
    agreementDiv.className = 'pet-survey__form-control agreement-checkbox';
    const agreementCheckbox = document.createElement('label');
    agreementCheckbox.className = 'checkbox-container';
    agreementCheckbox.innerHTML = `
        I agree to share my information with the applicable shelter.
        <input type="checkbox" id='pet-survey-summary-agreement' name="pet-survey-summary-agreement">
        <span class="checkmark"></span>
        `;
    agreementDiv.append(agreementCheckbox);
    form.append(agreementDiv);
    // Add Back and Submit Inquiry Button
    const backBtn = document.createElement('button');
    backBtn.id = 'pet-survey-summary-back';
    backBtn.className = 'pet-survey__button secondary';
    backBtn.innerText = 'Back';
    const inquiryBtn = document.createElement('button');
    inquiryBtn.id = 'pet-survey-summary-inquiry';
    inquiryBtn.className = 'pet-survey__button primary';
    inquiryBtn.innerText = 'Submit Inquiry';
    ctaContainer.append(backBtn, inquiryBtn);
  } else if (animalType && surveySummaryFlow === 'summary') {
    // Add additional else if statement to check for in summary flow,
    // w/ animalType ... show back button and inquiry button
    // Add agreement checkbox
    const agreementDiv = document.createElement('div');
    agreementDiv.className = 'pet-survey__form-control agreement-checkbox';
    const agreementCheckbox = document.createElement('label');
    agreementCheckbox.className = 'checkbox-container';
    agreementCheckbox.innerHTML = `
        I agree to share my information with the applicable shelter.
        <input type="checkbox" id='pet-survey-summary-agreement' name="pet-survey-summary-agreement">
        <span class="checkmark"></span>
        `;
    agreementDiv.append(agreementCheckbox);
    form.append(agreementDiv);
    // Add Back and Submit Inquiry Button
    const backBtn = document.createElement('button');
    backBtn.id = 'pet-survey-summary-back';
    backBtn.className = 'pet-survey__button secondary';
    backBtn.innerText = 'Back';
    const inquiryBtn = document.createElement('button');
    inquiryBtn.id = 'pet-survey-summary-inquiry';
    inquiryBtn.className = 'pet-survey__button primary';
    inquiryBtn.innerText = 'Submit Inquiry';
    ctaContainer.append(backBtn, inquiryBtn);
  } else {
    // add back button to summary screen with save changes
    const backBtn = document.createElement('button');
    backBtn.id = 'pet-survey-summary-back';
    backBtn.className = 'pet-survey__button secondary';
    backBtn.innerText = 'Back';
    // Add Save Changes button
    const saveBtn = document.createElement('button');
    saveBtn.id = 'pet-survey-summary-save';
    // saveBtn.setAttribute('disabled', 'disabled');
    saveBtn.className = 'pet-survey__button secondary';
    saveBtn.innerText = 'Save Changes';
    ctaContainer.append(backBtn, saveBtn);
  }
  form.append(ctaContainer);
  formDiv.append(form);
  return formDiv;
}

export async function createSummaryScreen(
  surveySummaryHeading,
  surveySummarySubheading,
  summaryForm,
) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'pet-survey__layout-container pet-survey__layout-container--summary hide';
  const headerDiv = document.createElement('div');
  headerDiv.className = 'pet-survey__summary-header';
  const heading = document.createElement('h2');
  heading.innerText = surveySummaryHeading || 'Almost Done!';
  const subheading = document.createElement('p');
  subheading.innerText = surveySummarySubheading || 'Confirm the following information before submitting your inquiry.';
  headerDiv.append(heading, subheading);
  containerDiv.append(headerDiv, summaryForm);
  return containerDiv;
}
