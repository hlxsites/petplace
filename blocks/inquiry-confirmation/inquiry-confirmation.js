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
        inquiryConfirmationHeading,
        inquiryConfirmationSubeading,
        inquiryConfirmationPetSearchCTALabel,
        inquiryConfirmationChecklistCTALabel,
    } = placeholders;
    block.textContent = '';
    const container = document.createElement('div');
    container.className = 'inquiry-confirmation__container';
    const checkmark = document.createElement('div');
    checkmark.className = 'inquiry-confirmation__checkmark';
    const heading = document.createElement('h2');
    heading.innerText = inquiryConfirmationHeading || 'Inquiry Submitted';
    const subheading = document.createElement('div');
    subheading.className = 'inquiry-confirmation__subheading';
    subheading.innerText = inquiryConfirmationSubeading || 'Check out our adoption checklist for the next steps of adopting a pet. If you need to edit your pet match survey in the future, visit ‘My Account’.';
    const ctaContainer = document.createElement('div');
    ctaContainer.className = 'inquiry-confirmation__cta-container';
    ctaContainer.innerHTML = `
        <a class='button inquiry-confirmation__button secondary' href=${searchUrl}>${inquiryConfirmationPetSearchCTALabel || 'Back to Pet Search'}</a>
        <a class='button inquiry-confirmation__button primary' href=${checklistUrl}>${inquiryConfirmationChecklistCTALabel || 'View Adoption Checklist'}</a>
    `;
    container.append(checkmark, heading, subheading, ctaContainer);
    block.append(container);
}