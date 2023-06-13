export default function decorate(block) {

  // if multple rows, needed to wrap with for each loop
  const targets = block.querySelector('.anchor>div>div').textContent.toLowerCase();
  // Select all h3 elements
  let cities = document.querySelectorAll(`.${targets}`);
  // console.log(cities[0].innerText)

  // new div
  let newDiv = document.createElement("div");
  newDiv.classList.add("anchor-list");

  // append every city
  cities.forEach((item) => {
      const newAnchor = document.createElement("a");
      newAnchor.href = `#${item.id}`;
      newAnchor.innerText = item.innerText;
      newDiv.appendChild(newAnchor);
  });

  // append div to anchor
  let anchor = document.querySelector(".anchor");
  anchor.appendChild(newDiv);
}
