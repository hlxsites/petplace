/* eslint-disable indent */
export default class MultiSelect {
    constructor(wrapperNode) {
        this.defaultButtonText = 'Select from menu...';
        this.containerNode = wrapperNode;
        this.toggleButtonNode = this.containerNode.querySelector('.multi-select__button');
        this.toggleButtonTextNode = this.containerNode.querySelector('.multi-select__button-text');
        this.checkboxNodes = Array.from(this.containerNode.querySelectorAll('input[type=checkbox'));
        this.toggleButtonNode.addEventListener('click', this.onButtonClick.bind(this));
        this.checkboxNodes.forEach((checkbox) => {
            checkbox.addEventListener('change', this.onChange.bind(this))
        })

    }
    onButtonClick(event, state) {
        const btn = event.currentTarget;
        // force the options group to collapse
        if (state === 'close') {
          btn.setAttribute('aria-expanded', 'false');
        } else if (btn.getAttribute('aria-expanded') === 'false') {
          btn.setAttribute('aria-expanded', 'true');
        } else {
          btn.setAttribute('aria-expanded', 'false');
        }
    }
    onChange(event) {
        const selected = this.checkboxNodes.filter((node) => node.checked);
        const displayText = selected.map((el) => el.getAttribute('data-label-text')).join(',') || this.defaultButtonText;
        this.toggleButtonTextNode.innerText = displayText;
    }


}