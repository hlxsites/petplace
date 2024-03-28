import { constants as AriaDialog } from '../../scripts/aria/aria-dialog.js';

export default function decorate(block) {
  const ariaDialog = document.createElement(AriaDialog.tagName);
  ariaDialog.setAttribute('modal', true);

  if (block.children.length > 1) {
    ariaDialog.append(block.children[0].children[0]);
  } else {
    const showDialog = document.createElement('button');
    showDialog.classList.add('popup-show');
    showDialog.innerText = '';
    ariaDialog.append(showDialog);
  }

  const contentContainer = document.createElement('div');
  const target = block.children[block.children.length > 1 ? 1 : 0].children[0];
  [...target.children].forEach((child) => {
    contentContainer.append(child);
  });
  ariaDialog.append(contentContainer);
  target.append(ariaDialog);

  if (block.children.length < 2) {
    ariaDialog.open();
  }
}
