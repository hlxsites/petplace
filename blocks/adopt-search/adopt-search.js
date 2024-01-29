import { sampleRUM } from '../../scripts/lib-franklin.js';

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
  
//   const form = document.createElement('form');
//   form.setAttribute('role', 'search');
//   form.className = 'search-box-wrapper';
//   form.action = '/discovery';
//   form.addEventListener('submit', (ev) => {
//     // const query = ev.target.querySelector('.search-input').value;
//     // if (!query) {
//     //   ev.preventDefault();
//     //   return;
//     // }
//     // sampleRUM('search', { source: '.search-input', target: query });
//   });

//   const input = document.createElement('input');
//   input.setAttribute('aria-label', searchPlaceholder);
//   input.className = 'search-input';
//   input.type = 'search';
//   input.name = 'q';
//   input.id = 'genai-search-box';
//   input.placeholder = searchPlaceholder;


//   const clearButton = document.createElement('button');
//   clearButton.setAttribute('id', 'clearButton');
//   clearButton.setAttribute('type', 'button');
//   clearButton.innerHTML = '&#10005;';


//   input.addEventListener('input', () => {
//     if (input.value.trim() !== '') {
//       clearButton.classList.add('show');
//     } else {
//       clearButton.classList.remove('show');
//     }
//   });

//   input.addEventListener('focus', () => {
//     if (input.value.trim() !== '') {
//       clearButton.classList.add('show');
//     }
//   });
//   input.addEventListener('focusout', () => {
//     clearButton.classList.remove('show');
//   });

//   clearButton.addEventListener('click', () => {
//     input.value = '';
//     input.focus();
//     clearButton.classList.remove('show');
//   });

//   form.append(clearButton);

//   form.append(input);

//   const button = document.createElement('button');
//   button.type = 'submit';
//   button.className = 'search-button';
//   button.textContent = searchButtonText;
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
//   form.append(button); 
//   block.innerHTML = '';
//   block.append(form);

//   const usp = new URLSearchParams(window.location.search);
//   block.querySelector('.search-input').value = usp.get('q') || '';
}
