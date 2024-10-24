(function () {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("token");
    const claim = parseJwt(token);

    renderOwnerName(claim);

    if (!token) return;

    const endpoint = "https://api-stg.petpoint.com/animal-ftr/adopt/account-activation";

    const response = fetch(endpoint, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        }
     })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            let petsList = [];

            if (Array.isArray(data)) {
                petsList = data.map((item) => ({
                    animalType: item.animalType,
                    name: item.animalName,
                    photo: item.animalImageUrl
                }));
            } else if (data) {
                petsList.push({
                    animalType: data.animalType,
                    name: data.animalName,
                    photo: data.animalImageUrl
                });
            }

            renderPageInfo(petsList)
        })
        .catch((error) => console.log("There was a problem on network: ", error));

    return response;
})();

(function () {
    const submitButton = document.querySelector('button[type="submit"]')
    if (!submitButton) return;

    const submitButtonText = submitButton.innerText.toLowerCase().replace(/\s/g, "");

    // Check if the button text contains "Sign In" or "Login" to display the correct UI
    const isSignIn = submitButtonText.includes("signin") || submitButtonText.includes("login");
    if (isSignIn) {
        document.getElementById("agreement-message").style.display = "none";
        document.getElementById("greeting-context-message").innerHTML = "logging into";
    }
})();

function renderPageInfo(petsList) {
    if (!petsList?.length) return;

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

    const petsPicturesLength = petsPictures.length || 0;

    const imageContainer = document.getElementById("pet-image");

    petsPictures.slice(0, 3).forEach(({ src, placeholder }, index) => {
        const imageTag = document.createElement("img");
        imageTag.src = src || placeholder;
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
    const imagesBaseUrl = "https://www.petplace.com/images/auth-page-images"
    const AnimalType = {
        cat: "cat-placeholder.svg",
        default: "dog-placeholder.svg",
        dog: "dog-placeholder.svg",
    };

    const image = AnimalType[animalType?.length ? animalType : "default"] || AnimalType["default"];
    return `${imagesBaseUrl}/${image}`;
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
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(window.atob(base64).split("").map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join(""));

        return JSON.parse(jsonPayload);
    } catch (_) {
        return null;
    }
}