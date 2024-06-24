import { decorateIcons } from '../../scripts/lib-franklin.js';
import { getPlaceholder } from '../../scripts/scripts.js';

/**
 * Determine the maximum amount of tags to be displayed,
 * based on the data attribute provided and current viewport.
 * The remaining tags will be opened via the Show More dialog.
 *
 * @param {Element} block The popular tags block
 * @returns {number | undefined} The maximum amount of tags to be displayed, if any.
 */
function getMaxTags(block) {
  // List of supported viewports
  const mediaObj = {
    desktop: 1024,
    tablet: 768,
    mobile: 0,
  };

  // Check the block's data attributes to determine the max tags amount to be applied.
  const viewport = Object.entries(mediaObj)
    .find(([, width]) => width <= document.documentElement.clientWidth)[0];

  const maxTags = block.getAttribute(`data-max-tags-${viewport}`);
  return maxTags;
}

/**
 * Hide tags based on the authored data attributes and viewport,
 * and move them to the dropdown dialog.
 * @param {Element} block The popular tags block
 * @param {Element} dropdown The dialog container's element
 */
function updateTagDisplay(block, dropdown) {
  const maxTags = getMaxTags(block);
  const tags = block.querySelectorAll('li');
  const dropdownTags = dropdown.querySelectorAll('li');
  tags.forEach((tag, idx) => {
    if (maxTags && idx >= maxTags) {
      tag.setAttribute('hidden', true);
      dropdownTags[idx].removeAttribute('hidden');
    } else {
      tag.removeAttribute('hidden');
      dropdownTags[idx].setAttribute('hidden', true);
    }
  });

  const button = block.querySelector('button');
  if (tags.length <= maxTags) {
    button.setAttribute('hidden', true);
  } else {
    button.removeAttribute('hidden');
  }
}

/**
 * Display/hide the dropdown dialog and update the button status.
 * @param {boolean} status Whether to show or hide the dialog
 * @param {Element} buttonEl The button element
 * @param {Element} containerEl The dropdown container element
 */
function setDropdownStatus(status, buttonEl, containerEl) {
  if (status) {
    buttonEl.classList.add('active');
    containerEl.removeAttribute('hidden');
    const top = buttonEl.getBoundingClientRect().top + window.scrollY;
    containerEl.style.top = `${top + buttonEl.clientHeight + 8}px`;
    const right = buttonEl.getBoundingClientRect().right + window.scrollX;
    containerEl.style.right = `${document.documentElement.clientWidth - right}px`;
  } else {
    buttonEl.classList.remove('active');
    containerEl.setAttribute('hidden', true);
    containerEl.style.top = null;
    containerEl.style.right = null;
  }
}

export default async function decorate(block) {
  const resp = await fetch(`${window.hlx.contentBasePath}/fragments/popular-tags.plain.html`);
  if (!resp.ok) {
    block.remove();
    return;
  }

  const html = await resp.text();
  block.innerHTML = html;

  const moreTagsTrigger = document.createElement('button');
  moreTagsTrigger.innerHTML = `<span>${getPlaceholder('morePopularTags')}</span><span class="icon icon-chevron-large"></span>`;
  block.querySelector('ul').append(moreTagsTrigger);
  decorateIcons(block);

  // Create the dropdown dialog and copy the tags list.
  const dropdownContainer = document.createElement('div');
  dropdownContainer.classList.add('popular-tags-dropdown');
  dropdownContainer.setAttribute('hidden', true);
  const dropdownList = document.createElement('ul');
  dropdownContainer.append(dropdownList);
  block.querySelectorAll('li').forEach((tag) => {
    const dropdownTag = tag.cloneNode(true);
    dropdownList.append(dropdownTag);
  });
  document.body.append(dropdownContainer);

  // Hide the tags depending on the current viewport.
  updateTagDisplay(block, dropdownContainer);

  // Toggle the dialog status on clicking the Show More button.
  moreTagsTrigger.addEventListener('click', () => {
    const isActive = moreTagsTrigger.classList.contains('active');
    setDropdownStatus(!isActive, moreTagsTrigger, dropdownContainer);
  });

  // Close the dialog if the user clicks outside.
  window.addEventListener('click', (e) => {
    const dropdownEls = [moreTagsTrigger, dropdownContainer];
    if (!dropdownEls.find((el) => el.contains(e.target))) {
      setDropdownStatus(false, moreTagsTrigger, dropdownContainer);
    }
  });

  // Update the tags displayed on resize (due to viewport changes)
  window.addEventListener('resize', () => {
    updateTagDisplay(block, dropdownContainer);

    // If the dialog is open, update the dialog location to keep it
    // consistent with newest viewport width.
    const isActive = moreTagsTrigger.classList.contains('active');
    if (isActive) {
      setDropdownStatus(true, moreTagsTrigger, dropdownContainer);
    }
  });

  // Close the dialog on scroll
  window.addEventListener('scroll', () => {
    const isActive = moreTagsTrigger.classList.contains('active');
    if (isActive) {
      setDropdownStatus(false, moreTagsTrigger, dropdownContainer);
    }
  });
}
