(function getPetsList() {
	const endpoint = "https://6bf885ab-eae1-4bf3-8087-2c29b87aea62.mock.pstmn.io/account-activation";

	const response = fetch(endpoint, { method: "GET" })
		.then((response) => {
			if (!response.ok) {
				throw new Error(`HTTP error status: ${response.status}`);
			}
			return response.json();
		})
		.then((data) => {
			renderPetsNames(data["node"]);
			renderPetsPictures(data["node"]);
		})
		.catch((error) => console.log("There was a problem on network: ", error));

	return response;
})();

function renderPetsNames(petsList) {
	const getPetsNames = petsList?.map((item) => item.name);

	const petsNames =
		getPetsNames && petsList.length > 1
			? getPetsNames.slice(0, -1).join(", ") + " & " + getPetsNames.at(-1)
			: getPetsNames;
	if (!petsNames || !petsNames.length) return;

	document.getElementById("pet-name").innerHTML = petsNames;
}

function renderPetsPictures(petsList) {
	const petsPictures = petsList?.map((item) => item.photo);
	const petsPicturesLength = petsPictures.length;

	if (!petsPictures || !petsPicturesLength) return;

	const imageContainer = document.getElementById("pet-image");

	petsPictures.slice(0, 3).forEach((src) => {
		if (!src) return;

		const imageTag = document.createElement("img");
		imageTag.src = src;

		imageTag.classList.add(petsPicturesLength === 1 ? "panel-pet-single-image" : "panel-pets-pictures");

		if (petsPicturesLength > 1) {
			imageContainer.style.marginLeft = "12%";
		}

		imageContainer.appendChild(imageTag);
	});

	if (petsPicturesLength > 3) {
		const textTag = document.createElement("p");
		textTag.innerHTML = `+${petsPicturesLength - 3}`;
		textTag.classList.add("panel-pets-count");
		imageContainer.appendChild(textTag);
	}
}
