export default function decorate(block) {

  const iconList = block.querySelector("ul");
  
  iconList.classList.add('icon-type-list');

  // Find the li elements containing the desired text
  const liElements = iconList.querySelectorAll("li");

  // Iterate over each li element
  liElements.forEach((liElement) => {
    const textContent = liElement.textContent.trim();
    const a = transformTextContent(textContent);
    // Fetch the SVG file from the "icons" folder
    const svgFilePath = `/icons/${a}.svg`; // Assuming SVG files are stored in the "icons" folder
    // console.log("xinyi path:", svgFilePath);
    fetch(svgFilePath)
      .then(function (response) {
        if (!response.ok) {
          throw new Error(`Failed to fetch SVG file: ${response.status}`);
        }
        return response.text();
      })
      .then(function (svgContent) {
       // Create a new <div> element to contain the image and the text
       const iconItem = document.createElement("icon-item");
        // Create a new <img> element with the SVG content
        const imgElement = document.createElement("img");
        imgElement.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
          svgContent
        )}`;
        // createOptimizedPicture(imgElement.src, imgElement.alt, false, [{ width: IMAGE_WIDTH }]);
        const pElement = document.createElement("span");
        pElement.textContent = textContent;

        // Replace the text content with the loaded SVG
        // liElement.textContent = "";
        // liElement.appendChild(imgElement);
        iconItem.appendChild(imgElement);
        iconItem.appendChild(pElement);

        liElement.textContent = "";
        liElement.appendChild(iconItem);
      })
      .catch(function (error) {
        console.error("Error loading SVG file:", error);
      });
  });
}

  // Function to transform the text content
  function transformTextContent(textContent) {
    const lowercaseText = textContent.toLowerCase();
    const firstWord = lowercaseText.split(/[\/\s]/)[0].replace("offleash", "off-leash");
    const transformedText = `city-${firstWord}`;
    return transformedText;
  }
