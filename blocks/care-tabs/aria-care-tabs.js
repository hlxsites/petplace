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

    this.querySelector('.slick-prev').addEventListener('click', () => {
      slide('prev', this, this.parentElement.parentElement);
    });

    this.querySelector('.slick-next').addEventListener('click', () => {
      slide('next', this, this.parentElement.parentElement);
    });
  }

  async decorate() {
    const careTabContainer = this.closest('.care-tabs-container');
    const id = AriaTabs.getId();
    this.id = id;
    this.setAttribute('role', 'tablist');
    this.setAttribute('aria-orientation', 'horizontal');

    [...this.children].forEach((careTabsCardWrapper, i) => {
      const id1 = AriaTabs.getId();
      const id2 = AriaTabs.getId();
      careTabsCardWrapper.classList.add('care-tabs-card-wrapper');

      careTabsCardWrapper.id = id1;
      careTabsCardWrapper.setAttribute('role', 'tab');
      careTabsCardWrapper.setAttribute('tabindex', i === this.selectedIndex ? 0 : -1);
      careTabsCardWrapper.setAttribute('aria-selected', i === this.selectedIndex);
      careTabsCardWrapper.setAttribute('aria-controls', id2);

      if (i === 0) careTabsCardWrapper.setAttribute('active', true);
      const card = careTabsCardWrapper.children[0];
      const details = careTabsCardWrapper.children[1];
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
    buttonPrev.setAttribute('aria-controls', id);
    buttonPrev.classList.add('slick-arrow', 'slick-prev');

    const buttonNext = document.createElement('button');
    buttonNext.setAttribute('type', 'button');
    buttonNext.setAttribute('data-role', 'none');
    buttonNext.setAttribute('aria-label', 'View next slide.');
    buttonPrev.setAttribute('aria-controls', id);
    buttonNext.classList.add('slick-arrow', 'slick-next');

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
