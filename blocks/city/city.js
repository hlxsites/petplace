// export default function decorate(block) {
//   // icon list
//   var cityName = block.querySelector("h3");
//   var iconList = cityName.nextElementSibling;
//   iconList.classList.add("icon-type-list");

//   // icon
//   // Find the li elements containing the desired text
//   const liElements = iconList.querySelectorAll("li");

//   // Iterate over each li element
//   liElements.forEach((liElement) => {
//     const textContent = liElement.textContent.trim();
//     const a = transformTextContent(textContent);
//     // Fetch the SVG file from the "icons" folder
//     const svgFilePath = `/icons/${a}.svg`; // Assuming SVG files are stored in the "icons" folder
//     // console.log("xinyi path:", svgFilePath);
//     fetch(svgFilePath)
//       .then(function (response) {
//         if (!response.ok) {
//           throw new Error(`Failed to fetch SVG file: ${response.status}`);
//         }
//         return response.text();
//       })
//       .then(function (svgContent) {
//        // Create a new <div> element to contain the image and the text
//        const divElement = document.createElement("div");
//         // Create a new <img> element with the SVG content
//         const imgElement = document.createElement("img");
//         imgElement.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
//           svgContent
//         )}`;
//         const pElement = document.createElement("span");
//         pElement.textContent = textContent;

//         // Replace the text content with the loaded SVG
//         // liElement.textContent = "";
//         // liElement.appendChild(imgElement);
//         divElement.appendChild(imgElement);
//         divElement.appendChild(pElement);

//         liElement.textContent = "";
//         liElement.appendChild(divElement);
//       })
//       .catch(function (error) {
//         console.error("Error loading SVG file:", error);
//       });
//   });

//   decroateOurFavsForCity(block);
//   decorateTips(block);
  
//   //tips (TODO: wrap as helper function)

//   }
  


// function decorateTips(block) {
//   // tip icon
//   const pElement = block.querySelectorAll("p");
//   const lastElement = pElement[pElement.length - 1];
  
//   if (lastElement) {
//     const divElement = document.createElement("div");
//     divElement.classList.add("tips-container");
//     // Wrap the last <p> element with the <div>
//     lastElement.parentNode.insertBefore(divElement, lastElement);
//     divElement.appendChild(lastElement);
//   }

//   const paragraph = block.querySelector(".tips-container p");
//   // Get the strong element
//   const strongElement = paragraph.querySelector("strong");
//   const divElement = document.createElement("div");
//   divElement.classList.add("tips-icon");
  
//   divElement.innerHTML = `<img src="/icons/tips-star.svg" alt="Tips Star Image">`;
  

//   paragraph.parentNode.insertBefore(divElement, paragraph);


//   if (strongElement) {
//     const replacedContent = paragraph.innerHTML.replace(/icon-star:|ICON-STAR/gi, "");
//     paragraph.innerHTML = replacedContent;
//     paragraph.classList.add("tips-text");
//   }


// }


//   // Function to transform the text content
//   function transformTextContent(textContent) {
//     const lowercaseText = textContent.toLowerCase();
//     const firstWord = lowercaseText.split(/[\/\s]/)[0].replace("offleash", "off-leash");
//     const transformedText = `city-${firstWord}`;
//     return transformedText;
//   }

//   function decroateOurFavsForCity(city){

//     let title = city.querySelector("h4");
//     let list = title.nextElementSibling;
//     const divElement = document.createElement("div");
//     divElement.classList.add("our-faves-for-div");
//     divElement.appendChild(title);
//     divElement.appendChild(list);
//     // divElement.classList.add("city-anchor");
//     const iconTypeList = city.querySelector(".icon-type-list");
//     console.log(iconTypeList?.parentNode)
//     iconTypeList.parentNode.insertBefore(divElement, iconTypeList.nextSibling);
//   }
  
//  const cities = document.querySelectorAll(".city");
//   cities.forEach(city => {
//     modifyCity(city)
//   })

