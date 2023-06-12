import { toClassName } from '../../scripts/lib-franklin.js';

const HEADINGS_SELECTOR = 'h1,h2,h3,h4,h5,h6';

export const constants = {
  tagName: 'hlx-aria-accordion',
  withControls: 'with-controls',
};

export class AriaAccordion extends HTMLElement {
  connectedCallback() {
    this.selectedIndex = 0;
    this.itemsCount = this.children.length;
    this.decorate();
    this.attachListeners();
  }

  attachListeners() {
    const items = this.querySelectorAll('button[aria-expanded]');
    items.forEach((item) => {
      item.addEventListener('click', (ev) => {
        this.toggleItem(ev.currentTarget);
        if (!ev.detail) { // it was triggered via keyboard space/enter
          ev.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
      item.addEventListener('keydown', (ev) => {
        switch (ev.key) {
          case 'Home':
            ev.preventDefault();
            this.focusItem(0);
            break;
          case 'ArrowUp':
            ev.preventDefault();
            this.focusItem(this.selectedIndex - 1);
            break;
          case 'ArrowDown':
            ev.preventDefault();
            this.focusItem(this.selectedIndex + 1);
            break;
          case 'End':
            ev.preventDefault();
            this.focusItem(this.itemsCount - 1);
            break;
          default:
            break;
        }
      });
    });
    if (this.attributes[constants.withControls] && this.attributes[constants.withControls].value === 'true') {
      const [expand, collapse] = [...this.querySelectorAll('[role="group"] button')];
      expand.addEventListener('click', () => this.toggleAll(true));
      collapse.addEventListener('click', () => this.toggleAll(false));
    }
  }

  async decorate() {
    let idBtn;
    let idPnl;
    const previousHeadings = [...document.querySelectorAll(HEADINGS_SELECTOR)]
      // eslint-disable-next-line no-bitwise
      .filter((h) => h.compareDocumentPosition(this) & Node.DOCUMENT_POSITION_FOLLOWING);
    const headingLevel = previousHeadings.length
      ? Number(previousHeadings.pop().tagName.substring(1)) + 1
      : 1;
    [...this.children].forEach((el, i) => {
      idBtn = Math.random().toString(32).substring(2);
      idPnl = Math.random().toString(32).substring(2);

      const button = document.createElement('button');
      button.id = idBtn;
      button.setAttribute('aria-expanded', false);
      button.setAttribute('aria-controls', idPnl);
      button.setAttribute('tabindex', i === this.selectedIndex ? 0 : -1);
      if (el.firstElementChild.matches(HEADINGS_SELECTOR)) {
        button.append = el.firstElementChild.innerHTML;
        el.firstElementChild.innerHTML = '';
        el.firstElementChild.append(button);
      } else {
        button.append(el.firstElementChild);
        const heading = document.createElement(`h${headingLevel}`);
        heading.id = toClassName(button.textContent);
        heading.append(button);
        el.prepend(heading);
      }

      const panel = document.createElement('div');
      panel.id = idPnl;
      panel.setAttribute('role', 'region');
      panel.setAttribute('aria-hidden', true);
      panel.setAttribute('aria-labelledby', idBtn);
      panel.append(el.firstElementChild.nextElementSibling);
      el.append(panel);
    });
    if (this.attributes[constants.withControls] && this.attributes[constants.withControls].value === 'true') {
      const ids = [...this.querySelectorAll('[role="region"]')].map((el) => el.id).join(' ');
      const div = document.createElement('div');
      div.setAttribute('role', 'group');
      const expand = document.createElement('button');
      expand.setAttribute('aria-controls', ids);
      expand.textContent = 'Expand All';
      div.append(expand);
      const collapse = document.createElement('button');
      collapse.setAttribute('aria-controls', ids);
      collapse.textContent = 'Collapse All';
      collapse.disabled = true;
      div.append(collapse);
      this.prepend(div);
    }
  }

  toggleAll(visible) {
    this.querySelectorAll('button[aria-expanded]').forEach((btn) => {
      btn.setAttribute('aria-expanded', visible);
      btn.parentElement.nextElementSibling.setAttribute('aria-hidden', !visible);
    });
    if (this.attributes[constants.withControls] && this.attributes[constants.withControls].value === 'true') {
      const [expand, collapse] = [...this.querySelectorAll('[role="group"] button')];
      expand.disabled = visible;
      collapse.disabled = !visible;
    }
  }

  toggleItem(el) {
    const index = [...this.querySelectorAll('button[aria-expanded]')].indexOf(el);
    if (index !== this.selectedIndex) {
      this.focusItem(index);
    }
    const expanded = el.getAttribute('aria-expanded') === 'true';
    el.setAttribute('aria-expanded', !expanded);
    el.parentElement.nextElementSibling.setAttribute('aria-hidden', expanded);
    if (this.attributes[constants.withControls] && this.attributes[constants.withControls].value === 'true') {
      const [expand, collapse] = [...this.querySelectorAll('[role="group"] button')];
      expand.disabled = !this.querySelector('button[aria-expanded="false"]');
      collapse.disabled = !this.querySelector('button[aria-expanded="true"]');
    }
  }

  focusItem(index) {
    let rotationIndex = index;
    if (index < 0) {
      rotationIndex = this.itemsCount - 1;
    } else if (index > this.itemsCount - 1) {
      rotationIndex = 0;
    }
    const buttons = this.querySelectorAll('button[aria-expanded]');
    buttons[this.selectedIndex].setAttribute('tabindex', -1);
    this.selectedIndex = rotationIndex;
    buttons[this.selectedIndex].setAttribute('tabindex', 0);
    buttons[this.selectedIndex].focus();
  }
}

customElements.define(constants.tagName, AriaAccordion);
