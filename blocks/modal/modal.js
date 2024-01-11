import { loadCSS } from '../../scripts/lib-franklin.js';

/**
 * Creates a modal with id modalId, or if that id already exists, returns the existing modal.
 * To show the modal, call `modal.showModal()`.
 * @param modalId
 * @param createContent Callback called when the modal is first opened; should return html string
 * for the modal content
 * @param addEventListeners Optional callback called when the modal is first opened;
 * should add event listeners to body if needed
 * @returns {Promise<HTMLElement>} The <dialog> element, after loading css
 */
export default async function getModal(modalId, type, createContent, addEventListeners) {
  await loadCSS('/blocks/modal/modal.css');

  let dialogElement = document.getElementById(modalId);
  if (!dialogElement) {
    dialogElement = document.createElement('dialog');
    dialogElement.id = modalId;
    dialogElement.classList.add('dialog', type || '');

    const contentHTML = createContent?.() || '';

    dialogElement.innerHTML = `
          <button value="close"><span class="close-x"></span></button>
          ${contentHTML}
      `;

    document.body.appendChild(dialogElement);

    dialogElement.querySelector('button[value="close"]')
      .addEventListener('click', () => {
        dialogElement.close();
      });

    addEventListeners?.(dialogElement);
  }
  return dialogElement;
}

export async function createDialog(modalId, header, content, footer, type) {
  await loadCSS('/blocks/modal/modal.css');

  let dialogElement = document.getElementById(modalId);
  if (!dialogElement) {
    dialogElement = document.createElement('dialog');
    dialogElement.id = modalId;
    dialogElement.classList.add(type);

    let headerHTML;
    if (typeof header === 'function') {
      headerHTML = header(dialogElement);
    } else if (typeof header === 'string') {
      headerHTML = header;
    } else if (header instanceof HTMLElement) {
      headerHTML = header.outerHTML;
    }

    let contentHTML;
    if (typeof content === 'function') {
      contentHTML = content(dialogElement);
    } else if (typeof content === 'string') {
      contentHTML = content;
    } else if (content instanceof HTMLElement) {
      contentHTML = content.outerHTML;
    }

    let footerHTML;
    if (typeof footer === 'function') {
      footerHTML = footer(dialogElement);
    } else if (typeof footer === 'string') {
      footerHTML = footer;
    } else if (footer instanceof HTMLElement) {
      footerHTML = footer.outerHTML;
    }

    dialogElement.innerHTML = `
      <section>
        <form class="form" method="dialog">
          ${(header || footer) ? `
            <header class="dialog-header">
              <button type="button" value="close"><span class="icon icon-x"></span></button>
              ${headerHTML}
            </header>` : ''}
          <div class="dialog-content">${contentHTML}</div>
          ${footer ? `<footer class="dialog-footer">${footerHTML}</footer>` : ''}
        </form>
      </section>`;

    document.body.appendChild(dialogElement);

    dialogElement.querySelectorAll('header button, footer button').forEach((btn) => {
      if (btn.type !== 'submit') {
        btn.type = null;
        btn.setAttribute('formnovalidate', true);
      }
      if (!btn.value) {
        btn.value = btn.name;
      }
    });
  }
  return dialogElement;
}
