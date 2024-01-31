import { sampleRUM, fetchPlaceholders} from '../../scripts/lib-franklin.js';

// fetch placeholders from the 'en' folder
const placeholders = await fetchPlaceholders('/adopt');
// retrieve the value for key 'foo'
const { petTypeLabel, petTypeValues, breedLabel, breedPlaceholder, zipLabel, zipPlaceholder, zipErrorMessage, searchButtonText } = placeholders;
console.log('placeholders', petTypeLabel, petTypeValues, breedLabel, breedPlaceholder, zipLabel, zipPlaceholder, zipErrorMessage, searchButtonText);

function createLabel(fd) {
    const label = document.createElement('label');
    label.setAttribute('for', fd.Field);
    label.textContent = fd.Label;
    if (fd.Required && fd.Required !== 'false') {
        label.classList.add('required');
    }
    return label;
}

function parseData(data) {
    const blockMetaData = {};
    [...data.children].forEach((row) => {
        if (row.children.length > 1) {
            Object.assign(blockMetaData, { [row.children[0].innerText]: row.children[1].innerText });
        }
    });
    return blockMetaData
}

export default async function decorate(block) {
    const blockMetaData = parseData(block);

    console.log('blockMetaData', blockMetaData);


    const form = document.createElement('form');
    form.setAttribute('role', 'search');
    form.className = 'adopt-search-box-wrapper';
    //   form.action = '/discovery';
    //   form.addEventListener('submit', (ev) => {
    //     // const query = ev.target.querySelector('.search-input').value;
    //     // if (!query) {
    //     //   ev.preventDefault();
    //     //   return;
    //     // }
    //     // sampleRUM('search', { source: '.search-input', target: query });
    //   });

    const radioContainer = document.createElement('fieldset');
    if (blockMetaData.petTypeValues) {
        const legend = document.createElement('legend');
        legend.innerText = blockMetaData.petTypeLabel;
        radioContainer.append(legend);
        const petTypes = blockMetaData.petTypeValues.split(',');
        console.log('petTypes', petTypes)
        petTypes.forEach((petType) => {
            const p = document.createElement('div');
            const label = document.createElement('label');
            label.setAttribute('for', `radio-${petType}`);
            label.innerText = petType;
            const radio = document.createElement('input');
            //   input.setAttribute('aria-label', blockMetaData.)
            radio.type = "radio";
            radio.name = 'petType';
            radio.id = `radio-${petType}`;
            radio.value = petType;
            p.append(radio)
            p.append(label)
            radioContainer.append(p)
        })

    }

    const breedContainer = document.createElement('div');
    const breedLabel = document.createElement('label');
    breedLabel.for = "breed";
    breedLabel.innerText = blockMetaData.breedLabel;

    const breedSelect = document.createElement('select');
    breedSelect.name = "breed";
    breedSelect.id = "breed";
    breedSelect.className = 'form-select-wrapper';
    const option = document.createElement('option');
    option.innerText = blockMetaData.breedPlaceholder
    option.value = '';

    breedSelect.append(option);
    breedContainer.append(breedLabel)
    breedContainer.append(breedSelect);

    const zipContainer = document.createElement('div');
    const zipLabel = document.createElement('label');
    zipLabel.setAttribute('for', "zipCode");
    zipLabel.innerText = blockMetaData.zipLabel;

    const zipInput = document.createElement('input');
    zipInput.setAttribute('aria-label', blockMetaData.zipPlaceholder);
    zipInput.className = 'zipCode';
    zipInput.type = 'text';
    zipInput.name = 'zip';
    zipInput.id = 'zip';
    zipInput.pattern = `^\\d{5}(?:[-\\s]\\d{4})?$`;
    zipInput.required = true;
    zipInput.placeholder = blockMetaData.zipPlaceholder;
    zipContainer.append(zipLabel);
    zipContainer.append(zipInput);


    const clearButton = document.createElement('button');
    clearButton.setAttribute('id', 'clearButton');
    clearButton.setAttribute('type', 'button');
    clearButton.innerHTML = '&#10005;';

    zipInput.addEventListener('input', () => {
        if (zipInput.value.trim() !== '') {
            clearButton.classList.add('show');
        } else {
            clearButton.classList.remove('show');
        }
    });

    zipInput.addEventListener('focus', () => {
        if (zipInput.value.trim() !== '') {
            clearButton.classList.add('show');
        }
    });
    zipInput.addEventListener('focusout', () => {
        clearButton.classList.remove('show');
    });

    clearButton.addEventListener('click', () => {
        zipInput.value = '';
        zipInput.focus();
        clearButton.classList.remove('show');
    });
    zipContainer.append(clearButton)
    //   form.append(clearButton);


    const button = document.createElement('button');
    button.type = 'submit';
    button.className = 'adopt-search-button';
    button.textContent = blockMetaData.searchButtonText;
    //   const xhr = new XMLHttpRequest();
    //   xhr.open('GET', `${window.hlx.codeBasePath}/icons/send.svg`, true);
    //   xhr.onreadystatechange = function () {
    //     if (xhr.readyState === 4 && xhr.status === 200) {
    //       // On successful response, create and append the SVG element
    //       const svgElement = document.createElement('svg');
    //       svgElement.className = 'icon-search';
    //       svgElement.innerHTML = xhr.responseText;
    //       button.appendChild(svgElement);
    //     }
    //   };
    //   xhr.send();
    form.append(radioContainer);

    form.append(breedContainer);

    form.append(zipContainer);
    form.append(button);

    console.log('block', block,form)
    
    const heroContainer = document.querySelector('.columns.hero');

    if(heroContainer?.firstElementChild?.lastElementChild != null){
        const formWrapper = document.createElement('div');
        formWrapper.className = "adopt-search-wrapper"
        formWrapper.append(form);
        block.innerHTML = '';
        
        heroContainer.firstElementChild.lastElementChild.append(formWrapper);
    } else {
        
        block.innerHTML = ''; 
        block.append(form); 
    }
    
    //   const usp = new URLSearchParams(window.location.search);
    //   block.querySelector('.search-input').value = usp.get('q') || '';
}
