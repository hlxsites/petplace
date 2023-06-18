import { decorateResponsiveImages } from '../../scripts/scripts.js';
export async function loadEager(main) {
  const links = document.querySelectorAll("a");
  for (let i = 0; i < links.length; i++) {
    links[i].setAttribute("target", "_blank");
  }

  // let picDivs = document.querySelectorAll('.section.city .columns-multi-img-col');
  // picDivs.forEach((div) => {
  //   console.log('Element found:', div);
  //   decorateResponsiveImages(div, [600, 900]);
  // });

  return false;
}


export function loadLazy() {
  console.log("traveling load lazy");


  let citySections = document.querySelectorAll('.section.city');
  citySections.forEach((section) => {

    // remove column wrapper 
    const column1 = section.querySelector(".columns.city-header");
    column1.parentNode.replaceWith(column1);
    const column2 = section.querySelector(".columns.city-middle");
    column2.parentNode.replaceWith(column2);
    const column3 = section.querySelector(".columns.city-footer");
    column3.parentNode.replaceWith(column3);

    // get all esstential elements
    const cityName = section.querySelector(".default-content-wrapper");
    const cityTags = section.querySelector(".icon-type-wrapper");
    const cityFavors = section.querySelector(".link-box-wrapper");
    const cityImg1 = section.querySelector(".columns.city-header.block>div>div:nth-child(1)");
    cityImg1.classList.add("city-header-img");
    const cityTxt1 = section.querySelector(".columns.city-header.block>div>div:nth-child(2)");
    cityTxt1.classList.add("city-header-txt");
    const cityTxt2 = section.querySelector(".columns.city-middle.block>div>div:nth-child(1)");
    cityTxt2.classList.add("city-middle-txt");
    const cityImg2 = section.querySelector(".columns.city-middle.block>div>div:nth-child(2)");
    cityImg2.classList.add("city-middle-img");
    const cityImg3 = section.querySelector(".columns.city-footer.block>div>div:nth-child(1)");
    cityImg3.classList.add("city-footer-img");
    const cityTxt3 = section.querySelector(".columns.city-footer.block>div>div:nth-child(2)"); 
    cityTxt3.classList.add("city-footer-txt");
    const tips = section.querySelector(".section.city .tips-wrapper");


    // rearrange the elements under section city
    let arrangedCitySection = document.createElement("div");
    arrangedCitySection.classList.add("section", "city");

    arrangedCitySection.appendChild(cityName);
    arrangedCitySection.appendChild(cityTags);
    arrangedCitySection.appendChild(cityFavors);
    arrangedCitySection.appendChild(cityImg1);
    arrangedCitySection.appendChild(cityTxt1);
    arrangedCitySection.appendChild(cityTxt2);
    arrangedCitySection.appendChild(cityImg2);
    arrangedCitySection.appendChild(cityImg3);
    arrangedCitySection.appendChild(cityTxt3);
    arrangedCitySection.appendChild(tips);

    section.replaceWith(arrangedCitySection);

    // pick the best grid area layout by image2 wdith/height
    const img2 = cityImg2.querySelector("img");
    const width = img2.getAttribute("width");
    const height = img2.getAttribute("height");
    if (width / height > 2) {
      console.log(cityName);
      arrangedCitySection.classList.add("backup-layout");
    }
    
  });
}

// export function loadDelayed() {
//   console.log("traveling load delayed");
//   let picDivs = document.querySelectorAll('.section.city .columns-multi-img-col');
//   picDivs.forEach((div) => {
//     console.log('Element found:', div);
//     decorateResponsiveImages(div, [600, 900]);
//   });
  
// }