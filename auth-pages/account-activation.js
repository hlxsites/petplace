(function () {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('token');
    const claim = parseJwt(token);

    renderOwnerName(claim);

    const endpoint = "https://6bf885ab-eae1-4bf3-8087-2c29b87aea62.mock.pstmn.io/account-activation";

    const response = fetch(endpoint, { method: "GET" })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            renderPageInfo(data["petsInfo"])
        })
        .catch((error) => console.log("There was a problem on network: ", error));

    return response;
})();

function renderPageInfo(petsList) {
    if (!petsList) return;

    const petsNames = petsList.filter((item) => item.name.length).map((item) => item.name);
    const petsPictures = petsList.map((item) => ({
        placeholder: getImagePlaceholder(item.animalType),
        src: item?.photo?.length ? item.photo : null,
    }));


    getPetsNames(petsNames);
    getPetsPictures(petsPictures, petsNames);
    getFormInfo(petsNames);
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

function getFormInfo(petsNames) {
    const petsText = document.getElementById("pets-names")
    petsText.innerHTML = formatPetsNames(petsNames)
}

function renderOwnerName(claim) {
    let ownerNameString = getOwnerName(claim);
    document.getElementById("owner-name").innerHTML = `Hi ${ownerNameString}!`;
}

function getOwnerName(claim) {
    let ownerName = "there";
    if (claim?.givenName?.length) {
        ownerName = claim.givenName;
        if (claim?.surname?.length) {
            return `${ownerName} ${claim.surname}`;
        }
    }
    return ownerName;
}

function parseJwt(token) {
    if (!token) return null;

    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join(''));

        return JSON.parse(jsonPayload);
    } catch (_) {
        return null;
    }
}