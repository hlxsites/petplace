export default function decorate(block) {
  // tip icon
  var iconTextDiv = block.querySelector(".tips.block > div > div");
  iconTextDiv.classList.add("tip");
  
  const strongElement = iconTextDiv.querySelector("strong");
  const divElement = document.createElement("div");
  divElement.classList.add("tips-icon");
  
  divElement.innerHTML = `<img src="/icons/tips-star.svg" alt="Tips Star Image">`;
  

  iconTextDiv.parentNode.insertBefore(divElement, iconTextDiv);


//   if (strongElement) {
//     paragraph.innerHTML = replacedContent;
//     paragraph.classList.add("tips-text");
//   }


}
