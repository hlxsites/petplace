export async function loadEager() {
  const links = document.querySelectorAll("a");
  links.forEach(link => link.setAttribute("target", "_blank"));
  return false;
}


export function loadLazy() {
  const citySections = document.querySelectorAll('.section.city');

  citySections.forEach((section) => {
    // remove column wrapper 
    ['city-header', 'city-middle', 'city-footer'].forEach(className => {
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
      '.section.city .tips-wrapper'
    ].map((e) => {
      if (Array.isArray(e)) {
        const el = section.querySelector(e[0]);
        el.classList.add(e[1]);
        return el;
      }
      return section.querySelector(e);
    });

    // rearrange the elements under section city
    const arrangedCitySection = document.createElement("div");
    arrangedCitySection.classList.add("section", "city");

    elements.forEach(e => arrangedCitySection.appendChild(e));

    section.replaceWith(arrangedCitySection);

    // pick the best grid area layout by image2 width/height
    const img2 = elements[6].querySelector("img");
    const width = img2.getAttribute("width");
    const height = img2.getAttribute("height");
    if (width / height > 1.9) {
      console.log(elements[0]);
      arrangedCitySection.classList.add("backup-layout");
    }
  });
}
