export const constants = {
  tagName: 'hlx-aria-menu',
};

export class AriaMenu extends HTMLElement {
  static getId() {
    return Math.random().toString(32).substring(2);
  }

  connectedCallback() {
    this.decorate();
    this.attachListeners();
  }

  attachListeners() {
    this.firstElementChild.addEventListener('click', (ev) => {
      this.toggleMenu(ev.currentTarget);
    });
    this.firstElementChild.addEventListener('keydown', (ev) => {
      const menu = ev.target.nextElementSibling;
      const items = [...menu.querySelectorAll(':scope > [role="none"] > [role="menuitem"]')];
      switch (ev.key) {
        case 'ArrowUp':
          ev.preventDefault();
          this.toggleMenu(ev.currentTarget);
          this.focusItem(menu, items.length - 1);
          break;
        case 'ArrowDown':
          ev.preventDefault();
          this.toggleMenu(ev.currentTarget);
          break;
        default:
          break;
      }
    });
    this.querySelectorAll('[role="menuitem"]').forEach((item) => {
      item.addEventListener('click', (ev) => {
        this.toggleMenu(ev.currentTarget);
      });
      item.addEventListener('keydown', (ev) => {
        const menu = ev.currentTarget.closest('[role="menu"]');
        if (!menu) {
          return;
        }
        const items = [...menu.querySelectorAll(':scope > [role="none"] > [role="menuitem"]')];
        const currentIndex = items.indexOf(ev.currentTarget);
        switch (ev.key) {
          case 'Escape':
            this.closeAll();
            break;
          case 'Home':
            ev.preventDefault();
            this.focusItem(menu, 0);
            break;
          case 'ArrowUp':
            ev.preventDefault();
            this.focusItem(menu, currentIndex - 1);
            break;
          case 'ArrowDown':
            ev.preventDefault();
            this.focusItem(menu, currentIndex + 1);
            break;
          case 'ArrowLeft': {
            ev.preventDefault();
            if (ev.currentTarget.getAttribute('aria-expanded') === 'true') {
              this.toggleMenu(ev.currentTarget);
            }
            const parentMenu = ev.currentTarget.closest('[role="menu"]');
            if (!parentMenu) {
              return;
            }
            const parentItem = this.querySelector(`[aria-controls="${parentMenu.id}"]`);
            this.toggleMenu(parentItem);
            break;
          }
          case 'ArrowRight':
            ev.preventDefault();
            this.toggleMenu(ev.currentTarget);
            break;
          case 'End':
            ev.preventDefault();
            this.focusItem(menu, items.length - 1);
            break;
          case 'Tab':
            this.closeAll(false);
            break;
          default:
            break;
        }
      });
    });

    // Hide the menu if we click outside of it, unless autohide is explicitly set to false
    if (!this.attributes.getNamedItem('autohide')
      || this.attributes.getNamedItem('autohide').value === 'false') {
      return;
    }
    document.addEventListener('click', (ev) => {
      if (ev.target.closest('hlx-aria-menu')) {
        return;
      }
      this.querySelectorAll('[aria-expanded="true"]').forEach((el) => {
        el.setAttribute('aria-expanded', false);
      });
      this.querySelectorAll('[aria-hidden="false"]').forEach((el) => {
        el.setAttribute('aria-hidden', true);
        // Required for animating the height
        if (el.tagName === 'UL') {
          el.style.maxHeight = 0;
        }
      });
    });
  }

  async decorate() {
    const button = document.createElement('button');
    button.innerHTML = '';
    button.append(this.firstElementChild);
    button.setAttribute('aria-expanded', false);
    button.setAttribute('aria-haspopup', true);
    this.firstElementChild.replaceWith(button);
    this.querySelectorAll('li').forEach((item) => {
      item.setAttribute('role', 'none');
      item.childNodes.forEach((child, i) => {
        if (child.nodeType === Node.TEXT_NODE && i === 0) {
          const toggle = document.createElement('button');
          toggle.setAttribute('role', 'menuitem');
          toggle.tabIndex = -1;
          toggle.textContent = child.nodeValue;
          child.replaceWith(toggle);
        } else if (child.nodeType === Node.TEXT_NODE && !child.nodeValue.trim()) {
          child.remove();
        } else if (child.nodeName === 'A') {
          child.setAttribute('role', 'menuitem');
          child.tabIndex = -1;
        } else if ((child.nodeName === 'UL' || child.nodeName === 'OL')) {
          child.previousSibling.setAttribute('aria-expanded', false);
          child.previousSibling.setAttribute('aria-haspopup', true);
        }
      });
    });
    this.querySelectorAll('ul,ol').forEach((list) => {
      const id = AriaMenu.getId();
      list.id = id;
      list.setAttribute('role', 'menu');
      list.setAttribute('aria-hidden', true);
      list.previousElementSibling.setAttribute('aria-controls', id);
    });
    this.querySelector('[role="menuitem"]').tabIndex = 0;
  }

  async close(menu) {
    return (this.onToggle ? this.onToggle(menu, false) : Promise.resolve())
      .then(() => { menu.setAttribute('aria-hidden', true); });
  }

  async open(menu) {
    menu.setAttribute('aria-hidden', false);
    if (this.onToggle) {
      return new Promise((resolve) => {
        window.requestAnimationFrame(() => {
          this.onToggle(menu, true)
            .then(resolve);
        });
      });
    }
    return Promise.resolve();
  }

  closeAll(focusToggle = true) {
    this.querySelectorAll('[role="menuitem"][aria-expanded="true"]').forEach((item) => {
      item.setAttribute('aria-expanded', false);
      item.tabIndex = -1;
    });
    this.querySelectorAll('[role="menu"][aria-hidden="false"]').forEach(this.close.bind(this));
    this.firstElementChild.setAttribute('aria-expanded', false);
    if (focusToggle) {
      this.firstElementChild.focus();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  focusItem(menu, index) {
    const items = [...menu.querySelectorAll(':scope > [role="none"] > [role="menuitem"]')];
    let i = index;
    if (i < 0) {
      i = items.length - 1;
    } else if (i > items.length - 1) {
      i = 0;
    }
    const current = items.find((item) => item.tabIndex === 0);
    if (current) {
      current.tabIndex = -1;
    }
    items[i].tabIndex = 0;
    items[i].focus();
  }

  async toggleMenu(item) {
    const expanded = item.getAttribute('aria-expanded') === 'true';
    const menu = document.getElementById(item.getAttribute('aria-controls'));
    if (!menu) {
      return;
    }
    item.setAttribute('aria-expanded', !expanded);
    await (expanded ? this.close(menu) : this.open(menu));
    if (expanded) {
      item.tabIndex = 0;
      item.focus();
    } else {
      if (item !== this.firstElementChild) {
        item.tabIndex = -1;
      }
      this.focusItem(menu, 0);
    }
  }
}

customElements.define(constants.tagName, AriaMenu);
