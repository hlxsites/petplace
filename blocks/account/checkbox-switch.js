export class CheckboxSwitch {
    constructor(domNode) {
      console.log(domNode);
      this.switchNode = domNode;
      this.switchNode.addEventListener('focus', (event) => this.onFocus(event));
      this.switchNode.addEventListener('blur', (event) => this.onBlur(event));
    }
  
    onFocus(event) {
      event.currentTarget.parentNode.classList.add('focus');
    }
  
    onBlur(event) {
      event.currentTarget.parentNode.classList.remove('focus');
    }
}