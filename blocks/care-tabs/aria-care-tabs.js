import { initializeTouch, slide } from '../../scripts/scripts.js';

export const constants = {
  tagName: 'hlx-aria-care-tabs',
};

export class AriaTabs extends HTMLElement {
  static getId() {
    return Math.random().toString(32).substring(2);
  }

  async connectedCallback() {
    this.selectedIndex = 0;
    this.itemsCount = this.children.length;
    await this.decorate();
    this.attachListeners();
  }

  attachListeners() {
    this.querySelectorAll('[role="tab"]').forEach((tab) => {
      tab.addEventListener('click', (ev) => {
        const buttons = [...this.querySelectorAll('[role="tab"]')];
        this.focusItem(buttons.indexOf(ev.currentTarget));
        this.setActiveCard(buttons.indexOf(ev.currentTarget));
      });

      // card.addEventListener('click', () => {
      //   setActiveCard(card, details);
      // });
      // card.addEventListener('keypress', (event) => {
      //   if (event.code === 'Space' || event.code === 'Enter') {
      //     event.preventDefault();
      //     setActiveCard(card, details);
      //   }
      // });
      tab.addEventListener('keydown', (ev) => {
        switch (ev.key) {
          case 'Home':
            ev.preventDefault();
            this.focusItem(0);
            this.setActiveCard(0);
            break;
          case 'ArrowLeft':
            ev.preventDefault();
            this.focusItem(this.selectedIndex - 1);
            this.setActiveCard(this.selectedIndex);
            break;
          case 'ArrowRight':
            ev.preventDefault();
            this.focusItem(this.selectedIndex + 1);
            this.setActiveCard(this.selectedIndex);
            break;
          case 'End':
            ev.preventDefault();
            this.focusItem(this.itemsCount - 1);
            this.setActiveCard(this.itemsCount - 1);
            break;
          default:
            break;
        }
      });
    });

    // if (
    //   this.attributes.getNamedItem(constants.withControls)
    //     && this.attributes.getNamedItem(constants.withControls).value === 'true'
    // ) {
    //   const [prev, next] = this.querySelectorAll('[role="tablist"] + div > button');
    //   prev.addEventListener('click', () => {
    //     this.focusItem(this.selectedIndex - 1);
    //     this.selectItem(this.querySelectorAll('[role="tab"')[this.selectedIndex]);
    //     prev.focus();
    //   });
    //   next.addEventListener('click', () => {
    //     this.focusItem(this.selectedIndex + 1);
    //     this.selectItem(this.querySelectorAll('[role="tab"')[this.selectedIndex]);
    //     next.focus();
    //   });
    // }
  }

  async decorate() {
    const careTabContainer = this.closest('.care-tabs-container');
    this.id = AriaTabs.getId();
    this.setAttribute('role', 'tablist');
    this.setAttribute('aria-orientation', 'horizontal');

    [...this.children].forEach((child, i) => {
      const id1 = AriaTabs.getId();
      const id2 = AriaTabs.getId();
      child.id = id1;
      child.setAttribute('role', 'tab');
      child.setAttribute('tabindex', i === this.selectedIndex ? 0 : -1);
      child.setAttribute('aria-selected', i === this.selectedIndex);
      child.setAttribute('aria-controls', id2);

      child.classList.add('care-tabs-card-wrapper');
      if (i === 0) child.setAttribute('active', true);
      const card = child.children[0];
      const details = child.children[1];
      details.classList.add('details');
      card.classList.add('card');
      if (i === 0) card.classList.add('active');
    });

    // Inject details into desktop details
    const desktopDetailsContainer = document.createElement('div');
    desktopDetailsContainer.classList.add('desktop-details-container');
    desktopDetailsContainer.setAttribute('role', 'tabpanel');
    // tabPanel.setAttribute('aria-labelledby', id1);
    desktopDetailsContainer.append(this.querySelector('.details').cloneNode(true));
    this.parentElement.parentElement.append(desktopDetailsContainer);

    // Adjust header for mobile and desktop views
    const careHeading = document.querySelector('.section.care-tabs-container h2');
    const careSpan = document.createElement('span');
    const textSpan = document.createElement('span');
    careSpan.textContent = 'Care';
    textSpan.append(careHeading.innerHTML);
    careHeading.innerHTML = '';
    careHeading.append(careSpan);
    careHeading.append(textSpan);

    // Create the Toggle button elements
    const buttonPrev = document.createElement('button');
    buttonPrev.setAttribute('type', 'button');
    buttonPrev.setAttribute('data-role', 'none');
    buttonPrev.setAttribute('aria-label', 'View previous slide.');
    buttonPrev.classList.add('slick-arrow', 'slick-prev');
    buttonPrev.addEventListener('click', () => {
      slide('prev', this, this.parentElement.parentElement);
    });
    const buttonNext = document.createElement('button');
    buttonNext.setAttribute('type', 'button');
    buttonNext.setAttribute('data-role', 'none');
    buttonNext.setAttribute('aria-label', 'View next slide.');
    buttonNext.classList.add('slick-arrow', 'slick-next');
    buttonNext.addEventListener('click', () => {
      slide('next', this, this.parentElement.parentElement);
    });
    // Add the button to the DOM
    careTabContainer.prepend(buttonNext);
    careTabContainer.prepend(buttonPrev);

    initializeTouch(this, this.parentElement);
  }

  focusItem(index) {
    let rotationIndex = index;
    if (index < 0) {
      rotationIndex = this.itemsCount - 1;
    } else if (index > this.itemsCount - 1) {
      rotationIndex = 0;
    }
    const buttons = this.querySelectorAll('[role="tab"]');
    buttons[this.selectedIndex].setAttribute('tabindex', -1);
    this.selectedIndex = rotationIndex;
    buttons[this.selectedIndex].setAttribute('tabindex', 0);
    buttons[this.selectedIndex].focus();
  }

  setActiveCard(newIndex) {
    this.querySelector('.card.active').classList.remove('active');
    const card = this.querySelectorAll('.card')[newIndex];
    const details = this.querySelectorAll('.details')[newIndex];
    card.classList.add('active');
    const desktopDetailsContainer = document.querySelector('.desktop-details-container');
    desktopDetailsContainer.innerHTML = '';
    desktopDetailsContainer.append(details.cloneNode(true));
  }
}

customElements.define(constants.tagName, AriaTabs);
