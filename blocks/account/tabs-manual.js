export default class TabsManual {
    constructor(groupNode, panelNodes) {
      this.tablistNode = groupNode;
      this.tabs = [];
      this.firstTab = null;
      this.lastTab = null;
      this.tabs = Array.from(this.tablistNode.querySelectorAll('[role=tab]'));
      console.log(this.tabs.map(tab => tab.href));
      this.tabpanels = Array.from(panelNodes);
  
      for (let i = 0; i < this.tabs.length; i += 1) {
        const tab = this.tabs[i];
  
        tab.tabIndex = -1;
        tab.setAttribute('aria-selected', 'false');
  
        tab.addEventListener('keydown', this.onKeydown.bind(this));
        tab.addEventListener('click', this.onClick.bind(this));
  
        if (!this.firstTab) {
          this.firstTab = tab;
        }
        this.lastTab = tab;
      }

  
      this.setSelectedTab(this.firstTab);
    }
  
    setSelectedTab(currentTab) {
      for (let i = 0; i < this.tabs.length; i += 1) {
        const tab = this.tabs[i];
        if (currentTab === tab) {
          tab.setAttribute('aria-selected', 'true');
          tab.removeAttribute('tabindex');
          this.tabpanels[i].classList.remove('is-hidden');
        } else {
          tab.setAttribute('aria-selected', 'false');
          tab.tabIndex = -1;
          this.tabpanels[i].classList.add('is-hidden');
        }
      }
    }
  
    moveFocusToTab(currentTab) {
      currentTab.focus();
    }
  
    moveFocusToPreviousTab(currentTab) {
      var index;
  
      if (currentTab === this.firstTab) {
        this.moveFocusToTab(this.lastTab);
      } else {
        index = this.tabs.indexOf(currentTab);
        this.moveFocusToTab(this.tabs[index - 1]);
      }
    }
  
    moveFocusToNextTab(currentTab) {
      let index; 
      if (currentTab === this.lastTab) {
        this.moveFocusToTab(this.firstTab);
      } else {
        index = this.tabs.indexOf(currentTab);
        this.moveFocusToTab(this.tabs[index + 1]);
      }
    }
  
    /* EVENT HANDLERS */
    onKeydown(event) {
      const tgt = event.currentTarget;
      let flag = false;
  
      switch (event.key) {
        case 'ArrowLeft':
          this.moveFocusToPreviousTab(tgt);
          flag = true;
          break;
        case 'ArrowRight':
          this.moveFocusToNextTab(tgt);
          flag = true;
          break;
        case 'Home':
          this.moveFocusToTab(this.firstTab);
          flag = true;
          break;
        case 'End':
          this.moveFocusToTab(this.lastTab);
          flag = true;
          break;
        case 'Enter':
        case 'Space':
          this.setSelectedTab(tgt);
          flag = true;
          break;
        default:
          break;
      }
  
      if (flag) {
        event.stopPropagation();
        event.preventDefault();
      }
    }
    onClick(event) {
      event.preventDefault();
      this.setSelectedTab(event.currentTarget);
    }
}