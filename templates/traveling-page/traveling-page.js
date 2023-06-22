// async function updateSection(section) {
//   // remove column wrapper
//   ['city-header', 'city-middle', 'city-footer'].forEach((className) => {
//     const column = section.querySelector(`.columns.${className}`);
//     column.parentNode.replaceWith(column);
//   });

//   // get all essential elements
//   const elements = [
//     '.default-content-wrapper',
//     '.icon-type-wrapper',
//     '.link-box-wrapper',
//     ['.columns.city-header.block>div>div:nth-child(1)', 'city-header-img'],
//     ['.columns.city-header.block>div>div:nth-child(2)', 'city-header-txt'],
//     ['.columns.city-middle.block>div>div:nth-child(1)', 'city-middle-txt'],
//     ['.columns.city-middle.block>div>div:nth-child(2)', 'city-middle-img'],
//     ['.columns.city-footer.block>div>div:nth-child(1)', 'city-footer-img'],
//     ['.columns.city-footer.block>div>div:nth-child(2)', 'city-footer-txt'],
//     '.section.city .tips-wrapper',
//   ].map((e) => {
//     if (Array.isArray(e)) {
//       const el = section.querySelector(e[0]);
//       el.classList.add(e[1]);
//       return el;
//     }
//     return section.querySelector(e);
//   });

//   // rearrange the elements under section city
//   const arrangedCitySection = document.createElement('div');
//   arrangedCitySection.classList.add('section', 'city');

//   elements.forEach((e) => arrangedCitySection.appendChild(e));

//   section.replaceWith(arrangedCitySection);

//   // pick the best grid area layout by image2 width/height
//   const img2 = elements[6].querySelector('img');
//   const width = img2.getAttribute('width');
//   const height = img2.getAttribute('height');
//   if (width / height > 1.9) {
//     arrangedCitySection.classList.add('backup-layout');
//   }
// }

// export function loadEager() {
//   const links = document.querySelectorAll('a');
//   links.forEach((link) => link.setAttribute('target', '_blank'));
//   return false;
// }

// export function loadLazy() {
//   const citySections = document.querySelectorAll('.section.city');
//   citySections.forEach((section) => section.classList.add('hidden'));
// }

// export function loadDelayed() {
//   const citySections = document.querySelectorAll('.section.city');
//   const promises = Array.from(citySections).map(async (section) => {
//     await updateSection(section);
//   });
//   Promise.all(promises);
// }

let interval;
const queue = [];
export async function meterCalls(fn, wait = 200, max = 5) {
  return new Promise((res) => {
    if (!interval) {
      setTimeout(() => fn.call(null));
      interval = window.setInterval(() => {
        queue.splice(0, max).forEach((item) => window.requestAnimationFrame(() => item.call(null)));
        if (!queue.length) {
          res();
          window.clearInterval(interval);
          interval = null; // reset the interval
        }
      }, wait);
    } else {
      queue.push(fn);
    }
  });
}

async function updateSection(section) {
  // remove column wrapper
  ['city-header', 'city-middle', 'city-footer'].forEach((className) => {
    const column = section.querySelector(`.columns.${className}`);
    column.parentNode.replaceWith(column);
  });
  // get all essential elements
  const elements = [
    '.default-content-wrapper',
    '.icon-type-wrapper',
    '.link-box-wrapper',
    ['.columns.city-header.block>div>div:nth-child(1)', 'city-header-img'],
    ['.columns.city-header.block>div>div:nth-child(2)', 'city-header-txt'],
    ['.columns.city-middle.block>div>div:nth-child(1)', 'city-middle-txt'],
    ['.columns.city-middle.block>div>div:nth-child(2)', 'city-middle-img'],
    ['.columns.city-footer.block>div>div:nth-child(1)', 'city-footer-img'],
    ['.columns.city-footer.block>div>div:nth-child(2)', 'city-footer-txt'],
    '.section.city .tips-wrapper',
  ].map((e) => {
    if (Array.isArray(e)) {
      const el = section.querySelector(e[0]);
      el.classList.add(e[1]);
      return el;
    }
    return section.querySelector(e);
  });
  // rearrange the elements under section city
  const arrangedCitySection = document.createElement('div');
  arrangedCitySection.classList.add('arranged', 'section', 'city');
  elements.forEach((e) => arrangedCitySection.appendChild(e));
  // clean reduntant childs
  // append arragned city section under orignal city section
  while (section.firstChild) {
    section.removeChild(section.firstChild);
  }
  section.appendChild(arrangedCitySection);
  // pick the best grid area layout by image2 width/height
  const img2 = elements[6].querySelector('img');
  const width = img2.getAttribute('width');
  const height = img2.getAttribute('height');
  if (width / height > 1.9) {
    arrangedCitySection.classList.add('backup-layout');
  }
}

export function loadEager() {
  const links = document.querySelectorAll('a');
  links.forEach((link) => link.setAttribute('target', '_blank'));
}

export function loadLazy() {
  const citySections = Array.from(document.querySelectorAll('.section.city'));
  citySections.reduce(
    (promiseChain, section) => promiseChain.then(() => new Promise((resolve) => {
      setTimeout(() => {
        window.requestAnimationFrame(() => {
          updateSection(section);
          resolve();
        });
      }, 200);
    })),
    Promise.resolve(),
  );
}
