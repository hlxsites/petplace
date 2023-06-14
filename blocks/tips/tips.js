export default function decorate(block) {
    var iconTextDiv = block.querySelector(".tips.block > div > div");
    iconTextDiv.classList.add("tip");
  
    const divElement = document.createElement("div");
    divElement.classList.add("tips-icon");
    
    divElement.innerHTML = `<img src="/icons/tips-star.svg" alt="Tips Star Image">`;
  
    // Get the parent element.
    const parentElement = block.querySelector(".tips.block > div");
  
    // Insert the 'tips-icon' at the beginning of the parent element.
    parentElement.insertBefore(divElement, parentElement.firstChild);
  }
  
  
