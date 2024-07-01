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
	if (!petsList) return;

	const getPetsNames = petsList.filter((item) => item.name.length).map((item) => item.name);

	const petsNames =
		getPetsNames?.length > 1 ? getPetsNames.slice(0, -1).join(", ") + " & " + getPetsNames.at(-1) : getPetsNames;
	if (!petsNames?.length) return;

	document.getElementById("pet-name").innerHTML = petsNames;
}

function renderPetsPictures(petsList) {
	if (!petsList) return;

	const petsPictures = petsList
		.filter((item) => {
			if (!item.photo.length) {
				item.photo = getImagePlaceholder(item.animalType);
			}
			return item.photo;
		})
		.map((item) => item.photo);

	const petsPicturesLength = petsPictures?.length || 0;

	if (!petsPictures) return;

	const imageContainer = document.getElementById("pet-image");

	petsPictures.slice(0, 3).forEach((src) => {
		if (!src) return;

		const imageTag = document.createElement("img");
		imageTag.src = src;
		imageTag.alt = "Pet image";
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

function getImagePlaceholder(animalType) {
	const AnimalType = {
		cat: "images/cat-placeholder.svg",
		default: "images/dog-placeholder.svg",
		dog: "images/dog-placeholder.svg",
	};

	return AnimalType[animalType?.length ? animalType : "default"] || AnimalType["default"];
}
