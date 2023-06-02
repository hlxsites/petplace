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
      .querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  }

  async decorate() {
    const id1 = AriaDialog.getId();
    const id2 = AriaDialog.getId();
    const button = document.createElement('button');
    button.id = id1;
    button.setAttribute('aria-controls', id2);
    button.innerHTML = '';
    button.append(this.firstElementChild);
    this.prepend(button);

    const close = document.createElement('button');
    close.setAttribute('aria-controls', id2);

    const dialog = document.createElement('div');
    dialog.id = id2;
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-hidden', true);
    dialog.setAttribute('aria-labelledby', id1);
    dialog.setAttribute('aria-modal', this.attributes.getNamedItem('modal')
      && this.attributes.getNamedItem('modal').value === 'true');
    dialog.innerHTML = '';
    dialog.append(button.nextElementSibling);
    dialog.firstElementChild.prepend(close);
    this.append(dialog);
  }

  async close() {
    const dialog = this.querySelector('[role="dialog"]');
    function handleClose() {
      if (dialog.getAttribute('aria-modal') === 'true') {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }
      this.firstElementChild.focus();
    }
    return (this.onToggle ? this.onToggle(false) : Promise.resolve())
      .then(() => {
        handleClose.call(this);
        dialog.setAttribute('aria-hidden', true);
      });
  }

  async open() {
    const dialog = this.querySelector('[role="dialog"]');
    dialog.setAttribute('aria-hidden', false);
    function handleOpen() {
      if (dialog.getAttribute('aria-modal') === 'true') {
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = '15px';
      }
      const [, el] = this.getFocusables();
      if (el) {
        el.focus();
      }
    }
    if (this.onToggle) {
      return new Promise((resolve) => {
        window.requestAnimationFrame(() => {
          this.onToggle(true)
            .then(handleOpen.bind(this))
            .then(resolve);
        });
      });
    }
    handleOpen.call(this);
    return Promise.resolve();
  }
}

customElements.define(constants.tagName, AriaDialog);
