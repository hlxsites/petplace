export function createInput(wrapperClass = '', type, id, name, value, labelText) {
    const div = document.createElement('div');
    if (wrapperClass) {
        div.className = wrapperClass;        
    }
    const input = document.createElement('input');
    input.type = type;
    input.value = value;
    input.name = name;
    input.id = id;
    input.setAttribute('data-label-text', labelText);
    const label = document.createElement('label');
    label.setAttribute('for', id);
    label.innerText = labelText;
    div.append(input, label);
    return div;
}
export function createControlGroup(Id, IsMultiAnswer, Label, options) {
    const type = IsMultiAnswer ? 'checkbox' : 'radio';
    const container = document.createElement('div');
    container.setAttribute('role', 'group');
    container.setAttribute('aria-label', Label);
    container.setAttribute('tabindex', '0');
    options.forEach((option) => {
        const input = createInput('custom-input', type, `question-${Id}-option-${option.Id}`, IsMultiAnswer ? `question-${Id}-option-${option.Id}` :`question-${Id}`, option.AnswerText, option.AnswerText);
        container.append(input);
    });
    return container;
}
export function createSingleSelect(questionId, options, label = null, className = null, attributes = null) {
    const containerDiv = document.createElement('div');
    containerDiv.className = `single-select ${className || ''}`;
    if (label) {
        const labelEl = document.createElement('label');
        labelEl.setAttribute('for', `question-${questionId}`);
        labelEl.innerText = label;
        containerDiv.append(labelEl);
    }
    const select = document.createElement('select');
    select.name = `question-${questionId}`;
    select.id = `question-${questionId}`;
    if (attributes) {
        const keys = Object.keys(attributes);
        keys.forEach((key) => {
            select.setAttribute(key, attributes[key]);
        });
    }
    options.forEach((option) => {
        const op = document.createElement('option');
        op.innerText = option.AnswerText;
        op.value = option.AnswerText;
        select.append(op);
    });
    containerDiv.append(select);
    return containerDiv;
}
export function createMultiSelect(questionId, options, label = null, className = null) {
    const containerDiv = document.createElement('div');
    containerDiv.className = `multi-select ${className || ''}`;
    containerDiv.id = `multi-select-question-${questionId}`;
    if (label) {
        const labelEl = document.createElement('div');
        labelEl.className = 'label';
        labelEl.innerText = label;
        containerDiv.append(labelEl);
    }
    const button = document.createElement('button');
    button.id = `multi-select-button-${questionId}`;
    button.className = 'multi-select__button';
    button.type = 'button';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', `multi-select-options-${questionId}`);
    const text = document.createElement('span');
    text.className = 'multi-select__button-text';
    text.innerText = 'Select from menu...';
    const icon = document.createElement('span');
    icon.className = 'multi-select__button-icon';
    button.append(text, icon);
    const groupDiv = document.createElement('div');
    groupDiv.setAttribute('role', 'group');
    groupDiv.setAttribute('aria-labelledby', `multi-select-button-${questionId}`);
    groupDiv.setAttribute('tabindex', '0');
    groupDiv.className = 'multi-select__options';
    groupDiv.id = `multi-select-options-${questionId}`;
    options.forEach((option, index) => {
        groupDiv.append(createInput('multi-select-input', 'checkbox', `question-${questionId}-option-${index}`, `question-${questionId}-option-${index}`, option.Id, option.AnswerText));
    });
    containerDiv.append(button, groupDiv);
    return containerDiv;
}
export function createQuestion(item, index) {
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
        if (IsMultiAnswer) {
            optionsDiv.append(createMultiSelect(Id, QuestionOptions));
        } else {
            optionsDiv.append(createSingleSelect(Id, Label, QuestionOptions));
        }
    } else {
        optionsDiv.append(createControlGroup(Id, IsMultiAnswer, Label, QuestionOptions));
    }
    itemDiv.append(optionsDiv);
    return itemDiv;
}
export function createPresurvey(preSurveyHeading, preSurveySubheading, preSurveySignInLabel, surveyCancelLabel, surveyStartLabel) {
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
export function createSurveySteps(surveyHeading, questions) {
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
export const createSummary = (animalType, surveyResponseAnswers) => {
    const form = document.createElement('form');
    form.id = `${animalType}-survey-form`;
    form.name = `${animalType}-survey-form`;
    form.className = 'pet-survey__form';
    surveyResponseAnswers.forEach((response) => {
        const { Question } = response;
        if (Question.IsMultiAnswer) {
            form.append(createMultiSelect(Question.Id, Question.QuestionOptions, Question.Label, 'pet-survey__form-control'));
        } else {
           form.append(createSingleSelect(Question.Id, Question.QuestionOptions, Question.Label, 'pet-survey__form-control', Question.Label === 'Desired Pet Type' ? {'disabled' : 'disabled'}: null));
        }

    });
    return form;
}