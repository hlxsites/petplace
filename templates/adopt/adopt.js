import { buildBlock, sampleRUM } from '../../scripts/lib-franklin.js';

// function createTemplateBlock(main, blockName) {
//     const section = document.createElement('div');
  
//     const block = buildBlock(blockName, { elems: [] });
//     block.dataset.limit = 16;
//     section.append(block);
//     main.append(section);
//   }
  
export async function loadEager(document) {
  console.log('loadEager');
  const main = document.querySelector('main');
  // if (isTrueSearch) {
  //   createTemplateBlock(main, 'pagination');
  //   main.insertBefore(), main.querySelector(':scope > div:nth-of-type(2)'));
  // } else {
  //   const response = await fetch('/fragments/404.plain.html');
  //   main.innerHTML = await response.text();
  // }
}
  
export async function loadLazy(main) {
  console.log('main', main);
  
}

/* Get multiple random elements from an Array */
export const getRandomItems = (array, count) => {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/* extract pet name from api returned name string */
export const extractName = (nameString) => {
  return nameString.replace(/\s*\([^)]*\)/, '').trim();
}

/*format phone number */
export const formatPhoneNumber = (phoneNumberString) => {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return null;
}