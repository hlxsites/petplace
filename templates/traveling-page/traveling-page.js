export async function loadEager(main) {
  const links = document.querySelectorAll("a");
  for (let i = 0; i < links.length; i++) {
    links[i].setAttribute("target", "_blank");
  }

  return false;
}

export function loadLazy() {
  console.log("traveling load lazy");



  let citySections = document.querySelectorAll('.section.city');
  citySections.forEach((section) => {

    // remove column wrapper 
    const column1 = document.querySelector(".columns.p1");
    column1.parentNode.replaceWith(column1);
    const column2 = document.querySelector(".columns.p2");
    column2.parentNode.replaceWith(column2);
    const column3 = document.querySelector(".columns.p3");
    column3.parentNode.replaceWith(column3);

    // combine city name, tags, favors, and txt1 into one div
    const cityName = section.querySelector(".default-content-wrapper");
    const cityTags = section.querySelector(".icon-type-wrapper");
    const cityFavors = section.querySelector(".link-box-wrapper");
    const cityTxt1 = section.querySelector(".columns.p1.block>div>div:nth-child(2)");

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

    // add tips block to the second div of column p3
    const tips = document.querySelector(".section.city .tips-wrapper");
    document.querySelector(".columns.p3.block>div>div:nth-child(2)").appendChild(tips);
  });


  
  
  // Select all h3 elements
  // const cities = document.querySelectorAll(".city-wrapper h3");

  // const container = document.getElementsByClassName("anchor block")[0];

  // cities.forEach((city) => {
  //   // Create a new anchor element
  //   // <a href="#${city.id}">innerText</a>
  //   const newAnchor = document.createElement('a');

  //   //console.log("xinyi city node is " + city);
    
  //   // Set the properties
  //   newAnchor.href = `#${city.id}`;
  //   //newAnchor.id = `city2${index}`;
  //   newAnchor.innerText = city.innerText;
    
    
  //   // Append the city to the anchor
  //   //newAnchor.appendChild(city.cloneNode(true));
    
  //   container.appendChild(newAnchor);
  // });
}