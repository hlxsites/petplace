export default function decorate(block) {
  // Select all h3 elements
  let cities = document.querySelectorAll(".city h3");
  // console.log(cities[0].innerText)

  // new div
  let newDiv = document.createElement("div");
  newDiv.classList.add("city-anchor");

  // append every city
  cities.forEach((city) => {
      const newAnchor = document.createElement("a");
      newAnchor.href = `#${city.id}`;
      newAnchor.innerText = city.innerText;
      newDiv.appendChild(newAnchor);
  });

  // append div to anchor
  let anchor = document.querySelector(".anchor");
  anchor.appendChild(newDiv);
}
