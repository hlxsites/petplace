import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
export async function loadEager(main) {
  

  console.log("traveling eager");
  console.log(main);

 const links = document.querySelectorAll("a");

for (let i = 0; i < links.length; i++) {
  links[i].setAttribute("target", "_blank");
}

  return false;
}

export function loadLazy() {
  console.log("traveling load lazy");
  
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