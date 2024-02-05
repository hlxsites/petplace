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
  