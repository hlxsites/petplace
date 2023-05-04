export const constants = {
  tagName: 'hlx-aria-dialog',
};

export class AriaDialog extends HTMLElement {
  static getId() {
    return Math.random().toString(32).substring(2);
  }

  connectedCallback() {
    this.decorate();
    this.attachListeners();
  }

  attachListeners() {
    this.querySelector('button').addEventListener('click', (ev) => {
      const dialog = document.getElementById(ev.currentTarget.getAttribute('aria-controls'));
      const visible = dialog.getAttribute('aria-hidden') !== 'true';
      if (visible) {
        this.close();
      } else {
        this.open();
      }
    });
    this.querySelector('[role="dialog"] button').addEventListener('click', () => {
      this.close();
    });
    this.addEventListener('keydown', (ev) => {
      switch (ev.key) {
        case 'Escape':
          ev.stopPropagation();
          this.close();
          break;
        default:
          break;
      }
    });
    this.querySelector('[role="dialog"]').addEventListener('keydown', (ev) => {
      if (ev.key !== 'Tab') {
        return;
      }
      const focusables = this.getFocusables();
      if (ev.target === focusables[0] && ev.shiftKey) {
        ev.preventDefault();
        [...this.getFocusables()].pop().focus();
      } else if (ev.target === focusables[focusables.length - 1] && !ev.shiftKey) {
        ev.preventDefault();
        this.getFocusables()[0].focus();
      }
    });
  }

  getFocusables() {
    return this.querySelector('[role="dialog"]')
      .querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  }

  async decorate() {
    const id1 = AriaDialog.getId();
    const id2 = AriaDialog.getId();
    const button = document.createElement('button');
    button.id = id1;
    button.setAttribute('aria-controls', id2);
    button.innerHTML = this.firstElementChild.outerHTML;
    this.firstElementChild.replaceWith(button);

    const close = document.createElement('button');
    close.setAttribute('aria-controls', id2);

    const dialog = document.createElement('div');
    dialog.id = id2;
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-hidden', true);
    dialog.setAttribute('aria-labelledby', id1);
    dialog.setAttribute('aria-modal', this.attributes.getNamedItem('modal')
      && this.attributes.getNamedItem('modal').value === 'true');
    dialog.innerHTML = this.firstElementChild.nextElementSibling.outerHTML;
    dialog.firstElementChild.prepend(close);
    this.firstElementChild.nextElementSibling.replaceWith(dialog);
  }

  async close() {
    const dialog = this.querySelector('[role="dialog"]');
    dialog.setAttribute('aria-hidden', true);
    if (dialog.getAttribute('aria-modal') === 'true') {
      document.body.style.overflow = '';
    }
    this.firstElementChild.focus();
  }

  async open() {
    const dialog = this.querySelector('[role="dialog"]');
    dialog.setAttribute('aria-hidden', false);
    if (dialog.getAttribute('aria-modal') === 'true') {
      document.body.style.overflow = 'hidden';
    }
    const [, el] = this.getFocusables();
    if (el) {
      el.focus();
    }
  }
}

customElements.define(constants.tagName, AriaDialog);
