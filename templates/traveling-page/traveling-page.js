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
    const column1 = document.querySelector(".columns.city-header");
    column1.parentNode.replaceWith(column1);
    const column2 = document.querySelector(".columns.city-middle");
    column2.parentNode.replaceWith(column2);
    const column3 = document.querySelector(".columns.city-footer");
    column3.parentNode.replaceWith(column3);

    // combine city name, tags, favors, and txt1 into one div
    const cityName = section.querySelector(".default-content-wrapper");
    const cityTags = section.querySelector(".icon-type-wrapper");
    const cityFavors = section.querySelector(".link-box-wrapper");
    const cityTxt1 = section.querySelector(".columns.city-header.block>div>div:nth-child(2)");

    let cityIntro = document.createElement("div");
    cityIntro.classList.add("city-intro");
    cityIntro.appendChild(cityName);
    cityIntro.appendChild(cityTags);
    cityIntro.appendChild(cityFavors);
    cityIntro.appendChild(cityTxt1);

    // insert to the top of the section
    if (section.firstChild) {
      section.insertBefore(cityIntro, section.firstChild);
    } else {
      section.appendChild(cityIntro);
    }

    // add tips block to the second div of column city-footer
    const tips = document.querySelector(".section.city .tips-wrapper");
    document.querySelector(".columns.city-footer.block>div>div:nth-child(2)").appendChild(tips);


  //   let picDivs = document.querySelectorAll('div[data-valign="middle"]');
  //   console.log("picDivs", [...picDivs]);
  //   // Check if the number of picture children is 2 or more
  //   picDivs.forEach(function(div) {
  //     // Check if the number of picture children is 2 or more
  //     let pictures = div.querySelectorAll('picture');
  //     if (pictures.length >= 2) {
  //         // Call function a()
  //         a();
  //     }
  // });
   

  });
  // let picDivs = document.querySelectorAll('.section.city .columns-multi-img-col');
  // picDivs.forEach((div) => {
  //   console.log('Element found:', div);
  //   decorateResponsiveImages(div, [600, 900]);
  // });

}

export function loadDelayed() {
  console.log("traveling load delayed");
  let picDivs = document.querySelectorAll('.section.city .columns-multi-img-col');
  picDivs.forEach((div) => {
    console.log('Element found:', div);
    decorateResponsiveImages(div, [600, 900]);
  });
  
}