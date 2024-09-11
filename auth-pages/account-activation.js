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
			renderPageInfo(data["petsInfo"], data["ownerName"])
		})
		.catch((error) => console.log("There was a problem on network: ", error));

	return response;
})();

function renderPageInfo(petsList, ownerName) {
	if (!petsList) return;

	const petsNames = petsList.filter((item) => item.name.length).map((item) => item.name);
	const petsPictures = petsList.map((item) => ({
		placeholder: getImagePlaceholder(item.animalType),
		src: item?.photo?.length ? item.photo : null,
	}));


	getPetsNames(petsNames);
	getPetsPictures(petsPictures, petsNames);
	getFormInfo(petsNames, ownerName);
}

function formatPetsNames(petsNames) {
	return petsNames?.length > 1 ? petsNames.slice(0, -1).join(", ") + " & " + petsNames.at(-1) : petsNames;
}

function getPetsNames(petsNames) {
	if (!petsNames) return;

	const greetingMessage = formatPetsNames(petsNames)
	if (!greetingMessage?.length) return;

	document.getElementById("pet-name").innerHTML = greetingMessage;
}

function getPetsPictures(petsPictures, petsNames) {
	if (!petsPictures) return;

	const petsPicturesLength = petsPictures?.length || 0;

	const imageContainer = document.getElementById("pet-image");

	petsPictures.slice(0, 3).forEach(({ src, placeholder }, index) => {
		if (!src) return;

		const imageTag = document.createElement("img");
		imageTag.src = src;
		imageTag.alt = `Image of pet: ${petsNames[index]}`;
		imageTag.onerror = function () {
			this.src = placeholder;
		}
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

function getFormInfo(petsNames, ownerName) {
	if (!ownerName?.length) return;

	const petsText = document.getElementById("pets-names")

	document.getElementById("owner-name").innerHTML = ownerName
	petsText.innerHTML = formatPetsNames(petsNames)
}