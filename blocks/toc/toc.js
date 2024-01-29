import { getPlaceholder } from '../../scripts/scripts.js';

function appendItems(items, container) {
  items.forEach((item) => {
    const newTOC = document.createElement('a');
    newTOC.href = `#${item.id}`;
    newTOC.innerText = item.innerText;
    container.appendChild(newTOC);
  });
}

export default async function decorate(block) {
  if (block.classList.contains('inline')) {
    const parent = block.closest('.toc-container');
    parent.classList.add('is-inline');
    const tocList = document.createElement('div');
    tocList.classList.add('toc-list');
    const citiesNames = document.querySelectorAll('.city h3');
    appendItems(citiesNames, tocList);
    block.innerHTML = '';
    block.appendChild(tocList);
  } else {
    const main = document.querySelector('main');
    const allH2s = main.querySelectorAll('main h2');
    const tocHeader = document.createElement('h2');
    const tocList = document.createElement('ol');
    tocHeader.innerText = getPlaceholder('tableOfContents');
    block.appendChild(tocHeader);
    if (allH2s.length > 1) {
      for (let index = 0; index < allH2s.length; index += 1) {
        const tagname = 'h'.concat(index);
        allH2s[index].id = tagname;
        const tocListItem = document.createElement('li');
        const tocEntry = document.createElement('a');
        tocEntry.setAttribute('href', '#'.concat(tagname));
        tocEntry.innerText = allH2s[index].innerText;
        tocListItem.appendChild(tocEntry);
        tocList.appendChild(tocListItem);
      }
      block.appendChild(tocList);
    }
  }
}
