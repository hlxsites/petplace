/* eslint-disable indent */
import { fetchPlaceholders, readBlockConfig } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
    const cfg = readBlockConfig(block);
    const searchUrl = cfg['pet-search-results-page-url'];
    const checklistUrl = cfg['adoption-checklist-page-url'];
    // fetch placeholders from the 'adopt' folder
    const placeholders = await fetchPlaceholders('/adopt');
    // retrieve the value for Pet Survey
    const {
        surveyConfirmationHeading,
        surveyConfirmationSubeading,
        surveyConfirmationPetSearchCTALabel,
        surveyConfirmationChecklistCTALabel,
    } = placeholders;
    block.textContent = '';
    const container = document.createElement('div');
    container.className = 'survey-confirmation__container';
    const checkmark = document.createElement('div');
    checkmark.className = 'survey-confirmation__checkmark';
    const heading = document.createElement('h2');
    heading.innerText = surveyConfirmationHeading || 'Survey Submitted';
    const subheading = document.createElement('div');
    subheading.className = 'survey-confirmation__subheading';
    subheading.innerText = surveyConfirmationSubeading || 'Check out our adoption checklist for the next steps of adopting a pet. If you need to edit your pet match survey in the future, visit ‘My Account’.';
    const ctaContainer = document.createElement('div');
    ctaContainer.className = 'survey-confirmation__cta-container';
    ctaContainer.innerHTML = `
        <a class='button survey-confirmation__button secondary' href=${searchUrl}>${surveyConfirmationPetSearchCTALabel || 'Back to Pet Search'}</a>
        <a class='button survey-confirmation__button primary' href=${checklistUrl}>${surveyConfirmationChecklistCTALabel || 'View Adoption Checklist'}</a>
    `;
    container.append(checkmark, heading, subheading, ctaContainer);
    block.append(container);
}
