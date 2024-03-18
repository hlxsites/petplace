/* eslint-disable indent */
export default class TabsManual {
    constructor(groupNode, dropdownNode, panelNodes) {
      this.tablistNode = groupNode;
      this.selectNode = dropdownNode;
      this.tabs = [];
      this.firstTab = null;
      this.lastTab = null;
      this.tabs = Array.from(this.tablistNode.querySelectorAll('[role=tab]'));
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
      this.selectNode.addEventListener('change', this.onChange.bind(this));
      let currentHash = window.location.hash;

      if (currentHash.includes('?')) {
        [currentHash] = currentHash.split('?');
      }

      if (currentHash && this.getIndexByHash(currentHash) > -1) {
        this.setSelectedTab(this.tabs[this.getIndexByHash(currentHash)]);
      } else {
        this.setSelectedTab(this.firstTab);
      }
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
      this.selectNode.value = currentTab.getAttribute('data-tab-index');
      this.selectNode.setAttribute('data-active-panel', currentTab.getAttribute('aria-controls'));
    }

    moveFocusToTab(currentTab) {
      currentTab.focus();
    }

    moveFocusToPreviousTab(currentTab) {
      let index;
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

    onChange(event) {
      const selectedIndex = parseInt(event.currentTarget.value);
      this.setSelectedTab(this.tabs[selectedIndex]);
    }

    getIndexByHash(hashStr) {
      const targetTab = this.tabs.find((tab) => tab.href.endsWith(hashStr));
      if (targetTab) {
        return parseInt(targetTab.getAttribute('data-tab-index'));
      }
      return -1;
    }

    getHashFromURL(url) {
      var hashIndex = url.indexOf('#');
      if (hashIndex !== -1) {
          return url.substring(hashIndex + 1);
      } else {
          return ''; // Return an empty string if there's no hash
      }
  }
}
