export const constants = {
  tagName: 'hlx-aria-treeview',
};

export class AriaTreeView extends HTMLElement {
  static getId() {
    return Math.random().toString(32).substring(2);
  }

  connectedCallback() {
    this.decorate();
    this.attachListeners();
  }

  attachListeners() {
    this.querySelectorAll('[role="treeitem"]').forEach((item) => {
      item.addEventListener('keydown', (ev) => {
        const focusables = [...this.querySelectorAll('[role="treeitem"]')]
          .filter((i) => {
            const group = i.closest('[role="group"]');
            if (!group) {
              return true;
            }
            return this.querySelector(`[aria-owns="${group.id}"]`).getAttribute('aria-expanded') === 'true';
          });
        const group = ev.target.closest('[role="group"],[role="tree"]');
        switch (ev.key) {
          case 'ArrowUp':
            ev.preventDefault();
            this.focusItem(focusables[focusables.indexOf(ev.target) - 1]);
            break;
          case 'ArrowDown':
            ev.preventDefault();
            this.focusItem(focusables[focusables.indexOf(ev.target) + 1]);
            break;
          case 'ArrowRight': {
            ev.preventDefault();
            if (ev.target.getAttribute('aria-expanded') === 'false') {
              this.open(ev.target);
            } else if (ev.target.getAttribute('aria-owns')) {
              this.focusItem(focusables[focusables.indexOf(ev.target) + 1]);
            }
            break;
          }
          case 'ArrowLeft':
            ev.preventDefault();
            if (ev.target.getAttribute('aria-expanded') === 'true') {
              this.close(ev.target);
            } else if (group) {
              this.focusItem(this.querySelector(`[aria-owns="${group.id}`));
            }
            break;
          case 'Home':
            ev.preventDefault();
            this.focusItem(focusables[0]);
            break;
          case 'End':
            ev.preventDefault();
            this.focusItem(focusables[focusables.length - 1]);
            break;
          default:
            break;
        }
      });
    });
    this.querySelectorAll('[role="treeitem"] + button').forEach((toggle) => {
      toggle.addEventListener('click', (ev) => {
        const item = this.querySelector(`#${ev.target.getAttribute('aria-controls')}`);
        if (item.getAttribute('aria-expanded') === 'true') {
          this.close(item);
        } else {
          this.open(item);
        }
      });
    });
  }

  async decorate() {
    const root = this.querySelector('ul,ol');
    if (root.getAttribute('role') === 'tree') {
      return;
    }
    root.setAttribute('role', 'tree');
    root.setAttribute('aria-label', this.attributes.getNamedItem('label')?.value || '');
    root.setAttribute('aria-multiselectable', 'false');
    root.querySelectorAll('li').forEach((li) => {
      li.setAttribute('role', 'none');
    });
    root.querySelectorAll('a').forEach((a) => {
      a.id = `treeitem-${AriaTreeView.getId()}`;
      a.setAttribute('role', 'treeitem');
      a.setAttribute('tabindex', -1);
      const id = `group-${AriaTreeView.getId()}`;
      if (a.nextElementSibling && ['UL', 'OL'].includes(a.nextElementSibling.tagName)) {
        a.setAttribute('aria-expanded', 'false');
        a.setAttribute('aria-owns', id);
        a.nextElementSibling.id = id;
        const toggle = document.createElement('button');
        toggle.setAttribute('aria-controls', a.id);
        toggle.setAttribute('tabindex', -1);
        a.insertAdjacentElement('afterend', toggle);
      }
    });
    root.querySelectorAll('ul,ol').forEach((list) => {
      list.setAttribute('role', 'group');
      list.setAttribute('aria-labelledby', root.querySelector(`[aria-owns="${list.id}"]`).id);
    });
    const initialItem = root.querySelector('[role="treeitem"]');
    initialItem.setAttribute('aria-selected', true);
    initialItem.setAttribute('tabindex', 0);
  }

  focusItem(item) {
    if (!item) {
      return;
    }
    const oldItem = this.querySelector('[tabindex="0"]');
    if (oldItem) {
      oldItem.setAttribute('tabIndex', -1);
      oldItem.removeAttribute('aria-selected');
    }
    let group = item.closest('[role="group"]');
    while (group) {
      const parentItem = this.querySelector(`[aria-owns="${group.id}"`);
      if (parentItem.getAttribute('aria-expanded') === 'false') {
        this.open(parentItem);
      }
      group = parentItem.closest('[role="group"]');
    }
    item.setAttribute('tabIndex', 0);
    item.setAttribute('aria-selected', true);
    item.focus();
  }

  // eslint-disable-next-line class-methods-use-this
  close(item) {
    item.setAttribute('aria-expanded', 'false');
  }

  // eslint-disable-next-line class-methods-use-this
  open(item) {
    item.setAttribute('aria-expanded', 'true');
  }
}

customElements.define(constants.tagName, AriaTreeView);
