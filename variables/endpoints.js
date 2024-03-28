// Purpose: Define the end points for the application based on the current environment
const developmentEndPoints = {
  apiUrl: 'https://api-stg-petplace.azure-api.net',
};

const productionEndPoints = {
  apiUrl: 'https://api.petplace.com',
};

// Set the endPoints based on the current environment
let endPoints;

if (window.location.href.includes("www.petplace.com") || window.location.href.includes("adopt-test--petplace--hlxsites") || window.location.href.includes("main--petplace--hlxsites")) {
  endPoints = productionEndPoints;
} else {
  endPoints = developmentEndPoints;
}

export default endPoints;
