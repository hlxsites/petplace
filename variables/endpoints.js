import { isProdEnvironment, isStagingEnvironment } from './envVariables.js';

// Purpose: Define the end points for the application based on the current environment
const developmentEndPoints = {
  apiUrl: 'https://api-stg-petplace.azure-api.net',
};

const stagingEndPoints = {
  apiUrl: 'https://petplaceapi-stg.azure-api.net',
};

const productionEndPoints = {
  apiUrl: 'https://api.petplace.com',
};

// Set the endPoints based on the current environment
// eslint-disable-next-line import/no-mutable-exports
let endPoints;

if (isProdEnvironment) {
  endPoints = productionEndPoints;
} else if (isStagingEnvironment) {
  endPoints = stagingEndPoints;
} else {
  endPoints = developmentEndPoints;

  // We're using "release" as the default stage for the phase 2 release
  // TODO: Remove this line after the phase 2 release
  endPoints = stagingEndPoints;
}

export default endPoints;
