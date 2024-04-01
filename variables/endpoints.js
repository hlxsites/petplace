// Purpose: Define the end points for the application based on the current environment
const developmentEndPoints = {
  apiUrl: 'https://api-stg-petplace.azure-api.net',
};

const stagingEndPoints = {
  apiUrl: 'https://petplaceapi-stg.azure-api.net',
}

const productionEndPoints = {
  apiUrl: 'https://api.petplace.com',
};

// Set the endPoints based on the current environment
// eslint-disable-next-line import/no-mutable-exports
let endPoints;

if (window.location.href.includes("www.petplace.com") || window.location.href.includes("main--petplace--hlxsites")) {
  endPoints = productionEndPoints;
} else if (window.location.href.includes("adopt-test--petplace--hlxsites")) {
  endPoints = stagingEndPoints;
} else {
  endPoints = developmentEndPoints;
}

export default endPoints;
