import { sampleRUM } from '../../scripts/lib-franklin.js';

function createLabel(fd) {
    const label = document.createElement('label');
    label.setAttribute('for', fd.Field);
    label.textContent = fd.Label;
    if (fd.Required && fd.Required !== 'false') {
      label.classList.add('required');
    }
    return label;
  }

export default async function decorate(block) {
  const blockMetaData = {};
  [...block.children].forEach((row) => {
    if (row.children.length > 1) {
      Object.assign(blockMetaData, { [row.children[0].innerText]: row.children[1].innerText });
    }
  });
  console.log('blockMetaData', blockMetaData)

//   const searchPlaceholder = block.firstElementChild.children[0].textContent || 'Ask a question or enter a topic....';
//   const searchButtonText = block.firstElementChild.children[1].textContent || 'Submit';
  
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
  if(blockMetaData.petTypeValues){
    const legend = document.createElement('legend');
    legend.innerText = blockMetaData.petTypeLabel;
    radioContainer.append(legend);
    const petTypes = blockMetaData.petTypeValues.split(',');
    console.log('petTypes', petTypes)
    petTypes.forEach((petType) => {
        console.log('type',petType)
        const p = document.createElement('div');
        const label = document.createElement('label');
        label.setAttribute('for',`radio-${petType}`);
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
  option.innerText =  blockMetaData.breedPlaceholder
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
  zipInput.name = 'zipCode';
  zipInput.id = 'zipCode';
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

form.append(zipContainer)

  form.append(button); 

  block.innerHTML = '';
  block.append(form);

//   const usp = new URLSearchParams(window.location.search);
//   block.querySelector('.search-input').value = usp.get('q') || '';
}
