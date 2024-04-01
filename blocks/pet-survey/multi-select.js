/* eslint-disable indent */
export default class MultiSelect {
    constructor(wrapperNode) {
        this.defaultButtonText = 'Select from menu...';
        this.containerNode = wrapperNode;
        this.toggleButtonNode = this.containerNode.querySelector('.multi-select__button');
        this.toggleButtonTextNode = this.containerNode.querySelector('.multi-select__button-text');
        this.checkboxNodes = Array.from(this.containerNode.querySelectorAll('input[type=\'checkbox\']'));
        this.containerNodes = Array.from(document.querySelectorAll('body'));
        this.toggleButtonNode.addEventListener('click', this.onButtonClick.bind(this, this.toggleButtonNode));
        this.checkboxNodes.forEach((checkbox) => {
          checkbox.addEventListener('change', this.onChange.bind(this));
        });
        this.containerNodes.forEach((container) => {
          container.addEventListener('focusout', this.handleFocusOut.bind(this));
        });
        document.onkeydown = (event) => {
          const evt = event;
          let isEscape = false;
          if ('key' in evt) {
            isEscape = evt.key === 'Escape' || evt.key === 'Esc';
          } else {
            isEscape = evt.keyCode === 27;
          }
          if (isEscape) {
            this.onButtonClick(this.toggleButtonNode, 'close');
          }
        };
    }

    onButtonClick(button, state) {
        const btn = button;
        // force the options group to collapse
        if (state === 'close') {
          btn.setAttribute('aria-expanded', 'false');
        } else if (btn.getAttribute('aria-expanded') === 'false') {
          btn.setAttribute('aria-expanded', 'true');
        } else {
          btn.setAttribute('aria-expanded', 'false');
        }
    }

    onChange() {
        const selected = this.checkboxNodes.filter((node) => node.checked);
        const displayText = selected.length > 0 ? `${selected.length} selected` : this.defaultButtonText;
        this.toggleButtonTextNode.innerText = displayText;
    }

    handleFocusOut(event) {
      const containsFocus = this.containerNode.contains(event.relatedTarget);
      if (!containsFocus) {
        this.onButtonClick(this.toggleButtonNode, 'close');
      }
    }
}
